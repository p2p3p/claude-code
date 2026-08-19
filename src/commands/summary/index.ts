/**
 * /summary — Generate and display a session summary.
 *
 * Triggers a manual Session Memory extraction (bypassing automatic thresholds),
 * then reads and displays the updated summary.md file.
 */
import type { Command, LocalCommandCall } from '../../types/command.js'
import type { Message } from '../../types/message.js'
import { t } from '../../utils/i18n/index.js'

/** Only user/assistant/system messages are valid for API calls. */
const API_SAFE_TYPES = new Set(['user', 'assistant', 'system'])

const call: LocalCommandCall = async (_args, context) => {
  const { messages } = context

  // Filter to API-safe message types only.
  // context.messages includes progress/attachment/etc. that crash the API
  // call chain (normalizeMessagesForAPI → addCacheBreakpoints expects
  // only user/assistant). The automatic extraction path uses
  // createCacheSafeParams(REPLHookContext) which already has clean
  // messages; the manual path via /summary does not.
  const safeMessages = (messages ?? []).filter(
    (m): m is Message => m != null && API_SAFE_TYPES.has(m.type),
  )

  if (safeMessages.length === 0) {
    return { type: 'text', value: t('summaryCmd.noMessages') }
  }

  try {
    const { manuallyExtractSessionMemory } = await import(
      '../../services/SessionMemory/sessionMemory.js'
    )
    const { getSessionMemoryContent } = await import(
      '../../services/SessionMemory/sessionMemoryUtils.js'
    )

    const safeContext = { ...context, messages: safeMessages }
    const result = await manuallyExtractSessionMemory(safeMessages, safeContext)

    if (!result.success) {
      return {
        type: 'text',
        value: t('summaryCmd.failedGenerate', result.error ?? t('summaryCmd.unknownError'))}
    }

    const content = await getSessionMemoryContent()

    if (!content || content.trim().length === 0) {
      return {
        type: 'text',
        value: t('summaryCmd.empty')}
    }

    return {
      type: 'text',
      value: t('summaryCmd.updated', content)}
  } catch (error) {
    return {
      type: 'text',
      value: t('summaryCmd.failedGenerate', error instanceof Error ? error.message : String(error))}
  }
}

const summary = {
  type: 'local',
  name: 'summary',
  description: t('cmd.descSummary'),
  supportsNonInteractive: true,
  isHidden: false,
  load: () => Promise.resolve({ call })} satisfies Command

export default summary
