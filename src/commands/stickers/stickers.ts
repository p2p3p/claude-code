import type { LocalCommandResult } from '../../types/command.js'
import { openBrowser } from '../../utils/browser.js'
import { t } from '../../utils/i18n/index.js'

export async function call(): Promise<LocalCommandResult> {
  const url = 'https://www.stickermule.com/claudecode'
  const success = await openBrowser(url)

  if (success) {
    return { type: 'text', value: t('stickersCmd.opening') }
  } else {
    return {
      type: 'text',
      value: t('stickersCmd.failedToOpen', url)}
  }
}
