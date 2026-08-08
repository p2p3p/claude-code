import { feature } from 'bun:bundle'
import type { LocalCommandCall } from '../../types/command.js'
import {
  isPipeAlive,
  getPipeIpc,
  getPipeDisplayRole,
  isPipeControlled,
} from '../../utils/pipeTransport.js'
import {
  cleanupStaleEntries,
  readRegistry,
  isMainMachine,
  mergeWithLanPeers,
} from '../../utils/pipeRegistry.js'
import { t } from '../../utils/i18n/index.js'

export const call: LocalCommandCall = async (_args, context) => {
  const args = _args.trim()

  // Enable status line + toggle selector open
  context.setAppState(prev => {
    const pipeIpc = getPipeIpc(prev)
    return {
      ...prev,
      pipeIpc: {
        ...pipeIpc,
        statusVisible: true,
        selectorOpen: !pipeIpc.selectorOpen,
      },
    }
  })

  // Handle select/deselect subcommands
  if (args.startsWith('select ') || args.startsWith('sel ')) {
    const pipeName = args.replace(/^(select|sel)\s+/, '').trim()
    if (!pipeName)
      return { type: 'text', value: t('pipesCmd.usageSelect') }
    context.setAppState(prev => {
      const pipeIpc = getPipeIpc(prev)
      const selected = pipeIpc.selectedPipes ?? []
      if (selected.includes(pipeName)) return prev
      return {
        ...prev,
        pipeIpc: { ...pipeIpc, selectedPipes: [...selected, pipeName] },
      }
    })
    return {
      type: 'text',
      value: t('pipesCmd.selected', pipeName),
    }
  }

  if (
    args.startsWith('deselect ') ||
    args.startsWith('desel ') ||
    args.startsWith('unsel ')
  ) {
    const pipeName = args.replace(/^(deselect|desel|unsel)\s+/, '').trim()
    if (!pipeName)
      return { type: 'text', value: t('pipesCmd.usageDeselect') }
    context.setAppState(prev => {
      const pipeIpc = getPipeIpc(prev)
      const selected = (pipeIpc.selectedPipes ?? []).filter(
        (n: string) => n !== pipeName,
      )
      return { ...prev, pipeIpc: { ...pipeIpc, selectedPipes: selected } }
    })
    return { type: 'text', value: t('pipesCmd.deselected', pipeName) }
  }

  if (args === 'select-all' || args === 'all') {
    const currentState = context.getAppState()
    const pipeState = getPipeIpc(currentState)
    const slaveNames = Object.keys(pipeState.slaves)
    context.setAppState(prev => ({
      ...prev,
      pipeIpc: { ...getPipeIpc(prev), selectedPipes: slaveNames },
    }))
    return {
      type: 'text',
      value: t('pipesCmd.selectedAll', slaveNames.length),
    }
  }

  if (args === 'deselect-all' || args === 'none') {
    context.setAppState(prev => ({
      ...prev,
      pipeIpc: { ...getPipeIpc(prev), selectedPipes: [] },
    }))
    return {
      type: 'text',
      value: t('pipesCmd.deselectedAll'),
    }
  }

  const currentState = context.getAppState()
  const pipeState = getPipeIpc(currentState)
  const myName = pipeState.serverName
  const displayRole = getPipeDisplayRole(pipeState)
  const selected: string[] = pipeState.selectedPipes ?? []

  await cleanupStaleEntries()
  const registry = await readRegistry()

  const lines: string[] = []

  lines.push(t('pipesCmd.yourPipe', myName ?? t('pipesCmd.notStarted')))
  lines.push(t('pipesCmd.role', displayRole))
  if (pipeState.machineId)
    lines.push(t('pipesCmd.machineId', pipeState.machineId.slice(0, 8)))
  if (pipeState.localIp) lines.push(t('pipesCmd.ip', pipeState.localIp))
  if (pipeState.hostname) lines.push(t('pipesCmd.host', pipeState.hostname))

  if (isPipeControlled(pipeState)) {
    lines.push(t('pipesCmd.controlledBy', pipeState.attachedBy))
  }

  lines.push('')

  if (registry.mainMachineId) {
    const isMyMachine = isMainMachine(pipeState.machineId ?? '', registry)
    lines.push(
      t('pipesCmd.mainMachine', registry.mainMachineId.slice(0, 8), isMyMachine ? t('pipesCmd.thisMachine') : ''),
    )
  }

  // Show main from registry
  if (registry.main) {
    const m = registry.main
    const alive = await isPipeAlive(m.pipeName, 1000)
    const isSelf = m.pipeName === myName
    lines.push(
      t('pipesCmd.mainEntry', m.pipeName, m.hostname, m.ip, alive ? t('pipesCmd.alive') : t('pipesCmd.stale'), isSelf ? t('pipesCmd.you') : ''),
    )
  }

  // Show subs from registry with selection status
  const discoveredPipes: Array<{
    id: string
    pipeName: string
    role: string
    machineId: string
    ip: string
    hostname: string
    alive: boolean
  }> = []

  for (const sub of registry.subs) {
    const alive = await isPipeAlive(sub.pipeName, 1000)
    const isSelf = sub.pipeName === myName
    const isSelected = selected.includes(sub.pipeName)
    const checkbox = isSelected ? '☑' : '☐'
    const isAttached = pipeState.slaves[sub.pipeName] ? t('pipesCmd.connected') : ''
    lines.push(
      t('pipesCmd.subEntry', checkbox, sub.subIndex, sub.pipeName, sub.hostname, sub.ip, alive ? t('pipesCmd.alive') : t('pipesCmd.stale'), isAttached, isSelf ? t('pipesCmd.you') : ''),
    )
    if (alive) {
      discoveredPipes.push({
        id: sub.id,
        pipeName: sub.pipeName,
        role: `sub-${sub.subIndex}`,
        machineId: sub.machineId,
        ip: sub.ip,
        hostname: sub.hostname,
        alive,
      })
    }
  }

  if (!registry.main && registry.subs.length === 0) {
    lines.push(t('pipesCmd.noOtherPipes'))
  }

  // Show LAN peers (if LAN_PIPES enabled)
  if (feature('LAN_PIPES')) {
    const { getLanBeacon } =
      require('../../utils/lanBeacon.js') as typeof import('../../utils/lanBeacon.js')
    const lanBeaconRef = getLanBeacon()
    if (lanBeaconRef) {
      const lanPeers = lanBeaconRef.getPeers()
      const merged = mergeWithLanPeers(registry, lanPeers)
      const lanOnly = merged.filter(e => e.source === 'lan')
      if (lanOnly.length > 0) {
        lines.push('')
        lines.push(t('pipesCmd.lanPeersHeading'))
        for (const peer of lanOnly) {
          const isSelected = selected.includes(peer.pipeName)
          const checkbox = isSelected ? '☑' : '☐'
          const ep = peer.tcpEndpoint
            ? `tcp:${peer.tcpEndpoint.host}:${peer.tcpEndpoint.port}`
            : ''
          lines.push(
            t('pipesCmd.lanPeerEntry', checkbox, peer.role, peer.pipeName, peer.hostname, peer.ip, ep),
          )
          discoveredPipes.push({
            id: peer.id,
            pipeName: peer.pipeName,
            role: peer.role,
            machineId: peer.machineId,
            ip: peer.ip,
            hostname: peer.hostname,
            alive: true,
          })
        }
      } else {
        lines.push('')
        lines.push(t('pipesCmd.lanPeersNone'))
      }
    }
  }

  // Update state
  context.setAppState(prev => ({
    ...prev,
    pipeIpc: { ...getPipeIpc(prev), discoveredPipes },
  }))

  lines.push('')
  lines.push(
    selected.length > 0
      ? t('pipesCmd.selectedList', selected.join(', '))
      : t('pipesCmd.selectedNone'),
  )
  lines.push('')
  lines.push(t('pipesCmd.commandsHeading'))
  lines.push('  /pipes select <name>    ' + t('pipesCmd.cmdSelect'))
  lines.push('  /pipes deselect <name>  ' + t('pipesCmd.cmdDeselect'))
  lines.push('  /pipes all              ' + t('pipesCmd.cmdAll'))
  lines.push('  /pipes none             ' + t('pipesCmd.cmdNone'))
  lines.push('  /send <name> <msg>      ' + t('pipesCmd.cmdSend'))
  lines.push('  /claim-main             ' + t('pipesCmd.cmdClaimMain'))

  return { type: 'text', value: lines.join('\n') }
}
