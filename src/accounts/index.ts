/**
 * Accounts domain (login system) facade.
 *
 * The heart of the user system: key registry, active state, switch / rotate /
 * delete actions, env injection and login-UI data all live in this directory.
 *
 * External code (commands / model layer / engine / other components) may only
 * import from here — it must not reach into settings.env or the account shape
 * of process.env directly.
 */

// Actions: switch / rotate / delete as atomic transactions
export {
  activatePlatform,
  advanceToNextKey,
  clearActivePlatform,
  clearProviderClientCache,
  parseApiKeys,
  rotateOn401,
  setActivePlatformByBaseUrl} from './core/actions.js'

// Key registry: the only place that parses settings.env + layer mappings
export {
  getPlatformsForProvider,
  getTotalKeys,
  hasApiKeyGroup,
  isCurrentSubscription,
  isOAuthLayer,
  LAYER_CREDENTIAL_KIND,
  readActivePlatformFor,
  toKeyGroupProviderKey} from './core/registry.js'

// Env injection: writes / clears the active platform in process.env
export {
  applyKeyGroupEnv,
  clearPlatformEnv,
  ensureApiKeyGroupEnv,
  markKeyGroupEnvManaged} from './core/env.js'

// Persistence: writes `current` so it survives restarts
export {
  persistActivePlatform,
  restore,
  setProviderLayer,
  validateCurrent} from './core/persist.js'

// Session-scoped active state (memory-first, cross-session isolated)
export {
  clearCurrentActive,
  getCurrentActive,
  setCurrentActive} from './core/session.js'

// Host-effects bridge: hosts register callbacks here at startup
export {
  registerAccountEffects,
  type AccountEffects} from './core/ports.js'

// Capabilities: masking + status snapshot
export { maskKey } from './core/mask.js'
export {
  getActivePlatformKeyCount,
  getSessionSnapshot,
  type SessionSnapshot} from './core/snapshot.js'

// Login-UI data source: China LLM presets
export {
  CHINA_LLM_PROVIDERS,
  findChinaProviderById,
  resolveChinaProviderBaseURL} from './ui/chinaLlmProviders.js'
export type {
  CodingPlanTier,
  ProviderModel,
  ProviderPreset} from './ui/chinaLlmProviders.js'

export type {
  CredentialKind} from './core/registry.js'
export type {
  EnvConfig,
  EnvPlatform,
  EnvProviderKey,
  EnvSubEntry} from './core/types.js'