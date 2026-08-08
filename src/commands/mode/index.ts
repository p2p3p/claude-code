import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const mode = {
  type: 'local-jsx',
  name: 'mode',
  description: t('cmd.descMode'),
  isEnabled: () => true,
  argumentHint: '<mode-slug>',
  load: () => import('./mode.js'),
} satisfies Command

export default mode
