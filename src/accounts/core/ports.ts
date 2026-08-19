import type { EnvProviderKey } from './types.js'

/**
 * Host-effects port: the ONLY bridge from the accounts domain back to host
 * side effects. The domain never imports host modules directly — callers
 * register handlers here at startup (one call site per host), and the domain
 * fires them after each transactional action.
 */

export type AccountEffects = {
  /** Fired after env was (re)injected / rotated — host clears provider caches. */
  onEnvChanged?(provider: EnvProviderKey): void
  /** Fired after the active account was cleared (delete / logout). */
  onAccountCleared?(): void
  /** Fired when the session model override should change. */
  onModelOverride?(model: string | undefined): void
}

let effects: AccountEffects = {}

/** Host startup hook. Merge-friendly — call once per host, may be called again. */
export function registerAccountEffects(handlers: AccountEffects): void {
  effects = { ...effects, ...handlers }
}

export function notifyEnvChanged(provider: EnvProviderKey): void {
  effects.onEnvChanged?.(provider)
}

export function notifyAccountCleared(): void {
  effects.onAccountCleared?.()
}

export function notifyModelOverride(model: string | undefined): void {
  effects.onModelOverride?.(model)
}