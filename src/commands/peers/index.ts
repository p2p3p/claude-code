import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const peers = {
  type: 'local',
  name: 'peers',
  aliases: ['who'],
  description: t('cmd.descPeers'),
  supportsNonInteractive: true,
  load: () => import('./peers.js')} satisfies Command

export default peers
