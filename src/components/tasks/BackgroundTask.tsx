import * as React from 'react';
import { Text } from '@anthropic/ink';
import { toInkColor } from '../../utils/ink.js';
import type { BackgroundTaskState } from 'src/tasks/types.js';
import type { DeepImmutable } from 'src/types/utils.js';
import { truncate } from 'src/utils/format.js';

import { t } from '../../utils/i18n/index.js';
import { DIAMOND_FILLED, DIAMOND_OPEN } from '../../constants/figures.js';
import { RemoteSessionProgress } from './RemoteSessionProgress.js';
import { ShellProgress, TaskStatusText } from './ShellProgress.js';
import { describeTeammateActivity } from './taskStatusUtils.js';

type Props = {
  task: DeepImmutable<BackgroundTaskState>;
  maxActivityWidth?: number;
};

export function BackgroundTask({ task, maxActivityWidth }: Props): React.ReactNode {
  const activityLimit = maxActivityWidth ?? 40;
  switch (task.type) {
    case 'local_bash':
      return (
        <Text>
          {truncate(task.kind === 'monitor' ? task.description : task.command, activityLimit, true)}{' '}
          <ShellProgress shell={task} />
        </Text>
      );
    case 'remote_agent': {
      // Lite-review renders its own rainbow line (title + live counts),
      // so we don't prefix the title — the rainbow already includes it.
      if (task.isRemoteReview) {
        return (
          <Text>
            <RemoteSessionProgress session={task} />
          </Text>
        );
      }
      const running = task.status === 'running' || task.status === 'pending';
      return (
        <Text>
          <Text dimColor>{running ? DIAMOND_OPEN : DIAMOND_FILLED} </Text>
          {truncate(task.title, activityLimit, true)}
          <Text dimColor> · </Text>
          <RemoteSessionProgress session={task} />
        </Text>
      );
    }
    case 'local_agent':
      return (
        <Text>
          {truncate(task.description, activityLimit, true)}{' '}
          <TaskStatusText
            status={task.status}
            label={task.status === 'completed' ? t('taskDetail.doneLabel') : undefined}
            suffix={task.status === 'completed' && !task.notified ? t('taskDetail.unreadSuffix') : undefined}
          />
        </Text>
      );
    case 'in_process_teammate': {
      const activity = describeTeammateActivity(task);
      return (
        <Text>
          <Text color={toInkColor(task.identity.color)}>@{task.identity.agentName}</Text>
          <Text dimColor>: {truncate(activity, activityLimit, true)}</Text>
        </Text>
      );
    }
    case 'local_workflow': {
      const _task = task as Record<string, unknown>;
      return (
        <Text>
          {truncate(
            ((_task.workflowName as string) ?? task.summary ?? task.description) as string,
            activityLimit,
            true,
          )}{' '}
          <TaskStatusText
            status={task.status}
            label={
              task.status === 'running'
                ? t('taskDetail.agentCount', (_task.agentCount as number) ?? 0)
                : task.status === 'completed'
                  ? t('taskDetail.doneLabel')
                  : undefined
            }
            suffix={task.status === 'completed' && !task.notified ? t('taskDetail.unreadSuffix') : undefined}
          />
        </Text>
      );
    }
    case 'monitor_mcp':
      return (
        <Text>
          {truncate(task.description, activityLimit, true)}{' '}
          <TaskStatusText
            status={task.status}
            label={task.status === 'completed' ? t('taskDetail.doneLabel') : undefined}
            suffix={task.status === 'completed' && !task.notified ? t('taskDetail.unreadSuffix') : undefined}
          />
        </Text>
      );
    case 'dream': {
      const n = task.filesTouched.length;
      const detail =
        task.phase === 'updating' && n > 0
          ? t('taskDetail.fileCount', n)
          : t('taskDetail.sessionCount', task.sessionsReviewing);
      return (
        <Text>
          {task.description}{' '}
          <Text dimColor>
            · {task.phase} · {detail}
          </Text>{' '}
          <TaskStatusText
            status={task.status}
            label={task.status === 'completed' ? t('taskDetail.doneLabel') : undefined}
            suffix={task.status === 'completed' && !task.notified ? t('taskDetail.unreadSuffix') : undefined}
          />
        </Text>
      );
    }
  }
}
