// biome-ignore-all assist/source/organizeImports: ANT-ONLY import markers must not be reordered
import { getInitialMainLoopModel } from '../../bootstrap/state.js'
import {
  isClaudeAISubscriber,
  isMaxSubscriber,
  isTeamPremiumSubscriber} from '../auth.js'
import { getModelStrings } from './modelStrings.js'
import { getAntModels } from './antModels.js'
import {
  COST_TIER_3_15,
  COST_HAIKU_45,
  formatModelPricing} from '../modelCost.js'
import { getSettings_DEPRECATED } from '../settings/settings.js'
import { getCurrentActive, getPlatformsForProvider } from '../../accounts/index.js'
import { checkOpus1mAccess, checkSonnet1mAccess } from './check1mAccess.js'
import { getAPIProvider } from './providers.js'
import { isModelAllowed } from './modelAllowlist.js'
import {
  getCanonicalName,
  getClaudeAiUserDefaultModelDescription,
  getDefaultModel,
  getDefaultMainLoopModelSetting,
  getMarketingNameForModel,
  getUserSpecifiedModelSetting,
  isOpus1mMergeEnabled,
  getOpusPricingSuffix,
  renderDefaultModelSetting,
  type ModelSetting} from './model.js'
import { getGlobalConfig } from '../config.js'
import {
  CHATGPT_CODEX_DEFAULT_MODEL,
  CHATGPT_CODEX_MODEL_OPTIONS,
  isChatGPTAuthMode} from './chatgptModels.js'

// @[MODEL LAUNCH]: Update all the available and default model option strings below.

export type ModelOption = {
  value: ModelSetting
  label: string
  description: string
  descriptionForModel?: string
}

export function getDefaultOptionForUser(fastMode = false): ModelOption {
  if (process.env.USER_TYPE === 'ant') {
    const currentModel = renderDefaultModelSetting(
      getDefaultMainLoopModelSetting(),
    )
    return {
      value: null,
      label: 'Default (recommended)',
      description: `Use the default model for Ants (currently ${currentModel})`,
      descriptionForModel: `Default model (currently ${currentModel})`}
  }

  // Subscribers
  if (isClaudeAISubscriber()) {
    return {
      value: null,
      label: 'Default (recommended)',
      description: getClaudeAiUserDefaultModelDescription(fastMode)}
  }

  // PAYG
  const is3P = getAPIProvider() !== 'anthropic'
  return {
    value: null,
    label: 'Default (recommended)',
    description: `Use the default model (currently ${renderDefaultModelSetting(getDefaultMainLoopModelSetting())})${is3P ? '' : ` · ${formatModelPricing(COST_TIER_3_15)}`}`}
}

// @[MODEL LAUNCH]: Update or add model option functions (getSonnetXXOption, getOpusXXOption, etc.)
// with the new model's label and description. These appear in the /model picker.
function getSonnet46Option(): ModelOption {
  const is3P = getAPIProvider() !== 'anthropic'
  return {
    value: is3P ? getModelStrings().sonnet46 : 'sonnet',
    label: 'Sonnet',
    description: `Sonnet 4.6 · Best for everyday tasks${is3P ? '' : ` · ${formatModelPricing(COST_TIER_3_15)}`}`,
    descriptionForModel:
      'Sonnet 4.6 - best for everyday tasks. Generally recommended for most coding tasks'}
}

function getOpus47Option(fastMode = false): ModelOption {
  const is3P = getAPIProvider() !== 'anthropic'
  return {
    value: is3P ? getModelStrings().opus47 : 'opus',
    label: 'Opus 4.7',
    description: `Opus 4.7 · Most capable for complex work${getOpusPricingSuffix(fastMode)}`,
    descriptionForModel: 'Opus 4.7 - most capable for complex work'}
}

export function getSonnet46_1MOption(): ModelOption {
  const is3P = getAPIProvider() !== 'anthropic'
  return {
    value: is3P ? getModelStrings().sonnet46 + '[1m]' : 'sonnet[1m]',
    label: 'Sonnet (1M context)',
    description: `Sonnet 4.6 for long sessions${is3P ? '' : ` · ${formatModelPricing(COST_TIER_3_15)}`}`,
    descriptionForModel:
      'Sonnet 4.6 with 1M context window - for long sessions with large codebases'}
}

