import * as React from 'react';
import { Box, Text } from '@anthropic/ink';
import type { ToolProgressData } from 'src/Tool.js';
import type { ProgressMessage } from 'src/types/message.js';
import type { ThemeName } from 'src/utils/theme.js';
import type { Output } from './ExitWorktreeTool.js';
import { t } from 'src/utils/i18n/index.js';

export function renderToolUseMessage(): React.ReactNode {
  return t('toolUI.exitWorktree.exiting');
}

export function renderToolResultMessage(
  output: Output,
  _progressMessagesForMessage: ProgressMessage<ToolProgressData>[],
  _options: { theme: ThemeName },
): React.ReactNode {
  if (!output) return null;
  const actionLabel = output.action === 'keep' ? t('toolUI.exitWorktree.kept') : t('toolUI.exitWorktree.removed');
  return (
    <Box flexDirection="column">
      <Text>
        {actionLabel}
        {output.worktreeBranch ? (
          <>
            {' '}
            {t('toolUI.exitWorktree.onBranch', output.worktreeBranch)}
          </>
        ) : null}
      </Text>
      <Text dimColor>{t('toolUI.exitWorktree.returnedTo', output.originalCwd)}</Text>
    </Box>
  );
}
