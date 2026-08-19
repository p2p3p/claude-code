import type { Command } from '../../commands.js'
import { feature } from 'bun:bundle'
import { t } from '../../utils/i18n/index.js'

const daemon = {
  type: 'local-jsx',
  name: 'daemon',
  description: t('cmd.descDaemon'),
  argumentHint: '[status|start|stop|bg|attach|logs|kill]',
  isEnabled: () => {
    if (feature('DAEMON')) return true
    if (feature('BG_SESSIONS')) return true
    return false
  },
  load: () => import('./daemon.js')} satisfies Command

export default daemon
