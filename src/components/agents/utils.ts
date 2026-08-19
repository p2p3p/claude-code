import capitalize from 'lodash-es/capitalize.js'
import type { SettingSource } from 'src/utils/settings/constants.js'
import { getSettingSourceName } from 'src/utils/settings/constants.js'
import { t } from 'src/utils/i18n/index.js'

export function getAgentSourceDisplayName(
  source: SettingSource | 'all' | 'built-in' | 'plugin',
): string {
  if (source === 'all') {
    return t('agentslist.agentsAll')
  }
  if (source === 'built-in') {
    return t('agentslist.builtInAgents')
  }
  if (source === 'plugin') {
    return t('agentslist.pluginAgents')
  }
  return capitalize(getSettingSourceName(source))
}
