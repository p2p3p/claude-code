import { Select } from 'src/components/CustomSelect/index.js';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';

interface ExistingWorkflowStepProps {
  repoName: string;
  onSelectAction: (action: 'update' | 'skip' | 'exit') => void;
}

export function ExistingWorkflowStep({ repoName, onSelectAction }: ExistingWorkflowStepProps) {
  const options = [
    {
      label: t('installGithub.updateWorkflow'),
      value: 'update'},
    {
      label: t('installGithub.skipWorkflow'),
      value: 'skip'},
    {
      label: t('installGithub.exitNoChanges'),
      value: 'exit'},
  ];

  const handleSelect = (value: string) => {
    onSelectAction(value as 'update' | 'skip' | 'exit');
  };

  const handleCancel = () => {
    onSelectAction('exit');
  };

  return (
    <Box flexDirection="column" borderStyle="round" borderDimColor paddingX={1}>
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>{t('installGithub.existingWorkflow')}</Text>
        <Text dimColor>{t('installGithub.repository')} {repoName}</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text>
          {t('installGithub.workflowExists')} <Text color="claude">.github/workflows/claude.yml</Text>
        </Text>
        <Text dimColor>{t('installGithub.whatToDo')}</Text>
      </Box>

      <Box flexDirection="column">
        <Select options={options} onChange={handleSelect} onCancel={handleCancel} />
      </Box>

      <Box marginTop={1}>
        <Text dimColor>{t('installGithub.viewLatestWorkflow')}
          <Text color="claude">https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml</Text>
        </Text>
      </Box>
    </Box>
  );
}
