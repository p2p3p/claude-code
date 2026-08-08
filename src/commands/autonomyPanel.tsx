import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, useInput } from '@anthropic/ink';
import { Dialog } from '@anthropic/ink';
import { useRegisterOverlay } from '../context/overlayContext.js';
import type { LocalJSXCommandOnDone } from '../types/command.js';
import { getAutonomyCommandText, getAutonomyDeepSectionText, getAutonomyStatusText } from '../cli/handlers/autonomy.js';
import { listAutonomyFlows, type AutonomyFlowRecord } from '../utils/autonomyFlows.js';
import { t } from '../utils/i18n/index.js'

type AutonomyAction = {
  label: string;
  description: string;
  run: () => Promise<string>;
};

const BASE_AUTONOMY_PANEL_ACTION_COUNT = 14;
const ACTION_LABEL_COLUMN_WIDTH = 24;

export function getAutonomyPanelBaseActionCountForTests(): number {
  return BASE_AUTONOMY_PANEL_ACTION_COUNT;
}

function AutonomyPanel({ onDone }: { onDone: LocalJSXCommandOnDone }): React.ReactNode {
  useRegisterOverlay('autonomy-panel');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flows, setFlows] = useState<AutonomyFlowRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    void listAutonomyFlows().then(items => {
      if (!cancelled) setFlows(items.slice(0, 5));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const actions = useMemo<AutonomyAction[]>(() => {
    const base: AutonomyAction[] = [
      {
        label: t('autonomy.overview'),
        description: t('autonomy.overviewDesc'),
        run: () => getAutonomyStatusText(),
      },
      {
        label: t('autonomy.fullDeepStatus'),
        description: t('autonomy.fullDeepStatusDesc'),
        run: () => getAutonomyStatusText({ deep: true }),
      },
      {
        label: t('autonomy.autoMode'),
        description: t('autonomy.autoModeDesc'),
        run: () => getAutonomyDeepSectionText('auto-mode'),
      },
      {
        label: t('autonomy.runsSummary'),
        description: t('autonomy.runsSummaryDesc'),
        run: () => getAutonomyDeepSectionText('runs'),
      },
      {
        label: t('autonomy.recentRuns'),
        description: t('autonomy.recentRunsDesc'),
        run: () => getAutonomyCommandText('runs 10'),
      },
      {
        label: t('autonomy.flowsSummary'),
        description: t('autonomy.flowsSummaryDesc'),
        run: () => getAutonomyDeepSectionText('flows'),
      },
      {
        label: t('autonomy.recentFlows'),
        description: t('autonomy.recentFlowsDesc'),
        run: () => getAutonomyCommandText('flows 10'),
      },
      {
        label: t('autonomy.cron'),
        description: t('autonomy.cronDesc'),
        run: () => getAutonomyDeepSectionText('cron'),
      },
      {
        label: t('autonomy.workflowRuns'),
        description: t('autonomy.workflowRunsDesc'),
        run: () => getAutonomyDeepSectionText('workflow-runs'),
      },
      {
        label: t('autonomy.teams'),
        description: t('autonomy.teamsDesc'),
        run: () => getAutonomyDeepSectionText('teams'),
      },
      {
        label: t('autonomy.pipes'),
        description: t('autonomy.pipesDesc'),
        run: () => getAutonomyDeepSectionText('pipes'),
      },
      {
        label: t('autonomy.runtime'),
        description: t('autonomy.runtimeDesc'),
        run: () => getAutonomyDeepSectionText('runtime'),
      },
      {
        label: t('autonomy.remoteControl'),
        description: t('autonomy.remoteControlDesc'),
        run: () => getAutonomyDeepSectionText('remote-control'),
      },
      {
        label: t('autonomy.remoteTrigger'),
        description: t('autonomy.remoteTriggerDesc'),
        run: () => getAutonomyDeepSectionText('remote-trigger'),
      },
    ];

    const flowActions = flows.flatMap<AutonomyAction>(flow => {
      const shortId = flow.flowId.slice(0, 8);
      const items: AutonomyAction[] = [
        {
          label: t('autonomy.flow', shortId),
          description: `${flow.status}: ${flow.goal}`,
          run: () => getAutonomyCommandText(`flow ${flow.flowId}`),
        },
      ];
      if (flow.status === 'waiting') {
        items.push({
          label: t('autonomy.resume', shortId),
          description: flow.currentStep ? t('autonomy.resumeWaitingStep', flow.currentStep) : t('autonomy.resumeWaitingFlow'),
          run: () =>
            getAutonomyCommandText(`flow resume ${flow.flowId}`, {
              enqueueInMemory: true,
            }),
        });
      }
      if (
        flow.status === 'queued' ||
        flow.status === 'running' ||
        flow.status === 'waiting' ||
        flow.status === 'blocked'
      ) {
        items.push({
          label: t('autonomy.cancel', shortId),
          description: t('autonomy.cancelFlow', flow.status),
          run: () =>
            getAutonomyCommandText(`flow cancel ${flow.flowId}`, {
              removeQueuedInMemory: true,
            }),
        });
      }
      return items;
    });

    return [...base, ...flowActions];
  }, [flows]);

  const selectCurrent = () => {
    const action = actions[selectedIndex];
    if (!action) return;
    void action.run().then(result => {
      onDone(result, { display: 'system' });
    });
  };

  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex(index => Math.max(0, index - 1));
      return;
    }
    if (key.downArrow) {
      setSelectedIndex(index => Math.min(actions.length - 1, index + 1));
      return;
    }
    if (key.return) {
      selectCurrent();
    }
  });

  return (
    <Dialog
      title={t("cmdSystemUI.autonomyTitle")}
      subtitle={t('autonomy.actionsCount', actions.length)}
      onCancel={() => onDone(t('cmdSystemUI.autonomyTitle') + ' panel dismissed', { display: 'system' })}
      color="background"
      hideInputGuide
    >
      <Box flexDirection="column">
        {actions.map((action, index) => (
          <Box key={`${action.label}-${index}`} flexDirection="row">
            <Text>{`${index === selectedIndex ? '›' : ' '} ${action.label}`.padEnd(ACTION_LABEL_COLUMN_WIDTH)}</Text>
            <Text dimColor>{action.description}</Text>
          </Box>
        ))}
        <Box marginTop={1}>
          <Text dimColor>{t('autonomy.navHint')}</Text>
        </Box>
      </Box>
    </Dialog>
  );
}

export async function call(onDone: LocalJSXCommandOnDone, _context: unknown, args?: string): Promise<React.ReactNode> {
  const trimmed = args?.trim() ?? '';
  if (trimmed) {
    const result = await getAutonomyCommandText(trimmed, {
      enqueueInMemory: true,
      removeQueuedInMemory: true,
    });
    onDone(result, { display: 'system' });
    return null;
  }

  return <AutonomyPanel onDone={onDone} />;
}