export function getOpus47_1MOption(fastMode = false): ModelOption {
  const is3P = getAPIProvider() !== 'anthropic'
  return {
    value: is3P ? getModelStrings().opus47 + '[1m]' : 'opus[1m]',
    label: 'Opus 4.7 (1M context)',
    description: `Opus 4.7 with 1M context${getOpusPricingSuffix(fastMode)}`,
    descriptionForModel:
      'Opus 4.7 with 1M context window - for long sessions with large codebases'}
}

export function getOpus46_1MOption(fastMode = false): ModelOption {
  return {
    value: getModelStrings().opus46 + '[1m]',
    label: 'Opus 4.6 (1M context)',
    description: `Opus 4.6 with 1M context${getOpusPricingSuffix(fastMode)}`,
    descriptionForModel:
      'Opus 4.6 with 1M context window - for long sessions with large codebases'}
}

function getHaiku45Option(): ModelOption {
  const is3P = getAPIProvider() !== 'anthropic'
  return {
    value: 'haiku',
    label: 'Haiku',
    description: `Haiku 4.5 · Fastest for quick answers${is3P ? '' : ` · ${formatModelPricing(COST_HAIKU_45)}`}`,
    descriptionForModel:
      'Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.6.'}
}

function getMaxOpusOption(fastMode = false): ModelOption {
  return {
    value: 'opus',
    label: 'Opus 4.7',
    description: `Opus 4.7 · Most capable for complex work${fastMode ? getOpusPricingSuffix(true) : ''}`}
}

export function getMaxSonnet46_1MOption(): ModelOption {
  const is3P = getAPIProvider() !== 'anthropic'
  const billingInfo = isClaudeAISubscriber() ? ' · Billed as extra usage' : ''
  return {
    value: 'sonnet[1m]',
    label: 'Sonnet (1M context)',
    description: `Sonnet 4.6 with 1M context${billingInfo}${is3P ? '' : ` · ${formatModelPricing(COST_TIER_3_15)}`}`}
}

export function getMaxOpus47_1MOption(fastMode = false): ModelOption {
  const billingInfo = isClaudeAISubscriber() ? ' · Billed as extra usage' : ''
  return {
    value: 'opus[1m]',
    label: 'Opus 4.7 (1M context)',
    description: `Opus 4.7 with 1M context${billingInfo}${getOpusPricingSuffix(fastMode)}`}
}

function getMergedOpus1MOption(fastMode = false): ModelOption {
  const is3P = getAPIProvider() !== 'anthropic'
  return {
    value: is3P ? getModelStrings().opus47 + '[1m]' : 'opus[1m]',
    label: 'Opus 4.7 (1M context)',
    description: `Opus 4.7 with 1M context · Most capable for complex work${!is3P && fastMode ? getOpusPricingSuffix(fastMode) : ''}`,
    descriptionForModel:
      'Opus 4.7 with 1M context - most capable for complex work'}
}

const MaxSonnet46Option: ModelOption = {
  value: 'sonnet',
  label: 'Sonnet',
  description: 'Sonnet 4.6 · Best for everyday tasks'}

const MaxHaiku45Option: ModelOption = {
  value: 'haiku',
  label: 'Haiku',
  description: 'Haiku 4.5 · Fastest for quick answers'}

function getOpusPlanOption(): ModelOption {
  return {
    value: 'opusplan',
    label: 'Opus Plan Mode',
    description: 'Use Opus 4.7 in plan mode, Sonnet 4.6 otherwise'}
}

function getChatGPTCodexModelOptions(): ModelOption[] {
  return [
    {
      value: null,
      label: 'Default (recommended)',
      description: `Use the default ChatGPT Codex model (currently ${CHATGPT_CODEX_DEFAULT_MODEL})`,
      descriptionForModel: `Default ChatGPT Codex model (currently ${CHATGPT_CODEX_DEFAULT_MODEL})`},
    ...CHATGPT_CODEX_MODEL_OPTIONS.map(model => ({
      value: model.value,
      label: model.label,
      description: model.description,
      descriptionForModel: `${model.description} (${model.value})`})),
  ]
}

