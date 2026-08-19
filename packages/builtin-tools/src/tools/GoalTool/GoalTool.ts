import { z } from 'zod/v4'
import { buildTool, type ToolDef } from 'src/Tool.js'
import { t } from 'src/utils/i18n/index.js'
import { jsonStringify } from 'src/utils/slowOperations.js'
import { lazySchema } from 'src/utils/lazySchema.js'
import {
  completeGoal,
  formatGoalElapsed,
  formatGoalStatusLabel,
  getGoal,
  recordBlockedAttempt,
} from 'src/services/goal/goalState.js'
import { persistCurrentGoal } from 'src/services/goal/goalStorage.js'
import { GOAL_TOOL_NAME } from './constants.js'
import { DESCRIPTION, generatePrompt } from './prompt.js'

function toolLog(msg: string): void {
  try {
    const { logForDebugging } =
      require('src/utils/debug.js') as typeof import('src/utils/debug.js')
    logForDebugging(`[goal] tool: ${msg}`)
  } catch {
    /* debug not available */
  }
}

const inputSchema = lazySchema(() =>
  z.strictObject({
    action: z
      .enum(['get', 'update'])
      .optional()
      .describe(
        'Action to perform: "get" to read status, "update" to mark complete or blocked. Defaults to "update" if status is provided, otherwise "get".',
      ),
    status: z
      .enum(['complete', 'blocked'])
      .optional()
      .describe(
        'Required for "update". Only "complete" or "blocked" are accepted.',
      ),
    reason: z
      .string()
      .optional()
      .describe('Explanation for the status change. Required for "update".'),
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

const outputSchema = lazySchema(() =>
  z.object({
    success: z.boolean(),
    goal: z
      .object({
        objective: z.string(),
        status: z.string(),
        tokensUsed: z.number(),
        tokenBudget: z.number().nullable(),
        elapsed: z.string(),
        turnsExecuted: z.number(),
      })
      .optional(),
    message: z.string().optional(),
    report: z.string().optional(),
    error: z.string().optional(),
  }),
)
type OutputSchema = ReturnType<typeof outputSchema>

export type Input = z.infer<InputSchema>
export type Output = z.infer<OutputSchema>

function buildGoalSnapshot() {
  const goal = getGoal()
  if (!goal) return undefined
  return {
    objective: goal.objective,
    status: formatGoalStatusLabel(goal.status),
    tokensUsed: goal.tokensUsed,
    tokenBudget: goal.tokenBudget,
    elapsed: formatGoalElapsed(goal),
    turnsExecuted: goal.turnsExecuted,
  }
}

function buildCompletionReport(): string {
  const goal = getGoal()
  if (!goal) return ''
  const budget =
    goal.tokenBudget !== null
      ? t(
          'toolUI.goal.reportTokenUsageWithBudget',
          goal.tokensUsed,
          goal.tokenBudget,
        )
      : t('toolUI.goal.reportTokenUsage', goal.tokensUsed)
  return [
    t('toolUI.goal.reportTitle'),
    `  ${budget}`,
    t('toolUI.goal.reportActiveTime', formatGoalElapsed(goal)),
    t('toolUI.goal.reportContinuationTurns', goal.turnsExecuted),
  ].join('\n')
}

export const GoalTool = buildTool({
  name: GOAL_TOOL_NAME,
  searchHint: t('toolUI.goal.searchHint'),
  maxResultSizeChars: 10_000,
  async description() {
    return DESCRIPTION
  },
  async prompt() {
    return generatePrompt()
  },
  get inputSchema(): InputSchema {
    return inputSchema()
  },
  get outputSchema(): OutputSchema {
    return outputSchema()
  },
  userFacingName() {
    return t('toolUI.goal.userFacingName')
  },
  shouldDefer: true,
  isConcurrencySafe() {
    return true
  },
  isReadOnly(input: Input) {
    const action = input.action ?? (input.status ? 'update' : 'get')
    return action === 'get'
  },
  toAutoClassifierInput(input: Input) {
    const action = input.action ?? (input.status ? 'update' : 'get')
    if (action === 'get') return 'get goal status'
    return `update goal: ${input.status} — ${input.reason ?? ''}`
  },
  async checkPermissions(input: Input) {
    return { behavior: 'allow' as const, updatedInput: input }
  },
  renderToolUseMessage(input: Input) {
    const action = input.action ?? (input.status ? 'update' : 'get')
    if (action === 'get') return t('toolUI.goal.checkingStatus')
    return t('toolUI.goal.updatingGoal', input.status, input.reason ?? '')
  },
  renderToolResultMessage(output: Output) {
    if (!output) {
      return null
    }
    if (output?.error) return t('toolUI.goal.goalError', output.error)
    if (output.report) return output.report
    if (output.goal) {
      return t('toolUI.goal.goalStatus', output.goal.objective, output.goal.status)
    }
    return output.message ?? t('toolUI.goal.done')
  },
  renderToolUseRejectedMessage() {
    return t('toolUI.goal.operationRejected')
  },
  async call(input: Input): Promise<{ data: Output }> {
    const action = input.action ?? (input.status ? 'update' : 'get')
    toolLog(
      `called: action=${action}${input.status ? ` status=${input.status}` : ''}${input.reason ? ` reason="${input.reason.slice(0, 60)}"` : ''}`,
    )
    if (action === 'get') {
      const snapshot = buildGoalSnapshot()
      if (!snapshot) {
        return {
          data: {
            success: true,
            message: t('toolUI.goal.noActiveGoal'),
          },
        }
      }
      return { data: { success: true, goal: snapshot } }
    }

    // action === 'update'
    if (!input.status) {
      return {
        data: {
          success: false,
          error: t('toolUI.goal.statusRequired'),
        },
      }
    }

    const goal = getGoal()
    if (!goal) {
      return {
        data: {
          success: false,
          error: t('toolUI.goal.noActiveGoalToUpdate'),
        },
      }
    }

    if (input.status === 'complete') {
      const report = buildCompletionReport()
      completeGoal()
      persistCurrentGoal()
      return {
        data: {
          success: true,
          goal: buildGoalSnapshot(),
          report,
        },
      }
    }

    // status === 'blocked'
    const reason = input.reason ?? t('toolUI.goal.unspecifiedBlocker')
    const result = recordBlockedAttempt(reason)
    if (!result) {
      return {
        data: {
          success: false,
          error: t('toolUI.goal.notAcceptingBlocked'),
        },
      }
    }
    persistCurrentGoal()

    if (result.status === 'blocked') {
      return {
        data: {
          success: true,
          goal: buildGoalSnapshot(),
          message: t('toolUI.goal.markedBlocked', result.attempts, reason),
        },
      }
    }

    return {
      data: {
        success: true,
        goal: buildGoalSnapshot(),
        message: t('toolUI.goal.blockedAttemptRecorded', result.attempts),
      },
    }
  },
  mapToolResultToToolResultBlockParam(content: Output, toolUseID: string) {
    if (content.error) {
      return {
        tool_use_id: toolUseID,
        type: 'tool_result' as const,
        content: `Error: ${content.error}`,
        is_error: true,
      }
    }
    const parts: string[] = []
    if (content.message) parts.push(content.message)
    if (content.report) parts.push(content.report)
    if (content.goal) parts.push(jsonStringify(content.goal))
    return {
      tool_use_id: toolUseID,
      type: 'tool_result' as const,
      content: parts.join('\n') || 'Done',
    }
  },
} satisfies ToolDef<InputSchema, Output>)
