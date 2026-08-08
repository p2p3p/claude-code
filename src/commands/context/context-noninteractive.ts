import { feature } from 'bun:bundle'
import { microcompactMessages } from '../../services/compact/microCompact.js'
import { t } from '../../utils/i18n/index.js'
import type { AppState } from '../../state/AppStateStore.js'
import type { Tools, ToolUseContext } from '../../Tool.js'
import type { AgentDefinitionsResult } from '@claude-code-best/builtin-tools/tools/AgentTool/loadAgentsDir.js'
import type { Message } from '../../types/message.js'
import {
  analyzeContextUsage,
  type ContextData,
} from '../../utils/analyzeContext.js'
import { formatTokens } from '../../utils/format.js'
import { getMessagesAfterCompactBoundary } from '../../utils/messages.js'
import { getSourceDisplayName } from '../../utils/settings/constants.js'
import { plural } from '../../utils/stringUtils.js'

/**
 * Shared data-collection path for `/context` (slash command) and the SDK
 * `get_context_usage` control request. Mirrors query.ts's pre-API transforms
 * (compact boundary, projectView, microcompact) so the token count reflects
 * what the model actually sees.
 */
type CollectContextDataInput = {
  messages: Message[]
  getAppState: () => AppState
  options: {
    mainLoopModel: string
    tools: Tools
    agentDefinitions: AgentDefinitionsResult
    customSystemPrompt?: string
    appendSystemPrompt?: string
  }
}

export async function collectContextData(
  context: CollectContextDataInput,
): Promise<ContextData> {
  const {
    messages,
    getAppState,
    options: {
      mainLoopModel,
      tools,
      agentDefinitions,
      customSystemPrompt,
      appendSystemPrompt,
    },
  } = context

  let apiView = getMessagesAfterCompactBoundary(messages)
  if (feature('CONTEXT_COLLAPSE')) {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { projectView } =
      require('../../services/contextCollapse/operations.js') as typeof import('../../services/contextCollapse/operations.js')
    /* eslint-enable @typescript-eslint/no-require-imports */
    apiView = projectView(apiView)
  }

  const { messages: compactedMessages } = await microcompactMessages(apiView)
  const appState = getAppState()

  return analyzeContextUsage(
    compactedMessages,
    mainLoopModel,
    async () => appState.toolPermissionContext,
    tools,
    agentDefinitions,
    undefined, // terminalWidth
    // analyzeContextUsage only reads options.{customSystemPrompt,appendSystemPrompt}
    // but its signature declares the full Pick<ToolUseContext, 'options'>.
    { options: { customSystemPrompt, appendSystemPrompt } } as Pick<
      ToolUseContext,
      'options'
    >,
    undefined, // mainThreadAgentDefinition
    apiView, // original messages for API usage extraction
  )
}

export async function call(
  _args: string,
  context: ToolUseContext,
): Promise<{ type: 'text'; value: string }> {
  const data = await collectContextData(context)
  return {
    type: 'text' as const,
    value: formatContextAsMarkdownTable(data),
  }
}

