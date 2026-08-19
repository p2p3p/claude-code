import { Box, Text } from '@anthropic/ink';
import type { Workflow } from './types.js';
import { t } from '../../utils/i18n/index.js';

interface CreatingStepProps {
  currentWorkflowInstallStep: number;
  secretExists: boolean;
  useExistingSecret: boolean;
  secretName: string;
  skipWorkflow?: boolean;
  selectedWorkflows: Workflow[];
}

export function CreatingStep({
  currentWorkflowInstallStep,
  secretExists,
  useExistingSecret,
  secretName,
  skipWorkflow = false,
  selectedWorkflows}: CreatingStepProps) {
  const progressSteps = skipWorkflow
    ? [
        t('installGithub.gettingRepoInfo'),
        secretExists && useExistingSecret
          ? t('installGithub.usingExistingSecret')
          : t('installGithub.settingUpSecret', secretName),
      ]
    : [
        t('installGithub.gettingRepoInfo'),
        t('installGithub.creatingBranch'),
        selectedWorkflows.length > 1
          ? t('installGithub.creatingWorkflowFiles')
          : t('installGithub.creatingWorkflowFile'),
        secretExists && useExistingSecret
          ? t('installGithub.usingExistingSecret')
          : t('installGithub.settingUpSecret', secretName),
        t('installGithub.openingPrPage'),
      ];

  return (
    <>
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>{t("cmdSystemUI.installGithubApp")}</Text>
          <Text dimColor>{t('installGithub.createWorkflow')}</Text>
        </Box>
        {progressSteps.map((stepText, index) => {
          let status: 'completed' | 'in-progress' | 'pending' = 'pending';

          if (index < currentWorkflowInstallStep) {
            status = 'completed';
          } else if (index === currentWorkflowInstallStep) {
            status = 'in-progress';
          }

          return (
            <Box key={index}>
              <Text color={status === 'completed' ? 'success' : status === 'in-progress' ? 'warning' : undefined}>
                {status === 'completed' ? '✓ ' : ''}
                {stepText}
                {status === 'in-progress' ? '…' : ''}
              </Text>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
