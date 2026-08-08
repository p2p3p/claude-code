import * as React from 'react';
import { useState } from 'react';
import { useExitOnCtrlCDWithKeybindings } from 'src/hooks/useExitOnCtrlCDWithKeybindings.js';
import { Box, Text } from '@anthropic/ink';
import { useKeybinding } from '../keybindings/useKeybinding.js';
import { ConfigurableShortcutHint } from './ConfigurableShortcutHint.js';
import { Select } from './CustomSelect/index.js';
import { Byline, KeyboardShortcutHint, Pane } from '@anthropic/ink';
import { t } from '../utils/i18n/index.js';

export type Props = {
  currentValue: boolean;
  onSelect: (enabled: boolean) => void;
  onCancel?: () => void;
  isMidConversation?: boolean;
};

export function ThinkingToggle({ currentValue, onSelect, onCancel, isMidConversation }: Props): React.ReactNode {
  const exitState = useExitOnCtrlCDWithKeybindings();
  const [confirmationPending, setConfirmationPending] = useState<boolean | null>(null);

  const options = [
    {
      value: 'true',
      label: t('thinkingToggle.enabled'),
      description: t('thinkingToggle.enabledDesc'),
    },
    {
      value: 'false',
      label: t('thinkingToggle.disabled'),
      description: t('thinkingToggle.disabledDesc'),
    },
  ];

  // Use configurable keybinding for ESC to cancel/go back
  useKeybinding(
    'confirm:no',
    () => {
      if (confirmationPending !== null) {
        setConfirmationPending(null);
      } else {
        onCancel?.();
      }
    },
    { context: 'Confirmation' },
  );

  // Use configurable keybinding for Enter to confirm in confirmation mode
  useKeybinding(
    'confirm:yes',
    () => {
      if (confirmationPending !== null) {
        onSelect(confirmationPending);
      }
    },
    { context: 'Confirmation', isActive: confirmationPending !== null },
  );

  function handleSelectChange(value: string): void {
    const selected = value === 'true';
    if (isMidConversation && selected !== currentValue) {
      setConfirmationPending(selected);
    } else {
      onSelect(selected);
    }
  }

  return (
    <Pane color="permission">
      <Box flexDirection="column">
        <Box marginBottom={1} flexDirection="column">
          <Text color="remember" bold>
            {t('thinkingToggle.title')}
          </Text>
          <Text dimColor>{t('thinkingToggle.desc')}</Text>
        </Box>

        {confirmationPending !== null ? (
          <Box flexDirection="column" marginBottom={1} gap={1}>
            <Text color="warning">
              Changing thinking mode mid-conversation will increase latency and may reduce quality. For best results,
              set this at the start of a session.
            </Text>
            <Text color="warning">{t('thinkingtoggle.doYouWantToProceed')}</Text>
          </Box>
        ) : (
          <Box flexDirection="column" marginBottom={1}>
            <Select
              defaultValue={currentValue ? 'true' : 'false'}
              defaultFocusValue={currentValue ? 'true' : 'false'}
              options={options}
              onChange={handleSelectChange}
              onCancel={onCancel ?? (() => {})}
              visibleOptionCount={2}
            />
          </Box>
        )}
      </Box>
      <Text dimColor italic>
        {exitState.pending ? (
          <>{t('common.pressAgain', exitState.keyName)}</>
        ) : confirmationPending !== null ? (
          <Byline>
            <KeyboardShortcutHint shortcut="Enter" action="confirm" />
            <ConfigurableShortcutHint action="confirm:no" context="Confirmation" fallback="Esc" description={t('desc.cancel')} />
          </Byline>
        ) : (
          <Byline>
            <KeyboardShortcutHint shortcut="Enter" action="confirm" />
            <ConfigurableShortcutHint action="confirm:no" context="Confirmation" fallback="Esc" description={t('desc.exit')} />
          </Byline>
        )}
      </Text>
    </Pane>
  );
}
