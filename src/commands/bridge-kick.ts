import { getBridgeDebugHandle } from '../bridge/bridgeDebug.js'
import type { Command } from '../commands.js'
import type { LocalCommandCall } from '../types/command.js'
import { t } from '../utils/i18n/index.js'

/**
 * Ant-only: inject bridge failure states to manually test recovery paths.
 *
 *   /bridge-kick close 1002            — fire ws_closed with code 1002
 *   /bridge-kick close 1006            — fire ws_closed with code 1006
 *   /bridge-kick poll 404              — next poll throws 404/not_found_error
 *   /bridge-kick poll 404 <type>       — next poll throws 404 with error_type
 *   /bridge-kick poll 401              — next poll throws 401 (auth)
 *   /bridge-kick poll transient        — next poll throws axios-style rejection
 *   /bridge-kick register fail         — next register (inside doReconnect) transient-fails
 *   /bridge-kick register fail 3       — next 3 registers transient-fail
 *   /bridge-kick register fatal        — next register 403s (terminal)
 *   /bridge-kick reconnect-session fail — POST /bridge/reconnect fails (→ Strategy 2)
 *   /bridge-kick heartbeat 401         — next heartbeat 401s (JWT expired)
 *   /bridge-kick reconnect             — call doReconnect directly (= SIGUSR2)
 *   /bridge-kick status                — print current bridge state
 *
 * Workflow: connect Remote Control, run a subcommand, `tail -f debug.log`
 * and watch [bridge:repl] / [bridge:debug] lines for the recovery reaction.
 *
 * Composite sequences — the failure modes in the BQ data are chains, not
 * single events. Queue faults then fire the trigger:
 *
 *   # #22148 residual: ws_closed → register transient-blips → teardown?
 *   /bridge-kick register fail 2
 *   /bridge-kick close 1002
 *   → expect: doReconnect tries register, fails, returns false → teardown
 *     (demonstrates the retry gap that needs fixing)
 *
 *   # Dead gate: poll 404/not_found_error → does onEnvironmentLost fire?
 *   /bridge-kick poll 404
 *   → expect: tengu_bridge_repl_fatal_error (gate is dead — 147K/wk)
 *     after fix: tengu_bridge_repl_env_lost → doReconnect
 */

const USAGE = t('bridgeKick.usage')

const call: LocalCommandCall = async args => {
  const h = getBridgeDebugHandle()
  if (!h) {
    return {
      type: 'text',
      value: t('bridgeKick.noDebugHandle'),
    }
  }

  const [sub, a, b] = args.trim().split(/\s+/)

  switch (sub) {
    case 'close': {
      const code = Number(a)
      if (!Number.isFinite(code)) {
        return { type: 'text', value: t('bridgeKick.needNumericCode', USAGE) }
      }
      h.fireClose(code)
      return {
        type: 'text',
        value: t('bridgeKick.firedClose', code),
      }
    }

    case 'poll': {
      if (a === 'transient') {
        h.injectFault({
          method: 'pollForWork',
          kind: 'transient',
          status: 503,
          count: 1,
        })
        h.wakePollLoop()
        return {
          type: 'text',
          value: t('bridgeKick.transientPoll'),
        }
      }
      const status = Number(a)
      if (!Number.isFinite(status)) {
        return {
          type: 'text',
          value: t('bridgeKick.needStatusCode', USAGE),
        }
      }
      // Default to what the server ACTUALLY sends for 404 (BQ-verified),
      // so `/bridge-kick poll 404` reproduces the real 147K/week state.
      const errorType =
        b ?? (status === 404 ? 'not_found_error' : 'authentication_error')
      h.injectFault({
        method: 'pollForWork',
        kind: 'fatal',
        status,
        errorType,
        count: 1,
      })
      h.wakePollLoop()
      return {
        type: 'text',
        value: t('bridgeKick.fatalPoll', status, errorType),
      }
    }

    case 'register': {
      if (a === 'fatal') {
        h.injectFault({
          method: 'registerBridgeEnvironment',
          kind: 'fatal',
          status: 403,
          errorType: 'permission_error',
          count: 1,
        })
        return {
          type: 'text',
          value: t('bridgeKick.registerFatal'),
        }
      }
      const n = Number(b) || 1
      h.injectFault({
        method: 'registerBridgeEnvironment',
        kind: 'transient',
        status: 503,
        count: n,
      })
      return {
        type: 'text',
        value: t('bridgeKick.registerTransient', n),
      }
    }

    case 'reconnect-session': {
      h.injectFault({
        method: 'reconnectSession',
        kind: 'fatal',
        status: 404,
        errorType: 'not_found_error',
        count: 2,
      })
      return {
        type: 'text',
        value: t('bridgeKick.reconnectSession'),
      }
    }

    case 'heartbeat': {
      const status = Number(a) || 401
      h.injectFault({
        method: 'heartbeatWork',
        kind: 'fatal',
        status,
        errorType: status === 401 ? 'authentication_error' : 'not_found_error',
        count: 1,
      })
      return {
        type: 'text',
        value: t('bridgeKick.heartbeatFatal', status),
      }
    }

    case 'reconnect': {
      h.forceReconnect()
      return {
        type: 'text',
        value: t('bridgeKick.calledReconnect'),
      }
    }

    case 'status': {
      return { type: 'text', value: h.describe() }
    }

    default:
      return { type: 'text', value: USAGE }
  }
}

const bridgeKick = {
  type: 'local',
  name: 'bridge-kick',
  description: t('bridgeKick.description'),
  isEnabled: () => process.env.USER_TYPE === 'ant',
  supportsNonInteractive: false,
  load: () => Promise.resolve({ call }),
} satisfies Command

export default bridgeKick
