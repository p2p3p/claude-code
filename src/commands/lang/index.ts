import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const lang = {
  type: 'local-jsx',
  name: 'lang',
  description: t('cmd.descLang'),
  immediate: true,
  argumentHint: '<en|zh|auto>',
  load: () => import('./lang.js'),
} satisfies Command

export default lang
