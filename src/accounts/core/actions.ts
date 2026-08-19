import type { EnvProviderKey, EnvPlatform } from '../../utils/settings/types.js'
import { logForDebugging } from '../../utils/debug.js'
import {
  clearCurrentActive,
  deleteKeyIndex,
  getCurrentActive,
  getKeyIndex,
  setKeyIndex} from './session.js'
import { getPlatformsForProvider } from './registry.js'
import { applyKeyGroupEnv, clearPlatformEnv, markKeyGroupEnvManaged } from './env.js'
import { persistActivePlatform } from './persist.js'
import { notifyAccountCleared, notifyEnvChanged, notifyModelOverride } from './ports.js'

/**
 * Account actions: switch / rotate / delete as atomic transactions. Each action
 * updates session, injects env and persists — the domain's single entry point
 * for changing which account is active.
 */

/**
 * Split a comma / space / semicolon / newline separated list of API keys.
 */
export function parseApiKeys(input: string): string[] {
  const seen = new Set<string>()
  const keys: string[] = []
  for (const part of input.split(/[\s,;]+/)) {
    const trimmed = part.trim()
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed)
      keys.push(trimmed)
    }
  }
  return keys
}

/**
 * Advance to the next key within the currently active platform (from current).
 * Cycles forever; the caller controls total retry count.
 */
export function advanceToNextKey(
  provider: EnvProviderKey,
): { platform: EnvPlatform; key: string } | null {
  const cur = getCurrentActive()
  if (cur?.layer !== provider) return null
  const platforms = getPlatformsForProvider(provider)
  if (!platforms) return null
  const platform = platforms.find(p => p.baseUrl === cur.account)
  if (!platform || platform.keys.length === 0) return null

  const key = `${provider}:${cur.account}`
  const nextIdx = (getKeyIndex(key) + 1) % platform.keys.length
  setKeyIndex(key, nextIdx)
  return { platform, key: platform.keys[nextIdx]! }
}

/**
 * Reset the key rotation state for the active platform. The caller
 * (doDeleteAccount) is responsible for clearing the persisted `current` entry.
 */
export function clearActivePlatform(provider: EnvProviderKey): void {
  const cur = getCurrentActive()
  if (cur) {
    deleteKeyIndex(`${provider}:${cur.account}`)
    clearCurrentActive()
  }
  clearPlatformEnv()
  notifyAccountCleared()
}

/**
 * Compatibility shim: clearing provider caches is now the host's job via the
 * effects port (onEnvChanged). Kept as a named export so existing callers keep
 * working — it simply forwards to the host notification.
 */
export function clearProviderClientCache(provider: EnvProviderKey): void {
  notifyEnvChanged(provider)
}

/**
 * Verify a platform exists for the given provider + baseUrl.
 * Returns true if found. No longer sets cursors — current:{layer,account} is
 * the sole authority.
 */
export function setActivePlatformByBaseUrl(
  provider: EnvProviderKey,
  baseUrl: string,
): boolean {
  const platforms = getPlatformsForProvider(provider)
  if (!platforms) return false
  return platforms.some(p => p.baseUrl === baseUrl)
}

/**
 * Rotate to the next key on a 401 within the current platform.
 * Cycles forever — the caller (withRetry) controls total retry count.
 */
export function rotateOn401(
  provider: EnvProviderKey,
): 'rotated' | 'no-group' {
  const platforms = getPlatformsForProvider(provider)
  if (!platforms || platforms.length === 0) return 'no-group'
  if (platforms.reduce((max, p) => max + p.keys.length, 0) <= 1) return 'no-group'

  const advanced = advanceToNextKey(provider)
  if (!advanced) return 'no-group'

  applyKeyGroupEnv(advanced.platform, advanced.key, provider)
  markKeyGroupEnvManaged(provider)
  notifyEnvChanged(provider)
  logForDebugging(
    `[keyRotation] rotated ${provider} to key on ${advanced.platform.baseUrl}`,
  )

  persistActivePlatform(provider, advanced.platform.baseUrl)
  return 'rotated'
}

/**
 * Activate a specific platform (by base URL) for a provider.
 */
export function activatePlatform(
  provider: EnvProviderKey,
  baseUrl: string,
): boolean {
  if (!setActivePlatformByBaseUrl(provider, baseUrl)) return false
  const platforms = getPlatformsForProvider(provider)
  const platform = platforms?.find(p => p.baseUrl === baseUrl)
  if (!platform) return false
  const key = platform.keys[0]
  if (!key) return false
  applyKeyGroupEnv(platform, key, provider)
  markKeyGroupEnvManaged(provider)
  notifyEnvChanged(provider)
  notifyModelOverride(undefined)
  logForDebugging(`[keyRotation] activated platform ${baseUrl} for ${provider}, model=${platform.model}`)
  persistActivePlatform(provider, baseUrl)
  return true
}