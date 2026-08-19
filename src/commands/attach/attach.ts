import { feature } from 'bun:bundle'
import type { LocalCommandCall } from '../../types/command.js'
import {
  connectToPipe,
  getPipeIpc,
  isPipeControlled,
  type PipeClient,
  type PipeMessage,
  type TcpEndpoint} from '../../utils/pipeTransport.js'
import { addSlaveClient } from '../../hooks/useMasterMonitor.js'
import { t } from '../../utils/i18n/index.js'

export const call: LocalCommandCall = async (args, context) => {
  const targetName = args.trim()
  if (!targetName) {
    return {
      type: 'text',
      value: t('attachCmd.usage')}
  }

  const currentState = context.getAppState()

  // Check if already attached to this slave
  if (getPipeIpc(currentState).slaves[targetName]) {
    return {
      type: 'text',
      value: t('attachCmd.alreadyAttached', targetName)}
  }

  // Controlled sub sessions cannot attach to other sub sessions.
  if (isPipeControlled(getPipeIpc(currentState))) {
    return {
      type: 'text',
      value: t('attachCmd.controlledByMaster')}
  }

  // Resolve TCP endpoint for LAN peers
  let tcpEndpoint: TcpEndpoint | undefined
  if (feature('LAN_PIPES')) {
    const pipeState = getPipeIpc(currentState)
    const discoveredPeer = pipeState.discoveredPipes.find(
      (p: { pipeName: string }) => p.pipeName === targetName,
    )
    if (discoveredPeer) {
      // Check if this is a LAN peer by looking up beacon data
      const { getLanBeacon } =
        require('../../utils/lanBeacon.js') as typeof import('../../utils/lanBeacon.js')
      const beaconRef = getLanBeacon()
      if (beaconRef) {
        const lanPeers = beaconRef.getPeers()
        const lanPeer = lanPeers.get(targetName)
        if (lanPeer) {
          tcpEndpoint = { host: lanPeer.ip, port: lanPeer.tcpPort }
        }
      }
    }
  }

  // Connect to the target pipe server (UDS or TCP)
  let client: PipeClient
  try {
    const myName =
      getPipeIpc(currentState).serverName ?? `master-${process.pid}`
    client = await connectToPipe(targetName, myName, undefined, tcpEndpoint)
  } catch (err) {
    const tcpSuffix = tcpEndpoint
      ? t('attachCmd.tcpEndpoint', tcpEndpoint.host, tcpEndpoint.port)
      : ''
    const reason = err instanceof Error ? err.message : String(err)
    return {
      type: 'text',
      value: t('attachCmd.failedToConnect', targetName, tcpSuffix, reason)}
  }

  // Send attach request and wait for response
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      client.disconnect()
      resolve({
        type: 'text',
        value: t('attachCmd.attachTimedOut', targetName)})
    }, 5000)

    client.onMessage((msg: PipeMessage) => {
      if (msg.type === 'attach_accept') {
        clearTimeout(timeout)

        // Register the slave client in the module-level registry
        addSlaveClient(targetName, client)

        // Update AppState: add slave and switch to master role
        context.setAppState(prev => ({
          ...prev,
          pipeIpc: {
            ...getPipeIpc(prev),
            role: 'master',
            displayRole: 'master',
            slaves: {
              ...getPipeIpc(prev).slaves,
              [targetName]: {
                name: targetName,
                connectedAt: new Date().toISOString(),
                status: 'idle' as const,
                unreadCount: 0,
                history: []}}}}))

        const slaveCount =
          Object.keys(getPipeIpc(currentState).slaves).length + 1
        resolve({
          type: 'text',
          value: t('attachCmd.attachedAsMaster', targetName, slaveCount)})
      } else if (msg.type === 'attach_reject') {
        clearTimeout(timeout)
        client.disconnect()

        resolve({
          type: 'text',
          value: t(
            'attachCmd.attachRejected',
            targetName,
            msg.data ?? t('attachCmd.unknownReason'),
          )})
      }
    })

    // Include machineId so remote can distinguish LAN peers from local peers
    const pipeState = getPipeIpc(currentState)
    client.send({
      type: 'attach_request',
      meta: { machineId: pipeState.machineId }})
  })
}
