import React, { useEffect, useState } from 'react';
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent,
} from 'src/services/analytics/index.js';
import { Box, Link, Text, useInput } from '@anthropic/ink';
import {
  type AccountSettings,
  calculateShouldShowGrove,
  type GroveConfig,
  getGroveNoticeConfig,
  getGroveSettings,
  markGroveNoticeViewed,
  updateGroveSettings,
} from '../../services/api/grove.js';
import { Select } from '../CustomSelect/index.js';
import { Byline, Dialog, KeyboardShortcutHint } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';

export type GroveDecision = 'accept_opt_in' | 'accept_opt_out' | 'defer' | 'escape' | 'skip_rendering';

type Props = {
  showIfAlreadyViewed: boolean;
  location: 'settings' | 'policy_update_modal' | 'onboarding';
  onDone(decision: GroveDecision): void;
};

const NEW_TERMS_ASCII = ` _____________
 |          \\  \\
 | NEW TERMS \\__\\
 |              |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |  ----------  |
 |              |
 |______________|`;

function GracePeriodContentBody(): React.ReactNode {
  return (
    <>
      <Text>
        {t('grove.gracePeriodBody')}
      </Text>

      <Box flexDirection="column">
        <Text>{t('grove.whatsChanging')}</Text>

        <Box paddingLeft={1}>
          <Text>
            <Text>· </Text>
            <Text bold>{t('grove.helpImproveClaude')} </Text>
            <Text>
              — {t('grove.helpImproveDesc')} (<Link url={'https://claude.ai/settings/data-privacy-controls'}></Link>
              ).
            </Text>
          </Text>
        </Box>
        <Box paddingLeft={1}>
          <Text>
            <Text>· </Text>
            <Text bold>{t('grove.dataRetention')} </Text>
            <Text>
              — {t('grove.dataRetentionDesc')}
            </Text>
          </Text>
        </Box>
      </Box>

      <Text>
        {t('grove.learnMore')} (<Link url={'https://www.anthropic.com/news/updates-to-our-consumer-terms'}></Link>)
      </Text>
    </>
  );
}

function PostGracePeriodContentBody(): React.ReactNode {
  return (
    <>
      <Text>{t('grove.postGraceBody')}</Text>

      <Box flexDirection="column" gap={1}>
        <Text>{t('grove.whatsChanging')}</Text>

        <Box flexDirection="column">
          <Text bold>{t('grove.helpImproveClaudeSetting')}</Text>
          <Text>
            {t('grove.helpImproveDesc')}
          </Text>
          <Link url={'https://claude.ai/settings/data-privacy-controls'}></Link>
        </Box>

        <Box flexDirection="column">
          <Text bold>{t('grove.dataRetentionHow')}</Text>
          <Text>
            {t('grove.dataRetentionHowDesc')}
          </Text>
        </Box>
      </Box>

      <Text>
        {t('grove.learnMore')} (<Link url={'https://www.anthropic.com/news/updates-to-our-consumer-terms'}></Link>)
      </Text>
    </>
  );
}

