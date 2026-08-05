import figures from 'figures';
import { homedir } from 'os';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';
import type { Step } from '../../projectOnboardingState.js';
import { formatCreditAmount, getCachedReferrerReward } from '../../services/api/referral.js';
import type { LogOption } from '../../types/logs.js';
import { getCwd } from '../../utils/cwd.js';
import { formatRelativeTimeAgo } from '../../utils/format.js';
import type { FeedConfig, FeedLine } from './Feed.js';

export function createRecentActivityFeed(activities: LogOption[]): FeedConfig {
  const lines: FeedLine[] = activities.map(log => {
    const time = formatRelativeTimeAgo(log.modified);
    const description = log.summary && log.summary !== 'No prompt' ? log.summary : log.firstPrompt;

    return {
      text: description || '',
      timestamp: time,
    };
  });

  return {
    title: t('feed.recent'),
    lines,
    footer: lines.length > 0 ? t('feed.resumeMore') : undefined,
    emptyMessage: t('feed.noRecent'),
  };
}

export function createWhatsNewFeed(releaseNotes: string[]): FeedConfig {
  const lines: FeedLine[] = releaseNotes.map(note => {
    if (process.env.USER_TYPE === 'ant') {
      const match = note.match(/^(\d+\s+\w+\s+ago)\s+(.+)$/);
      if (match) {
        return {
          timestamp: match[1],
          text: match[2] || '',
        };
      }
    }
    return {
      text: note,
    };
  });

  const emptyMessage =
    process.env.USER_TYPE === 'ant'
      ? t('feed.unableToFetch')
      : t('feed.checkChangelog');

  return {
    title: process.env.USER_TYPE === 'ant' ? t('feed.antOnlyCommits') : t('feed.whatsNew'),
    lines,
    footer: lines.length > 0 ? t('feed.releaseNotes') : undefined,
    emptyMessage,
  };
}

export function createProjectOnboardingFeed(steps: Step[]): FeedConfig {
  const enabledSteps = steps
    .filter(({ isEnabled }) => isEnabled)
    .sort((a, b) => Number(a.isComplete) - Number(b.isComplete));

  const lines: FeedLine[] = enabledSteps.map(({ text, isComplete }) => {
    const checkmark = isComplete ? `${figures.tick} ` : '';
    return {
      text: `${checkmark}${text}`,
    };
  });

  const warningText =
    getCwd() === homedir()
      ? t('feed.homeDirWarning')
      : undefined;

  if (warningText) {
    lines.push({
      text: warningText,
    });
  }

  return {
    title: t('feed.tips'),
    lines,
  };
}

export function createGuestPassesFeed(): FeedConfig {
  const reward = getCachedReferrerReward();
  const subtitle = reward
    ? t('feed.shareEarn', formatCreditAmount(reward))
    : t('feed.shareFriends');
  return {
    title: t('feed.guestPasses'),
    lines: [],
    customContent: {
      content: (
        <>
          <Box marginY={1}>
            <Text color="claude">[✻] [✻] [✻]</Text>
          </Box>
          <Text dimColor>{subtitle}</Text>
        </>
      ),
      width: 48,
    },
    footer: t('feed.passesFooter'),
  };
}
