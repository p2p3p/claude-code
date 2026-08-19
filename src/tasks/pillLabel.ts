import { DIAMOND_FILLED, DIAMOND_OPEN } from '../constants/figures.js'
import { count } from '../utils/array.js'
import { t } from '../utils/i18n/index.js'
import type { BackgroundTaskState } from './types.js'

/**
 * Produces the compact footer-pill label for a set of background tasks.
 * Used by both the footer pill and the turn-duration transcript line so the
 * two surfaces agree on terminology.
 */
export function getPillLabel(tasks: BackgroundTaskState[]): string {
  const n = tasks.length
  const allSameType = tasks.every(t => t.type === tasks[0]!.type)

  if (allSameType) {
    switch (tasks[0]!.type) {
      case 'local_bash': {
        const monitors = count(
          tasks,
          t => t.type === 'local_bash' && t.kind === 'monitor',
        )
        const shells = n - monitors
        const parts: string[] = []
        if (shells > 0)
          parts.push(t('pillLabel.shells', shells))
        if (monitors > 0)
          parts.push(t('pillLabel.monitors', monitors))
        return parts.join(', ')
      }
      case 'in_process_teammate': {
        const teamCount = new Set(
          tasks.map(t =>
            t.type === 'in_process_teammate' ? t.identity.teamName : '',
          ),
        ).size
        return t('pillLabel.teams', teamCount)
      }
      case 'local_agent':
        return t('pillLabel.localAgents', n)
      case 'remote_agent': {
        const first = tasks[0]!
        // Per design mockup: ◇ open diamond while running/needs-input,
        // ◆ filled once ExitPlanMode is awaiting approval.
        if (n === 1 && first.type === 'remote_agent' && first.isUltraplan) {
          switch (first.ultraplanPhase) {
            case 'plan_ready':
              return `${DIAMOND_FILLED} ${t('pillLabel.ultraplanReady')}`
            case 'needs_input':
              return `${DIAMOND_OPEN} ${t('pillLabel.ultraplanNeedsInput')}`
            default:
              return `${DIAMOND_OPEN} ${t('pillLabel.ultraplan')}`
          }
        }
        return `${DIAMOND_OPEN} ${t('pillLabel.cloudSessions', n)}`
      }
      case 'local_workflow':
        return t('pillLabel.backgroundWorkflows', n)
      case 'monitor_mcp':
        return t('pillLabel.monitors', n)
      case 'dream':
        return t('pillLabel.dreaming')
    }
  }

  return t('pillLabel.backgroundTasks', n)
}

/**
 * True when the pill should show the dimmed " · ↓ to view" call-to-action.
 * Per the state diagram: only the two attention states (needs_input,
 * plan_ready) surface the CTA; plain running shows just the diamond + label.
 */
export function pillNeedsCta(tasks: BackgroundTaskState[]): boolean {
  if (tasks.length !== 1) return false
  const t = tasks[0]!
  return (
    t.type === 'remote_agent' &&
    t.isUltraplan === true &&
    t.ultraplanPhase !== undefined
  )
}
