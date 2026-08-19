import * as React from 'react';
import { useExitOnCtrlCDWithKeybindings } from '../../hooks/useExitOnCtrlCDWithKeybindings.js';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';

type Props = {
  instructions?: string;
};

export function AgentNavigationFooter({
  instructions = t('agentNavigationFooter.defaultInstructions')}: Props): React.ReactNode {
  const exitState = useExitOnCtrlCDWithKeybindings();

  return (
    <Box marginLeft={2}>
      <Text dimColor>{exitState.pending ? t('agentNavigationFooter.pressKeyToExit', exitState.keyName) : instructions}</Text>
    </Box>
  );
}
