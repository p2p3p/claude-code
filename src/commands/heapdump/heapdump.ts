import { performHeapDump } from '../../utils/heapDumpService.js'
import { t } from '../../utils/i18n/index.js'

export async function call(): Promise<{ type: 'text'; value: string }> {
  const result = await performHeapDump()

  if (!result.success) {
    return {
      type: 'text',
      value: t('heapdumpCmd.failed', result.error)}
  }

  return {
    type: 'text',
    value: t('heapdumpCmd.success', result.heapPath, result.diagPath)}
}
