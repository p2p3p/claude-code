import type {
  BetaToolUnion,
  BetaMessage,
  BetaRawMessageStreamEvent,
  BetaUsage,
} from '@anthropic-ai/sdk/resources/beta/messages/messages.mjs'
import type { SystemPrompt } from '../../../utils/systemPromptType.js'
import type {
  Message,
  StreamEvent,
  SystemAPIErrorMessage,
  AssistantMessage,
  UserMessage,
} from '../../../types/message.js'
import type { AgentId } from '../../../types/ids.js'
import type { Tools } from '../../../Tool.js'
import { getSessionId } from '../../../bootstrap/state.js'
import { getOpenAIClient } from './client.js'
import {
  formatOpenAIPromptCacheKey,
  getOfficialOpenAIPromptCacheKey,
  updateOpenAIUsage,
} from './openaiShared.js'
import {
  anthropicMessagesToOpenAI,
  resolveOpenAIModel,
  adaptOpenAIStreamToAnthropic,
  anthropicToolsToOpenAI,
  anthropicToolChoiceToOpenAI,
} from '@ant/model-provider'
import { isChatGPTAuthEnabled } from './chatgptAuth.js'
import {
  adaptResponsesStreamToAnthropic,
  buildResponsesRequest,
  createChatGPTResponsesStream,
  type ResponsesReasoningEffort,
} from './responsesAdapter.js'
import { normalizeMessagesForAPI } from '../../../utils/messages.js'
import { toolToAPISchema } from '../../../utils/api.js'
import {
  getEmptyToolPermissionContext,
  toolMatchesName,
} from '../../../Tool.js'
import { logForDebugging } from '../../../utils/debug.js'
import { addToTotalSessionCost } from '../../../cost-tracker.js'
import { calculateUSDCost } from '../../../utils/modelCost.js'
import {
  isOpenAIThinkingEnabled,
  resolveOpenAIMaxTokens,
  buildOpenAIRequestBody,
} from './requestBody.js'
import { recordLLMObservation } from '../../../services/langfuse/tracing.js'
import {
  convertMessagesToLangfuse,
  convertOutputToLangfuse,
  convertToolsToLangfuse,
} from '../../../services/langfuse/convert.js'
export {
  isOpenAIThinkingEnabled,
  resolveOpenAIMaxTokens,
  buildOpenAIRequestBody,
}
import { getModelMaxOutputTokens } from '../../../utils/context.js'
import type { Options } from '../claude.js'
import { randomUUID } from 'crypto'
import {
  createAssistantAPIErrorMessage,
  createUserMessage,
  normalizeContentFromAPI,
} from '../../../utils/messages.js'
import type { SDKAssistantMessageError } from '../../../entrypoints/agentSdkTypes.js'
import {
  isSearchExtraToolsEnabled,
  isDeferredToolsDeltaEnabled,
} from '../../../utils/searchExtraTools.js'
import {
  formatDeferredToolLine,
  isDeferredTool,
  SEARCH_EXTRA_TOOLS_TOOL_NAME,
} from '@claude-code-best/builtin-tools/tools/SearchExtraToolsTool/prompt.js'

function convertToResponsesReasoningEffort(
  effortValue: unknown,
): ResponsesReasoningEffort | undefined {
  if (effortValue === 'low') return 'low'
  if (effortValue === 'medium') return 'medium'
  if (effortValue === 'high') return 'high'
  if (effortValue === 'xhigh') return 'xhigh'
  if (effortValue === 'max') return 'max'
  if (typeof effortValue === 'number') return 'high'
  return undefined
}

function getChatGPTResponsesReasoningEffort(
  effortValue: unknown,
): ResponsesReasoningEffort | undefined {
  const envOverride = process.env.CLAUDE_CODE_EFFORT_LEVEL?.toLowerCase()
  if (envOverride === 'auto' || envOverride === 'unset') return undefined
  return (
    convertToResponsesReasoningEffort(envOverride) ??
    convertToResponsesReasoningEffort(effortValue) ??
    'medium'
  )
}

/**
 * Mirrors the Anthropic request path's deferred-tool announcement for OpenAI.
 *
 * OpenAI-compatible endpoints cannot consume Anthropic's `defer_loading` or
 * `tool_reference` beta payloads directly, so the model needs the same textual
 * list of deferred MCP tool names that Anthropic receives before it can ask
 * SearchExtraToolsTool to load their full schemas.
 */
