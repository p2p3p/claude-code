import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const webTools = {
  type: 'local-jsx',
  name: 'web-tools',
  description: t('cmd.descWebTools'),
  load: () => import('./web-tools.js'),
} satisfies Command

export default webTools
