import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const stickers = {
  type: 'local',
  name: 'stickers',
  description: t('cmd.descStickers'),
  supportsNonInteractive: false,
  load: () => import('./stickers.js')} satisfies Command

export default stickers
