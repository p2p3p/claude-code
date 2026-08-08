import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const send = {
  type: 'local',
  name: 'send',
  description: t('cmd.descSend'),
  supportsNonInteractive: false,
  load: () => import('./send.js'),
} satisfies Command

export default send
