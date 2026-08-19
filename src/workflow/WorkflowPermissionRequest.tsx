import React, { useCallback, useMemo } from 'react';
import { Box, Text, useTheme } from '@anthropic/ink';
import { getTheme, type Theme } from 'src/utils/theme.js';
import { env } from 'src/utils/env.js';
import { shouldShowAlwaysAllowOptions } from 'src/utils/permissions/permissionsLoader.js';
import { logUnaryEvent } from 'src/utils/unaryLogging.js';
import { t } from '../utils/i18n/index.js';
import { PermissionDialog } from 'src/components/permissions/PermissionDialog.js';
import { PermissionPrompt, type PermissionPromptOption } from 'src/components/permissions/PermissionPrompt.js';
import type { PermissionRequestProps } from 'src/components/permissions/PermissionRequest.js';
import { PermissionRuleExplanation } from 'src/components/permissions/PermissionRuleExplanation.js';

type OptionValue = 'yes' | 'yes-dont-ask-again' | 'no';

/**
 * Permission request UI for the WorkflowTool. Asks the user to confirm
 * executing a workflow script.
 * Follows the MonitorPermissionRequest / FallbackPermissionRequest pattern.
 */
export function WorkflowPermissionRequest({
  toolUseConfirm,
  onDone,
  onReject,
  workerBadge}: PermissionRequestProps): React.ReactNode {
  const [themeName] = useTheme();
  const theme = getTheme(themeName);

  const input = toolUseConfirm.input as {
    workflow: string;
    args?: string;
  };

  const showAlwaysAllowOptions = useMemo(() => shouldShowAlwaysAllowOptions(), []);

  const options: PermissionPromptOption<OptionValue>[] = useMemo(() => {
    const opts: PermissionPromptOption<OptionValue>[] = [
      {
        label: t('workflowPermission.yes'),
        value: 'yes',
        feedbackConfig: { type: 'accept' as const }},
    ];
    if (showAlwaysAllowOptions) {
      opts.push({
        label: (
          <Text>
            {t('workflowPermission.yesDontAsk', toolUseConfirm.tool.name)}
          </Text>
        ),
        value: 'yes-dont-ask-again'});
    }
    opts.push({
      label: t('workflowPermission.no'),
      value: 'no',
      feedbackConfig: { type: 'reject' as const }});
    return opts;
  }, [showAlwaysAllowOptions, toolUseConfirm.tool.name]);

  const handleSelect = useCallback(
    (value: OptionValue, feedback?: string) => {
      switch (value) {
        case 'yes':
          logUnaryEvent({
            completion_type: 'tool_use_single',
            event: 'accept',
            metadata: {
              language_name: 'none',
              message_id: toolUseConfirm.assistantMessage.message.id ?? '',
              platform: env.platform}});
          toolUseConfirm.onAllow(toolUseConfirm.input, [], feedback);
          onDone();
          break;
        case 'yes-dont-ask-again':
          logUnaryEvent({
            completion_type: 'tool_use_single',
            event: 'accept',
            metadata: {
              language_name: 'none',
              message_id: toolUseConfirm.assistantMessage.message.id ?? '',
              platform: env.platform}});
          toolUseConfirm.onAllow(toolUseConfirm.input, [
            {
              type: 'addRules',
              rules: [{ toolName: toolUseConfirm.tool.name }],
              behavior: 'allow',
              destination: 'localSettings'},
          ]);
          onDone();
          break;
        case 'no':
          logUnaryEvent({
            completion_type: 'tool_use_single',
            event: 'reject',
            metadata: {
              language_name: 'none',
              message_id: toolUseConfirm.assistantMessage.message.id ?? '',
              platform: env.platform}});
          toolUseConfirm.onReject(feedback);
          onReject();
          onDone();
          break;
      }
    },
    [toolUseConfirm, onDone, onReject],
  );

  const handleCancel = useCallback(() => {
    logUnaryEvent({
      completion_type: 'tool_use_single',
      event: 'reject',
      metadata: {
        language_name: 'none',
        message_id: toolUseConfirm.assistantMessage.message.id ?? '',
        platform: env.platform}});
    toolUseConfirm.onReject();
    onReject();
    onDone();
  }, [toolUseConfirm, onDone, onReject]);

  return (
    <PermissionDialog title={t('workflowPermission.title')} workerBadge={workerBadge}>
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text bold color={theme.permission as keyof Theme}>
            {t('workflowPermission.executeWorkflow', input.workflow)}
          </Text>
          {input.args && <Text dimColor>{t('workflowPermission.arguments', input.args)}</Text>}
        </Box>
        <PermissionRuleExplanation permissionResult={toolUseConfirm.permissionResult} toolType="command" />
        <PermissionPrompt<OptionValue> options={options} onSelect={handleSelect} onCancel={handleCancel} />
      </Box>
    </PermissionDialog>
  );
}
