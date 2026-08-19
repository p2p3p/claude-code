/**
 * `/goal` slash command — set, view, or control the persistent thread
 * goal that drives auto-continuation across turns.
 *
 * Subcommands
 * -----------
 * `/goal`              -> show current status
 * `/goal status`       -> alias of bare `/goal`
 * `/goal clear`        -> remove the active goal (persists tombstone)
 * `/goal pause`        -> pause auto-continuation
 * `/goal resume`       -> resume from paused state
 * `/goal continue`     -> reset turn counter after max-turns and continue
 * `/goal complete`     -> mark complete (manual override; tools usually do this)
 * `/goal <objective>`  -> set a new goal; if one is already active and not
 *                         complete, a confirmation dialog appears first.
 */
import * as React from 'react';

import type { LocalJSXCommandContext } from 'src/commands.js';
import {
  clearGoal,
  completeGoal,
  continueGoalFromMaxTurns,
  formatGoalElapsed,
  formatGoalStatusLabel,
  getGoal,
  incrementGoalTurns,
  MAX_GOAL_TURNS,
  pauseGoal,
  resumeGoal,
  setGoal} from 'src/services/goal/goalState.js';
import { persistCurrentGoal, persistGoalClear } from 'src/services/goal/goalStorage.js';
import type { LocalJSXCommandOnDone } from 'src/types/command.js';
import { removeByFilter } from 'src/utils/messageQueueManager.js';
import { GoalReplaceConfirmDialog } from './GoalReplaceConfirmDialog.js';
import { t } from '../../utils/i18n/index.js'

const MAX_OBJECTIVE_CHARS = 4000;
const MAX_DISPLAY_CHARS = 80;

function truncateForDisplay(objective: string): string {
  const firstLine = objective.split('\n')[0] ?? objective;
  if (firstLine.length <= MAX_DISPLAY_CHARS) return firstLine;
  return firstLine.slice(0, MAX_DISPLAY_CHARS) + '…';
}

function drainGoalContinuationQueue(): void {
  removeByFilter(cmd => cmd.origin === 'goal-continuation' || cmd.origin === 'goal-budget-limit');
}

function formatGoalStatus(): string {
  const goal = getGoal();
  if (!goal) {
    return t('cmdSystemUI.noActiveGoal');
  }
  const tokens = goal.tokenBudget !== null ? `${goal.tokensUsed} / ${goal.tokenBudget}` : `${goal.tokensUsed}`;
  const lines = [
    `${t('goalCmd.labelGoal')}${goal.objective}`,
    `${t('goalCmd.labelStatus')}${formatGoalStatusLabel(goal.status)}`,
    `${t('goalCmd.labelTime')}${formatGoalElapsed(goal)}`,
    `${t('goalCmd.labelTokens')}${tokens}`,
    `${t('goalCmd.labelContinuation')}${goal.turnsExecuted}`,
  ];

  if (goal.status === 'max_turns') {
    lines.push(
      t('goalCmd.maxTurnsHint', MAX_GOAL_TURNS),
    );
  }

  return lines.join('\n');
}

function applySetGoal(objective: string): string {
  setGoal(objective);
  incrementGoalTurns();
  persistCurrentGoal();
  return t('cmdSystemUI.goalResumed');
}

export async function call(
  onDone: LocalJSXCommandOnDone,
  _context: LocalJSXCommandContext,
  args: string,
): Promise<React.ReactNode> {
  const trimmed = args.trim();

  if (!trimmed || trimmed.toLowerCase() === 'status') {
    onDone(formatGoalStatus(), { display: 'system' });
    return null;
  }

  const lower = trimmed.toLowerCase();

  if (lower === 'clear') {
    const cleared = clearGoal();
    if (cleared) {
      persistGoalClear();
      drainGoalContinuationQueue();
    }
    onDone(cleared ? t('cmdSystemUI.goalCleared') : t('cmdSystemUI.goalCleared'), {
      display: 'system'});
    return null;
  }

  if (lower === 'pause') {
    const g = pauseGoal();
    if (g) {
      persistCurrentGoal();
      drainGoalContinuationQueue();
    }
    onDone(g ? t('cmdSystemUI.goalPaused') : t('cmdSystemUI.goalPaused'), {
      display: 'system'});
    return null;
  }

  if (lower === 'resume') {
    const current = getGoal();
    if (current?.status === 'max_turns') {
      onDone(
        t('goalCmd.maxTurnsResume', MAX_GOAL_TURNS),
        { display: 'system' },
      );
      return null;
    }
    const g = resumeGoal();
    if (g) persistCurrentGoal();
    onDone(g ? t('cmdSystemUI.goalResumed') : t('cmdSystemUI.goalResumed'), {
      display: 'system',
      shouldQuery: Boolean(g)});
    return null;
  }

  if (lower === 'continue') {
    const g = continueGoalFromMaxTurns();
    if (g) persistCurrentGoal();
    onDone(
      g
        ? t('goalCmd.continueReset', MAX_GOAL_TURNS)
        : t('goalCmd.notMaxTurns'),
      {
        display: 'system',
        shouldQuery: Boolean(g)},
    );
    return null;
  }

  if (lower === 'complete') {
    const g = completeGoal();
    if (g) {
      persistCurrentGoal();
      drainGoalContinuationQueue();
    }
    onDone(g ? t('cmdSystemUI.goalComplete') : t('cmdSystemUI.goalComplete'), {
      display: 'system'});
    return null;
  }

  if (trimmed.length > MAX_OBJECTIVE_CHARS) {
    onDone(
      t('goalCmd.objectiveTooLong', trimmed.length, MAX_OBJECTIVE_CHARS),
      { display: 'system' },
    );
    return null;
  }

  const existing = getGoal();
  const needsConfirmation = existing && existing.status !== 'complete';

  if (!needsConfirmation) {
    const summary = applySetGoal(trimmed);
    onDone(summary, {
      display: 'system',
      shouldQuery: true,
      displayArgs: truncateForDisplay(trimmed),
      metaMessages: [`<goal-objective-updated>\n${trimmed}\n</goal-objective-updated>`]});
    return null;
  }

  return (
    <GoalReplaceConfirmDialog
      currentGoal={existing}
      newObjective={trimmed}
      onConfirm={() => {
        drainGoalContinuationQueue();
        const summary = applySetGoal(trimmed);
        onDone(summary, {
          display: 'system',
          shouldQuery: true,
          displayArgs: truncateForDisplay(trimmed),
          metaMessages: [`<goal-objective-updated>\n${trimmed}\n</goal-objective-updated>`]});
      }}
      onCancel={() => {
        onDone(t('cmdSystemUI.noKeepGoal'), {
          display: 'system'});
      }}
    />
  );
}