function prependDeferredToolListIfNeeded(
  messages: (AssistantMessage | UserMessage)[],
  tools: Tools,
  deferredToolNames: Set<string>,
  useSearchExtraTools: boolean,
): (AssistantMessage | UserMessage)[] {
  if (!useSearchExtraTools || isDeferredToolsDeltaEnabled()) return messages

  const deferredToolList = tools
    .filter(tool => deferredToolNames.has(tool.name))
    .map(formatDeferredToolLine)
    .sort()
    .join('\n')

  if (!deferredToolList) return messages

  return [
    createUserMessage({
      content: `<available-deferred-tools>\n${deferredToolList}\n</available-deferred-tools>`,
      isMeta: true,
    }),
    ...messages,
  ]
}

function isOpenAIConvertibleMessage(
  msg: Message,
): msg is AssistantMessage | UserMessage {
  return msg.type === 'assistant' || msg.type === 'user'
}

/**
 * Assemble the final AssistantMessage (and optional max_tokens error) from
 * accumulated stream state. Extracted to avoid duplication between the
 * `message_stop` handler and the post-loop safety fallback.
 */
function assembleFinalAssistantOutputs(params: {
  partialMessage: BetaMessage | null
  contentBlocks: Record<number, Record<string, unknown>>
  tools: Tools
  agentId: string | undefined
  usage: {
    input_tokens: number
    output_tokens: number
    cache_creation_input_tokens: number
    cache_read_input_tokens: number
  }
  stopReason: string | null
  maxTokens: number
}): (AssistantMessage | SystemAPIErrorMessage)[] {
  const {
    partialMessage,
    contentBlocks,
    tools,
    agentId,
    usage,
    stopReason,
    maxTokens,
  } = params
  const outputs: (AssistantMessage | SystemAPIErrorMessage)[] = []

  const allBlocks = Object.keys(contentBlocks)
    .sort((a, b) => Number(a) - Number(b))
    .map(k => contentBlocks[Number(k)])
    .filter(Boolean)

  if (allBlocks.length > 0 && partialMessage) {
    outputs.push({
      message: {
        ...partialMessage,
        content: normalizeContentFromAPI(
          allBlocks as unknown as BetaMessage['content'],
          tools,
          agentId as AgentId | undefined,
        ),
        usage,
        stop_reason: stopReason,
        stop_sequence: null,
      } as AssistantMessage['message'],
      requestId: undefined,
      type: 'assistant',
      uuid: randomUUID(),
      timestamp: new Date().toISOString(),
    } as AssistantMessage)
  }

  if (stopReason === 'max_tokens') {
    outputs.push(
      createAssistantAPIErrorMessage({
        content:
          `Output truncated: response exceeded the ${maxTokens} token limit. ` +
          `Set OPENAI_MAX_TOKENS or CLAUDE_CODE_MAX_OUTPUT_TOKENS to override.`,
        apiError: 'max_output_tokens',
        error: 'max_output_tokens',
      }),
    )
  }

  return outputs
}

/**
 * Create an OpenAI-compatible adapted stream, returning only the raw
 * BetaRawMessageStreamEvent generator (no AssistantMessage/StreamEvent wrapping).
 * Separated from queryModelOpenAI so queryModel() can create the stream inside
 * withRetry's callback and let the outer loop handle event iteration uniformly.
 */
