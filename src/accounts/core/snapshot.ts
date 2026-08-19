import { getCurrentActive, getKeyIndex } from './session.js'
import { getPlatformsForProvider, getTotalKeys, isOAuthLayer } from './registry.js'
import type { EnvProviderKey } from './types.js'

/**
 * Official state snapshot for statusline / diagnostics / UI. Read-only —
 * one query for "who am I, on which key, with how many keys".
 */
export interface SessionSnapshot {
  layer: string | undefined
  account: string | undefined
  isSubscription: boolean
  model: string | undefined
  keyIndex: number
  keyCount: number
}

export function getSessionSnapshot(): SessionSnapshot {
  const cur = getCurrentActive()
  const layer = cur?.layer as EnvProviderKey | undefined
  const keyCount = layer ? getTotalKeys(layer) : 0
  return {
    layer: cur?.layer,
    account: cur?.account,
    isSubscription: isOAuthLayer(cur?.layer),
    model: process.env.MODEL,
    keyIndex: cur ? getKeyIndex(`${cur.layer}:${cur.account}`) : 0,
    keyCount}
}

/** Convenience for status lines: platform key count of the current provider. */
export function getActivePlatformKeyCount(layer: EnvProviderKey | undefined): number {
  if (!layer) return 0
  const platforms = getPlatformsForProvider(layer)
  if (!platforms) return 0
  const cur = getCurrentActive()
  const active = cur ? platforms.find(p => p.baseUrl === cur.account) : platforms[0]
  return active?.keys.length ?? 0
}