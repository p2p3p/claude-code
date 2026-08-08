import * as React from 'react';
import { Box, Text } from '@anthropic/ink';
import type { ToolProgressData } from 'src/Tool.js';
import type { ProgressMessage } from 'src/types/message.js';
import type { ThemeName } from 'src/utils/theme.js';
import type { Output } from './EnterWorktreeTool.js';
import { t } from 'src/utils/i18n/index.js';

export function renderToolUseMessage(): React.ReactNode {
  return t('toolUI.enterWorktree.creating');
}

export function renderToolResultMessage(
  output: Output,
  _progressMessagesForMessage: ProgressMessage<ToolProgressData>[],
  _options: { theme: ThemeName },
): React.ReactNode {
  if (!output) return null;
  return (
    <Box flexDirection="column">
      <Text>
        {t('toolUI.enterWorktree.switched')}
        {output.worktreeBranch ? (
          <>
            {' '}
            {t('toolUI.enterWorktree.onBranch')}<Text bold>{output.worktreeBranch}</Text>
          </>
        ) : null}
      </Text>
      <Text dimColor>{output.worktreePath}</Text>
    </Box>
  );
}
