import type { Command } from '../../types/command.js'
import { t } from '../../utils/i18n/index.js'

const teleport: Command = {
  type: 'local-jsx',
  name: 'teleport',
  // Official v2.1.123 advertises alias `tp` (reverse-engineered from
  // claude.exe: `name:"teleport",aliases:["tp"]`). Keeping it for parity.
  aliases: ['tp'],
  description: t('cmd.descTeleport'),
  // REPL markdown renderer strips `<...>` as HTML tags — use uppercase.
  argumentHint: 'SESSION_ID',
  isHidden: false,
  isEnabled: () => true,
  bridgeSafe: false,
  getBridgeInvocationError: (_args: string) => t('teleportCmd.bridgeError'),
  load: async () => {
    const m = await import('./launchTeleport.js')
    return { call: m.callTeleport }
  }}

export default teleport
