import { updateSettingsForSource } from '../../utils/settings/settings.js'
import type { EnvProviderKey, EnvConfig } from '../../utils/settings/types.js'
import { clearCurrentActive, getCurrentActive, setCurrentActive } from './session.js'
import { getGroups } from './registry.js'

/**
 * Persistence: writes the active account into userSettings so it survives
 * restarts (the ONLY caller that writes `current` on disk). Every write also
 * syncs the session-scoped memory so this session keeps its own view.
 */

/**
 * Persist the active account (layer + account identifier) to userSettings so
 * it survives restarts. Called by activatePlatform() on login.
 */
export function persistActivePlatform(
  provider: EnvProviderKey,
  baseUrl: string,
): void {
  setCurrentActive(provider, baseUrl)
  const groups = getGroups()
  const next: EnvConfig = {
    ...(groups ?? {}),
    current: { layer: provider, account: baseUrl }}

  // Only write the structured env (current + platform data). The old flat env
  // block (BASE_URL/API_KEY/MODEL) is no longer persisted.
  updateSettingsForSource('userSettings', {
    env: next} as unknown as Parameters<typeof updateSettingsForSource>[1])
}

/**
 * Used by the /provider command: switches only the active compatibility layer
 * (account left empty) without touching the key group data. Lives in the
 * accounts domain so commands don't re-implement env-shape assembly.
 */
export function setProviderLayer(provider: EnvProviderKey | undefined): void {
  const next: EnvConfig = {
    ...(getGroups() ?? {}),
    current: provider
      ? { layer: provider, account: '' }
      : undefined}
  if (provider) {
    setCurrentActive(provider, '')
  } else {
    clearCurrentActive()
  }
  updateSettingsForSource('userSettings', {
    env: next} as unknown as Parameters<typeof updateSettingsForSource>[1])
}

/**
 * Repair an orphaned current: if the active account points at a platform that
 * no longer exists, fall back to the layer's first platform (or clear the
 * current entirely when the layer is gone). Returns false when no account is
 * active. A layer-only current (empty account, e.g. /provider) is left alone.
 */
export function validateCurrent(): boolean {
  const cur = getCurrentActive()
  if (!cur) return false
  if (!cur.account) return true

  const platforms = getGroups()?.[cur.layer as EnvProviderKey]
  if (Array.isArray(platforms) && platforms.some(p => p.baseUrl === cur.account)) {
    return true
  }
  if (Array.isArray(platforms) && platforms.length > 0) {
    persistActivePlatform(cur.layer as EnvProviderKey, platforms[0]!.baseUrl)
    return true
  }
  clearCurrentActive()
  // Clear the orphan on disk too so a restart doesn't re-seed it.
  const groups = getGroups()
  if (groups) {
    const next = { ...groups }
    delete (next as Record<string, unknown>).current
    updateSettingsForSource('userSettings', {
      env: next} as unknown as Parameters<typeof updateSettingsForSource>[1])
  }
  return false
}

/**
 * Startup restore sequence: cements the current (session.getCurrentActive
 * seeds from disk on first read) and repairs any orphan. Env injection itself
 * is handled by the host via ensureApiKeyGroupEnv after this returns.
 */
export function restore(): void {
  validateCurrent()
}