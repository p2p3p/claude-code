import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const rewind = {
  description: t('cmd.descRewind'),
  name: 'rewind',
  aliases: ['checkpoint'],
  argumentHint: '',
  type: 'local',
  supportsNonInteractive: false,
  load: () => import('./rewind.js'),
} satisfies Command

export default rewind
