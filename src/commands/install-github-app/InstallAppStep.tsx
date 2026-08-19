import figures from 'figures';
import { GITHUB_ACTION_SETUP_DOCS_URL } from '../../constants/github-app.js';
import { Box, Text } from '@anthropic/ink';
import { useKeybinding } from '../../keybindings/useKeybinding.js';
import { t } from '../../utils/i18n/index.js';

interface InstallAppStepProps {
  repoUrl: string;
  onSubmit: () => void;
}

export function InstallAppStep({ repoUrl, onSubmit }: InstallAppStepProps) {
  // Enter to submit
  useKeybinding('confirm:yes', onSubmit, { context: 'Confirmation' });

  return (
    <Box flexDirection="column" borderStyle="round" borderDimColor paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>{t("cmdSystemUI.installGithubApp")}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text>{t('installGithub.openingBrowser')}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text>{t('installGithub.ifNotOpen')}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text underline>https://github.com/apps/claude</Text>
      </Box>
      <Box marginBottom={1}>
        <Text>
          {t('installGithub.installForRepo')} <Text bold>{repoUrl}</Text>
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text dimColor>{t('installGithub.grantAccess')}</Text>
      </Box>
      <Box>
        <Text bold color="permission">
          {t('installGithub.pressEnterInstalled')}{figures.ellipsis}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          {t('installGithub.havingTrouble')} <Text color="claude">{GITHUB_ACTION_SETUP_DOCS_URL}</Text>
        </Text>
      </Box>
    </Box>
  );
}
