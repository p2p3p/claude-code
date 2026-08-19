import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'
import { t } from '../../utils/i18n/index.js'

const compact = {
  type: 'local',
  name: 'compact',
  description: t('cmd.descCompact'),
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_COMPACT),
  supportsNonInteractive: true,
  argumentHint: '<optional custom summarization instructions>',
  load: () => import('./compact.js')} satisfies Command

export default compact
