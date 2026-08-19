import { t } from '../../utils/i18n/index.js'
import { runExtraUsage } from './extra-usage-core.js'

export async function call(): Promise<{ type: 'text'; value: string }> {
  const result = await runExtraUsage()

  if (result.type === 'message') {
    return { type: 'text', value: result.value }
  }

  return {
    type: 'text',
    value: result.opened
      ? t('extraUsage.browserOpened', result.url)
      : t('extraUsage.visitUrl', result.url)}
}
