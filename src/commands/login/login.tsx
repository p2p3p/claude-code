import * as React from 'react';
import { resetCostState } from '../../bootstrap/state.js';
import { clearTrustedDeviceToken, enrollTrustedDevice } from '../../bridge/trustedDevice.js';
import type { LocalJSXCommandContext } from '../../commands.js';
import { ConsoleOAuthFlow } from '../../accounts/ui/ConsoleOAuthFlow.js';
import { Box, Dialog, Text } from '@anthropic/ink';
import { useMainLoopModel } from '../../hooks/useMainLoopModel.js';
import { t } from '../../utils/i18n/index.js';
import { refreshGrowthBookAfterAuthChange } from '../../services/analytics/growthbook.js';
import { refreshPolicyLimits } from '../../services/policyLimits/index.js';
import { refreshRemoteManagedSettings } from '../../services/remoteManagedSettings/index.js';
import type { LocalJSXCommandOnDone } from '../../types/command.js';
import { stripSignatureBlocks } from '../../utils/messages.js';
import {
  checkAndDisableAutoModeIfNeeded,
  resetAutoModeGateCheck} from '../../utils/permissions/bypassPermissionsKillswitch.js';
import { resetUserCache } from '../../utils/user.js';

export async function call(onDone: LocalJSXCommandOnDone, context: LocalJSXCommandContext): Promise<React.ReactNode> {
  return (
    <Login
      onDone={async success => {
        context.onChangeAPIKey();
        // Signature-bearing blocks (thinking, connector_text) are bound to the API key —
        // strip them so the new key doesn't reject stale signatures.
        context.setMessages(stripSignatureBlocks);
        if (success) {
          // Post-login refresh logic. Keep in sync with onboarding in src/interactiveHelpers.tsx
          // Reset cost state when switching accounts
          resetCostState();
          // Refresh remotely managed settings after login (non-blocking)
          void refreshRemoteManagedSettings();
          // Refresh policy limits after login (non-blocking)
          void refreshPolicyLimits();
          // Clear user data cache BEFORE GrowthBook refresh so it picks up fresh credentials
          resetUserCache();
          // Refresh GrowthBook after login to get updated feature flags (e.g., for claude.ai MCPs)
          refreshGrowthBookAfterAuthChange();
          // Clear any stale trusted device token from a previous account before
          // re-enrolling — prevents sending the old token on bridge calls while
          // the async enrollTrustedDevice() is in-flight.
          clearTrustedDeviceToken();
          // Enroll as a trusted device for Remote Control (10-min fresh-session window)
          void enrollTrustedDevice();
          // Reset killswitch gate checks and re-run with new org
          resetAutoModeGateCheck();
          const appState = context.getAppState();
          void checkAndDisableAutoModeIfNeeded(appState.toolPermissionContext, context.setAppState, appState.fastMode);
          // Increment authVersion to trigger re-fetching of auth-dependent data in hooks (e.g., MCP servers)
          context.setAppState(prev => ({
            ...prev,
            authVersion: prev.authVersion + 1}));
        }
        onDone(success ? t('ui.loginSuccessful') : t('ui.loginInterrupted'));
      }}
    />
  );
}

export function Login(props: {
  onDone: (success: boolean, mainLoopModel: string) => void;
  startingMessage?: string;
}): React.ReactNode {
  const mainLoopModel = useMainLoopModel();

  // While inside a sub-screen (platform/key editor etc.), disable the Dialog's
  // Esc so it steps back a level instead of closing the whole login.
  const [inSubscreen, setInSubscreen] = React.useState(false);
  const handleSubscreenChange = React.useCallback((sub: boolean) => {
    setInSubscreen(sub);
  }, []);

  return (
    <Dialog
      title={t('login.loginTitle')}
      onCancel={() => props.onDone(false, mainLoopModel)}
      color="permission"
      isCancelActive={!inSubscreen}
      inputGuide={exitState =>
        exitState.pending ? (
          <Text>{t('common.pressAgain', exitState.keyName)}</Text>
        ) : null
      }
    >
      <Box flexDirection="column">
        <ConsoleOAuthFlow
          onDone={(success) => props.onDone(success ?? true, mainLoopModel)}
          startingMessage={props.startingMessage}
          onSubscreenChange={handleSubscreenChange}
        />
      </Box>
    </Dialog>
  );
}