export async function createOpenAIStream(
  messages: Message[],
  systemPrompt: SystemPrompt,
  tools: Tools,
  signal: AbortSignal,
  options: Options,
): Promise<AsyncGenerator<BetaRawMessageStreamEvent, void, unknown>> {
  // 1. Resolve model name
  const openaiModel = resolveOpenAIModel(options.model)

  // 2. Normalize messages using shared preprocessing
  const messagesForAPI = normalizeMessagesForAPI(messages, tools)

  // 3. Check if tool search is enabled (similar to Anthropic path)
  const useSearchExtraTools = await isSearchExtraToolsEnabled(
    options.model,
    tools,
    options.getToolPermissionContext ||
      (async () => getEmptyToolPermissionContext()),
    options.agents || [],
    options.querySource,
  )

  // 4. Build deferred tools set (similar to Anthropic path)
  const deferredToolNames = new Set<string>()
  if (useSearchExtraTools) {
    for (const t of tools) {
      if (isDeferredTool(t)) deferredToolNames.add(t.name)
    }
  }

  // 5. Filter tools (similar to Anthropic path)
  let filteredTools = tools
  if (useSearchExtraTools && deferredToolNames.size > 0) {
    filteredTools = tools.filter(tool => {
      if (!deferredToolNames.has(tool.name)) return true
      if (toolMatchesName(tool, SEARCH_EXTRA_TOOLS_TOOL_NAME)) return true
      return false
    })
  }

  // 6. Build tool schemas
  const toolSchemas = await Promise.all(
    filteredTools.map(tool =>
      toolToAPISchema(tool, {
        getToolPermissionContext: options.getToolPermissionContext,
        tools,
        agents: options.agents,
        allowedAgentTypes: options.allowedAgentTypes,
        model: options.model,
        deferLoading: useSearchExtraTools && deferredToolNames.has(tool.name),
      }),
    ),
  )

  // 7. Filter out non-standard tools
  const standardTools = toolSchemas.filter(
    (t): t is BetaToolUnion & { type: string } => {
      const anyT = t as unknown as Record<string, unknown>
      return (
        anyT.type !== 'advisor_20260301' && anyT.type !== 'computer_20250124'
      )
    },
  )

  // 8. Convert messages and tools to OpenAI format
  const enableThinking = isOpenAIThinkingEnabled(openaiModel)
  const openAIConvertibleMessages = messagesForAPI.filter(
    isOpenAIConvertibleMessage,
  )
  const messagesWithDeferredToolList = prependDeferredToolListIfNeeded(
    openAIConvertibleMessages,
    tools,
    deferredToolNames,
    useSearchExtraTools,
  )
  const openaiMessages = anthropicMessagesToOpenAI(
    messagesWithDeferredToolList,
    systemPrompt,
    { enableThinking },
  )
  const openaiTools = anthropicToolsToOpenAI(standardTools)
  const openaiToolChoice = anthropicToolChoiceToOpenAI(options.toolChoice)
  const reasoningEffort = getChatGPTResponsesReasoningEffort(
    options.effortValue,
  )

  // 9. Log tool filtering details
  if (useSearchExtraTools) {
    const includedDeferredTools = filteredTools.filter(t =>
      deferredToolNames.has(t.name),
    ).length
    logForDebugging(
      `[OpenAI] Tool search enabled: ${includedDeferredTools}/${deferredToolNames.size} deferred tools included, total tools=${openaiTools.length}`,
    )
  } else {
    logForDebugging(
      `[OpenAI] Tool search disabled, total tools=${openaiTools.length}`,
    )
  }

  // 10. Compute max_tokens
  const { upperLimit } = getModelMaxOutputTokens(openaiModel)
  const maxTokens = resolveOpenAIMaxTokens(
    upperLimit,
    options.maxOutputTokensOverride,
  )

  const useChatGPTResponses = isChatGPTAuthEnabled()
  const sessionId = getSessionId()
  const sessionPromptCacheKey = formatOpenAIPromptCacheKey(sessionId)
  const promptCacheKey = useChatGPTResponses
    ? sessionPromptCacheKey
    : getOfficialOpenAIPromptCacheKey(process.env.OPENAI_BASE_URL, sessionId)
  const useOfficialOpenAICache = promptCacheKey !== undefined

  logForDebugging(
    `[OpenAI] Calling model=${openaiModel}, messages=${openaiMessages.length}, tools=${openaiTools.length}, thinking=${enableThinking}${promptCacheKey ? `, prompt_cache_key=${promptCacheKey}` : ''}`,
  )

  // 11. Call OpenAI API with streaming
  const adaptedStream = useChatGPTResponses
    ? adaptResponsesStreamToAnthropic(
        await createChatGPTResponsesStream({
          request: buildResponsesRequest({
            model: openaiModel,
            messages: openaiMessages,
            tools: openaiTools,
            toolChoice: openaiToolChoice,
            reasoningEffort,
            promptCacheKey: sessionPromptCacheKey,
          }),
          signal,
          fetchOverride: options.fetchOverride as unknown as typeof fetch,
        }),
        openaiModel,
      )
    : adaptOpenAIStreamToAnthropic(
        await getOpenAIClient({
          maxRetries: 0,
          fetchOverride: options.fetchOverride as unknown as typeof fetch,
          source: options.querySource,
        }).chat.completions.create(
          buildOpenAIRequestBody({
            model: openaiModel,
            messages: openaiMessages,
            tools: openaiTools,
            toolChoice: openaiToolChoice,
            enableThinking,
            maxTokens,
            temperatureOverride: options.temperatureOverride,
            promptCacheKey,
          }),
          { signal },
        ),
        openaiModel,
        { includeCacheWriteTokens: useOfficialOpenAICache },
      )

  return adaptedStream
}

/**
 * @deprecated Use createOpenAIStream() + queryModel's withRetry instead.
 * Kept for test compatibility — wraps createOpenAIStream into a generator.
 */
export async function* queryModelOpenAI(
  messages: Message[],
  systemPrompt: SystemPrompt,
  tools: Tools,
  signal: AbortSignal,
  options: Options,
): AsyncGenerator<
  StreamEvent | AssistantMessage | SystemAPIErrorMessage,
  void
