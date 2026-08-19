import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const heapDump = {
  type: 'local',
  name: 'heapdump',
  description: t('cmd.descHeapdump'),
  isHidden: true,
  supportsNonInteractive: true,
  load: () => import('./heapdump.js')} satisfies Command

export default heapDump
