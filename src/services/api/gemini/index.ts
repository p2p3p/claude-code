import type {
  BetaToolUnion,
  BetaMessage,
  BetaRawMessageStreamEvent} from '@anthropic-ai/sdk/resources/beta/messages/messages.mjs'
import type { SystemPrompt } from '../../../utils/systemPromptType.js'
import type { ThinkingConfig } from '../../../utils/thinking.js'
import type { Options } from '../anthropic/index.js'
import { toolToAPISchema } from '../../../utils/api.js'
import { logForDebugging } from '../../../utils/debug.js'
import { normalizeMessagesForAPI } from '../../../utils/messages.js'
import type { Message } from '../../../types/message.js'
import type { Tools } from '../../../Tool.js'
import { streamGeminiGenerateContent } from './client.js'
import {
  anthropicMessagesToGemini,
  resolveGeminiModel,
  adaptGeminiStreamToAnthropic,
  anthropicToolsToGemini,
  anthropicToolChoiceToGemini} from '@ant/model-provider'

/**
 * Create a Gemini adapted stream, returning only the raw
 * BetaRawMessageStreamEvent generator. Separated from queryModelGemini
 * so queryModel() can create the stream inside withRetry's callback.
 */
export async function createGeminiStream(
  messages: Message[],
  systemPrompt: SystemPrompt,
  tools: Tools,
  signal: AbortSignal,
  options: Options,
  thinkingConfig: ThinkingConfig,
): Promise<AsyncGenerator<BetaRawMessageStreamEvent, void, unknown>> {
  const geminiModel = resolveGeminiModel(options.model)
  const messagesForAPI = normalizeMessagesForAPI(messages, tools)

  const toolSchemas = await Promise.all(
    tools.map(tool =>
      toolToAPISchema(tool, {
        getToolPermissionContext: options.getToolPermissionContext,
        tools,
        agents: options.agents,
        allowedAgentTypes: options.allowedAgentTypes,
        model: options.model}),
    ),
  )

  const standardTools = toolSchemas.filter(
    (t): t is BetaToolUnion & { type: string } => {
      const anyTool = t as unknown as Record<string, unknown>
      return (
        anyTool.type !== 'advisor_20260301' &&
        anyTool.type !== 'computer_20250124'
      )
    },
  )

  const { contents, systemInstruction } = anthropicMessagesToGemini(
    messagesForAPI,
    systemPrompt,
  )
  const geminiTools = anthropicToolsToGemini(standardTools)
  const toolChoice = anthropicToolChoiceToGemini(options.toolChoice)

  const stream = streamGeminiGenerateContent({
    model: geminiModel,
    signal,
    fetchOverride: options.fetchOverride as typeof fetch | undefined,
    body: {
      contents,
      ...(systemInstruction && { systemInstruction }),
      ...(geminiTools.length > 0 && { tools: geminiTools }),
      ...(toolChoice && {
        toolConfig: {
          functionCallingConfig: toolChoice}}),
      generationConfig: {
        ...(options.temperatureOverride !== undefined && {
          temperature: options.temperatureOverride}),
        ...(thinkingConfig.type !== 'disabled' && {
          thinkingConfig: {
            includeThoughts: true,
            ...(thinkingConfig.type === 'enabled' && {
              thinkingBudget: thinkingConfig.budgetTokens})}})}}})

  logForDebugging(
    `[Gemini] Calling model=${geminiModel}, messages=${contents.length}, tools=${geminiTools.length}`,
  )

  return adaptGeminiStreamToAnthropic(stream, geminiModel)
}