> {
  try {
    const stream = await createOpenAIStream(messages, systemPrompt, tools, signal, options)
    const openaiModel = resolveOpenAIModel(options.model)
    const messagesForAPI = normalizeMessagesForAPI(messages, tools)
    const toolSchemas = await Promise.all(
      tools.map(tool =>
        toolToAPISchema(tool, {
          getToolPermissionContext: options.getToolPermissionContext,
          tools,
          agents: options.agents,
          allowedAgentTypes: options.allowedAgentTypes,
          model: options.model,
        }),
      ),
    )

    const { upperLimit } = getModelMaxOutputTokens(openaiModel)
    const maxTokens = resolveOpenAIMaxTokens(
      upperLimit,
      options.maxOutputTokensOverride,
    )

    const contentBlocks: Record<number, Record<string, unknown>> = {}
    const collectedMessages: AssistantMessage[] = []
    let partialMessage: BetaMessage | null = null
    let stopReason: string | null = null
    let usage = {
      input_tokens: 0,
      output_tokens: 0,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    }
    let ttftMs = 0
    const start = Date.now()

    for await (const event of stream) {
      switch (event.type) {
        case 'message_start': {
          partialMessage = event.message
          ttftMs = Date.now() - start
          if (event.message.usage) {
            usage = {
              ...usage,
              ...(event.message.usage as unknown as typeof usage),
            }
          }
          break
        }
        case 'content_block_start': {
          const idx = event.index
          const cb = event.content_block
          if (cb.type === 'tool_use') {
            contentBlocks[idx] = { ...cb, input: '' }
          } else if (cb.type === 'text') {
            contentBlocks[idx] = { ...cb, text: '' }
          } else if (cb.type === 'thinking') {
            contentBlocks[idx] = { ...cb, thinking: '', signature: '' }
          } else {
            contentBlocks[idx] = { ...cb }
          }
          break
        }
        case 'content_block_delta': {
          const idx = event.index
          const delta = event.delta
          const block = contentBlocks[idx]
          if (!block) break
          if (delta.type === 'text_delta') {
            block.text = ((block.text as string | undefined) || '') + delta.text
          } else if (delta.type === 'input_json_delta') {
            block.input =
              ((block.input as string | undefined) || '') + delta.partial_json
          } else if (delta.type === 'thinking_delta') {
            block.thinking =
              ((block.thinking as string | undefined) || '') + delta.thinking
          } else if (delta.type === 'signature_delta') {
            block.signature = delta.signature
          }
          break
        }
        case 'content_block_stop': {
          break
        }
        case 'message_delta': {
          const deltaUsage = event.usage
          if (deltaUsage) {
            usage = updateOpenAIUsage(
              usage,
              deltaUsage as unknown as Parameters<typeof updateOpenAIUsage>[1],
            )
          }
          if (event.delta.stop_reason != null) {
            stopReason = event.delta.stop_reason
          }
          break
        }
        case 'message_stop': {
          if (partialMessage) {
            for (const output of assembleFinalAssistantOutputs({
              partialMessage,
              contentBlocks,
              tools,
              agentId: options.agentId,
              usage,
              stopReason,
              maxTokens,
            })) {
              if (output.type === 'assistant') {
                collectedMessages.push(output)
              }
              yield output
            }
            partialMessage = null
          }
          if (usage.input_tokens + usage.output_tokens > 0) {
            const costUSD = calculateUSDCost(
              openaiModel,
              usage as unknown as BetaUsage,
            )
            addToTotalSessionCost(
              costUSD,
              usage as unknown as BetaUsage,
              options.model,
            )
          }
          break
        }
      }

      yield {
        type: 'stream_event',
        event,
        ...(event.type === 'message_start' ? { ttftMs } : undefined),
      } as StreamEvent
    }

    // Record LLM observation in Langfuse (no-op if not configured)
    // Note: openaiMessages and enableThinking are scoped inside createOpenAIStream,
    // so we record without them here.
    recordLLMObservation(options.langfuseTrace ?? null, {
      model: openaiModel,
      provider: 'openai',
      input: [],
      output: convertOutputToLangfuse(collectedMessages),
      usage: {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens,
        cache_read_input_tokens: usage.cache_read_input_tokens,
      },
      startTime: new Date(start),
      endTime: new Date(),
      completionStartTime: ttftMs > 0 ? new Date(start + ttftMs) : undefined,
      tools: convertToolsToLangfuse(toolSchemas as unknown[]),
    })

    if (partialMessage) {
      for (const output of assembleFinalAssistantOutputs({
        partialMessage,
        contentBlocks,
        tools,
        agentId: options.agentId,
        usage,
        stopReason,
        maxTokens,
      })) {
        yield output
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logForDebugging(`[OpenAI] Error: ${errorMessage}`, { level: 'error' })
  }
}
