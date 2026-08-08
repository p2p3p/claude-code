import React from 'react';
import { Box, Text } from '@anthropic/ink';
import type { Theme } from '@anthropic/ink';
import type { Memory, MemoryStore, MemoryVersion } from './memoryStoresApi.js';
import { t } from '../../utils/i18n/index.js'

type Props =
  | { mode: 'list'; stores: MemoryStore[] }
  | { mode: 'detail'; store: MemoryStore }
  | { mode: 'created'; store: MemoryStore }
  | { mode: 'archived'; store: MemoryStore }
  | { mode: 'memory-list'; storeId: string; memories: Memory[] }
  | { mode: 'memory-detail'; memory: Memory }
  | { mode: 'memory-created'; memory: Memory }
  | { mode: 'memory-updated'; memory: Memory }
  | { mode: 'memory-deleted'; storeId: string; memoryId: string }
  | { mode: 'versions'; storeId: string; versions: MemoryVersion[] }
  | { mode: 'redacted'; version: MemoryVersion }
  | { mode: 'error'; message: string };

function StoreRow({ store }: { store: MemoryStore }): React.ReactNode {
  const isArchived = !!store.archived_at;
  const createdAt = store.created_at ? new Date(store.created_at).toLocaleString() : '—';
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold>{store.memory_store_id}</Text>
        <Text dimColor> · </Text>
        <Text color={(isArchived ? 'warning' : 'success') as keyof Theme}>{isArchived ? t('memoryStores.archived') : t('memoryStores.active')}</Text>
        {store.namespace ? (
          <>
            <Text dimColor> · {t('memoryStores.ns')} </Text>
            <Text>{store.namespace}</Text>
          </>
        ) : null}
      </Box>
      <Text>{t('memoryStores.name')} {store.name}</Text>
      <Text dimColor>{t('memoryStores.created')} {createdAt}</Text>
    </Box>
  );
}

