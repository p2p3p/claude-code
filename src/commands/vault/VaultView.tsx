import React from 'react';
import { Box, Text } from '@anthropic/ink';
import type { Theme } from '@anthropic/ink';
import type { Credential, Vault } from './vaultsApi.js';
import { t } from '../../utils/i18n/index.js'

type Props =
  | { mode: 'list'; vaults: Vault[] }
  | { mode: 'detail'; vault: Vault }
  | { mode: 'created'; vault: Vault }
  | { mode: 'archived'; vault: Vault }
  | { mode: 'credential-list'; vaultId: string; credentials: Credential[] }
  | { mode: 'credential-added'; vaultId: string; credentialId: string }
  | { mode: 'credential-archived'; vaultId: string; credentialId: string }
  | { mode: 'error'; message: string };

function VaultRow({ vault }: { vault: Vault }): React.ReactNode {
  const isArchived = !!vault.archived_at;
  const createdAt = vault.created_at ? new Date(vault.created_at).toLocaleString() : '—';
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold>{vault.vault_id}</Text>
        <Text dimColor> · </Text>
        <Text color={(isArchived ? 'warning' : 'success') as keyof Theme}>{isArchived ? t('vaultView.archived') : t('vaultView.active')}</Text>
      </Box>
      <Text>{t('vaultView.name')} {vault.name}</Text>
      <Text dimColor>{t('vaultView.created')} {createdAt}</Text>
    </Box>
  );
}

export function VaultView(props: Props): React.ReactNode {
  if (props.mode === 'list') {
    if (props.vaults.length === 0) {
      return (
        <Box>
          <Text dimColor>{t('vaultView.noVaultsFound')}</Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('vaultView.vaultsCount', props.vaults.length)}</Text>
        </Box>
        {props.vaults.map(vault => (
          <VaultRow key={vault.vault_id} vault={vault} />
        ))}
      </Box>
    );
  }

  if (props.mode === 'detail') {
    const { vault } = props;
    const isArchived = !!vault.archived_at;
    const createdAt = vault.created_at ? new Date(vault.created_at).toLocaleString() : '—';
    const archivedAt = vault.archived_at ? new Date(vault.archived_at).toLocaleString() : null;
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('vaultView.vaultDetail')} {vault.vault_id}</Text>
        </Box>
        <Text>{t('vaultView.name')} {vault.name}</Text>
        <Text>
          {t('vaultView.status')}{' '}
          <Text color={(isArchived ? 'warning' : 'success') as keyof Theme}>{isArchived ? t('vaultView.archived') : t('vaultView.active')}</Text>
        </Text>
        <Text dimColor>{t('vaultView.created')} {createdAt}</Text>
        {archivedAt ? <Text dimColor>{t('vaultView.archivedAt')} {archivedAt}</Text> : null}
      </Box>
    );
  }

  if (props.mode === 'created') {
    const { vault } = props;
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t('vaultView.vaultCreated')}
          </Text>
        </Box>
        <Text>{t('vaultView.id')} {vault.vault_id}</Text>
        <Text>{t('vaultView.name')} {vault.name}</Text>
      </Box>
    );
  }

  if (props.mode === 'archived') {
    const { vault } = props;
    const archivedAt = vault.archived_at ? new Date(vault.archived_at).toLocaleString() : '—';
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'warning' as keyof Theme}>
            {t('vaultView.vaultArchived')}
          </Text>
        </Box>
        <Text>{t('vaultView.id')} {vault.vault_id}</Text>
        <Text dimColor>{t('vaultView.archivedAtLabel')} {archivedAt}</Text>
      </Box>
    );
  }

  if (props.mode === 'credential-list') {
    const { vaultId, credentials } = props;
    if (credentials.length === 0) {
      return (
        <Box>
          <Text dimColor>
            {t('vaultView.noCredentials', vaultId)}
          </Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>
            {t('vaultView.credentialsIn', vaultId, credentials.length)}
          </Text>
        </Box>
        {credentials.map(cred => {
          const isArchived = !!cred.archived_at;
          return (
            <Box key={cred.credential_id} flexDirection="column" marginBottom={1}>
              <Box>
                <Text bold>{cred.credential_id}</Text>
                <Text dimColor> · </Text>
                {cred.kind ? <Text dimColor>{cred.kind}</Text> : null}
                {isArchived ? (
                  <>
                    <Text dimColor> · </Text>
                    <Text color={'warning' as keyof Theme}>{t('vaultView.archived')}</Text>
                  </>
                ) : null}
              </Box>
              {/* SECURITY: credential value is never displayed */}
              <Text dimColor>{t('vaultView.valueMask')}</Text>
            </Box>
          );
        })}
      </Box>
    );
  }

  if (props.mode === 'credential-added') {
    const { vaultId, credentialId } = props;
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t('vaultView.credentialAdded')}
          </Text>
        </Box>
        <Text>{t('vaultView.id')} {credentialId}</Text>
        <Text>{t('vaultView.vaultLabel')} {vaultId}</Text>
        {/* SECURITY: credential value is never echoed back */}
        <Text dimColor>{t('vaultView.valueMask')}</Text>
      </Box>
    );
  }

  if (props.mode === 'credential-archived') {
    const { vaultId, credentialId } = props;
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'warning' as keyof Theme}>
            {t('vaultView.credentialArchived')}
          </Text>
        </Box>
        <Text>{t('vaultView.id')} {credentialId}</Text>
        <Text>{t('vaultView.vaultLabel')} {vaultId}</Text>
      </Box>
    );
  }

  // error mode
  return (
    <Box>
      <Text color={'error' as keyof Theme}>{props.message}</Text>
    </Box>
  );
}
