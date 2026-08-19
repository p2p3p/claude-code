import * as React from 'react';
import { t } from '../../utils/i18n/index.js'
import { Box, Text } from '@anthropic/ink';
import { SandboxManager, shouldAllowManagedSandboxDomainsOnly } from '../../utils/sandbox/sandbox-adapter.js';

export function SandboxConfigTab(): React.ReactNode {
  const isEnabled = SandboxManager.isSandboxingEnabled();

  // Show warnings (e.g., seccomp not available on Linux)
  const depCheck = SandboxManager.checkDependencies();
  const warningsNote =
    depCheck.warnings.length > 0 ? (
      <Box marginTop={1} flexDirection="column">
        {depCheck.warnings.map((w, i) => (
          <Text key={i} dimColor>
            {w}
          </Text>
        ))}
      </Box>
    ) : null;

  if (!isEnabled) {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Text color="subtle">{t('sandboxconfigtab.sandboxIsNotEnabled')}</Text>
        {warningsNote}
      </Box>
    );
  }

  const fsReadConfig = SandboxManager.getFsReadConfig();
  const fsWriteConfig = SandboxManager.getFsWriteConfig();
  const networkConfig = SandboxManager.getNetworkRestrictionConfig();
  const allowUnixSockets = SandboxManager.getAllowUnixSockets();
  const excludedCommands = SandboxManager.getExcludedCommands();
  const globPatternWarnings = SandboxManager.getLinuxGlobPatternWarnings();

  return (
    <Box flexDirection="column" paddingY={1}>
      {/* Excluded Commands */}
      <Box flexDirection="column">
        <Text bold color="permission">
          {t('ui.excludedCommands')}
        </Text>
        <Text dimColor>{excludedCommands.length > 0 ? excludedCommands.join(', ') : t('ui.none')}</Text>
      </Box>

      {/* Filesystem Read Restrictions */}
      {fsReadConfig.denyOnly.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color="permission">
            {t('ui.fsReadRestrictions')}
          </Text>
          <Text dimColor>{t('ui.denied', fsReadConfig.denyOnly.join(', '))}</Text>
          {fsReadConfig.allowWithinDeny && fsReadConfig.allowWithinDeny.length > 0 && (
            <Text dimColor>{t('ui.allowedWithinDenied', fsReadConfig.allowWithinDeny.join(', '))}</Text>
          )}
        </Box>
      )}

      {/* Filesystem Write Restrictions */}
      {fsWriteConfig.allowOnly.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color="permission">
            {t('ui.fsWriteRestrictions')}
          </Text>
          <Text dimColor>{t('ui.allowed', fsWriteConfig.allowOnly.join(', '))}</Text>
          {fsWriteConfig.denyWithinAllow.length > 0 && (
            <Text dimColor>{t('ui.deniedWithinAllowed', fsWriteConfig.denyWithinAllow.join(', '))}</Text>
          )}
        </Box>
      )}

      {/* Network Restrictions */}
      {((networkConfig.allowedHosts && networkConfig.allowedHosts.length > 0) ||
        (networkConfig.deniedHosts && networkConfig.deniedHosts.length > 0)) && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color="permission">
            {t('ui.networkRestrictions')}{shouldAllowManagedSandboxDomainsOnly() ? t('ui.managedLabel') : ''}:
          </Text>
          {networkConfig.allowedHosts && networkConfig.allowedHosts.length > 0 && (
            <Text dimColor>{t('ui.allowed', networkConfig.allowedHosts.join(', '))}</Text>
          )}
          {networkConfig.deniedHosts && networkConfig.deniedHosts.length > 0 && (
            <Text dimColor>{t('ui.denied', networkConfig.deniedHosts.join(', '))}</Text>
          )}
        </Box>
      )}

      {/* Unix Sockets */}
      {allowUnixSockets && allowUnixSockets.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color="permission">
            {t('ui.allowedUnixSockets')}
          </Text>
          <Text dimColor>{allowUnixSockets.join(', ')}</Text>
        </Box>
      )}

      {/* Linux Glob Pattern Warning */}
      {globPatternWarnings.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color="warning">
            {t('ui.globPatternWarning')}
          </Text>
          <Text dimColor>
            {t('ui.patternsWillBeIgnored', globPatternWarnings.slice(0, 3).join(', '))}
            {globPatternWarnings.length > 3 && t('ui.andMore', globPatternWarnings.length - 3)}
          </Text>
        </Box>
      )}

      {warningsNote}
    </Box>
  );
}
