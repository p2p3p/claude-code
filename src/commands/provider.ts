import type { Command } from '../commands.js'
import type { LocalCommandCall } from '../types/command.js'
import { getAPIProvider } from '../utils/model/providers.js'
import {
  getCurrentActive,
  setProviderLayer,
  type EnvProviderKey} from '../accounts/index.js'
import { applyConfigEnvironmentVariables } from '../utils/managedEnv.js'
import { t } from '../utils/i18n/index.js'

function getEnvVarForProvider(provider: string): string {
  switch (provider) {
    case 'bedrock':
      return 'CLAUDE_CODE_USE_BEDROCK'
    case 'vertex':
      return 'CLAUDE_CODE_USE_VERTEX'
    case 'foundry':
      return 'CLAUDE_CODE_USE_FOUNDRY'
    case 'openai':
      return 'CLAUDE_CODE_USE_OPENAI'
    case 'gemini':
      return 'CLAUDE_CODE_USE_GEMINI'
    case 'grok':
      return 'CLAUDE_CODE_USE_GROK'
    case 'anthropic':
      return 'CLAUDE_CODE_USE_ANTHROPIC'
    default:
      throw new Error(t('providerCmd.unknownProvider', provider))
  }
}

// Get merged process.env (settings.env is the account registry, not flat env)
function getMergedEnv(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (e): e is [string, string] => e[1] !== undefined,
    ),
  )
}

const call: LocalCommandCall = async (args, _context) => {
  const arg = args.trim().toLowerCase()

  // No argument: show current provider
  if (!arg) {
    const current = getAPIProvider()
    return { type: 'text', value: t('providerCmd.currentProvider', current) }
  }

  // unset - clear settings, fallback to env vars
  if (arg === 'unset') {
    setProviderLayer(undefined)
    // Also clear all provider-specific env vars to prevent conflicts
    delete process.env.CLAUDE_CODE_USE_BEDROCK
    delete process.env.CLAUDE_CODE_USE_VERTEX
    delete process.env.CLAUDE_CODE_USE_FOUNDRY
    delete process.env.CLAUDE_CODE_USE_OPENAI
    delete process.env.CLAUDE_CODE_USE_GEMINI
    delete process.env.CLAUDE_CODE_USE_GROK
    delete process.env.CLAUDE_CODE_USE_ANTHROPIC
    return {
      type: 'text',
      value: t('providerCmd.cleared')}
  }

  // Validate provider
  const validProviders = [
    'anthropic',
    'openai',
    'gemini',
    'grok',
    'bedrock',
    'vertex',
    'foundry',
  ]
  if (!validProviders.includes(arg)) {
    return {
      type: 'text',
      value: t('providerCmd.invalid', arg, validProviders.join(', '))}
  }

  // Check env vars when switching to openai (including settings.env)
  if (arg === 'openai') {
    const mergedEnv = getMergedEnv()
    const hasChatGPTAuth = getCurrentActive()?.layer === 'chatgpt-sub'
    const hasKey = !!mergedEnv.API_KEY
    const hasUrl = !!mergedEnv.BASE_URL
    if (!hasChatGPTAuth && (!hasKey || !hasUrl)) {
      setProviderLayer('openai')
      const missing = []
      if (!hasKey) missing.push('API_KEY')
      if (!hasUrl) missing.push('BASE_URL')
      return {
        type: 'text',
        value: t('providerCmd.switchedOpenaiMissing', missing.join(', '))}
    }
  }

  // Check env vars when switching to grok (including settings.env)
  if (arg === 'grok') {
    const mergedEnv = getMergedEnv()
    const hasKey = !!mergedEnv.API_KEY
    if (!hasKey) {
      setProviderLayer('grok')
      return {
        type: 'text',
        value: t('providerCmd.switchedGrokMissing')}
    }
  }

  // Check env vars when switching to gemini (including settings.env)
  if (arg === 'gemini') {
    const mergedEnv = getMergedEnv()
    const hasKey = !!mergedEnv.API_KEY
    // BASE_URL is optional for Gemini (has default endpoint)
    if (!hasKey) {
      setProviderLayer('gemini')
      return {
        type: 'text',
        value: t('providerCmd.switchedGeminiMissing')}
    }
  }

  // Handle different provider types
  // - 'anthropic', 'openai', 'gemini' are stored in settings.json (persistent)
  // - 'bedrock', 'vertex', 'foundry' are env-only (do NOT touch settings.json)
  if (
    arg === 'anthropic' ||
    arg === 'openai' ||
    arg === 'gemini' ||
    arg === 'grok'
  ) {
    // Clear any cloud provider env vars to avoid conflicts
    delete process.env.CLAUDE_CODE_USE_BEDROCK
    delete process.env.CLAUDE_CODE_USE_VERTEX
    delete process.env.CLAUDE_CODE_USE_FOUNDRY
    delete process.env.CLAUDE_CODE_USE_OPENAI
    delete process.env.CLAUDE_CODE_USE_GEMINI
    delete process.env.CLAUDE_CODE_USE_GROK
    delete process.env.CLAUDE_CODE_USE_ANTHROPIC
    setProviderLayer(arg as EnvProviderKey)
    applyConfigEnvironmentVariables()
    return { type: 'text', value: t('providerCmd.set', arg) }
  } else {
    // Cloud providers: set env vars only, do NOT touch settings.json
    delete process.env.CLAUDE_CODE_USE_OPENAI
    delete process.env.API_KEY
    delete process.env.BASE_URL
    delete process.env.CLAUDE_CODE_USE_GEMINI
    delete process.env.CLAUDE_CODE_USE_GROK
    process.env[getEnvVarForProvider(arg)] = '1'
    // Do not modify settings.json - cloud providers controlled solely by env vars
    applyConfigEnvironmentVariables()
    return {
      type: 'text',
      value: t('providerCmd.setEnv', arg)}
  }
}

const provider = {
  type: 'local',
  name: 'provider',
  description: t('cmd.descProvider'),
  aliases: ['api'],
  argumentHint: '[anthropic|openai|gemini|grok|bedrock|vertex|foundry|unset]',
  supportsNonInteractive: true,
  load: () => Promise.resolve({ call })} satisfies Command

export default provider
