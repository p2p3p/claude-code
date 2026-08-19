import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

export default {
  type: 'local-jsx',
  name: 'usage',
  aliases: ['cost', 'stats'],
  description: t('cmd.descUsage'),
  // Like /lang: pure local display panel, must open even while a query is
  // still running (queryGuard blocks non-immediate commands mid-response).
  immediate: true,
  load: () => import('./usage.js')} satisfies Command
