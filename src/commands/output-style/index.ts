import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const outputStyle = {
  type: 'local-jsx',
  name: 'output-style',
  description: t('cmd.descOutputStyle'),
  isHidden: true,
  load: () => import('./output-style.js')} satisfies Command

export default outputStyle
