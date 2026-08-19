import type { LocalCommandCall } from '../../types/command.js'
import { getPipeIpc } from '../../utils/pipeTransport.js'
import { t } from '../../utils/i18n/index.js'

export const call: LocalCommandCall = async (args, context) => {
  const currentState = context.getAppState()

  if (getPipeIpc(currentState).role !== 'master') {
    return {
      type: 'text',
      value: t('historyCmd.notInMasterMode')}
  }

  const parts = args.trim().split(/\s+/)
  const targetName = parts[0]

  if (!targetName) {
    // Show list of connected sub sessions
    const slaveNames = Object.keys(getPipeIpc(currentState).slaves)
    if (slaveNames.length === 0) {
      return { type: 'text', value: t('historyCmd.noSubSessions') }
    }
    return {
      type: 'text',
      value: t('historyCmd.usageWithSessions', slaveNames.join(', '))}
  }

  const slave = getPipeIpc(currentState).slaves[targetName]
  if (!slave) {
    return {
      type: 'text',
      value: t('historyCmd.notAttached', targetName)}
  }

  // Parse --last N
  let limit = slave.history.length
  const lastIdx = parts.indexOf('--last')
  if (lastIdx !== -1 && parts[lastIdx + 1]) {
    const n = parseInt(parts[lastIdx + 1], 10)
    if (!isNaN(n) && n > 0) {
      limit = n
    }
  }

  const entries = slave.history.slice(-limit)

  if (entries.length === 0) {
    return {
      type: 'text',
      value: t('historyCmd.noSessionHistory', targetName)}
  }

  const lines: string[] = [
    t('historyCmd.sessionHistoryHeader', targetName, entries.length, slave.history.length),
    '',
  ]

  for (const entry of entries) {
    const time = entry.timestamp.slice(11, 19) // HH:MM:SS
    const prefix = formatEntryType(entry.type)
    const content =
      entry.content.length > 200
        ? entry.content.slice(0, 200) + '...'
        : entry.content
    lines.push(`[${time}] ${prefix} ${content}`)
  }

  return { type: 'text', value: lines.join('\n') }
}

function formatEntryType(type: string): string {
  switch (type) {
    case 'prompt':
      return t('historyCmd.typePrompt')
    case 'prompt_ack':
      return t('historyCmd.typePromptAck')
    case 'stream':
      return t('historyCmd.typeStream')
    case 'tool_start':
      return t('historyCmd.typeToolStart')
    case 'tool_result':
      return t('historyCmd.typeToolResult')
    case 'done':
      return t('historyCmd.typeDone')
    case 'error':
      return t('historyCmd.typeError')
    default:
      return `[${type}]`
  }
}
