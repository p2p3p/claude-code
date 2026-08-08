import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const pipeStatus = {
  type: 'local',
  name: 'pipe-status',
  description: t('cmd.descPipeStatus'),
  supportsNonInteractive: true,
  load: () => import('./pipe-status.js'),
} satisfies Command

export default pipeStatus
