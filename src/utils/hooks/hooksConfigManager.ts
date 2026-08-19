import memoize from 'lodash-es/memoize.js'
import type { HookEvent } from 'src/entrypoints/agentSdkTypes.js'
import { getRegisteredHooks } from '../../bootstrap/state.js'
import type { AppState } from '../../state/AppState.js'
import { t } from '../i18n/index.js'
import {
  getAllHooks,
  type IndividualHookConfig,
  sortMatchersByPriority} from './hooksSettings.js'

export type MatcherMetadata = {
  fieldToMatch: string
  values: string[]
}

export type HookEventMetadata = {
  summary: string
  description: string
  matcherMetadata?: MatcherMetadata
}

// Hook event metadata configuration.
// Resolver uses sorted-joined string key so that callers passing a fresh
// toolNames array each render (e.g. HooksConfigMenu) hit the cache instead
// of leaking a new entry per call.
export const getHookEventMetadata = memoize(
  function (toolNames: string[]): Record<HookEvent, HookEventMetadata> {
    return {
      PreToolUse: {
        summary: t('hooksEvent.preToolUseSummary'),
        description: t('hooksEvent.preToolUseDescription'),
        matcherMetadata: {
          fieldToMatch: 'tool_name',
          values: toolNames}},
      PostToolUse: {
        summary: t('hooksEvent.postToolUseSummary'),
        description: t('hooksEvent.postToolUseDescription'),
        matcherMetadata: {
          fieldToMatch: 'tool_name',
          values: toolNames}},
      PostToolUseFailure: {
        summary: t('hooksEvent.postToolUseFailureSummary'),
        description: t('hooksEvent.postToolUseFailureDescription'),
        matcherMetadata: {
          fieldToMatch: 'tool_name',
          values: toolNames}},
      PermissionDenied: {
        summary: t('hooksEvent.permissionDeniedSummary'),
        description: t('hooksEvent.permissionDeniedDescription'),
        matcherMetadata: {
          fieldToMatch: 'tool_name',
          values: toolNames}},
      Notification: {
        summary: t('hooksEvent.notificationSummary'),
        description: t('hooksEvent.notificationDescription'),
        matcherMetadata: {
          fieldToMatch: 'notification_type',
          values: [
            'permission_prompt',
            'idle_prompt',
            'auth_success',
            'elicitation_dialog',
            'elicitation_complete',
            'elicitation_response',
          ]}},
      UserPromptSubmit: {
        summary: t('hooksEvent.userPromptSubmitSummary'),
        description: t('hooksEvent.userPromptSubmitDescription')},
      SessionStart: {
        summary: t('hooksEvent.sessionStartSummary'),
        description: t('hooksEvent.sessionStartDescription'),
        matcherMetadata: {
          fieldToMatch: 'source',
          values: ['startup', 'resume', 'clear', 'compact']}},
      Stop: {
        summary: t('hooksEvent.stopSummary'),
        description: t('hooksEvent.stopDescription')},
      StopFailure: {
        summary: t('hooksEvent.stopFailureSummary'),
        description: t('hooksEvent.stopFailureDescription'),
        matcherMetadata: {
          fieldToMatch: 'error',
          values: [
            'rate_limit',
            'authentication_failed',
            'billing_error',
            'invalid_request',
            'server_error',
            'max_output_tokens',
            'unknown',
          ]}},
      SubagentStart: {
        summary: t('hooksEvent.subagentStartSummary'),
        description: t('hooksEvent.subagentStartDescription'),
        matcherMetadata: {
          fieldToMatch: 'agent_type',
          values: [], // Will be populated with available agent types
        }},
      SubagentStop: {
        summary: t('hooksEvent.subagentStopSummary'),
        description: t('hooksEvent.subagentStopDescription'),
        matcherMetadata: {
          fieldToMatch: 'agent_type',
          values: [], // Will be populated with available agent types
        }},
      PreCompact: {
        summary: t('hooksEvent.preCompactSummary'),
        description: t('hooksEvent.preCompactDescription'),
        matcherMetadata: {
          fieldToMatch: 'trigger',
          values: ['manual', 'auto']}},
      PostCompact: {
        summary: t('hooksEvent.postCompactSummary'),
        description: t('hooksEvent.postCompactDescription'),
        matcherMetadata: {
          fieldToMatch: 'trigger',
          values: ['manual', 'auto']}},
      SessionEnd: {
        summary: t('hooksEvent.sessionEndSummary'),
        description: t('hooksEvent.sessionEndDescription'),
        matcherMetadata: {
          fieldToMatch: 'reason',
          values: ['clear', 'logout', 'prompt_input_exit', 'other']}},
      PermissionRequest: {
        summary: t('hooksEvent.permissionRequestSummary'),
        description: t('hooksEvent.permissionRequestDescription'),
        matcherMetadata: {
          fieldToMatch: 'tool_name',
          values: toolNames}},
      Setup: {
        summary: t('hooksEvent.setupSummary'),
        description: t('hooksEvent.setupDescription'),
        matcherMetadata: {
          fieldToMatch: 'trigger',
          values: ['init', 'maintenance']}},
      TeammateIdle: {
        summary: t('hooksEvent.teammateIdleSummary'),
        description: t('hooksEvent.teammateIdleDescription')},
      TaskCreated: {
        summary: t('hooksEvent.taskCreatedSummary'),
        description: t('hooksEvent.taskCreatedDescription')},
      TaskCompleted: {
        summary: t('hooksEvent.taskCompletedSummary'),
        description: t('hooksEvent.taskCompletedDescription')},
      Elicitation: {
        summary: t('hooksEvent.elicitationSummary'),
        description: t('hooksEvent.elicitationDescription'),
        matcherMetadata: {
          fieldToMatch: 'mcp_server_name',
          values: []}},
      ElicitationResult: {
        summary: t('hooksEvent.elicitationResultSummary'),
        description: t('hooksEvent.elicitationResultDescription'),
        matcherMetadata: {
          fieldToMatch: 'mcp_server_name',
          values: []}},
      ConfigChange: {
        summary: t('hooksEvent.configChangeSummary'),
        description: t('hooksEvent.configChangeDescription'),
        matcherMetadata: {
          fieldToMatch: 'source',
          values: [
            'user_settings',
            'project_settings',
            'local_settings',
            'policy_settings',
            'skills',
          ]}},
      InstructionsLoaded: {
        summary: t('hooksEvent.instructionsLoadedSummary'),
        description: t('hooksEvent.instructionsLoadedDescription'),
        matcherMetadata: {
          fieldToMatch: 'load_reason',
          values: [
            'session_start',
            'nested_traversal',
            'path_glob_match',
            'include',
            'compact',
          ]}},
      WorktreeCreate: {
        summary: t('hooksEvent.worktreeCreateSummary'),
        description: t('hooksEvent.worktreeCreateDescription')},
      WorktreeRemove: {
        summary: t('hooksEvent.worktreeRemoveSummary'),
        description: t('hooksEvent.worktreeRemoveDescription')},
      CwdChanged: {
        summary: t('hooksEvent.cwdChangedSummary'),
        description: t('hooksEvent.cwdChangedDescription')},
      FileChanged: {
        summary: t('hooksEvent.fileChangedSummary'),
        description: t('hooksEvent.fileChangedDescription')}}
  },
  toolNames => toolNames.slice().sort().join(','),
)

