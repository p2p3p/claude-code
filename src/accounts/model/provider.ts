import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import type { SettingsJson } from '../../utils/settings/types.js'
import { isEnvTruthy } from '../../utils/envUtils.js'
import { getCurrentActive } from '../index.js'

/**
 * Provider classification: which compatibility layer the current account maps
 * to. All providers are equal — there is no "first-party" concept.
 */

export type APIProvider =
  | 'bedrock'     // AWS
  | 'vertex'      // GCP
  | 'foundry'     // Azure
  | 'openai'      // OpenAI
  | 'gemini'      // Gemini
  | 'grok'        // Grok
  | 'anthropic'   // Anthropic

export function getAPIProvider(
  settings: Pick<SettingsJson, 'env'> | undefined = undefined,
): APIProvider {
  // System env flags first — explicit overrides win, enterprise top priority.
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)) return 'bedrock'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)) return 'vertex'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY)) return 'foundry'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_OPENAI)) return 'openai'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_GEMINI)) return 'gemini'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_GROK)) return 'grok'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_ANTHROPIC)) return 'anthropic'

  // Registered accounts (login-managed) next. Callers that explicitly pass a
  // settings object (tests / auth checks) win; otherwise the session-scoped
  // current (memory-first) decides so other sessions' changes can't flip this.
  const cur = settings?.env?.current ?? getCurrentActive()
  if (cur?.layer === 'openai') return 'openai'
  if (cur?.layer === 'gemini') return 'gemini'
  if (cur?.layer === 'grok') return 'grok'
  if (cur?.layer === 'anthropic') return 'anthropic'
  if (cur?.layer === 'chatgpt-sub') return 'openai'
  if (cur?.layer === 'claude-sub') return 'anthropic'

  return 'anthropic'
}

export function getAPIProviderForStatsig(): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return getAPIProvider() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
}