function formatContextAsMarkdownTable(data: ContextData): string {
  const {
    categories,
    totalTokens,
    rawMaxTokens,
    percentage,
    model,
    memoryFiles,
    mcpTools,
    agents,
    skills,
    messageBreakdown,
    systemTools,
    systemPromptSections,
  } = data

  let output = `${t('contextCmd.title')}\n\n`
  output += `${t('contextCmd.modelLabel')} ${model}  \n`
  output += `${t('contextCmd.tokensLabel')} ${formatTokens(totalTokens)} / ${formatTokens(rawMaxTokens)} (${percentage}%)\n`

  // Context-collapse status. Always show when the runtime gate is on —
  // the user needs to know which strategy is managing their context
  // even before anything has fired.
  if (feature('CONTEXT_COLLAPSE')) {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { getStats, isContextCollapseEnabled } =
      require('../../services/contextCollapse/index.js') as typeof import('../../services/contextCollapse/index.js')
    /* eslint-enable @typescript-eslint/no-require-imports */
    if (isContextCollapseEnabled()) {
      const s = getStats()
      const { health: h } = s

      const parts = []
      if (s.collapsedSpans > 0) {
        parts.push(t('contextCmd.spansSummarized', s.collapsedSpans, s.collapsedMessages))
      }
      if (s.stagedSpans > 0) parts.push(t('contextCmd.spanStaged', s.stagedSpans))
      const summary =
        parts.length > 0
          ? parts.join(', ')
          : h.totalSpawns > 0
            ? t('contextCmd.spawnsNothingStaged', h.totalSpawns)
            : t('contextCmd.waitingForFirstTrigger')
      output += `${t('contextCmd.contextStrategy')} collapse (${summary})\n`

      if (h.totalErrors > 0) {
        output += `${t('contextCmd.collapseErrors')} ${h.totalErrors}/${h.totalSpawns} ${t('contextCmd.spawnsFailed')}`
        if (h.lastError) {
          output += ` (${t('contextCmd.last')}: ${h.lastError.slice(0, 80)})`
        }
        output += '\n'
      } else if (h.emptySpawnWarningEmitted) {
        output += `${t('contextCmd.collapseIdle')} ${h.totalEmptySpawns} ${t('contextCmd.consecutiveEmptyRuns')}\n`
      }
    }
  }
  output += '\n'

  // Main categories table
  const visibleCategories = categories.filter(
    cat =>
      cat.tokens > 0 &&
      cat.name !== 'Free space' &&
      cat.name !== 'Autocompact buffer',
  )

  if (visibleCategories.length > 0) {
    output += `${t('contextCmd.estimatedUsageSection')}\n\n`
    output += t('contextCmd.categoryTableHeader')
    output += `|----------|--------|------------|\n`

    for (const cat of visibleCategories) {
      const percentDisplay = ((cat.tokens / rawMaxTokens) * 100).toFixed(1)
      output += `| ${cat.name} | ${formatTokens(cat.tokens)} | ${percentDisplay}% |\n`
    }

    const freeSpaceCategory = categories.find(c => c.name === 'Free space')
    if (freeSpaceCategory && freeSpaceCategory.tokens > 0) {
      const percentDisplay = (
        (freeSpaceCategory.tokens / rawMaxTokens) *
        100
      ).toFixed(1)
      output += `| ${t('contextCmd.freeSpace')} | ${formatTokens(freeSpaceCategory.tokens)} | ${percentDisplay}% |\n`
    }

    const autocompactCategory = categories.find(
      c => c.name === 'Autocompact buffer',
    )
    if (autocompactCategory && autocompactCategory.tokens > 0) {
      const percentDisplay = (
        (autocompactCategory.tokens / rawMaxTokens) *
        100
      ).toFixed(1)
      output += `| ${t('contextCmd.autocompactBuffer')} | ${formatTokens(autocompactCategory.tokens)} | ${percentDisplay}% |\n`
    }

    output += `\n`
  }

  // MCP tools
  if (mcpTools.length > 0) {
    output += `${t('contextCmd.mcpToolsSection')}\n\n`
    output += t('contextCmd.mcpToolsHeader')
    output += `|------|--------|--------|\n`
    for (const tool of mcpTools) {
      output += `| ${tool.name} | ${tool.serverName} | ${formatTokens(tool.tokens)} |\n`
    }
    output += `\n`
  }

  // System tools (ant-only)
  if (
    systemTools &&
    systemTools.length > 0 &&
    process.env.USER_TYPE === 'ant'
  ) {
    output += `${t('contextCmd.systemToolsSection')}\n\n`
    output += t('contextCmd.systemToolsHeader')
    output += `|------|--------|\n`
    for (const tool of systemTools) {
      output += `| ${tool.name} | ${formatTokens(tool.tokens)} |\n`
    }
    output += `\n`
  }

  // System prompt sections (ant-only)
  if (
    systemPromptSections &&
    systemPromptSections.length > 0 &&
    process.env.USER_TYPE === 'ant'
  ) {
    output += `${t('contextCmd.systemPromptSectionsSection')}\n\n`
    output += t('contextCmd.systemPromptSectionsHeader')
    output += `|---------|--------|\n`
    for (const section of systemPromptSections) {
      output += `| ${section.name} | ${formatTokens(section.tokens)} |\n`
    }
    output += `\n`
  }

  // Custom agents
  if (agents.length > 0) {
    output += `${t('contextCmd.customAgentsSection')}\n\n`
    output += t('contextCmd.customAgentsHeader')
    output += `|------------|--------|--------|\n`
    for (const agent of agents) {
      let sourceDisplay: string
      switch (agent.source) {
        case 'projectSettings':
          sourceDisplay = t('contextCmd.sourceProject')
          break
        case 'userSettings':
          sourceDisplay = t('contextCmd.sourceUser')
          break
        case 'localSettings':
          sourceDisplay = t('contextCmd.sourceLocal')
          break
        case 'flagSettings':
          sourceDisplay = t('contextCmd.sourceFlag')
          break
        case 'policySettings':
          sourceDisplay = t('contextCmd.sourcePolicy')
          break
        case 'plugin':
          sourceDisplay = t('contextCmd.sourcePlugin')
          break
        case 'built-in':
          sourceDisplay = t('contextCmd.sourceBuiltin')
          break
        default:
          sourceDisplay = String(agent.source)
      }
      output += `| ${agent.agentType} | ${sourceDisplay} | ${formatTokens(agent.tokens)} |\n`
    }
    output += `\n`
  }

  // Memory files
  if (memoryFiles.length > 0) {
    output += `${t('contextCmd.memoryFilesSection')}\n\n`
    output += t('contextCmd.memoryFilesHeader')
    output += `|------|------|--------|\n`
    for (const file of memoryFiles) {
      output += `| ${file.type} | ${file.path} | ${formatTokens(file.tokens)} |\n`
    }
    output += `\n`
  }

  // Skills
  if (skills && skills.tokens > 0 && skills.skillFrontmatter.length > 0) {
    output += `${t('contextCmd.skillsSection')}\n\n`
    output += t('contextCmd.skillsHeader')
    output += `|-------|--------|--------|\n`
    for (const skill of skills.skillFrontmatter) {
      output += `| ${skill.name} | ${getSourceDisplayName(skill.source)} | ${formatTokens(skill.tokens)} |\n`
    }
    output += `\n`
  }

  // Message breakdown (ant-only)
  if (messageBreakdown && process.env.USER_TYPE === 'ant') {
    output += `${t('contextCmd.messageBreakdownSection')}\n\n`
    output += t('contextCmd.messageBreakdownHeader')
    output += `|----------|--------|\n`
    output += t('contextCmd.breakdownToolCalls', formatTokens(messageBreakdown.toolCallTokens)) + '\n'
    output += t('contextCmd.breakdownToolResults', formatTokens(messageBreakdown.toolResultTokens)) + '\n'
    output += t('contextCmd.breakdownAttachments', formatTokens(messageBreakdown.attachmentTokens)) + '\n'
    output += t('contextCmd.breakdownAssistantMessages', formatTokens(messageBreakdown.assistantMessageTokens)) + '\n'
    output += t('contextCmd.breakdownUserMessages', formatTokens(messageBreakdown.userMessageTokens)) + '\n'
    output += `\n`

    if (messageBreakdown.toolCallsByType.length > 0) {
      output += `${t('contextCmd.topToolsSection')}\n\n`
      output += t('contextCmd.topToolsHeader')
      output += `|------|-------------|---------------|\n`
      for (const tool of messageBreakdown.toolCallsByType) {
        output += `| ${tool.name} | ${formatTokens(tool.callTokens)} | ${formatTokens(tool.resultTokens)} |\n`
      }
      output += `\n`
    }

    if (messageBreakdown.attachmentsByType.length > 0) {
      output += `${t('contextCmd.topAttachmentsSection')}\n\n`
      output += t('contextCmd.topAttachmentsHeader')
      output += `|------------|--------|\n`
      for (const attachment of messageBreakdown.attachmentsByType) {
        output += `| ${attachment.name} | ${formatTokens(attachment.tokens)} |\n`
      }
      output += `\n`
    }
  }

  return output
}
