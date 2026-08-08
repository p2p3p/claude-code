import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const fork = {
  type: 'local-jsx',
  name: 'fork',
  description: t('cmd.descFork'),
  argumentHint: '<prompt>',
  load: () => import('./fork.js'),
} satisfies Command

export default fork
