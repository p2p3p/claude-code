import React from 'react';
import { Box, Dialog, Text, useInput } from '@anthropic/ink';
import type { LocalJSXCommandCall, LocalJSXCommandOnDone } from '../../types/command.js';
import {
  listStores,
  createStore,
  setEntry,
  getEntry,
  listEntries,
  archiveStore,
  isValidStoreName} from '../../services/SessionMemory/multiStore.js';
import { isValidKey } from '../../utils/localValidate.js';
import TextInput from '../../components/TextInput.js';
import { LocalMemoryView } from './LocalMemoryView.js';
import { parseLocalMemoryArgs } from './parseArgs.js';
import { launchCommand } from '../_shared/launchCommand.js';
import { t } from '../../utils/i18n/index.js'

const USAGE = t('localMemory.usage');

type LocalMemoryViewProps = React.ComponentProps<typeof LocalMemoryView>;

type LocalMemoryAction = {
  label: string;
  description: string;
  run: () => void;
};

const ACTION_LABEL_COLUMN_WIDTH = 26;

function formatStoreList(stores: string[]): string {
  if (stores.length === 0) {
    return t('localMemory.noStoresFound');
  }
  return [t('localMemory.storeListHeader'), ...stores.map(store => `- ${store}`)].join('\n');
}

function formatEntryList(store: string, keys: string[]): string {
  if (keys.length === 0) {
    return t('localMemory.noEntriesIn', store);
  }
  return [t('localMemory.entriesIn', store), ...keys.map(key => `- ${key}`)].join('\n');
}

// ── Interactive multi-step panel ───────────────────────────────────────────
// State machine:
//   menu                 — pick an action
//   collect-store        — input STORE_NAME (Create/Store/Fetch/Entries/Archive)
//   collect-key          — input KEY (Store/Fetch)
//   collect-value        — input VALUE (Store)
//   confirm-archive      — Y/N confirmation (Archive)
//   confirm-overwrite    — Y/N confirmation (Store when key exists)
// Each step has inline validation; Esc cancels back to menu (or closes from menu).

type ActionKind = 'list' | 'create' | 'store' | 'fetch' | 'entries' | 'archive' | 'about';

type Step =
  | { kind: 'menu' }
  | { kind: 'collect-store'; action: ActionKind }
  | { kind: 'collect-key'; action: ActionKind; store: string }
  | { kind: 'collect-value'; action: ActionKind; store: string; key: string }
  | {
      kind: 'confirm-archive';
      store: string;
    }
  | {
      kind: 'confirm-overwrite';
      store: string;
      key: string;
      value: string;
    };

const MENU: Array<{
  kind: ActionKind;
  label: string;
  description: string;
}> = [
  { kind: 'list', label: t('localMemory.list'), description: t('localMemory.listDesc') },
  {
    kind: 'create',
    label: t('localMemory.create'),
    description: t('localMemory.createDesc')},
  {
    kind: 'store',
    label: t('localMemory.store'),
    description: t('localMemory.storeDesc')},
  {
    kind: 'fetch',
    label: t('localMemory.fetch'),
    description: t('localMemory.fetchDesc')},
  {
    kind: 'entries',
    label: t('localMemory.entries'),
    description: t('localMemory.entriesDesc')},
  {
    kind: 'archive',
    label: t('localMemory.archive'),
    description: t('localMemory.archiveDesc')},
  {
    kind: 'about',
    label: t('localMemory.about'),
    description: t('localMemory.aboutDesc')},
];

