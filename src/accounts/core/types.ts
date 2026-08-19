import { z } from 'zod/v4'
import { EnvPlatformSchema, EnvSubEntrySchema, EnvSchema } from '../../utils/settings/types.js'

/**
 * Accounts domain core types. Derived from settings/types so they evolve together.
 */

export type EnvProviderKey = 'openai' | 'gemini' | 'grok' | 'anthropic' | 'chatgpt-sub' | 'claude-sub'
export type EnvPlatform = z.infer<ReturnType<typeof EnvPlatformSchema>>
export type EnvSubEntry = z.infer<ReturnType<typeof EnvSubEntrySchema>>
export type EnvConfig = z.infer<ReturnType<typeof EnvSchema>>