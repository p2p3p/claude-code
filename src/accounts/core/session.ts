import { getInitialSettings } from '../../utils/settings/settings.js'

/**
 * Session-scoped "current account" (memory-first) home.
 *
 * Account switching is session-local state: once this session has settled on a
 * current (startup restore / manual switch / 401 rotation), every read uses the
 * in-memory value and stops following changes that OTHER sessions write to the
 * shared settings.json. The disk current is only a fallback until memory is
 * seeded (one-shot startup restore source).
 *
 * Kept as its own module so accounts → auth → providers → accounts cycles stay
 * out of the dependency graph, and so every consumer reads from one authority.
 */
let sessionCurrent: { layer: string; account: string } | undefined

/** Read the current account: memory wins when present, otherwise fall back to disk and cement. */
export function getCurrentActive(): { layer: string; account: string } | undefined {
  if (sessionCurrent) return sessionCurrent
  const cur = getInitialSettings().env?.current
  if (cur) sessionCurrent = { layer: cur.layer, account: cur.account }
  return sessionCurrent
}

/** This session actively chooses its account (switch / rotation / login); the caller persists. */
export function setCurrentActive(
  provider: string,
  account: string,
): void {
  sessionCurrent = { layer: provider, account: account }
}

/** This session drops its current account (account delete / logout); reads fall back to disk or none. */
export function clearCurrentActive(): void {
  sessionCurrent = undefined
}

/**
 * Per-(provider,account) key index tracker for 401 rotation.
 * Derived from current:{layer,account} — never a separate authority.
 */
const keyIndexMap = new Map<string, number>()

export function getKeyIndex(key: string): number {
  return keyIndexMap.get(key) ?? 0
}

export function setKeyIndex(key: string, idx: number): void {
  keyIndexMap.set(key, idx)
}

export function deleteKeyIndex(key: string): void {
  keyIndexMap.delete(key)
}