function LocalMemoryPanel({ onDone }: { onDone: LocalJSXCommandOnDone }): React.ReactNode {
  const [step, setStep] = React.useState<Step>({ kind: 'menu' });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [textValue, setTextValue] = React.useState('');
  const [cursorOffset, setCursorOffset] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  // Reset text/error when step transitions
  const transition = React.useCallback((next: Step) => {
    setStep(next);
    setTextValue('');
    setCursorOffset(0);
    setError(null);
  }, []);

  const closeWith = React.useCallback((msg: string) => onDone(msg, { display: 'system' }), [onDone]);

  // Run an action when it has all required inputs.
  const runAction = React.useCallback(
    (
      action: ActionKind,
      store: string | undefined,
      key: string | undefined,
      value: string | undefined,
      opts: { confirmedOverwrite?: boolean } = {},
    ) => {
      try {
        if (action === 'list') {
          closeWith(formatStoreList(listStores()));
          return;
        }
        if (action === 'about') {
          closeWith(USAGE);
          return;
        }
        if (!store) {
          setError('Internal: missing store');
          return;
        }
        if (action === 'create') {
          createStore(store);
          closeWith(`Store created: ${store}`);
          return;
        }
        if (action === 'entries') {
          const keys = listEntries(store);
          closeWith(formatEntryList(store, keys));
          return;
        }
        if (action === 'archive') {
          archiveStore(store);
          closeWith(`Archived store: ${store}`);
          return;
        }
        if (action === 'fetch') {
          if (!key) {
            setError('Internal: missing key');
            return;
          }
          const v = getEntry(store, key);
          if (v === null) {
            closeWith(`Entry not found: ${store}/${key}`);
            return;
          }
          closeWith(`Entry fetched: ${store}/${key}\n\n${v}`);
          return;
        }
        if (action === 'store') {
          if (!key || value === undefined) {
            setError('Internal: missing key or value');
            return;
          }
          // Confirm overwrite if key already exists (safety prompt)
          if (!opts.confirmedOverwrite && getEntry(store, key) !== null) {
            transition({
              kind: 'confirm-overwrite',
              store,
              key,
              value});
            return;
          }
          setEntry(store, key, value);
          closeWith(`Stored ${store}/${key} (${value.length} chars)`);
          return;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [closeWith, transition],
  );

  // ── Menu step ──────────────────────────────────────────────────────────
  useInput(
    (input, key) => {
      if (step.kind !== 'menu') return;
      if (key.upArrow) {
        setSelectedIndex(idx => Math.max(0, idx - 1));
        return;
      }
      if (key.downArrow) {
        setSelectedIndex(idx => Math.min(MENU.length - 1, idx + 1));
        return;
      }
      if (key.return) {
        const choice = MENU[selectedIndex];
        if (!choice) return;
        if (choice.kind === 'list' || choice.kind === 'about') {
          runAction(choice.kind, undefined, undefined, undefined);
          return;
        }
        // Everything else needs a store
        transition({ kind: 'collect-store', action: choice.kind });
        return;
      }
      // Quick-key shortcuts: 1..7
      const n = Number(input);
      if (Number.isInteger(n) && n >= 1 && n <= MENU.length) {
        setSelectedIndex(n - 1);
      }
    },
    { isActive: step.kind === 'menu' },
  );

  // ── confirm-archive / confirm-overwrite Y/N handling ───────────────────
  useInput(
    (input, key) => {
      if (step.kind !== 'confirm-archive' && step.kind !== 'confirm-overwrite') {
        return;
      }
      if (key.escape) {
        transition({ kind: 'menu' });
        return;
      }
      const ch = input.toLowerCase();
      if (ch === 'y' || key.return) {
        if (step.kind === 'confirm-archive') {
          runAction('archive', step.store, undefined, undefined);
        } else {
          runAction('store', step.store, step.key, step.value, {
            confirmedOverwrite: true});
        }
      } else if (ch === 'n') {
        transition({ kind: 'menu' });
      }
    },
    {
      isActive: step.kind === 'confirm-archive' || step.kind === 'confirm-overwrite'},
  );

  // Esc to back-step in collect-* steps
  useInput(
    (_input, key) => {
      if (step.kind !== 'collect-store' && step.kind !== 'collect-key' && step.kind !== 'collect-value') {
        return;
      }
      if (key.escape) {
        // Walk back one step
        if (step.kind === 'collect-value') {
          transition({
            kind: 'collect-key',
            action: step.action,
            store: step.store});
          return;
        }
        if (step.kind === 'collect-key') {
          transition({ kind: 'collect-store', action: step.action });
          return;
        }
        // collect-store → menu
        transition({ kind: 'menu' });
      }
    },
    {
      isActive: step.kind === 'collect-store' || step.kind === 'collect-key' || step.kind === 'collect-value'},
  );

  // ── Render ──────────────────────────────────────────────────────────────
  if (step.kind === 'menu') {
    return (
      <Dialog
        title={t("cmdSystemUI.localMemoryTitle")}
        subtitle={t('localMemory.actionsCount', MENU.length)}
        onCancel={() => closeWith(t('cmdSystemUI.panelDismissed', t('cmdSystemUI.localMemoryTitle')))}
        color="background"
        hideInputGuide
      >
        <Box flexDirection="column">
          {MENU.map((m, i) => (
            <Box key={m.kind} flexDirection="row">
              <Text>{`${i === selectedIndex ? '›' : ' '} ${m.label}`.padEnd(ACTION_LABEL_COLUMN_WIDTH)}</Text>
              <Text dimColor>{m.description}</Text>
            </Box>
          ))}
          <Box marginTop={1}>
            <Text dimColor>{t('localMemory.navHint')}</Text>
          </Box>
        </Box>
      </Dialog>
    );
  }

  // Confirmation prompts
  if (step.kind === 'confirm-archive') {
    return (
      <Dialog title={t("cmdSystemUI.confirmArchive")} onCancel={() => transition({ kind: 'menu' })} color="warning" hideInputGuide>
        <Box flexDirection="column">
          <Text>{t('localMemory.archivePrompt', step.store)}</Text>
          <Box marginTop={1}>
            <Text dimColor>{t('localMemory.archiveKeysHint')}</Text>
          </Box>
        </Box>
      </Dialog>
    );
  }
  if (step.kind === 'confirm-overwrite') {
    return (
      <Dialog title={t("cmdSystemUI.confirmOverwrite")} onCancel={() => transition({ kind: 'menu' })} color="warning" hideInputGuide>
        <Box flexDirection="column">
          <Text>
            {t('localMemory.overwritePrompt', step.store, step.key, step.value.length)}
          </Text>
          <Box marginTop={1}>
            <Text dimColor>{t('localMemory.overwriteKeysHint')}</Text>
          </Box>
        </Box>
      </Dialog>
    );
  }

  // collect-* steps share the same TextInput render
  const fieldLabel = step.kind === 'collect-store' ? t('localMemory.storeName') : step.kind === 'collect-key' ? t('localMemory.keyName') : t('localMemory.value');
  const placeholder =
    step.kind === 'collect-store'
      ? t('localMemory.storePlaceholder')
      : step.kind === 'collect-key'
        ? t('localMemory.keyPlaceholder')
        : t('localMemory.valuePlaceholder');
  const validateAndAdvance = (raw: string) => {
    const trimmed = raw.trim();
    if (step.kind === 'collect-store') {
      if (!trimmed) {
        setError(t('localMemory.storeNameRequired'));
        return;
      }
      if (!isValidStoreName(trimmed)) {
        setError(t('localMemory.invalidStoreName'));
        return;
      }
      // Action-specific completion
      if (step.action === 'create' || step.action === 'entries' || step.action === 'archive') {
        if (step.action === 'archive') {
          transition({ kind: 'confirm-archive', store: trimmed });
        } else {
          runAction(step.action, trimmed, undefined, undefined);
        }
      } else {
        // Store / Fetch — need key next
        transition({
          kind: 'collect-key',
          action: step.action,
          store: trimmed});
      }
      return;
    }
    if (step.kind === 'collect-key') {
      if (!trimmed) {
        setError(t('localMemory.keyRequired'));
        return;
      }
      if (!isValidKey(trimmed)) {
        setError(t('localMemory.invalidKey'));
        return;
      }
      if (step.action === 'fetch') {
        runAction('fetch', step.store, trimmed, undefined);
      } else {
        // store action — collect value next
        transition({
          kind: 'collect-value',
          action: 'store',
          store: step.store,
          key: trimmed});
      }
      return;
    }
    if (step.kind === 'collect-value') {
      // Value can be empty (allowed). Just submit.
      runAction('store', step.store, step.key, raw);
    }
  };

  return (
    <Dialog
      title={t('localMemory.stepTitle', step.kind.replace('collect-', '').toUpperCase())}
      onCancel={() => transition({ kind: 'menu' })}
      color="background"
      hideInputGuide
    >
      <Box flexDirection="column">
        <Box>
          <Text dimColor>{fieldLabel}</Text>
        </Box>
        <Box>
          <Text>{'> '}</Text>
          <TextInput
            value={textValue}
            onChange={v => {
              setTextValue(v);
              setError(null);
            }}
            cursorOffset={cursorOffset}
            onChangeCursorOffset={setCursorOffset}
            onSubmit={validateAndAdvance}
            placeholder={placeholder}
            columns={70}
            showCursor
          />
        </Box>
        {error !== null && (
          <Box marginTop={0}>
            <Text color="warning">✗ {error}</Text>
          </Box>
        )}
        <Box marginTop={1}>
          <Text dimColor>{t('localMemory.nextBackHint')}</Text>
        </Box>
      </Box>
    </Dialog>
  );
}

async function dispatchLocalMemory(
  parsed: ReturnType<typeof parseLocalMemoryArgs>,
  onDone: LocalJSXCommandOnDone,
): Promise<LocalMemoryViewProps | null> {
  if (parsed.action === 'list') {
    const stores = listStores();
    onDone(formatStoreList(stores), { display: 'system' });
    return null;
  }

  if (parsed.action === 'create') {
    const { store } = parsed;
    createStore(store);
    onDone(t('localMemory.storeCreatedFull', store), { display: 'system' });
    return null;
  }

  if (parsed.action === 'store') {
    const { store, key, value } = parsed;
    setEntry(store, key, value);
    onDone(t('localMemory.storedEntryIn', key, store), { display: 'system' });
    return null;
  }

  if (parsed.action === 'fetch') {
    const { store, key } = parsed;
    const value = getEntry(store, key);
    if (value === null) {
      onDone(t('localMemory.entryNotFound', store, key), { display: 'system' });
      return null;
    }
    onDone(t('localMemory.entryFetched', store, key, value), { display: 'system' });
    return null;
  }

  if (parsed.action === 'entries') {
    const { store } = parsed;
    const keys = listEntries(store);
    onDone(formatEntryList(store, keys), { display: 'system' });
    return null;
  }

  if (parsed.action === 'archive') {
    const { store } = parsed;
    archiveStore(store);
    onDone(t('localMemory.storeArchivedFull', store), { display: 'system' });
    return null;
  }

  // Exhaustive guard
  onDone(USAGE, { display: 'system' });
  return null;
}

const callLocalMemoryDirect: LocalJSXCommandCall = launchCommand<
  ReturnType<typeof parseLocalMemoryArgs>,
  LocalMemoryViewProps
>({
  commandName: 'local-memory',
  parseArgs: (raw: string) => {
    const result = parseLocalMemoryArgs(raw);
    if (result.action === 'invalid') {
      return { action: 'invalid' as const, reason: `${USAGE}\n${result.reason}` };
    }
    return result;
  },
  dispatch: dispatchLocalMemory,
  View: LocalMemoryView,
  errorView: (msg: string) => React.createElement(LocalMemoryView, { mode: 'error', message: msg })});

export const callLocalMemory: LocalJSXCommandCall = async (onDone, context, args) => {
  if ((args ?? '').trim() === '') {
    return <LocalMemoryPanel onDone={onDone} />;
  }
  return callLocalMemoryDirect(onDone, context, args);
};
