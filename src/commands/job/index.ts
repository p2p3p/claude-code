import type { Command } from '../../commands.js'
import { feature } from 'bun:bundle'
import { t } from '../../utils/i18n/index.js'

const job = {
  type: 'local-jsx',
  name: 'job',
  description: t('cmd.descJob'),
  argumentHint: '[list|new|reply|status]',
  isEnabled: () => {
    if (feature('TEMPLATES')) return true
    return false
  },
  load: () => import('./job.js')} satisfies Command

export default job
