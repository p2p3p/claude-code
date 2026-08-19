import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const installSlackApp = {
  type: 'local',
  name: 'install-slack-app',
  description: t('cmd.descInstallSlackApp'),
  availability: ['claude-ai'],
  supportsNonInteractive: false,
  load: () => import('./install-slack-app.js')} satisfies Command

export default installSlackApp
