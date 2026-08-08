import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

export default {
  type: 'local-jsx',
  name: 'usage',
  aliases: ['cost', 'stats'],
  description: t('cmd.descUsage'),
  load: () => import('./usage.js'),
} satisfies Command
