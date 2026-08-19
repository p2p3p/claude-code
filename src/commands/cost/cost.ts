import { formatTotalCost } from '../../cost-tracker.js'
import { currentLimits } from '../../services/claudeAiLimits.js'
import type { LocalCommandCall } from '../../types/command.js'
import { isClaudeAISubscriber } from '../../utils/auth.js'
import { t } from '../../utils/i18n/index.js'

export const call: LocalCommandCall = async () => {
  if (isClaudeAISubscriber()) {
    let value: string

    if (currentLimits.isUsingOverage) {
      value = t('costCmd.usingOverage')
    } else {
      value = t('costCmd.usingSubscription')
    }

    if (process.env.USER_TYPE === 'ant') {
      value += t('costCmd.antOnlyCost', formatTotalCost())
    }
    return { type: 'text', value }
  }
  return { type: 'text', value: formatTotalCost() }
}
