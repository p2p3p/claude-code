import type { Command } from '../../commands.js'
import { checkStatsigFeatureGate_CACHED_MAY_BE_STALE } from '../../services/analytics/growthbook.js'
import { t } from '../../utils/i18n/index.js'

const thinkback = {
  type: 'local-jsx',
  name: 'think-back',
  description: t('cmd.descThinkback'),
  isEnabled: () =>
    checkStatsigFeatureGate_CACHED_MAY_BE_STALE('tengu_thinkback'),
  load: () => import('./thinkback.js'),
} satisfies Command

export default thinkback
