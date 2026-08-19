import { getInitialSettings } from '../../utils/settings/settings.js'
import type { EnvProviderKey, EnvPlatform, EnvConfig } from '../../utils/settings/types.js'
import { getCurrentActive } from './session.js'

/**
 * Key registry: the only place that parses the account structure in
 * settings.env. No side effects — everything here is a pure read or a layer
 * mapping. Writing / env injection / actions live in their own modules.
 */

/**
 * Map a runtime APIProvider (from getAPIProvider()) to its env key.
 */
export function toKeyGroupProviderKey(
  provider: string,
): EnvProviderKey | undefined {
  if (
    provider === 'openai' ||
    provider === 'gemini' ||
    provider === 'grok' ||
    provider === 'anthropic' ||
    provider === 'chatgpt-sub' ||
    provider === 'claude-sub'
  ) {
    return provider
  }
  if (provider === 'anthropic') return 'anthropic'
  return undefined
}

/**
 * Intrinsic per-layer credential kind (not stored on current, not persisted —
 * single source of truth). Subscription check = layerCredentialKind(layer) ===
 * 'oauth'. A future layer (e.g. bedrock: 'iam', local: 'local') is one line.
 */
export const LAYER_CREDENTIAL_KIND = {
  openai: 'api-key',
  gemini: 'api-key',
  grok: 'api-key',
  anthropic: 'api-key',
  'chatgpt-sub': 'oauth',
  'claude-sub': 'oauth'} as const
export type CredentialKind = (typeof LAYER_CREDENTIAL_KIND)[EnvProviderKey]

export function isOAuthLayer(layer: string | undefined): boolean {
  if (!layer) return false
  return LAYER_CREDENTIAL_KIND[layer as EnvProviderKey] === 'oauth'
}

/** Whether the currently active layer is a subscription (OAuth credential). */
export function isCurrentSubscription(): boolean {
  return isOAuthLayer(getCurrentActive()?.layer)
}

/** Full settings.env account structure. Internal use only. */
export function getGroups(): EnvConfig | undefined {
  return getInitialSettings().env
}

/** Platforms for a provider, or null when none configured. */
export function getPlatformsForProvider(
  provider: EnvProviderKey,
): EnvPlatform[] | null {
  const groups = getGroups()
  const platforms = groups?.[provider]
  if (!platforms || platforms.length === 0) return null
  return platforms
}

/** Current active account for a provider, from current:{layer,account}. */
export function readActivePlatformFor(
  provider: EnvProviderKey,
): string | undefined {
  const cur = getCurrentActive()
  return cur?.layer === provider ? cur.account : undefined
}

/** Total keys across all platforms of a provider. */
export function getTotalKeys(provider: EnvProviderKey): number {
  const platforms = getPlatformsForProvider(provider)
  if (!platforms) return 0
  return platforms.reduce((sum, p) => sum + p.keys.length, 0)
}

/** Whether this provider has a key group with more than one key in total. */
export function hasApiKeyGroup(provider: EnvProviderKey): boolean {
  return getTotalKeys(provider) > 1
}