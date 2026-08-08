import React from 'react';
import { t } from '../../utils/i18n/index.js'
import { Box, Text } from '@anthropic/ink';
import { SandboxManager } from '../../utils/sandbox/sandbox-adapter.js';

export function SandboxDoctorSection(): React.ReactNode {
  if (!SandboxManager.isSupportedPlatform()) {
    return null;
  }

  if (!SandboxManager.isSandboxEnabledInSettings()) {
    return null;
  }

  const depCheck = SandboxManager.checkDependencies();
  const hasErrors = depCheck.errors.length > 0;
  const hasWarnings = depCheck.warnings.length > 0;

  if (!hasErrors && !hasWarnings) {
    return null;
  }

  const statusColor = hasErrors ? ('error' as const) : ('warning' as const);
  const statusText = hasErrors ? 'Missing dependencies' : 'Available (with warnings)';

  return (
    <Box flexDirection="column">
      <Text bold>{t('sandboxdoctorsection.sandbox')}</Text>
      <Text>
        └ Status: <Text color={statusColor}>{statusText}</Text>
      </Text>
      {depCheck.errors.map((e, i) => (
        <Text key={i} color="error">
          └ {e}
        </Text>
      ))}
      {depCheck.warnings.map((w, i) => (
        <Text key={i} color="warning">
          └ {w}
        </Text>
      ))}
      {hasErrors && <Text dimColor>└ {t('sandboxDoctor.runSandbox')}</Text>}
    </Box>
  );
}
