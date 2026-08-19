import type { Command } from '../types/command.js'
import { t } from '../utils/i18n/index.js'

const autonomy = {
  type: 'local-jsx',
  name: 'autonomy',
  description: t('cmd.descAutonomy'),
  argumentHint:
    '[status [--deep]|runs [limit]|flows [limit]|flow <id>|flow cancel <id>|flow resume <id>]',
  load: () => import('./autonomyPanel.js')} satisfies Command

export default autonomy
