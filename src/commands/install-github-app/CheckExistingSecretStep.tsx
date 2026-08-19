import { useCallback, useState } from 'react';
import TextInput from '../../components/TextInput.js';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';
import { Box, color, Text, useTheme } from '@anthropic/ink';
import { useKeybindings } from '../../keybindings/useKeybinding.js';
import { t } from '../../utils/i18n/index.js';

interface CheckExistingSecretStepProps {
  useExistingSecret: boolean;
  secretName: string;
  onToggleUseExistingSecret: (useExisting: boolean) => void;
  onSecretNameChange: (value: string) => void;
  onSubmit: () => void;
}

export function CheckExistingSecretStep({
  useExistingSecret,
  secretName,
  onToggleUseExistingSecret,
  onSecretNameChange,
  onSubmit}: CheckExistingSecretStepProps) {
  const [cursorOffset, setCursorOffset] = useState(0);
  const terminalSize = useTerminalSize();
  const [theme] = useTheme();

  // When the text input is visible, omit confirm:yes so bare 'y' passes
  // through to the input instead of submitting. TextInput's onSubmit handles
  // Enter. Keep the Confirmation context (not Settings) to avoid j/k bindings.
  const handlePrevious = useCallback(() => onToggleUseExistingSecret(true), [onToggleUseExistingSecret]);
  const handleNext = useCallback(() => onToggleUseExistingSecret(false), [onToggleUseExistingSecret]);
  useKeybindings(
    {
      'confirm:previous': handlePrevious,
      'confirm:next': handleNext,
      'confirm:yes': onSubmit},
    { context: 'Confirmation', isActive: useExistingSecret },
  );
  useKeybindings(
    {
      'confirm:previous': handlePrevious,
      'confirm:next': handleNext},
    { context: 'Confirmation', isActive: !useExistingSecret },
  );

  return (
    <>
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>{t("cmdSystemUI.installGithubApp")}</Text>
          <Text dimColor>{t('installGithub.setupApiKeySecret')}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text color="warning">{t('installGithub.apiKeyExists')}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text>{t('installGithub.wouldYouLike')}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text>
            {useExistingSecret ? color('success', theme)('> ') : '  '}
            {t('installGithub.useExistingKey')}
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text>
            {!useExistingSecret ? color('success', theme)('> ') : '  '}
            {t('installGithub.createNewSecret')}
          </Text>
        </Box>
        {!useExistingSecret && (
          <>
            <Box marginBottom={1}>
              <Text>{t('installGithub.enterSecretName')}</Text>
            </Box>
            <TextInput
              value={secretName}
              onChange={onSecretNameChange}
              onSubmit={onSubmit}
              focus={true}
              placeholder={t('installGithub.secretNamePlaceholder')}
              columns={terminalSize.columns}
              cursorOffset={cursorOffset}
              onChangeCursorOffset={setCursorOffset}
              showCursor={true}
            />
          </>
        )}
      </Box>
      <Box marginLeft={3}>
        <Text dimColor>{'↑/↓ ' + t('installGithub.toSelect') + ' · ' + t('installGithub.enterContinue')}</Text>
      </Box>
    </>
  );
}