// Group hooks by event and matcher
export function groupHooksByEventAndMatcher(
  appState: AppState,
  toolNames: string[],
): Record<HookEvent, Record<string, IndividualHookConfig[]>> {
  const grouped: Record<HookEvent, Record<string, IndividualHookConfig[]>> = {
    PreToolUse: {},
    PostToolUse: {},
    PostToolUseFailure: {},
    PermissionDenied: {},
    Notification: {},
    UserPromptSubmit: {},
    SessionStart: {},
    SessionEnd: {},
    Stop: {},
    StopFailure: {},
    SubagentStart: {},
    SubagentStop: {},
    PreCompact: {},
    PostCompact: {},
    PermissionRequest: {},
    Setup: {},
    TeammateIdle: {},
    TaskCreated: {},
    TaskCompleted: {},
    Elicitation: {},
    ElicitationResult: {},
    ConfigChange: {},
    WorktreeCreate: {},
    WorktreeRemove: {},
    InstructionsLoaded: {},
    CwdChanged: {},
    FileChanged: {}}

  const metadata = getHookEventMetadata(toolNames)

  // Include hooks from settings files
  getAllHooks(appState).forEach(hook => {
    const eventGroup = grouped[hook.event]
    if (eventGroup) {
      // For events without matchers, use empty string as key
      const matcherKey =
        metadata[hook.event].matcherMetadata !== undefined
          ? hook.matcher || ''
          : ''
      if (!eventGroup[matcherKey]) {
        eventGroup[matcherKey] = []
      }
      eventGroup[matcherKey].push(hook)
    }
  })

  // Include registered hooks (e.g., plugin hooks)
  const registeredHooks = getRegisteredHooks()
  if (registeredHooks) {
    for (const [event, matchers] of Object.entries(registeredHooks)) {
      const hookEvent = event as HookEvent
      const eventGroup = grouped[hookEvent]
      if (!eventGroup) continue

      for (const matcher of matchers ?? []) {
        const matcherKey = matcher.matcher || ''

        // Only PluginHookMatcher has pluginRoot; HookCallbackMatcher (internal
        // callbacks like attributionHooks, sessionFileAccessHooks) does not.
        if ('pluginRoot' in matcher) {
          eventGroup[matcherKey] ??= []
          for (const hook of matcher.hooks) {
            eventGroup[matcherKey].push({
              event: hookEvent,
              config: hook,
              matcher: matcher.matcher,
              source: 'pluginHook',
              pluginName: matcher.pluginId})
          }
        } else if (process.env.USER_TYPE === 'ant') {
          eventGroup[matcherKey] ??= []
          for (const _hook of matcher.hooks) {
            eventGroup[matcherKey].push({
              event: hookEvent,
              config: {
                type: 'command',
                command: '[ANT-ONLY] Built-in Hook'},
              matcher: matcher.matcher,
              source: 'builtinHook'})
          }
        }
      }
    }
  }

  return grouped
}

// Get sorted matchers for a specific event
export function getSortedMatchersForEvent(
  hooksByEventAndMatcher: Record<
    HookEvent,
    Record<string, IndividualHookConfig[]>
  >,
  event: HookEvent,
): string[] {
  const matchers = Object.keys(hooksByEventAndMatcher[event] || {})
  return sortMatchersByPriority(matchers, hooksByEventAndMatcher, event)
}

// Get hooks for a specific event and matcher
export function getHooksForMatcher(
  hooksByEventAndMatcher: Record<
    HookEvent,
    Record<string, IndividualHookConfig[]>
  >,
  event: HookEvent,
  matcher: string | null,
): IndividualHookConfig[] {
  // For events without matchers, hooks are stored with empty string as key
  // because the record keys must be strings.
  const matcherKey = matcher ?? ''
  return hooksByEventAndMatcher[event]?.[matcherKey] ?? []
}

// Get metadata for a specific event's matcher
export function getMatcherMetadata(
  event: HookEvent,
  toolNames: string[],
): MatcherMetadata | undefined {
  return getHookEventMetadata(toolNames)[event].matcherMetadata
}
