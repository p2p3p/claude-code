import type { LocalCommandCall } from '../../types/command.js'
import { getAllSlaveClients } from '../../hooks/useMasterMonitor.js'
import {
  getPipeDisplayRole,
  getPipeIpc,
  isPipeControlled,
} from '../../utils/pipeTransport.js'
import { t } from '../../utils/i18n/index.js'

export const call: LocalCommandCall = async (_args, context) => {
  const currentState = context.getAppState()

  if (getPipeIpc(currentState).role === 'main') {
    return {
      type: 'text',
      value: t('pipeStatus.mainMode'),
    }
  }

  if (isPipeControlled(getPipeIpc(currentState))) {
    return {
      type: 'text',
      value: t('pipeStatus.controlledMode', getPipeDisplayRole(getPipeIpc(currentState)), getPipeIpc(currentState).attachedBy),
    }
  }

  // Master mode
  const slaves = getPipeIpc(currentState).slaves
  const slaveNames = Object.keys(slaves)
  const clients = getAllSlaveClients()

  if (slaveNames.length === 0) {
    return {
      type: 'text',
      value: t('pipeStatus.masterNoSubs'),
    }
  }

  const lines: string[] = [
    t('pipeStatus.masterHeader', slaveNames.length),
    '',
  ]

  for (const name of slaveNames) {
    const slave = slaves[name]!
    const client = clients.get(name)
    const connected = client?.connected ? t('pipeStatus.connected') : t('pipeStatus.disconnected')
    const historyCount = slave.history.length
    const connectedAt = slave.connectedAt.slice(11, 19)

    lines.push(`  ${name}`)
    lines.push(t('pipeStatus.statusLine', slave.status, connected))
    lines.push(t('pipeStatus.connectedLine', connectedAt))
    lines.push(t('pipeStatus.historyLine', historyCount))
    lines.push('')
  }

  lines.push(t('pipeStatus.commandsHeading'))
  lines.push('  /send <name> <msg>  ' + t('pipeStatus.cmdSend'))
  lines.push('  /history <name>     ' + t('pipeStatus.cmdHistory'))
  lines.push('  /detach [name]      ' + t('pipeStatus.cmdDetach'))

  return { type: 'text', value: lines.join('\n') }
}
