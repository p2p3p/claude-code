import { feature } from 'bun:bundle';
import chalk from 'chalk';
import React from 'react';
import { t } from '../../utils/i18n/index.js';
import { Ansi, Box, Text } from '@anthropic/ink';
import ThemedText from '../design-system/ThemedText.js';
import { useAppState } from '../../state/AppState.js';
import type { PermissionDecision, PermissionDecisionReason } from '../../utils/permissions/PermissionResult.js';
import { permissionRuleValueToString } from '../../utils/permissions/permissionRuleParser.js';
import type { Theme } from '../../utils/theme.js';

export type PermissionRuleExplanationProps = {
  permissionResult: PermissionDecision;
  toolType: 'tool' | 'command' | 'edit' | 'read';
};

type DecisionReasonStrings = {
  reasonString: string;
  configString?: string;
  /** When set, reasonString is plain text rendered with this theme color instead of <Ansi>. */
  themeColor?: keyof Theme;
};

function stringsForDecisionReason(
  reason: PermissionDecisionReason | undefined,
  toolType: 'tool' | 'command' | 'edit' | 'read',
): DecisionReasonStrings | null {
  if (!reason) {
    return null;
  }
  if ((feature('BASH_CLASSIFIER') || feature('TRANSCRIPT_CLASSIFIER')) && reason.type === 'classifier') {
    if (reason.classifier === 'auto-mode') {
      return {
        reasonString: t('permissionRuleExplanation.autoModeClassifierRequiresConfirmation', toolType, reason.reason),
        configString: undefined,
        themeColor: 'error'};
    }
    return {
      reasonString: t('permissionRuleExplanation.classifierRequiresConfirmation', chalk.bold(reason.classifier), toolType, reason.reason),
      configString: undefined};
  }
  switch (reason.type) {
    case 'rule':
      return {
        reasonString: t('permissionRuleExplanation.permissionRuleRequiresConfirmation', chalk.bold(permissionRuleValueToString(reason.rule.ruleValue)), toolType),
        configString: reason.rule.source === 'policySettings' ? undefined : t('permissionRuleExplanation.permissionsToUpdateRules')};
    case 'hook': {
      const hookReasonString = reason.reason ? `:\n${reason.reason}` : '.';
      const sourceLabel = reason.hookSource ? ` ${chalk.dim(`[${reason.hookSource}]`)}` : '';
      return {
        reasonString: t('permissionRuleExplanation.hookRequiresConfirmation', chalk.bold(reason.hookName), toolType, `${hookReasonString}${sourceLabel}`),
        configString: t('permissionRuleExplanation.hooksToUpdate')};
    }
    case 'safetyCheck':
    case 'other':
      return {
        reasonString: reason.reason,
        configString: undefined};
    case 'workingDir':
      return {
        reasonString: reason.reason,
        configString: t('permissionRuleExplanation.permissionsToUpdateRules')};
    default:
      return null;
  }
}

export function PermissionRuleExplanation({
  permissionResult,
  toolType}: PermissionRuleExplanationProps): React.ReactNode {
  const permissionMode = useAppState(s => s.toolPermissionContext.mode);
  const strings = stringsForDecisionReason(permissionResult?.decisionReason, toolType);
  if (!strings) {
    return null;
  }

  const themeColor =
    strings.themeColor ??
    (permissionResult?.decisionReason?.type === 'hook' && permissionMode === 'auto' ? 'warning' : undefined);

  return (
    <Box marginBottom={1} flexDirection="column">
      {themeColor ? (
        <ThemedText color={themeColor}>{strings.reasonString}</ThemedText>
      ) : (
        <Text>
          <Ansi>{strings.reasonString}</Ansi>
        </Text>
      )}
      {strings.configString && <Text dimColor>{strings.configString}</Text>}
    </Box>
  );
}
