import React from 'react';
import { Box, Text } from '@anthropic/ink';
import type { Theme } from '@anthropic/ink';
import type { AgentTrigger } from './agentsApi.js';
import { cronToHuman } from '../../utils/cron.js';
import { t } from '../../utils/i18n/index.js'

type Props =
  | { mode: 'list'; agents: AgentTrigger[] }
  | { mode: 'created'; agent: AgentTrigger }
  | { mode: 'deleted'; id: string }
  | { mode: 'ran'; id: string; runId: string }
  | { mode: 'error'; message: string };

function AgentRow({ agent }: { agent: AgentTrigger }): React.ReactNode {
  const schedule = cronToHuman(agent.cron_expr, { utc: true });
  const nextRun = agent.next_run ? new Date(agent.next_run).toLocaleString() : '—';
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold>{agent.id}</Text>
        <Text dimColor> · </Text>
        <Text color={'suggestion' as keyof Theme}>{agent.status}</Text>
      </Box>
      <Text>{t('agentsPlatform.schedule')} {schedule}</Text>
      <Text dimColor>{t('agentsPlatform.prompt')} {agent.prompt}</Text>
      <Text dimColor>{t('agentsPlatform.nextRun')} {nextRun}</Text>
    </Box>
  );
}

export function AgentsPlatformView(props: Props): React.ReactNode {
  if (props.mode === 'list') {
    if (props.agents.length === 0) {
      return (
        <Box>
          <Text dimColor>
            {t('agentsPlatform.noAgentsFound')}
          </Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold>{t('agentsPlatform.scheduledAgents', props.agents.length)}</Text>
        </Box>
        {props.agents.map(agent => (
          <AgentRow key={agent.id} agent={agent} />
        ))}
      </Box>
    );
  }

  if (props.mode === 'created') {
    const schedule = cronToHuman(props.agent.cron_expr, { utc: true });
    return (
      <Box flexDirection="column">
        <Box>
          <Text bold color={'success' as keyof Theme}>
            {t("cmdSystemUI.agentsPlatformTitle")} created
          </Text>
        </Box>
        <Text>{t('agentsPlatform.id')} {props.agent.id}</Text>
        <Text>{t('agentsPlatform.schedule')} {schedule}</Text>
        <Text>{t('agentsPlatform.prompt')} {props.agent.prompt}</Text>
        <Text dimColor>{t('agentsPlatform.status')} {props.agent.status}</Text>
      </Box>
    );
  }

  if (props.mode === 'deleted') {
    return (
      <Box>
        <Text color={'success' as keyof Theme}>{t('agentsPlatform.agentDeleted', props.id)}</Text>
      </Box>
    );
  }

  if (props.mode === 'ran') {
    return (
      <Box flexDirection="column">
        <Box>
          <Text color={'success' as keyof Theme}>{t('agentsPlatform.agentTriggered', props.id)}</Text>
        </Box>
        <Text dimColor>{t('agentsPlatform.runId')} {props.runId}</Text>
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
