import { GITHUB_ACTION_SETUP_DOCS_URL } from '../../constants/github-app.js';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';

interface ErrorStepProps {
  error: string | undefined;
  errorReason?: string;
  errorInstructions?: string[];
}

export function ErrorStep({ error, errorReason, errorInstructions }: ErrorStepProps) {
  return (
    <>
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>{t("cmdSystemUI.installGithubApp")}</Text>
        </Box>
        <Text color="error">{t('installGithub.errorPrefix')} {error}</Text>
        {errorReason && (
          <Box marginTop={1}>
            <Text dimColor>{t('installGithub.reasonPrefix')} {errorReason}</Text>
          </Box>
        )}
        {errorInstructions && errorInstructions.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Text dimColor>{t('installGithub.howToFix')}</Text>
            {errorInstructions.map((instruction, index) => (
              <Box key={index} marginLeft={2}>
                <Text dimColor>• </Text>
                <Text>{instruction}</Text>
              </Box>
            ))}
          </Box>
        )}
        <Box marginTop={1}>
          <Text dimColor>
            {t('installGithub.manualSetupInstructions')} <Text color="claude">{GITHUB_ACTION_SETUP_DOCS_URL}</Text>
          </Text>
        </Box>
      </Box>
      <Box marginLeft={3}>
        <Text dimColor>{t('installGithub.pressAnyKey')}</Text>
      </Box>
    </>
  );
}