// @[MODEL LAUNCH]: Update the model picker lists below to include/reorder options for the new model.
// Each user tier (ant, Max/Team Premium, Pro/Team Standard/Enterprise, PAYG 1P, PAYG 3P) has its own list.
function getModelOptionsBase(fastMode = false): ModelOption[] {
  if (process.env.USER_TYPE === 'ant') {
    // Build options from antModels config
    const antModelOptions: ModelOption[] = getAntModels().map(m => ({
      value: m.alias,
      label: m.label,
      description: m.description ?? `[ANT-ONLY] ${m.label} (${m.model})`}))

    return [
      getDefaultOptionForUser(),
      ...antModelOptions,
      getMergedOpus1MOption(fastMode),
      getSonnet46Option(),
      getSonnet46_1MOption(),
      getHaiku45Option(),
    ]
  }

  if (getAPIProvider() === 'openai' && isChatGPTAuthMode()) {
    return getChatGPTCodexModelOptions()
  }

  if (isClaudeAISubscriber()) {
    if (isMaxSubscriber() || isTeamPremiumSubscriber()) {
      // Max and Team Premium users: Default = Opus 4.7 1M (merged), plus Opus 4.6 1M
      const premiumOptions = [getDefaultOptionForUser(fastMode)]
      premiumOptions.push(getOpus46_1MOption(fastMode))

      premiumOptions.push(MaxSonnet46Option)
      if (checkSonnet1mAccess()) {
        premiumOptions.push(getMaxSonnet46_1MOption())
      }

      premiumOptions.push(MaxHaiku45Option)
      return premiumOptions
    }

    // Pro/Team Standard/Enterprise users: Sonnet is default, show Opus 4.7 1M + Opus 4.6 1M
    const standardOptions = [getDefaultOptionForUser(fastMode)]

    if (isOpus1mMergeEnabled()) {
      standardOptions.push(getMergedOpus1MOption(fastMode))
    } else {
      standardOptions.push(getMaxOpusOption(fastMode))
      if (checkOpus1mAccess()) {
        standardOptions.push(getMaxOpus47_1MOption(fastMode))
      }
    }
    standardOptions.push(getOpus46_1MOption(fastMode))

    if (checkSonnet1mAccess()) {
      standardOptions.push(getMaxSonnet46_1MOption())
    }

    standardOptions.push(MaxHaiku45Option)
    return standardOptions
  }

  // PAYG 1P API: Default (Sonnet) + Opus 4.7 1M + Opus 4.6 1M + Sonnet 1M + Haiku
  if (getAPIProvider() === 'anthropic') {
    const payg1POptions = [getDefaultOptionForUser(fastMode)]
    if (isOpus1mMergeEnabled()) {
      payg1POptions.push(getMergedOpus1MOption(fastMode))
    } else {
      payg1POptions.push(getOpus47Option(fastMode))
      if (checkOpus1mAccess()) {
        payg1POptions.push(getOpus47_1MOption(fastMode))
      }
    }
    payg1POptions.push(getOpus46_1MOption(fastMode))
    if (checkSonnet1mAccess()) {
      payg1POptions.push(getSonnet46_1MOption())
    }
    payg1POptions.push(getHaiku45Option())
    return payg1POptions
  }

  // PAYG 3P: all available models come from the active platform's cachedModels
  const payg3pOptions: ModelOption[] = []

  const cur = getCurrentActive()
  const activeProvider = cur?.layer
  if (!activeProvider) return payg3pOptions
  const platforms = getPlatformsForProvider(activeProvider as any)
  if (platforms) {
    const activeBaseUrl = cur?.layer === activeProvider ? cur.account : undefined
    const activePlatform = activeBaseUrl
      ? platforms.find(p => p.baseUrl === activeBaseUrl)
      : platforms[0]
    for (const model of activePlatform?.cachedModels ?? []) {
      payg3pOptions.push({ value: model, label: model, description: '' })
    }
  }

  return payg3pOptions
}

// @[MODEL LAUNCH]: Add the new model ID to the appropriate family pattern below
// so the "newer version available" hint works correctly.
/**
 * Map a full model name to its family alias and the marketing name of the
 * version the alias currently resolves to. Used to detect when a user has
 * a specific older version pinned and a newer one is available.
 */
