import type { ToolResultBlockParam } from '@anthropic-ai/sdk/resources/index.mjs';
import React from 'react';
import { CtrlOToExpand } from 'src/components/CtrlOToExpand.js';
import { FallbackToolUseErrorMessage } from 'src/components/FallbackToolUseErrorMessage.js';
import { MessageResponse } from 'src/components/MessageResponse.js';
import { TOOL_SUMMARY_MAX_LENGTH } from 'src/constants/toolLimits.js';
import { Box, Text } from '@anthropic/ink';
import type { ToolProgressData } from 'src/Tool.js';
import type { ProgressMessage } from 'src/types/message.js';
import { FILE_NOT_FOUND_CWD_NOTE, getDisplayPath } from 'src/utils/file.js';
import { truncate } from 'src/utils/format.js';
import { extractTag } from 'src/utils/messages.js';
import { t } from 'src/utils/i18n/index.js';

// Reusable component for search result summaries
function SearchResultSummary({
  primaryText,
  secondaryText,
  content,
  verbose,
}: {
  primaryText: React.ReactNode;
  secondaryText?: React.ReactNode;
  content?: string;
  verbose: boolean;
}): React.ReactNode {

  if (verbose) {
    return (
      <Box flexDirection="column">
        <Box flexDirection="row">
          <Text>
            <Text dimColor>&nbsp;&nbsp;⎿ &nbsp;</Text>
            {primaryText}
            {secondaryText}
          </Text>
        </Box>
        <Box marginLeft={5}>
          <Text>{content}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <MessageResponse height={1}>
      <Text>
        {primaryText}
        {secondaryText} {content && <CtrlOToExpand />}
      </Text>
    </MessageResponse>
  );
}

type Output = {
  mode?: 'content' | 'files_with_matches' | 'count';
  numFiles: number;
  filenames: string[];
  content?: string;
  numLines?: number; // For content mode
  numMatches?: number; // For count mode
};

export function renderToolUseMessage(
  { pattern, path }: Partial<{ pattern: string; path?: string }>,
  { verbose }: { verbose: boolean },
): React.ReactNode {
  if (!pattern) {
    return null;
  }
  const displayPath = path ? (verbose ? path : getDisplayPath(path)) : undefined;
  if (displayPath) {
    return t('toolUI.grep.patternPath', pattern, displayPath);
  }
  return t('toolUI.grep.pattern', pattern);
}

export function renderToolUseErrorMessage(
  result: ToolResultBlockParam['content'],
  { verbose }: { verbose: boolean },
): React.ReactNode {
  if (!verbose && typeof result === 'string' && extractTag(result, 'tool_use_error')) {
    const errorMessage = extractTag(result, 'tool_use_error');
    if (errorMessage?.includes(FILE_NOT_FOUND_CWD_NOTE)) {
      return (
        <MessageResponse>
          <Text color="error">{t('toolUI.grep.fileNotFound')}</Text>
        </MessageResponse>
      );
    }
    return (
      <MessageResponse>
        <Text color="error">{t('toolUI.grep.errorSearching')}</Text>
      </MessageResponse>
    );
  }
  return <FallbackToolUseErrorMessage result={result} verbose={verbose} />;
}

export function renderToolResultMessage(
  { mode = 'files_with_matches', filenames, numFiles, content, numLines, numMatches }: Output,
  _progressMessagesForMessage: ProgressMessage<ToolProgressData>[],
  { verbose }: { verbose: boolean },
): React.ReactNode {
  if (mode === 'content') {
    return (
      <SearchResultSummary
        primaryText={t('toolUI.grep.foundLines', numLines ?? 0)}
        content={content}
        verbose={verbose}
      />
    );
  }

  if (mode === 'count') {
    return (
      <SearchResultSummary
        primaryText={t('toolUI.grep.foundMatches', numMatches ?? 0, numFiles)}
        content={content}
        verbose={verbose}
      />
    );
  }

  // files_with_matches mode
  const fileListContent = filenames.map(filename => filename).join('\n');
  return <SearchResultSummary primaryText={t('toolUI.grep.foundFiles', numFiles)} content={fileListContent} verbose={verbose} />;
}

export function getToolUseSummary(
  input:
    | Partial<{
        pattern: string;
        path?: string;
        glob?: string;
        type?: string;
        output_mode?: 'content' | 'files_with_matches' | 'count';
        head_limit?: number;
      }>
    | undefined,
): string | null {
  if (!input?.pattern) {
    return null;
  }
  return truncate(input.pattern, TOOL_SUMMARY_MAX_LENGTH);
}