export function GroveDialog({ showIfAlreadyViewed, location, onDone }: Props): React.ReactNode {
  const [shouldShowDialog, setShouldShowDialog] = useState<boolean | null>(null);
  const [groveConfig, setGroveConfig] = useState<GroveConfig | null>(null);

  useEffect(() => {
    async function checkGroveSettings() {
      const [settingsResult, configResult] = await Promise.all([getGroveSettings(), getGroveNoticeConfig()]);

      // Extract config data if successful, otherwise null
      const config = configResult.success ? configResult.data : null;
      setGroveConfig(config);

      // Determine if we should show the dialog (returns false on API failure)
      const shouldShow = calculateShouldShowGrove(settingsResult, configResult, showIfAlreadyViewed);

      setShouldShowDialog(shouldShow);
      // If we shouldn't show the dialog, immediately call onDone
      if (!shouldShow) {
        onDone('skip_rendering');
        return;
      }
      // Mark as viewed every time we show the dialog (for reminder frequency tracking)
      void markGroveNoticeViewed();
      // Log that the Grove policy dialog was shown
      logEvent('tengu_grove_policy_viewed', {
        location: location as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        dismissable: config?.notice_is_grace_period as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      });
    }

    void checkGroveSettings();
  }, [showIfAlreadyViewed, location, onDone]);

  // Loading state
  if (shouldShowDialog === null) {
    return null;
  }

  // User has already set preferences, don't show dialog
  if (!shouldShowDialog) {
    return null;
  }

  async function onChange(value: 'accept_opt_in' | 'accept_opt_out' | 'defer' | 'escape') {
    switch (value) {
      case 'accept_opt_in': {
        await updateGroveSettings(true);
        logEvent('tengu_grove_policy_submitted', {
          state: true,
          dismissable:
            groveConfig?.notice_is_grace_period as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        });
        break;
      }
      case 'accept_opt_out': {
        await updateGroveSettings(false);
        logEvent('tengu_grove_policy_submitted', {
          state: false,
          dismissable:
            groveConfig?.notice_is_grace_period as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        });
        break;
      }
      case 'defer':
        logEvent('tengu_grove_policy_dismissed', {
          state: true,
        });
        break;
      case 'escape':
        logEvent('tengu_grove_policy_escaped', {});
        break;
    }

    onDone(value);
  }

  const acceptOptions = groveConfig?.domain_excluded
    ? [
        {
          label: t('grove.acceptOffDomain'),
          value: 'accept_opt_out',
        },
      ]
    : [
        {
          label: t('grove.acceptOn'),
          value: 'accept_opt_in',
        },
        {
          label: t('grove.acceptOff'),
          value: 'accept_opt_out',
        },
      ];

  function handleCancel(): void {
    if (groveConfig?.notice_is_grace_period) {
      void onChange('defer');
      return;
    }
    void onChange('escape');
  }

  return (
    <Dialog
      title={t('grove.title')}
      color="professionalBlue"
      onCancel={handleCancel}
      inputGuide={exitState =>
        exitState.pending ? (
          <Text>{t('grove.pressAgain', exitState.keyName)}</Text>
        ) : (
          <Byline>
            <KeyboardShortcutHint shortcut="Enter" action="confirm" />
            <KeyboardShortcutHint shortcut="Esc" action="cancel" />
          </Byline>
        )
      }
    >
      <Box flexDirection="row">
        <Box flexDirection="column" gap={1} flexGrow={1}>
          {groveConfig?.notice_is_grace_period ? <GracePeriodContentBody /> : <PostGracePeriodContentBody />}
        </Box>
        <Box flexShrink={0}>
          <Text color="professionalBlue">{NEW_TERMS_ASCII}</Text>
        </Box>
      </Box>

      <Box flexDirection="column" gap={1}>
        <Box flexDirection="column">
          <Text bold>{t('grove.selectHow')}</Text>
          <Text>{t('grove.takesEffect')}</Text>
        </Box>

        <Select
          options={[
            ...acceptOptions,
            // Only show "Not now" if in grace period
            ...(groveConfig?.notice_is_grace_period ? [{ label: t('grove.notNow'), value: 'defer' }] : []),
          ]}
          onChange={value => onChange(value as 'accept_opt_in' | 'accept_opt_out' | 'defer')}
          onCancel={handleCancel}
        />
      </Box>
    </Dialog>
  );
}

type PrivacySettingsDialogProps = {
  settings: AccountSettings;
  domainExcluded?: boolean;
  onDone(): void;
};

export function PrivacySettingsDialog({
  settings,
  domainExcluded,
  onDone,
}: PrivacySettingsDialogProps): React.ReactNode {
  const [groveEnabled, setGroveEnabled] = useState(settings.grove_enabled);

  React.useEffect(() => {
    logEvent('tengu_grove_privacy_settings_viewed', {});
  }, []);

  useInput(async (input, key) => {
    // Toggle the setting when enter/tab/space is pressed
    if (!domainExcluded && (key.tab || key.return || input === ' ')) {
      const newValue = !groveEnabled;
      setGroveEnabled(newValue);
      await updateGroveSettings(newValue);
    }
  });

  let valueComponent = <Text color="error">false</Text>;
  if (domainExcluded) {
    valueComponent = <Text color="error">{t('grove.falseForDomain')}</Text>;
  } else if (groveEnabled) {
    valueComponent = <Text color="success">true</Text>;
  }

  return (
    <Dialog
      title={t('grove.dataPrivacy')}
      color="professionalBlue"
      onCancel={onDone}
      inputGuide={exitState =>
        exitState.pending ? (
          <Text>{t('grove.pressAgain', exitState.keyName)}</Text>
        ) : domainExcluded ? (
          <KeyboardShortcutHint shortcut="Esc" action="cancel" />
        ) : (
          <Byline>
            <KeyboardShortcutHint shortcut="Enter/Tab/Space" action="toggle" />
            <KeyboardShortcutHint shortcut="Esc" action="cancel" />
          </Byline>
        )
      }
    >
      <Text>
        {t('grove.reviewSettings')}{' '}
        <Link url={'https://claude.ai/settings/data-privacy-controls'}></Link>
      </Text>

      <Box>
        <Box width={44}>
          <Text bold>{t('grove.helpImproveLabel')}</Text>
        </Box>
        <Box>{valueComponent}</Box>
      </Box>
    </Dialog>
  );
}
