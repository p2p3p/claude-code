import type { EnvProviderKey, EnvPlatform } from '../../utils/settings/types.js'
import { logForDebugging } from '../../utils/debug.js'
import { getCurrentActive, getKeyIndex } from './session.js'
import { getPlatformsForProvider, isOAuthLayer } from './registry.js'

/**
 * Environment injection: writes / clears the active platform's BASE_URL /
 * API_KEY / MODEL in process.env. Reads session + registry, never mutates them.
 */

const ENV = { baseUrl: 'BASE_URL', key: 'API_KEY', model: 'MODEL' } as const

/** Write the platform's base URL / key / model into process.env. */
export function applyKeyGroupEnv(
  platform: EnvPlatform,
  key: string,
  provider?: EnvProviderKey,
): void {
  delete process.env[ENV.baseUrl]
  delete process.env[ENV.key]
  delete process.env[ENV.model]

  process.env[ENV.baseUrl] = platform.baseUrl
  process.env[ENV.key] = key
  if (platform.model) process.env[ENV.model] = platform.model
  logForDebugging(
    `[applyKeyGroupEnv] wrote BASE_URL=${platform.baseUrl} MODEL=${platform.model} provider=${provider}`,
  )
}

/**
 * Wipe the platform env vars from process.env. Called when deleting the active
 * platform or logging out.
 */
export function clearPlatformEnv(): void {
  delete process.env[ENV.baseUrl]
  delete process.env[ENV.key]
  delete process.env[ENV.model]
}

/**
 * Providers whose env vars are already owned by the key-group system in this
 * session. Once a provider's env is set from a key group, later rotations /
 * activations write env unconditionally; this set only guards the FIRST
 * injection so it doesn't clobber an env var the user explicitly configured
 * (shell / settings.env) before the group took over.
 */
const groupManaged = new Set<EnvProviderKey>()

/**
 * Mark the provider as group-managed so `ensureApiKeyGroupEnv` skips it.
 * Called by activatePlatform / rotateOn401 after the first env injection.
 */
export function markKeyGroupEnvManaged(provider: EnvProviderKey): void {
  groupManaged.add(provider)
}

/**
 * Ensure the active platform's env vars are present in process.env for the
 * given provider. Designed to be called just before each API request so the
 * right key/URL are available without the caller having to track state.
 *
 * No-op when:
 * - already managed (group wrote env earlier this session),
 * - an explicit key env is set (user bypassed the group),
 * - the current layer is a subscription (uses OAuth tokens, not API keys).
 */
export function ensureApiKeyGroupEnv(provider: EnvProviderKey): void {
  if (groupManaged.has(provider)) return

  if (process.env[ENV.key]) return
  // Subscription layers use their own auth, skip key-group injection.
  const cur = getCurrentActive()
  if (isOAuthLayer(cur?.layer)) return

  // Find the active platform from current:{layer,account}
  if (cur?.layer !== provider) return
  const platforms = getPlatformsForProvider(provider)
  if (!platforms) return
  const platform = platforms.find(p => p.baseUrl === cur.account)
  if (!platform) return

  const keyIdx = getKeyIndex(`${provider}:${cur.account}`)
  const key = platform.keys[keyIdx % platform.keys.length]
  if (!key) return

  applyKeyGroupEnv(platform, key, provider)
  markKeyGroupEnvManaged(provider)
  logForDebugging(
    `[keyGroup] synced active entry for ${provider}: ${platform.baseUrl} (${platform.keys.length} keys)`,
  )
}