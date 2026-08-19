import { Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';

export function CheckGitHubStep() {
  return <Text>{t('installGithub.checkingGitHub')}</Text>;
}
