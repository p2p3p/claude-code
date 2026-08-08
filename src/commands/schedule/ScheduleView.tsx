import React from 'react';
import { Box, Text } from '@anthropic/ink';
import type { Theme } from '@anthropic/ink';
import type { Trigger } from './triggersApi.js';
import { cronToHuman } from '../../utils/cron.js';
import { t } from '../../utils/i18n/index.js'

type Props =
  | { mode: 'list'; triggers: Trigger[] }
  | { mode: 'detail'; trigger: Trigger }
  | { mode: 'created'; trigger: Trigger }
  | { mode: 'updated'; trigger: Trigger }
  | { mode: 'deleted'; id: string }
  | { mode: 'ran'; id: string; runId: string }
  | { mode: 'enabled'; id: string }
  | { mode: 'disabled'; id: string }
  | { mode: 'error'; message: string };

function TriggerRow({ trigger }: { trigger: Trigger }): React.ReactNode {
  const schedule = cronToHuman(trigger.cron_expression, { utc: true });
  const nextRun = trigger.next_run ? new Date(trigger.next_run).toLocaleString() : '—';
  const enabledText = trigger.enabled ? t('scheduleView.enabled') : t('scheduleView.disabled');
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold>{trigger.trigger_id}</Text>
        <Text dimColor> · </Text>
        <Text color={(trigger.enabled ? 'success' : 'warning') as keyof Theme}>{enabledText}</Text>
        {trigger.agent_id ? (
          <>
            <Text dimColor> · {t('scheduleView.agent')} </Text>
            <Text>{trigger.agent_id}</Text>
          </>
        ) : null}
      </Box>
      <Text>{t('scheduleView.schedule')} {schedule}</Text>
      <Text dimColor>{t('scheduleView.prompt')} {trigger.prompt}</Text>
      <Text dimColor>{t('scheduleView.nextRun')} {nextRun}</Text>
    </Box>
  );
}

export function ScheduleView(props: Props): React.ReactNode {
  if (props.mode === 'list') {
    if (props.triggers.length === 0) {
      return (
        <Box>
          <Text dimColor>{t('scheduleView.noTriggersFound')}</Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('scheduleView.scheduledTriggers', props.triggers.length)}</Text>
        </Box>
        {props.triggers.map(trigger => (
          <TriggerRow key={trigger.trigger_id} trigger={trigger} />
        ))}
      </Box>
    );
  }

  if (props.mode === 'detail') {
    const { trigger } = props;
    const schedule = cronToHuman(trigger.cron_expression, { utc: true });
    const nextRun = trigger.next_run ? new Date(trigger.next_run).toLocaleString() : '—';
    const lastRun = trigger.last_run ? new Date(trigger.last_run).toLocaleString() : '—';
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('scheduleView.triggerDetail')} {trigger.trigger_id}</Text>
        </Box>
        <Text>
          {t('scheduleView.status')}{' '}
          <Text color={(trigger.enabled ? 'success' : 'warning') as keyof Theme}>
            {trigger.enabled ? t('scheduleView.enabled') : t('scheduleView.disabled')}
          </Text>
        </Text>
        <Text>{t('scheduleView.schedule')} {schedule}</Text>
        {trigger.agent_id ? <Text>{t('scheduleView.agentLabel')} {trigger.agent_id}</Text> : null}
        <Text>{t('scheduleView.nextRun')} {nextRun}</Text>
        <Text dimColor>{t('scheduleView.lastRun')} {lastRun}</Text>
        <Text dimColor>{t('scheduleView.prompt')} {trigger.prompt}</Text>
        {trigger.created_at ? <Text dimColor>{t('scheduleView.created')} {new Date(trigger.created_at).toLocaleString()}</Text> : null}
      </Box>
    );
  }

  if (props.mode === 'created') {
    const { trigger } = props;
    const schedule = cronToHuman(trigger.cron_expression, { utc: true });
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t('scheduleView.triggerCreated')}
          </Text>
        </Box>
        <Text>{t('scheduleView.id')} {trigger.trigger_id}</Text>
        <Text>{t('scheduleView.schedule')} {schedule}</Text>
        <Text>{t('scheduleView.prompt')} {trigger.prompt}</Text>
        {trigger.agent_id ? <Text>{t('scheduleView.agentLabel')} {trigger.agent_id}</Text> : null}
        <Text dimColor>{t('scheduleView.status')} {trigger.enabled ? t('scheduleView.enabled') : t('scheduleView.disabled')}</Text>
      </Box>
    );
  }

  if (props.mode === 'updated') {
    const { trigger } = props;
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t('scheduleView.triggerUpdated')}
          </Text>
        </Box>
        <Text>{t('scheduleView.id')} {trigger.trigger_id}</Text>
        <Text dimColor>{t('scheduleView.status')} {trigger.enabled ? t('scheduleView.enabled') : t('scheduleView.disabled')}</Text>
      </Box>
    );
  }

  if (props.mode === 'deleted') {
    return (
      <Box>
        <Text color={'success' as keyof Theme}>{t('scheduleView.triggerDeleted', props.id)}</Text>
      </Box>
    );
  }

  if (props.mode === 'ran') {
    return (
      <Box flexDirection="column">
        <Box>
          <Text color={'success' as keyof Theme}>{t('scheduleView.triggerFired', props.id)}</Text>
        </Box>
        <Text dimColor>{t('scheduleView.runId')} {props.runId}</Text>
      </Box>
    );
  }

  if (props.mode === 'enabled') {
    return (
      <Box>
        <Text color={'success' as keyof Theme}>{t('scheduleView.triggerEnabled', props.id)}</Text>
      </Box>
    );
  }

  if (props.mode === 'disabled') {
    return (
      <Box>
        <Text color={'warning' as keyof Theme}>{t('scheduleView.triggerDisabled', props.id)}</Text>
      </Box>
    );
  }

  // error mode
  return (
    <Box>
      <Text color={'error' as keyof Theme}>{props.message}</Text>
    </Box>
  );
}