export function MemoryStoresView(props: Props): React.ReactNode {
  if (props.mode === 'list') {
    if (props.stores.length === 0) {
      return (
        <Box>
          <Text dimColor>{t('memoryStores.noStoresFound')}</Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('memoryStores.storesCount', props.stores.length)}</Text>
        </Box>
        {props.stores.map(store => (
          <StoreRow key={store.memory_store_id} store={store} />
        ))}
      </Box>
    );
  }

  if (props.mode === 'detail') {
    const { store } = props;
    const isArchived = !!store.archived_at;
    const createdAt = store.created_at ? new Date(store.created_at).toLocaleString() : '—';
    const archivedAt = store.archived_at ? new Date(store.archived_at).toLocaleString() : null;
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('memoryStores.storeDetail')} {store.memory_store_id}</Text>
        </Box>
        <Text>{t('memoryStores.name')} {store.name}</Text>
        {store.namespace ? <Text>{t('memoryStores.namespace')} {store.namespace}</Text> : null}
        <Text>
          {t('memoryStores.status')}{' '}
          <Text color={(isArchived ? 'warning' : 'success') as keyof Theme}>{isArchived ? t('memoryStores.archived') : t('memoryStores.active')}</Text>
        </Text>
        <Text dimColor>{t('memoryStores.created')} {createdAt}</Text>
        {archivedAt ? <Text dimColor>{t('memoryStores.archivedAt')} {archivedAt}</Text> : null}
      </Box>
    );
  }

  if (props.mode === 'created') {
    const { store } = props;
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t('memoryStores.storeCreated')}
          </Text>
        </Box>
        <Text>{t('memoryStores.id')} {store.memory_store_id}</Text>
        <Text>{t('memoryStores.name')} {store.name}</Text>
        {store.namespace ? <Text>{t('memoryStores.namespace')} {store.namespace}</Text> : null}
      </Box>
    );
  }

  if (props.mode === 'archived') {
    const { store } = props;
    const archivedAt = store.archived_at ? new Date(store.archived_at).toLocaleString() : '—';
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'warning' as keyof Theme}>
            {t('memoryStores.storeArchived')}
          </Text>
        </Box>
        <Text>{t('memoryStores.id')} {store.memory_store_id}</Text>
        <Text dimColor>{t('memoryStores.archivedAtLabel')} {archivedAt}</Text>
      </Box>
    );
  }

  if (props.mode === 'memory-list') {
    const { storeId, memories } = props;
    if (memories.length === 0) {
      return (
        <Box>
          <Text dimColor>
            {t('memoryStores.noMemories', storeId)}
          </Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>
            {t('memoryStores.memoriesIn', storeId, memories.length)}
          </Text>
        </Box>
        {memories.map(mem => (
          <Box key={mem.memory_id} flexDirection="column" marginBottom={1}>
            <Text bold>{mem.memory_id}</Text>
            <Text dimColor>{mem.content.length > 80 ? `${mem.content.slice(0, 80)}…` : mem.content}</Text>
          </Box>
        ))}
      </Box>
    );
  }

  if (props.mode === 'memory-detail') {
    const { memory } = props;
    const createdAt = memory.created_at ? new Date(memory.created_at).toLocaleString() : '—';
    const updatedAt = memory.updated_at ? new Date(memory.updated_at).toLocaleString() : '—';
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('memoryStores.memoryDetail')} {memory.memory_id}</Text>
        </Box>
        <Text>{t('memoryStores.storeLabel')} {memory.memory_store_id}</Text>
        <Text>{t('memoryStores.content')} {memory.content}</Text>
        <Text dimColor>{t('memoryStores.created')} {createdAt}</Text>
        <Text dimColor>{t('memoryStores.updated')} {updatedAt}</Text>
      </Box>
    );
  }

  if (props.mode === 'memory-created') {
    const { memory } = props;
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t('memoryStores.memoryCreated')}
          </Text>
        </Box>
        <Text>{t('memoryStores.id')} {memory.memory_id}</Text>
        <Text>{t('memoryStores.storeLabel')} {memory.memory_store_id}</Text>
        <Text dimColor>{t('memoryStores.content')} {memory.content}</Text>
      </Box>
    );
  }

  if (props.mode === 'memory-updated') {
    const { memory } = props;
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t('memoryStores.memoryUpdated')}
          </Text>
        </Box>
        <Text>{t('memoryStores.id')} {memory.memory_id}</Text>
        <Text dimColor>{t('memoryStores.content')} {memory.content}</Text>
      </Box>
    );
  }

  if (props.mode === 'memory-deleted') {
    return (
      <Box>
        <Text color={'success' as keyof Theme}>
          {t('memoryStores.memoryDeleted', props.memoryId, props.storeId)}
        </Text>
      </Box>
    );
  }

  if (props.mode === 'versions') {
    const { storeId, versions } = props;
    if (versions.length === 0) {
      return (
        <Box>
          <Text dimColor>{t('memoryStores.noVersions', storeId)}</Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>
            {t('memoryStores.versionsIn', storeId, versions.length)}
          </Text>
        </Box>
        {versions.map(ver => {
          const createdAt = ver.created_at ? new Date(ver.created_at).toLocaleString() : '—';
          const isRedacted = !!ver.redacted_at;
          return (
            <Box key={ver.version_id} flexDirection="column" marginBottom={1}>
              <Box>
                <Text bold>{ver.version_id}</Text>
                {isRedacted ? (
                  <>
                    <Text dimColor> · </Text>
                    <Text color={'warning' as keyof Theme}>{t('memoryStores.redacted')}</Text>
                  </>
                ) : null}
              </Box>
              <Text dimColor>{t('memoryStores.created')} {createdAt}</Text>
            </Box>
          );
        })}
      </Box>
    );
  }

  if (props.mode === 'redacted') {
    const { version } = props;
    const redactedAt = version.redacted_at ? new Date(version.redacted_at).toLocaleString() : '—';
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'warning' as keyof Theme}>
            {t('memoryStores.versionRedacted')}
          </Text>
        </Box>
        <Text>{t('memoryStores.id')} {version.version_id}</Text>
        <Text dimColor>{t('memoryStores.redactedAt')} {redactedAt}</Text>
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
