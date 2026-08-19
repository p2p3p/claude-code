/**
 * Confirmation dialog shown when the user runs `/goal <objective>`
 * while a non-complete goal is already active.
 */
import * as React from 'react';

import { Box, Text } from '@anthropic/ink';

import type { GoalState } from 'src/types/logs.js';
import { Select } from 'src/components/CustomSelect/index.js';
import { PermissionDialog } from 'src/components/permissions/PermissionDialog.js';
import { formatGoalElapsed, formatGoalStatusLabel } from 'src/services/goal/goalState.js';
import { t } from '../../utils/i18n/index.js'

type Props = {
  currentGoal: GoalState;
  newObjective: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function GoalReplaceConfirmDialog({ currentGoal, newObjective, onConfirm, onCancel }: Props): React.ReactNode {
  function handleResponse(value: 'yes' | 'no'): void {
    if (value === 'yes') onConfirm();
    else onCancel();
  }

  const tokensDisplay =
    currentGoal.tokenBudget !== null
      ? `${currentGoal.tokensUsed} / ${currentGoal.tokenBudget}`
      : `${currentGoal.tokensUsed}`;

  return (
    <PermissionDialog color="warning" title={t("cmdSystemUI.replaceGoalTitle")}>
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text>{t("cmdSystemUI.replaceGoalBody")}</Text>

        <Box marginTop={1} flexDirection="column">
          <Text dimColor>{t("cmdSystemUI.currentGoal")}</Text>
          <Text>
            <Text dimColor>· {t('cmdSystemUI.goalObjective')}: </Text>
            {currentGoal.objective}
          </Text>
          <Text>
            <Text dimColor>· {t('cmdSystemUI.goalStatus')}: </Text>
            {formatGoalStatusLabel(currentGoal.status)}
          </Text>
          <Text>
            <Text dimColor>· {t('cmdSystemUI.goalTime')}: </Text>
            {formatGoalElapsed(currentGoal)}
          </Text>
          <Text>
            <Text dimColor>· {t('cmdSystemUI.goalTokens')}: </Text>
            {tokensDisplay}
          </Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text dimColor>{t("cmdSystemUI.newObjective")}</Text>
          <Text>{newObjective}</Text>
        </Box>

        <Box marginTop={1}>
          <Select
            options={[
              { label: t('cmdSystemUI.yesReplace'), value: 'yes' as const },
              { label: t('cmdSystemUI.noKeepGoal'), value: 'no' as const },
            ]}
            onChange={handleResponse}
            onCancel={onCancel}
          />
        </Box>
      </Box>
    </PermissionDialog>
  );
}
