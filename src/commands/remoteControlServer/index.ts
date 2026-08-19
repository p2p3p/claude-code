import { feature } from 'bun:bundle'
import { isBridgeEnabled } from '../../bridge/bridgeEnabled.js'
import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

function isEnabled(): boolean {
  if (!feature('BRIDGE_MODE')) {
    return false
  }
  if (feature('DAEMON')) {
    return isBridgeEnabled()
  }
  // DAEMON feature disabled — still allow the command but warn at runtime
  // that headless/daemon worker mode is unavailable.
  return isBridgeEnabled()
}

const remoteControlServer = {
  type: 'local-jsx',
  name: 'remote-control-server',
  aliases: ['rcs'],
  description: t('cmd.descRemoteControlServer'),
  isEnabled,
  get isHidden() {
    return !isEnabled()
  },
  immediate: true,
  load: () => import('./remoteControlServer.js')} satisfies Command

export default remoteControlServer
