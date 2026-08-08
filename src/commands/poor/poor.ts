import type { LocalCommandCall } from '../../types/command.js'
import { isPoorModeActive, setPoorMode } from './poorMode.js'
import { t } from '../../utils/i18n/index.js'

export const call: LocalCommandCall = async (_, context) => {
  const currentlyActive = isPoorModeActive()
  const newState = !currentlyActive
  setPoorMode(newState)

  if (newState) {
    // Disable prompt suggestion in AppState
    context.setAppState(prev => ({
      ...prev,
      promptSuggestionEnabled: false,
    }))
  } else {
    // Re-enable prompt suggestion
    context.setAppState(prev => ({
      ...prev,
      promptSuggestionEnabled: true,
    }))
  }

  const status = newState ? t('poorCmd.on') : t('poorCmd.off')
  const details = newState
    ? t('poorCmd.disabledDetails')
    : t('poorCmd.restoredDetails')
  return { type: 'text', value: t('poorCmd.statusMsg', status, details) }
}
