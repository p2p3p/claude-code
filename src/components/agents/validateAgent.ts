import type { Tools } from '../../Tool.js'
import { resolveAgentTools } from '@claude-code-best/builtin-tools/tools/AgentTool/agentToolUtils.js'
import type {
  AgentDefinition,
  CustomAgentDefinition} from '@claude-code-best/builtin-tools/tools/AgentTool/loadAgentsDir.js'
import { getAgentSourceDisplayName } from './utils.js'
import { t } from '../../utils/i18n/index.js'

export type AgentValidationResult = {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateAgentType(agentType: string): string | null {
  if (!agentType) {
    return t('validateAgent.typeRequired')
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(agentType)) {
    return t('validateAgent.typeInvalidChars')
  }

  if (agentType.length < 3) {
    return t('validateAgent.typeTooShort')
  }

  if (agentType.length > 50) {
    return t('validateAgent.typeTooLong')
  }

  return null
}

export function validateAgent(
  agent: Omit<CustomAgentDefinition, 'location'>,
  availableTools: Tools,
  existingAgents: AgentDefinition[],
): AgentValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate agent type
  if (!agent.agentType) {
    errors.push(t('validateAgent.typeRequired'))
  } else {
    const typeError = validateAgentType(agent.agentType)
    if (typeError) {
      errors.push(typeError)
    }

    // Check for duplicates (excluding self for editing)
    const duplicate = existingAgents.find(
      a => a.agentType === agent.agentType && a.source !== agent.source,
    )
    if (duplicate) {
      errors.push(
        t('validateAgent.typeExists', agent.agentType, getAgentSourceDisplayName(duplicate.source)),
      )
    }
  }

  // Validate description
  if (!agent.whenToUse) {
    errors.push(t('validateAgent.descriptionRequired'))
  } else if (agent.whenToUse.length < 10) {
    warnings.push(
      t('validateAgent.descriptionTooShort'),
    )
  } else if (agent.whenToUse.length > 5000) {
    warnings.push(t('validateAgent.descriptionTooLong'))
  }

  // Validate tools
  if (agent.tools !== undefined && !Array.isArray(agent.tools)) {
    errors.push(t('validateAgent.toolsMustBeArray'))
  } else {
    if (agent.tools === undefined) {
      warnings.push(t('validateAgent.allTools'))
    } else if (agent.tools.length === 0) {
      warnings.push(
        t('validateAgent.noTools'),
      )
    }

    // Check for invalid tools
    const resolvedTools = resolveAgentTools(agent, availableTools, false)

    if (resolvedTools.invalidTools.length > 0) {
      errors.push(t('validateAgent.invalidTools', resolvedTools.invalidTools.join(', ')))
    }
  }

  // Validate system prompt
  const systemPrompt = agent.getSystemPrompt()
  if (!systemPrompt) {
    errors.push(t('validateAgent.systemPromptRequired'))
  } else if (systemPrompt.length < 20) {
    errors.push(t('validateAgent.systemPromptTooShort'))
  } else if (systemPrompt.length > 10000) {
    warnings.push(t('validateAgent.systemPromptTooLong'))
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings}
}
