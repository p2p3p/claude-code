import React from 'react';
import type { LocalJSXCommandCall, LocalJSXCommandOnDone } from '../../types/command.js';
import {
  addCredential,
  archiveCredential,
  archiveVault,
  createVault,
  getVault,
  listCredentials,
  listVaults} from './vaultsApi.js';
import { VaultView } from './VaultView.js';
import { parseVaultArgs } from './parseArgs.js';
import { launchCommand } from '../_shared/launchCommand.js';
import { t } from '../../utils/i18n/index.js';

const USAGE = t('vaultView.usage');

type VaultViewProps = React.ComponentProps<typeof VaultView>;

async function dispatchVault(
  parsed: ReturnType<typeof parseVaultArgs>,
  onDone: LocalJSXCommandOnDone,
): Promise<VaultViewProps | null> {
  if (parsed.action === 'list') {
    const vaults = await listVaults();
    onDone(vaults.length === 0 ? t('vaultView.noVaults') : t('vaultView.vaultsCount2', vaults.length), { display: 'system' });
    return { mode: 'list', vaults };
  }

  if (parsed.action === 'create') {
    const { name } = parsed;
    const vault = await createVault(name);
    onDone(t('vaultView.vaultCreatedId', vault.vault_id), { display: 'system' });
    return { mode: 'created', vault };
  }

  if (parsed.action === 'get') {
    const { id } = parsed;
    const vault = await getVault(id);
    onDone(t('vaultView.vaultFetched'), { display: 'system' });
    return { mode: 'detail', vault };
  }

  if (parsed.action === 'archive') {
    const { id } = parsed;
    const vault = await archiveVault(id);
    onDone(t('vaultView.vaultArchivedId'), { display: 'system' });
    return { mode: 'archived', vault };
  }

  if (parsed.action === 'add-credential') {
    const { vaultId, key, secret } = parsed;
    const cred = await addCredential(vaultId, key, secret);
    // SECURITY: credential value is NOT echoed in onDone message
    onDone(t('vaultView.credentialAddedId', cred.credential_id), { display: 'system' });
    return { mode: 'credential-added', vaultId, credentialId: cred.credential_id };
  }

  if (parsed.action === 'archive-credential') {
    const { vaultId, credentialId } = parsed;
    await archiveCredential(vaultId, credentialId);
    onDone(t('vaultView.credentialArchivedId', credentialId), { display: 'system' });
    return { mode: 'credential-archived', vaultId, credentialId };
  }

  // Fallback: list vaults for any unrecognised action (matches original behaviour)
  const vaults = await listVaults();
  onDone(vaults.length === 0 ? t('vaultView.noVaults') : t('vaultView.vaultsCount2', vaults.length), { display: 'system' });
  return { mode: 'list', vaults };
}

export const callVault: LocalJSXCommandCall = launchCommand<ReturnType<typeof parseVaultArgs>, VaultViewProps>({
  commandName: 'vault',
  parseArgs: (raw: string) => {
    const result = parseVaultArgs(raw);
    if (result.action === 'invalid') {
      return { action: 'invalid' as const, reason: `${USAGE}\n${result.reason}` };
    }
    return result;
  },
  dispatch: dispatchVault,
  View: VaultView,
  errorView: (msg: string) => React.createElement(VaultView, { mode: 'error', message: msg })});

export const callVaultListCredentials = async (
  onDone: (msg: string, opts: { display: string }) => void,
  vaultId: string,
): Promise<React.ReactNode> => {
  try {
    const credentials = await listCredentials(vaultId);
    onDone(
      credentials.length === 0
        ? t('vaultView.noCredentialsIn', vaultId)
        : t('vaultView.credentialsInCount', vaultId, credentials.length),
      { display: 'system' },
    );
    return React.createElement(VaultView, {
      mode: 'credential-list',
      vaultId,
      credentials});
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    onDone(t('vaultView.failedToListCredentials', msg), { display: 'system' });
    return React.createElement(VaultView, { mode: 'error', message: msg });
  }
};
