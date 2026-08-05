import figures from 'figures';
import { GITHUB_ACTION_SETUP_DOCS_URL } from '../../constants/github-app.js';
import { Box, Text } from '@anthropic/ink';
import { useKeybinding } from '../../keybindings/useKeybinding.js';
import type { Warning } from './types.js';
import { t } from '../../utils/i18n/index.js'

interface WarningsStepProps {
  warnings: Warning[];
  onContinue: () => void;
}

export function WarningsStep({ warnings, onContinue }: WarningsStepProps) {
  // Enter to continue
  useKeybinding('confirm:yes', onContinue, { context: 'Confirmation' });

  return (
    <>
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>{figures.warning} {t('installGithub.setupWarnings')}</Text>
          <Text dimColor>{t('installGithub.warningsDesc')}</Text>
        </Box>

        {warnings.map((warning, index) => (
          <Box key={index} flexDirection="column" marginBottom={1}>
            <Text color="warning" bold>
              {warning.title}
            </Text>
            <Text>{warning.message}</Text>
            {warning.instructions.length > 0 && (
              <Box flexDirection="column" marginLeft={2} marginTop={1}>
                {warning.instructions.map((instruction, i) => (
                  <Text key={i} dimColor>
                    • {instruction}
                  </Text>
                ))}
              </Box>
            )}
          </Box>
        ))}

        <Box marginTop={1}>
          <Text bold color="permission">
            {t('installGithub.continueAnyway')}
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>
            {t('installGithub.manualSetup')}
            <Text color="claude">{GITHUB_ACTION_SETUP_DOCS_URL}</Text>
          </Text>
        </Box>
      </Box>
    </>
  );
}