function getModelFamilyInfo(
  model: string,
): { alias: string; currentVersionName: string } | null {
  const canonical = getCanonicalName(model)

  // Sonnet family
  if (
    canonical.includes('claude-sonnet-4-6') ||
    canonical.includes('claude-sonnet-4-5') ||
    canonical.includes('claude-sonnet-4-') ||
    canonical.includes('claude-3-7-sonnet') ||
    canonical.includes('claude-3-5-sonnet')
  ) {
    const currentName = getMarketingNameForModel(getDefaultModel())
    if (currentName) {
      return { alias: 'Sonnet', currentVersionName: currentName }
    }
  }

  // Opus family
  if (canonical.includes('claude-opus-4')) {
    const currentName = getMarketingNameForModel(getDefaultModel())
    if (currentName) {
      return { alias: 'Opus', currentVersionName: currentName }
    }
  }

  // Haiku family
  if (
    canonical.includes('claude-haiku') ||
    canonical.includes('claude-3-5-haiku')
  ) {
    const currentName = getMarketingNameForModel(getDefaultModel())
    if (currentName) {
      return { alias: 'Haiku', currentVersionName: currentName }
    }
  }

  return null
}

/**
 * Returns a ModelOption for a known Anthropic model with a human-readable
 * label, and an upgrade hint if a newer version is available via the alias.
 * Returns null if the model is not recognized.
 */
function getKnownModelOption(model: string): ModelOption | null {
  const marketingName = getMarketingNameForModel(model)
  if (!marketingName) return null

  const familyInfo = getModelFamilyInfo(model)
  if (!familyInfo) {
    return {
      value: model,
      label: marketingName,
      description: model}
  }

  // Check if the alias currently resolves to a different (newer) version
  if (marketingName !== familyInfo.currentVersionName) {
    return {
      value: model,
      label: marketingName,
      description: `Newer version available · select ${familyInfo.alias} for ${familyInfo.currentVersionName}`}
  }

  // Same version as the alias — just show the friendly name
  return {
    value: model,
    label: marketingName,
    description: model}
}

export function getModelOptions(fastMode = false): ModelOption[] {
  const options = getModelOptionsBase(fastMode)

  // Add the custom model from the CUSTOM_MODEL_OPTION env var
  const envCustomModel = process.env.CUSTOM_MODEL_OPTION
  if (
    envCustomModel &&
    !options.some(existing => existing.value === envCustomModel)
  ) {
    options.push({
      value: envCustomModel,
      label: process.env.CUSTOM_MODEL_OPTION_NAME ?? envCustomModel,
      description:
        process.env.CUSTOM_MODEL_OPTION_DESCRIPTION ??
        `Custom model (${envCustomModel})`})
  }

  // Append additional model options fetched during bootstrap
  for (const opt of getGlobalConfig().additionalModelOptionsCache ?? []) {
    if (!options.some(existing => existing.value === opt.value)) {
      options.push(opt)
    }
  }

  // Add custom model from either the current model value or the initial one
  // if it is not already in the options.
  let customModel: ModelSetting = null
  const currentMainLoopModel = getUserSpecifiedModelSetting()
  const initialMainLoopModel = getInitialMainLoopModel()
  if (currentMainLoopModel !== undefined && currentMainLoopModel !== null) {
    customModel = currentMainLoopModel
  } else if (initialMainLoopModel !== null) {
    customModel = initialMainLoopModel
  }
  if (customModel === null || options.some(opt => opt.value === customModel)) {
    return filterModelOptionsByAllowlist(options)
  } else if (customModel === 'opusplan') {
    return filterModelOptionsByAllowlist([...options, getOpusPlanOption()])
  } else if (customModel === 'opus' && getAPIProvider() === 'anthropic') {
    return filterModelOptionsByAllowlist([
      ...options,
      getMaxOpusOption(fastMode),
    ])
  } else if (customModel === 'opus[1m]' && getAPIProvider() === 'anthropic') {
    return filterModelOptionsByAllowlist([
      ...options,
      getMergedOpus1MOption(fastMode),
    ])
  } else {
    // Try to show a human-readable label for known Anthropic models, with an
    // upgrade hint if the alias now resolves to a newer version.
    const knownOption = getKnownModelOption(customModel)
    if (knownOption) {
      options.push(knownOption)
    } else {
      options.push({
        value: customModel,
        label: customModel,
        description: 'Custom model'})
    }
    return filterModelOptionsByAllowlist(options)
  }
}

/**
 * Filter model options by the availableModels allowlist.
 * Always preserves the "Default" option (value: null).
 */
function filterModelOptionsByAllowlist(options: ModelOption[]): ModelOption[] {
  const settings = getSettings_DEPRECATED() || {}
  if (!settings.availableModels) {
    return options // No restrictions
  }
  return options.filter(
    opt =>
      opt.value === null || (opt.value !== null && isModelAllowed(opt.value)),
  )
}
