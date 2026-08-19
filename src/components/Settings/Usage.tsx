import * as React from 'react';
import { useEffect, useState } from 'react';
import { extraUsage as extraUsageCommand } from 'src/commands/extra-usage/index.js';
import {
  formatCost,
  getModelUsage,
  getTotalAPIDuration,
  getTotalCacheCreationInputTokens,
  getTotalCacheReadInputTokens,
  getTotalCost,
  getTotalDuration,
  getTotalInputTokens,
  getTotalLinesAdded,
  getTotalLinesRemoved,
  getTotalOutputTokens,
  getTotalWebSearchRequests,
  hasUnknownModelCost} from 'src/cost-tracker.js';
import { getSubscriptionType } from 'src/utils/auth.js';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';
import { Box, Text } from '@anthropic/ink';
import { useKeybinding } from '../../keybindings/useKeybinding.js';
import { type ExtraUsage, fetchUtilization, type RateLimit, type Utilization } from '../../services/api/usage.js';
import { formatDuration, formatNumber, formatResetText } from '../../utils/format.js';
import { logError } from '../../utils/log.js';
import { getCanonicalName } from '../../utils/model/model.js';
import { jsonStringify } from '../../utils/slowOperations.js';
import { t } from '../../utils/i18n/index.js';
import { ConfigurableShortcutHint } from '../ConfigurableShortcutHint.js';
import { Byline, ProgressBar } from '@anthropic/ink';
import { isEligibleForOverageCreditGrant, OverageCreditUpsell } from '../LogoV2/OverageCreditUpsell.js';

/**
 * Session-scoped stats — cost, token counts, durations, code changes and
 * per-model usage. These are tracked locally for every session (API key,
 * alternate providers, etc.), so unlike the subscription rate-limit section
 * below they are available to all users.
 */
function SessionStats(): React.ReactNode {
  const added = getTotalLinesAdded();
  const removed = getTotalLinesRemoved();

  const lines: string[] = [
    t('costTracker.totalCost', formatCost(getTotalCost())),
    t('costTracker.totalApiDuration', formatDuration(getTotalAPIDuration())),
    t('costTracker.totalWallDuration', formatDuration(getTotalDuration())),
    t(
      'costTracker.totalCodeChanges',
      formatNumber(added),
      added === 1 ? t('costTracker.line') : t('costTracker.lines'),
      formatNumber(removed),
      removed === 1 ? t('costTracker.line') : t('costTracker.lines'),
    ),
    t(
      'settingsUsage.sessionTokens',
      formatNumber(getTotalInputTokens()),
      formatNumber(getTotalOutputTokens()),
      formatNumber(getTotalCacheReadInputTokens()),
      formatNumber(getTotalCacheCreationInputTokens()),
    ),
  ];

  const webSearches = getTotalWebSearchRequests();
  if (webSearches > 0) {
    lines.push(t('settingsUsage.sessionWebSearch', formatNumber(webSearches)));
  }

  if (hasUnknownModelCost()) {
    lines.push(t('costTracker.unknownCostWarning'));
  }

  const modelUsage = getModelUsage();
  const usageKeys = Object.keys(modelUsage);

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>{t('settingsUsage.sessionStats')}</Text>
      <Box flexDirection="column">
        {lines.map((line, i) => (
          <Text key={i}>{line}</Text>
        ))}
      </Box>
      {usageKeys.length > 0 && (
        <Box flexDirection="column">
          <Text>{t('costTracker.usageByModel')}</Text>
          <Box flexDirection="column">
            {usageKeys.map(model => {
              const usage = modelUsage[model];
              const shortName = getCanonicalName(model);
              const parts = [
                `${formatNumber(usage.inputTokens)} ${t('costTracker.input')}`,
                `${formatNumber(usage.outputTokens)} ${t('costTracker.output')}`,
                `${formatNumber(usage.cacheReadInputTokens)} ${t('costTracker.cacheRead')}`,
                `${formatNumber(usage.cacheCreationInputTokens)} ${t('costTracker.cacheWrite')}`,
              ];
              if (usage.webSearchRequests > 0) {
                parts.push(`${formatNumber(usage.webSearchRequests)} ${t('costTracker.webSearch')}`);
              }
              parts.push(`(${formatCost(usage.costUSD)})`);
              return <Text key={model}>{`  ${shortName}: ${parts.join(', ')}`}</Text>;
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

type LimitBarProps = {
  title: string;
  limit: RateLimit;
  maxWidth: number;
  showTimeInReset?: boolean;
  extraSubtext?: string;
};

function LimitBar({ title, limit, maxWidth, showTimeInReset = true, extraSubtext }: LimitBarProps): React.ReactNode {
  const { utilization, resets_at } = limit;
  if (utilization === null) {
    return null;
  }

  // Calculate usage percentage
  const usedText = `${Math.floor(utilization)}% used`;

  let subtext: string | undefined;
  if (resets_at) {
    subtext = `Resets ${formatResetText(resets_at, true, showTimeInReset)}`;
  }

  if (extraSubtext) {
    if (subtext) {
      subtext = `${extraSubtext} · ${subtext}`;
    } else {
      subtext = extraSubtext;
    }
  }

  const maxBarWidth = 50;
  const usedLabelSpace = 12;
  if (maxWidth >= maxBarWidth + usedLabelSpace) {
    return (
      <Box flexDirection="column">
        <Text bold>{title}</Text>
        <Box flexDirection="row" gap={1}>
          <ProgressBar
            ratio={utilization / 100}
            width={maxBarWidth}
            fillColor="rate_limit_fill"
            emptyColor="rate_limit_empty"
          />
          <Text>{usedText}</Text>
        </Box>
        {subtext && <Text dimColor>{subtext}</Text>}
      </Box>
    );
  } else {
    return (
      <Box flexDirection="column">
        <Text>
          <Text bold>{title}</Text>
          {subtext && (
            <>
              <Text> </Text>
              <Text dimColor>· {subtext}</Text>
            </>
          )}
        </Text>
        <ProgressBar
          ratio={utilization / 100}
          width={maxWidth}
          fillColor="rate_limit_fill"
          emptyColor="rate_limit_empty"
        />
        <Text>{usedText}</Text>
      </Box>
    );
  }
}

export function Usage(): React.ReactNode {
  const [utilization, setUtilization] = useState<Utilization | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { columns } = useTerminalSize();

  const availableWidth = columns - 2; // 2 for screen padding
  const maxWidth = Math.min(availableWidth, 80);

  const loadUtilization = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUtilization();
      setUtilization(data);
    } catch (err) {
      logError(err as Error);
      const axiosError = err as { response?: { data?: unknown } };
      const responseBody = axiosError.response?.data ? jsonStringify(axiosError.response.data) : undefined;
      setError(t('settingsUsage.failedToLoad', responseBody));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUtilization();
  }, [loadUtilization]);

  useKeybinding(
    'settings:retry',
    () => {
      void loadUtilization();
    },
    { context: 'Settings', isActive: !!error && !isLoading },
  );

  if (error) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="error">{t('settingsUsage.error')}: {error}</Text>
        <Text dimColor>
          <Byline>
            <ConfigurableShortcutHint action="settings:retry" context="Settings" fallback="r" description={t('desc.retry')} />
            <ConfigurableShortcutHint action="confirm:no" context="Settings" fallback="Esc" description={t('desc.cancel')} />
          </Byline>
        </Text>
      </Box>
    );
  }

  if (!utilization) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text dimColor>{t('settingsUsage.loading')}</Text>
        <Text dimColor>
          <ConfigurableShortcutHint action="confirm:no" context="Settings" fallback="Esc" description={t('desc.cancel')} />
        </Text>
      </Box>
    );
  }

  // Only Max and Team plans have a Sonnet limit that differs from the weekly
  // limit (see rateLimitMessages.ts). For other plans the bar is redundant.
  // Show for null (unknown plan) to stay consistent with rateLimitMessages.ts,
  // which labels it "Sonnet limit" in that case.
  const subscriptionType = getSubscriptionType();
  const showSonnetBar = subscriptionType === 'max' || subscriptionType === 'team' || subscriptionType === null;

  const limits = [
    {
      title: t('settingsUsage.currentSession'),
      limit: utilization.five_hour},
    {
      title: t('settingsUsage.currentWeekAll'),
      limit: utilization.seven_day},
    ...(showSonnetBar
      ? [
          {
            title: t('settingsUsage.currentWeekSonnet'),
            limit: utilization.seven_day_sonnet},
        ]
      : []),
  ];

  return (
    <Box flexDirection="column" gap={1} width="100%">
      <SessionStats />

      {limits.some(({ limit }) => limit) || <Text dimColor>{t('settingsUsage.onlyAvailableForSubscriptions')}</Text>}

      {limits.map(
        ({ title, limit }) => limit && <LimitBar key={title} title={title} limit={limit} maxWidth={maxWidth} />,
      )}

      {utilization.extra_usage && <ExtraUsageSection extraUsage={utilization.extra_usage} maxWidth={maxWidth} />}

      {isEligibleForOverageCreditGrant() && <OverageCreditUpsell maxWidth={maxWidth} />}

      <Text dimColor>
        <ConfigurableShortcutHint action="confirm:no" context="Settings" fallback="Esc" description={t('desc.cancel')} />
      </Text>
    </Box>
  );
}

