import type { LocalCommandCall } from '../../types/command.js'
import { listPeers, isPeerAlive } from '../../utils/udsClient.js'
import {
  formatUdsAddress,
  getUdsMessagingSocketPath,
} from '../../utils/udsMessaging.js'
import { t } from '../../utils/i18n/index.js'

export const call: LocalCommandCall = async (_args, _context) => {
  const mySocket = getUdsMessagingSocketPath()
  const peers = await listPeers()

  const lines: string[] = []

  // Show own socket
  lines.push(t('peersCmd.yourSocket', mySocket ?? t('peersCmd.notStarted')))
  lines.push('')

  if (peers.length === 0) {
    lines.push(t('peersCmd.noPeers'))
  } else {
    lines.push(t('peersCmd.peersCount', peers.length))
    lines.push('')

    for (const peer of peers) {
      const alive = peer.messagingSocketPath
        ? await isPeerAlive(peer.messagingSocketPath)
        : false
      const status = alive ? t('peersCmd.reachable') : t('peersCmd.unreachable')
      const label = peer.name ?? peer.kind ?? t('peersCmd.interactive')
      const cwd = peer.cwd ? t('peersCmd.cwdLine', peer.cwd) : ''
      const age = peer.startedAt
        ? t('peersCmd.startedLine', formatAge(peer.startedAt))
        : ''

      lines.push(t('peersCmd.peerLine', status, peer.pid, label, cwd, age))
      if (peer.messagingSocketPath) {
        lines.push(
          t('peersCmd.socketLine', formatUdsAddress(peer.messagingSocketPath)),
        )
      }
      if (peer.sessionId) {
        lines.push(t('peersCmd.sessionLine', peer.sessionId))
      }
    }
  }

  lines.push('')
  lines.push(t('peersCmd.messageHint'))

  return { type: 'text', value: lines.join('\n') }
}

function formatAge(startedAt: number): string {
  const elapsed = Date.now() - startedAt
  const seconds = Math.floor(elapsed / 1000)
  if (seconds < 60) return t('peersCmd.secondsAgo', seconds)
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t('peersCmd.minutesAgo', minutes)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return t('peersCmd.hoursMinutesAgo', hours, remainingMinutes)
}
