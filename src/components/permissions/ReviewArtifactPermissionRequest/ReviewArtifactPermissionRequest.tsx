import React from 'react';
import { t } from '../../../utils/i18n/index.js';
import { Box, Text } from '@anthropic/ink';
import { Select } from '../../CustomSelect/select.js';
import { usePermissionRequestLogging } from '../hooks.js';
import { PermissionDialog } from '../PermissionDialog.js';
import type { PermissionRequestProps } from '../PermissionRequest.js';
import { logUnaryPermissionEvent } from '../utils.js';

export function ReviewArtifactPermissionRequest({
  toolUseConfirm,
  onDone,
  onReject,
  workerBadge}: PermissionRequestProps): React.ReactNode {
  const { title, annotations, summary } = toolUseConfirm.input as {
    title?: string;
    annotations?: Array<{ line?: number; message: string; severity?: string }>;
    summary?: string;
  };

  const unaryEvent = {
    completion_type: 'tool_use_single' as const,
    language_name: 'none'};
  usePermissionRequestLogging(toolUseConfirm, unaryEvent);

  const annotationCount = annotations?.length ?? 0;

  function handleResponse(value: 'yes' | 'no'): void {
    if (value === 'yes') {
      logUnaryPermissionEvent('tool_use_single', toolUseConfirm, 'accept');
      toolUseConfirm.onAllow(toolUseConfirm.input, []);
      onDone();
    } else {
      logUnaryPermissionEvent('tool_use_single', toolUseConfirm, 'reject');
      toolUseConfirm.onReject();
      onReject();
      onDone();
    }
  }

  return (
    <PermissionDialog color="permission" title={t('reviewartifactpermissionrequest.reviewArtifact')} workerBadge={workerBadge}>
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text>{t('permission.approveArtifact', title ? `: ${title}` : ' an artifact')}</Text>

        <Box marginTop={1} flexDirection="column">
          <Text dimColor>
            {t('reviewartifactpermissionrequest.annotationsCount', { count: annotationCount })}
          </Text>
          {summary ? <Text dimColor>{t('reviewartifactpermissionrequest.summary', { summary })}</Text> : null}
        </Box>

        <Box marginTop={1}>
          <Select
            options={[
              { label: t('reviewArtifactPermission.yesShowReview'), value: 'yes' as const },
              { label: t('reviewArtifactPermission.noSkip'), value: 'no' as const },
            ]}
            onChange={handleResponse}
            onCancel={() => handleResponse('no')}
          />
        </Box>
      </Box>
    </PermissionDialog>
  );
}
