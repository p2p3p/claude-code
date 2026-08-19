import React from 'react';
import { MessageResponse } from 'src/components/MessageResponse.js';
import { TOOL_SUMMARY_MAX_LENGTH } from 'src/constants/toolLimits.js';
import { Box, Text } from '@anthropic/ink';
import type { ProgressMessage } from 'src/types/message.js';
import { truncate } from 'src/utils/format.js';
import { t } from 'src/utils/i18n/index.js';
import type { Output, SearchResult, WebSearchProgress } from './WebSearchTool.js';

function getSearchSummary(results: (SearchResult | string | null | undefined)[]): {
  searchCount: number;
  totalResultCount: number;
} {
  let searchCount = 0;
  let totalResultCount = 0;

  for (const result of results) {
    if (result != null && typeof result !== 'string') {
      searchCount++;
      totalResultCount += result.content?.length ?? 0;
    }
  }

  return { searchCount, totalResultCount };
}

export function renderToolUseMessage(
  {
    query,
    allowed_domains,
    blocked_domains,
  }: Partial<{
    query: string;
    allowed_domains?: string[];
    blocked_domains?: string[];
  }>,
  { verbose }: { verbose: boolean },
): React.ReactNode {
  if (!query) {
    return null;
  }

  let message = '';

  if (query) {
    message += `"${query}"`;
  }

  if (verbose) {
    if (allowed_domains && allowed_domains.length > 0) {
      message += t('toolUI.webSearch.onlyAllowing', allowed_domains.join(', '));
    }

    if (blocked_domains && blocked_domains.length > 0) {
      message += t('toolUI.webSearch.blockingDomains', blocked_domains.join(', '));
    }
  }

  return message;
}

export function renderToolUseProgressMessage(progressMessages: ProgressMessage<WebSearchProgress>[]): React.ReactNode {
  if (progressMessages.length === 0) {
    return null;
  }

  const lastProgress = progressMessages[progressMessages.length - 1];
  if (!lastProgress?.data) {
    return null;
  }

  const data = lastProgress.data;

  switch (data.type) {
    case 'query_update':
      return (
        <MessageResponse>
          <Text dimColor>{t('toolUI.webSearch.searching', data.query)}</Text>
        </MessageResponse>
      );
    case 'search_results_received':
      return (
        <MessageResponse>
          <Text dimColor>
            {t('toolUI.webSearch.foundResults', data.resultCount, data.query)}
          </Text>
        </MessageResponse>
      );
    default:
      return null;
  }
}

export function renderToolResultMessage(output: Output): React.ReactNode {
  const { searchCount } = getSearchSummary(output.results ?? []);
  const timeDisplay =
    output.durationSeconds >= 1
      ? `${Math.round(output.durationSeconds)}s`
      : `${Math.round(output.durationSeconds * 1000)}ms`;

  return (
    <Box justifyContent="space-between" width="100%">
      <MessageResponse height={1}>
        <Text>
          {t('toolUI.webSearch.didSearch', searchCount, timeDisplay)}
        </Text>
      </MessageResponse>
    </Box>
  );
}

export function getToolUseSummary(input: Partial<{ query: string }> | undefined): string | null {
  if (!input?.query) {
    return null;
  }
  return truncate(input.query, TOOL_SUMMARY_MAX_LENGTH);
}
