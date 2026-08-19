import * as React from 'react';
import { Box, Pane, Text, useTheme } from '@anthropic/ink';
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent} from '../../services/analytics/index.js';
import type { LocalJSXCommandCall } from '../../types/command.js';
import { ThemePicker } from '../../components/ThemePicker.js';
import { getGlobalConfig, saveCurrentProjectConfig, saveGlobalConfig } from '../../utils/config.js';
import type { ThemeSetting } from '../../utils/theme.js';
import { t } from '../../utils/i18n/index.js';

/**
 * /onboarding [subcommand]
 *
 * User-facing slash command that re-runs the first-run setup flow. The
 * official v2.1.123 binary advertises `/onboarding` and emits
 * `tengu_onboarding_step` telemetry; this command exposes a clean entry
 * point for re-running individual steps after initial setup.
 *
 * Subcommands:
 *   (none) | full | reset  — clear `hasCompletedOnboarding` so the next
 *                            REPL launch re-runs the full flow, then exit
 *                            with instructions.
 *   theme                  — render the theme picker inline.
 *   trust                  — clear the workspace trust acceptance and
 *                            instruct the user to restart.
 *   model                  — defer to /model (cannot mid-call suspend
 *                            into a separate command's Ink picker; print
 *                            instructions instead).
 *   mcp                    — print MCP setup hints (delegates to /mcp).
 *   status                 — show current onboarding state (theme,
 *                            completion flag, trust, last version).
 */
export type OnboardingSubcommand = 'full' | 'theme' | 'trust' | 'model' | 'mcp' | 'status';

const SUBCOMMANDS: ReadonlySet<OnboardingSubcommand> = new Set(['full', 'theme', 'trust', 'model', 'mcp', 'status']);

function meta(s: string): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return s as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS;
}

export function parseSubcommand(args: string): {
  sub: OnboardingSubcommand;
  unknownArg?: string;
} {
  const trimmed = args.trim().toLowerCase();
  if (trimmed === '' || trimmed === 'reset') {
    return { sub: 'full' };
  }
  if (SUBCOMMANDS.has(trimmed as OnboardingSubcommand)) {
    return { sub: trimmed as OnboardingSubcommand };
  }
  return { sub: 'full', unknownArg: trimmed };
}

function ThemeSubcommand({ onDone }: { onDone: (msg: string) => void }): React.ReactNode {
  const [, setTheme] = useTheme();
  return (
    <Pane color="permission">
      <ThemePicker
        onThemeSelect={(setting: ThemeSetting) => {
          setTheme(setting);
          logEvent('tengu_onboarding_step', { stepId: meta('theme') });
          onDone(t('theme.themeSetTo', setting));
        }}
        onCancel={() => onDone(t('theme.themePickerDismissed'))}
        skipExitHandling={true}
      />
    </Pane>
  );
}

function StatusView({
  theme,
  hasCompletedOnboarding,
  lastOnboardingVersion}: {
  theme: string;
  hasCompletedOnboarding: boolean;
  lastOnboardingVersion: string;
}): React.ReactNode {
  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Text bold>{t('misc.onboardingStatus')}</Text>
      <Text>
        {t('misc.themeLabel')} <Text bold>{theme}</Text>
      </Text>
      <Text>
        {t('misc.onboardingCompleted')}{' '}
        <Text bold color={hasCompletedOnboarding ? 'success' : 'warning'}>
          {hasCompletedOnboarding ? t('common.yes') : t('common.no')}
        </Text>
      </Text>
      <Text>
        {t('misc.lastOnboardingVersion')} <Text bold>{lastOnboardingVersion}</Text>
      </Text>
      <Text dimColor>{t('misc.onboardingStatusHint')}</Text>
    </Box>
  );
}

export const callOnboarding: LocalJSXCommandCall = async (onDone, _context, args) => {
  const { sub, unknownArg } = parseSubcommand(args);
  logEvent('tengu_onboarding_step', { stepId: meta(`slash_${sub}`) });

  if (unknownArg !== undefined) {
    onDone(t('misc.unknownSubcommand', unknownArg),
      { display: 'system' },
    );
    return null;
  }

  if (sub === 'theme') {
    return <ThemeSubcommand onDone={msg => onDone(msg)} />;
  }

  if (sub === 'trust') {
    saveCurrentProjectConfig(current => ({
      ...current,
      hasTrustDialogAccepted: false}));
    onDone(t('misc.workspaceTrustCleared'),
      { display: 'system' },
    );
    return null;
  }

  if (sub === 'model') {
    onDone(t('misc.runModelPick'),
      { display: 'system' },
    );
    return null;
  }

  if (sub === 'mcp') {
    onDone(t('misc.mcpHelp'),
      { display: 'system' },
    );
    return null;
  }

  if (sub === 'status') {
    const cfg = getGlobalConfig();
    return (
      <StatusView
        theme={cfg.theme ?? '(unset)'}
        hasCompletedOnboarding={cfg.hasCompletedOnboarding === true}
        lastOnboardingVersion={cfg.lastOnboardingVersion ?? '(unset)'}
      />
    );
  }

  // sub === 'full'
  // Clearing `hasCompletedOnboarding` causes `showSetupScreens()` (in
  // src/interactiveHelpers.tsx) to render the full Onboarding component
  // on the next launch. We cannot render <Onboarding /> mid-REPL because
  // it owns terminal-setup detection, OAuth flow, and final redirect to
  // the prompt — not safe to mount inside an active REPL session.
  saveGlobalConfig(current => ({
    ...current,
    hasCompletedOnboarding: false}));
  onDone(t('misc.onboardingFullCleared'), { display: 'system' });
  return null;
};
