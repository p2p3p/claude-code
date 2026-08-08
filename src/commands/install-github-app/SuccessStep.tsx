import React from 'react';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js'

type SuccessStepProps = {
  secretExists: boolean;
  useExistingSecret: boolean;
  secretName: string;
  skipWorkflow?: boolean;
};

export function SuccessStep({
  secretExists,
  useExistingSecret,
  secretName,
  skipWorkflow = false,
}: SuccessStepProps): React.ReactNode {
  return (
    <>
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>{t("cmdSystemUI.installGithubApp")}</Text>
          <Text dimColor>{t('installGithub.success')}</Text>
        </Box>
        {!skipWorkflow && <Text color="success">✓ {t('installGithub.workflowCreated')}</Text>}
        {secretExists && useExistingSecret && (
          <Box marginTop={1}>
            <Text color="success">✓ {t('installGithub.usingExistingSecretSuccess')}</Text>
          </Box>
        )}
        {(!secretExists || !useExistingSecret) && (
          <Box marginTop={1}>
            <Text color="success">✓ {t('installGithub.apiKeySaved', secretName)}</Text>
          </Box>
        )}
        <Box marginTop={1}>
          <Text>{t('installGithub.nextSteps')}</Text>
        </Box>
        {skipWorkflow ? (
          <>
            <Text>{t('installGithub.stepInstallApp')}</Text>
            <Text>{t('installGithub.stepWorkflowUnchanged')}</Text>
            <Text>{t('installGithub.stepApiKeyReady')}</Text>
          </>
        ) : (
          <>
            <Text>{t('installGithub.stepPrPage')}</Text>
            <Text>{t('installGithub.stepInstallApp')}</Text>
            <Text>{t('installGithub.stepMergePr')}</Text>
          </>
        )}
      </Box>
      <Box marginLeft={3}>
        <Text dimColor>{t('installGithub.pressAnyKey')}</Text>
      </Box>
    </>
  );
}