type ExtraUsageSectionProps = {
  extraUsage: ExtraUsage;
  maxWidth: number;
};

const EXTRA_USAGE_SECTION_TITLE = t('settingsUsage2.extraUsageTitle');

function ExtraUsageSection({ extraUsage, maxWidth }: ExtraUsageSectionProps): React.ReactNode {
  const subscriptionType = getSubscriptionType();
  const isProOrMax = subscriptionType === 'pro' || subscriptionType === 'max';
  if (!isProOrMax) {
    // Only show to Pro and Max, consistent with claude.ai non-admin usage settings
    return false;
  }

  if (!extraUsage.is_enabled) {
    if (extraUsageCommand.isEnabled()) {
      return (
        <Box flexDirection="column">
          <Text bold>{EXTRA_USAGE_SECTION_TITLE}</Text>
          <Text dimColor>{t('settingsUsage2.extraUsageNotEnabled')}</Text>
        </Box>
      );
    }

    return null;
  }

  if (extraUsage.monthly_limit === null) {
    return (
      <Box flexDirection="column">
        <Text bold>{EXTRA_USAGE_SECTION_TITLE}</Text>
        <Text dimColor>{t('settingsUsage.unlimited')}</Text>
      </Box>
    );
  }

  if (typeof extraUsage.used_credits !== 'number' || typeof extraUsage.utilization !== 'number') {
    return null;
  }

  const formattedUsedCredits = formatCost(extraUsage.used_credits / 100, 2);
  const formattedMonthlyLimit = formatCost(extraUsage.monthly_limit / 100, 2);
  const now = new Date();
  const oneMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return (
    <LimitBar
      title={EXTRA_USAGE_SECTION_TITLE}
      limit={{
        utilization: extraUsage.utilization,
        // Not applicable for enterprises, but for now we don't render this for them
        resets_at: oneMonthReset.toISOString()}}
      showTimeInReset={false}
      extraSubtext={`${formattedUsedCredits} / ${formattedMonthlyLimit} spent`}
      maxWidth={maxWidth}
    />
  );
}
