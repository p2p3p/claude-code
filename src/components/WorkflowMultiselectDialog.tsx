import React, { useCallback, useState } from 'react';
import type { Workflow } from '../commands/install-github-app/types.js';
import type { ExitState } from '../hooks/useExitOnCtrlCDWithKeybindings.js';
import { Box, Link, Text, Byline, Dialog, KeyboardShortcutHint } from '@anthropic/ink';
import { t } from '../utils/i18n/index.js';
import { ConfigurableShortcutHint } from './ConfigurableShortcutHint.js';
import { SelectMulti } from './CustomSelect/SelectMulti.js';

type WorkflowOption = {
  value: Workflow;
  label: string;
};

type Props = {
  onSubmit: (selectedWorkflows: Workflow[]) => void;
  defaultSelections: Workflow[];
};

const WORKFLOWS: WorkflowOption[] = [
  {
    value: 'claude' as const,
    label: t('workflowMultiselect.workflowClaude')},
  {
    value: 'claude-review' as const,
    label: t('workflowMultiselect.workflowReview')},
];

function renderInputGuide(exitState: ExitState): React.ReactNode {
  if (exitState.pending) {
    return <Text>{t('common.pressAgain', exitState.keyName)}</Text>;
  }
  return (
    <Byline>
      <KeyboardShortcutHint shortcut="↑↓" action={t('shortcutHint.navigate')} />
      <KeyboardShortcutHint shortcut="Space" action={t('shortcutHint.toggle')} />
      <KeyboardShortcutHint shortcut="Enter" action={t('shortcutHint.confirm')} />
      <ConfigurableShortcutHint action="confirm:no" context="Confirmation" fallback="Esc" description={t('desc.cancel')} />
    </Byline>
  );
}

export function WorkflowMultiselectDialog({ onSubmit, defaultSelections }: Props): React.ReactNode {
  const [showError, setShowError] = useState(false);

  const handleSubmit = useCallback(
    (selectedValues: Workflow[]) => {
      if (selectedValues.length === 0) {
        setShowError(true);
        return;
      }
      setShowError(false);
      onSubmit(selectedValues);
    },
    [onSubmit],
  );

  const handleChange = useCallback(() => {
    setShowError(false);
  }, []);

  // Cancel just shows the error - user must select at least one workflow
  const handleCancel = useCallback(() => {
    setShowError(true);
  }, []);

  return (
    <Dialog
      title={t('workflowmultiselectdialog.selectGitHubWorkflowsToInstall')}
      subtitle={t('workflowmultiselectdialog.weLlCreateAWorkflowFileInYourRepositoryForEachOneYouSelect')}
      onCancel={handleCancel}
      inputGuide={renderInputGuide}
    >
      <Box>
        <Text dimColor>
          More workflow examples (issue triage, CI fixes, etc.) at:{' '}
          <Link url="https://github.com/anthropics/claude-code-action/blob/main/examples/">
            https://github.com/anthropics/claude-code-action/blob/main/examples/
          </Link>
        </Text>
      </Box>

      <SelectMulti
        options={WORKFLOWS.map(workflow => ({
          label: workflow.label,
          value: workflow.value}))}
        defaultValue={defaultSelections}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCancel={handleCancel}
        hideIndexes
      />

      {showError && (
        <Box>
          <Text color="error">{t('workflowmultiselectdialog.youMustSelectAtLeastOneWorkflowToContinue')}</Text>
        </Box>
      )}
    </Dialog>
  );
}
