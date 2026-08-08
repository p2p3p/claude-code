import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const history = {
  type: 'local',
  name: 'history',
  aliases: ['hist'],
  description: t('cmd.descHistory'),
  supportsNonInteractive: false,
  load: () => import('./history.js'),
} satisfies Command

export default history
