import * as React from 'react';
import { Box, Text } from '@anthropic/ink';
import { t } from 'src/utils/i18n/index.js';
import { useShortcutDisplay } from '../../keybindings/useShortcutDisplay.js';

export function CompactBoundaryMessage(): React.ReactNode {
  const historyShortcut = useShortcutDisplay('app:toggleTranscript', 'Global', 'ctrl+o');

  return (
    <Box marginY={1}>
      <Text dimColor>{t('componentsMessages.conversationCompacted', historyShortcut)}</Text>
    </Box>
  );
}
