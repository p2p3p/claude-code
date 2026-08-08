import { type ReactNode } from 'react';
import { useExitOnCtrlCDWithKeybindings } from '../../hooks/useExitOnCtrlCDWithKeybindings.js';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';
import { ConfigurableShortcutHint } from '../ConfigurableShortcutHint.js';
import { Byline, KeyboardShortcutHint } from '@anthropic/ink';

type Props = {
  instructions?: ReactNode;
};

export function WizardNavigationFooter({
  instructions = (
    <Byline>
      <KeyboardShortcutHint shortcut="↑↓" action="navigate" />
      <KeyboardShortcutHint shortcut="Enter" action="select" />
      <ConfigurableShortcutHint action="confirm:no" context="Confirmation" fallback="Esc" description={t('desc.goBack')} />
    </Byline>
  ),
}: Props): ReactNode {
  const exitState = useExitOnCtrlCDWithKeybindings();

  return (
    <Box marginLeft={3} marginTop={1}>
      <Text dimColor>{exitState.pending ? t('common.pressAgain', exitState.keyName) : instructions}</Text>
    </Box>
  );
}
