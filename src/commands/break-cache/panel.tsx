import React, { useMemo, useState } from 'react';
import { Box, Dialog, Text, useInput } from '@anthropic/ink';
import type { LocalJSXCommandOnDone } from '../../types/command.js';
import { callBreakCache } from './index.js';
import { t } from '../../utils/i18n/index.js'

type BreakCacheAction = {
  label: string;
  description: string;
  run: () => void;
};

const ACTION_LABEL_COLUMN_WIDTH = 28;

async function runBreakCacheAction(scope: string, onDone: LocalJSXCommandOnDone): Promise<void> {
  const result = await callBreakCache(scope);
  if (result.type === 'text') {
    onDone(result.value, { display: 'system' });
  }
}

function BreakCachePanel({ onDone }: { onDone: LocalJSXCommandOnDone }): React.ReactNode {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = useMemo<BreakCacheAction[]>(
    () => [
      {
        label: t('breakCache.status'),
        description: t('breakCache.statusDesc'),
        run: () => void runBreakCacheAction('status', onDone)},
      {
        label: t('breakCache.once'),
        description: t('breakCache.onceDesc'),
        run: () => void runBreakCacheAction('once', onDone)},
      {
        label: t('breakCache.always'),
        description: t('breakCache.alwaysDesc'),
        run: () => void runBreakCacheAction('always', onDone)},
      {
        label: t('breakCache.off'),
        description: t('breakCache.offDesc'),
        run: () => void runBreakCacheAction('off', onDone)},
      {
        label: t('breakCache.clearOnce'),
        description: t('breakCache.clearOnceDesc'),
        run: () => void runBreakCacheAction('--clear', onDone)},
    ],
    [onDone],
  );

  const selectCurrent = () => {
    const action = actions[selectedIndex];
    if (!action) return;
    action.run();
  };

  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex(index => Math.max(0, index - 1));
      return;
    }
    if (key.downArrow) {
      setSelectedIndex(index => Math.min(actions.length - 1, index + 1));
      return;
    }
    if (key.return) {
      selectCurrent();
    }
  });

  return (
    <Dialog
      title={t("cmdSystemUI.breakCacheTitle")}
      subtitle={`${actions.length} ${t('breakCache.actions')}`}
      onCancel={() => onDone(t('cmdSystemUI.panelDismissed', t('cmdSystemUI.breakCacheTitle')), { display: 'system' })}
      color="background"
      hideInputGuide
    >
      <Box flexDirection="column">
        {actions.map((action, index) => (
          <Box key={action.label} flexDirection="row">
            <Text>{`${index === selectedIndex ? '›' : ' '} ${action.label}`.padEnd(ACTION_LABEL_COLUMN_WIDTH)}</Text>
            <Text dimColor>{action.description}</Text>
          </Box>
        ))}
        <Box marginTop={1}>
          <Text dimColor>{t('breakCachePanel.selectRunClose')}</Text>
        </Box>
      </Box>
    </Dialog>
  );
}

export async function call(onDone: LocalJSXCommandOnDone, _context: unknown, args?: string): Promise<React.ReactNode> {
  const trimmed = args?.trim() ?? '';
  if (trimmed) {
    await runBreakCacheAction(trimmed, onDone);
    return null;
  }
  return <BreakCachePanel onDone={onDone} />;
}
