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
} from '../../../types/message.js'
import type { Tools } from '../../../Tool.js'
import type {
  ChatCompletionChunk,
  ChatCompletionCreateParamsStreaming,
} from 'openai/resources/chat/completions/completions.mjs'
import { getGrokClient } from './client.js'
import { updateOpenAIUsage } from '../openai/openaiShared.js'
import {
  anthropicMessagesToOpenAI,
  anthropicToolsToOpenAI,
  anthropicToolChoiceToOpenAI,
  adaptOpenAIStreamToAnthropic,
  resolveGrokModel,
} from '@ant/model-provider'
import { normalizeMessagesForAPI } from '../../../utils/messages.js'
import { toolToAPISchema } from '../../../utils/api.js'
import { logForDebugging } from '../../../utils/debug.js'
import { addToTotalSessionCost } from '../../../cost-tracker.js'
import { calculateUSDCost } from '../../../utils/modelCost.js'
import { recordLLMObservation } from '../../../services/langfuse/tracing.js'
import {
  convertMessagesToLangfuse,
  convertOutputToLangfuse,
  convertToolsToLangfuse,
} from '../../../services/langfuse/convert.js'
import type { Options } from '../claude.js'
import { randomUUID } from 'crypto'
import { normalizeContentFromAPI } from '../../../utils/messages.js'

/**
 * Grok (xAI) query path. Grok uses an OpenAI-compatible API, so we reuse
 * the OpenAI message/tool converters and stream adapter. Only the client
 * (different base URL + API key) and model mapping are Grok-specific.
 */
export async function createGrokStream(
  messages: Message[],
  systemPrompt: SystemPrompt,
  tools: Tools,
  signal: AbortSignal,
  options: Options,
): Promise<AsyncGenerator<BetaRawMessageStreamEvent, void, unknown>> {
  const grokModel = resolveGrokModel(options.model)
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
  const standardTools = toolSchemas.filter(
    (t): t is BetaToolUnion & { type: string } => {
      const anyT = t as unknown as Record<string, unknown>
      return (
        anyT.type !== 'advisor_20260301' && anyT.type !== 'computer_20250124'
      )
    },
  )

  const openaiMessages = anthropicMessagesToOpenAI(
    messagesForAPI,
    systemPrompt,
  )
  const openaiTools = anthropicToolsToOpenAI(standardTools)
  const openaiToolChoice = anthropicToolChoiceToOpenAI(options.toolChoice)

  const client = getGrokClient({
    maxRetries: 0,
    fetchOverride: options.fetchOverride as typeof fetch | undefined,
    source: options.querySource,
  })

  logForDebugging(
    `[Grok] Calling model=${grokModel}, messages=${openaiMessages.length}, tools=${openaiTools.length}`,
  )

  const stream = await client.chat.completions.create(
    {
      model: grokModel,
      messages: openaiMessages,
      ...(openaiTools.length > 0 && {
        tools: openaiTools,
        ...(openaiToolChoice && { tool_choice: openaiToolChoice }),
      }),
      stream: true,
      stream_options: { include_usage: true },
      ...(options.temperatureOverride !== undefined && {
        temperature: options.temperatureOverride,
      }),
    } as ChatCompletionCreateParamsStreaming,
    {
      signal,
    },
  )

  return adaptOpenAIStreamToAnthropic(
    stream as AsyncIterable<ChatCompletionChunk>,
    grokModel,
  )
}
