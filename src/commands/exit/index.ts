import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const exit = {
  type: 'local-jsx',
  name: 'exit',
  aliases: ['quit'],
  description: t('cmd.descExit'),
  immediate: true,
  load: () => import('./exit.js')} satisfies Command

export default exit
