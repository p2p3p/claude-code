import React from 'react';
import { handlePlanModeTransition } from '../../../bootstrap/state.js';
import { t } from '../../../utils/i18n/index.js';
import { Box, Text } from '@anthropic/ink';
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent} from '../../../services/analytics/index.js';
import { useAppState } from '../../../state/AppState.js';
import { isPlanModeInterviewPhaseEnabled } from '../../../utils/planModeV2.js';
import { Select } from '../../CustomSelect/index.js';
import { PermissionDialog } from '../PermissionDialog.js';
import type { PermissionRequestProps } from '../PermissionRequest.js';

export function EnterPlanModePermissionRequest({
  toolUseConfirm,
  onDone,
  onReject,
  workerBadge}: PermissionRequestProps): React.ReactNode {
  const toolPermissionContextMode = useAppState(s => s.toolPermissionContext.mode);

  function handleResponse(value: 'yes' | 'no'): void {
    if (value === 'yes') {
      logEvent('tengu_plan_enter', {
        interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
        entryMethod: 'tool' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS});
      handlePlanModeTransition(toolPermissionContextMode, 'plan');
      onDone();
      toolUseConfirm.onAllow({}, [{ type: 'setMode', mode: 'plan', destination: 'session' }]);
    } else {
      onDone();
      onReject();
      toolUseConfirm.onReject();
    }
  }

  return (
    <PermissionDialog color="planMode" title={t('enterplanmodepermissionrequest.enterPlanMode')} workerBadge={workerBadge}>
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text>{t('permission.enterPlanMode')}</Text>

        <Box marginTop={1} flexDirection="column">
          <Text dimColor>{t('enterplanmodepermissionrequest.inPlanModeClaudeWill')}</Text>
          <Text dimColor> · {t('enterPlanModePermission.exploreCodebase')}</Text>
          <Text dimColor> · {t('enterPlanModePermission.identifyPatterns')}</Text>
          <Text dimColor> · {t('enterPlanModePermission.designStrategy')}</Text>
          <Text dimColor> · {t('enterPlanModePermission.presentPlan')}</Text>
        </Box>

        <Box marginTop={1}>
          <Text dimColor>{t('enterplanmodepermissionrequest.noCodeChangesWillBeMadeUntilYouApproveThePlan')}</Text>
        </Box>

        <Box marginTop={1}>
          <Select
            options={[
              { label: t('enterPlanModePermission.yesEnterPlanMode'), value: 'yes' as const },
              { label: t('enterPlanModePermission.noStartNow'), value: 'no' as const },
            ]}
            onChange={handleResponse}
            onCancel={() => handleResponse('no')}
          />
        </Box>
      </Box>
    </PermissionDialog>
  );
}
