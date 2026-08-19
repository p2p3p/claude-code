import type { ToolResultBlockParam } from '@anthropic-ai/sdk/resources/index.mjs';
import * as React from 'react';
import { extractTag } from 'src/utils/messages.js';
import { FallbackToolUseErrorMessage } from 'src/components/FallbackToolUseErrorMessage.js';

import { MessageResponse } from 'src/components/MessageResponse.js';
import { Text } from '@anthropic/ink';
import { FilePathLink } from 'src/components/FilePathLink.js';
import { FILE_NOT_FOUND_CWD_NOTE, getDisplayPath } from 'src/utils/file.js';
import { formatFileSize } from 'src/utils/format.js';
import { getPlansDirectory } from 'src/utils/plans.js';
import { getTaskOutputDir } from 'src/utils/task/diskOutput.js';
import type { Input, Output } from './FileReadTool.js';
import { t } from 'src/utils/i18n/index.js';

/**
 * Check if a file path is an agent output file and extract the task ID.
 * Agent output files follow the pattern: {projectTempDir}/tasks/{taskId}.output
 */
function getAgentOutputTaskId(filePath: string): string | null {
  const prefix = `${getTaskOutputDir()}/`;
  const suffix = '.output';
  if (filePath.startsWith(prefix) && filePath.endsWith(suffix)) {
    const taskId = filePath.slice(prefix.length, -suffix.length);
    // Validate it looks like a task ID (alphanumeric, reasonable length)
    if (taskId.length > 0 && taskId.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(taskId)) {
      return taskId;
    }
  }
  return null;
}

export function renderToolUseMessage(
  { file_path, offset, limit, pages }: Partial<Input>,
  { verbose }: { verbose: boolean },
): React.ReactNode {
  if (!file_path) {
    return null;
  }

  // For agent output files, return empty string so no parentheses are shown
  // The task ID is displayed separately by AssistantToolUseMessage
  if (getAgentOutputTaskId(file_path)) {
    return '';
  }

  const displayPath = verbose ? file_path : getDisplayPath(file_path);
  if (pages) {
    return (
      <>
        <FilePathLink filePath={file_path}>{displayPath}</FilePathLink>
        {` · ${t('toolUI.fileRead.pages', pages)}`}
      </>
    );
  }
  if (verbose && (offset || limit)) {
    const startLine = offset ?? 1;
    const lineRange = limit ? t('toolUI.fileRead.lines', startLine, startLine + limit - 1) : t('toolUI.fileRead.fromLine', startLine);
    return (
      <>
        <FilePathLink filePath={file_path}>{displayPath}</FilePathLink>
        {` · ${lineRange}`}
      </>
    );
  }
  return <FilePathLink filePath={file_path}>{displayPath}</FilePathLink>;
}

export function renderToolUseTag({ file_path }: Partial<Input>): React.ReactNode {
  const agentTaskId = file_path ? getAgentOutputTaskId(file_path) : null;

  // Show agent task ID for Read tool when reading agent output
  if (!agentTaskId) {
    return null;
  }
  return <Text dimColor> {agentTaskId}</Text>;
}

export function renderToolResultMessage(output: Output): React.ReactNode {
  // TODO: Render recursively
  switch (output.type) {
    case 'image': {
      const { originalSize } = output.file;
      const formattedSize = formatFileSize(originalSize);

      return (
        <MessageResponse height={1}>
          <Text>{t('toolUI.fileRead.readImage', formattedSize)}</Text>
        </MessageResponse>
      );
    }
    case 'notebook': {
      const { cells } = output.file;
      if (!cells || cells.length < 1) {
        return <Text color="error">{t('toolUI.fileRead.noCells')}</Text>;
      }
      return (
        <MessageResponse height={1}>
          <Text>{t('toolUI.fileRead.readCells', cells.length)}</Text>
        </MessageResponse>
      );
    }
    case 'pdf': {
      const { originalSize } = output.file;
      const formattedSize = formatFileSize(originalSize);

      return (
        <MessageResponse height={1}>
          <Text>{t('toolUI.fileRead.readPdf', formattedSize)}</Text>
        </MessageResponse>
      );
    }
    case 'parts': {
      return (
        <MessageResponse height={1}>
          <Text>
            {t('toolUI.fileRead.readPages', output.file.count)} (
            {formatFileSize(output.file.originalSize)})
          </Text>
        </MessageResponse>
      );
    }
    case 'text': {
      const { numLines } = output.file;

      return (
        <MessageResponse height={1}>
          <Text>{t('toolUI.fileRead.readLines', numLines)}</Text>
        </MessageResponse>
      );
    }
    case 'file_unchanged': {
      return (
        <MessageResponse height={1}>
          <Text dimColor>{t('toolUI.fileRead.unchanged')}</Text>
        </MessageResponse>
      );
    }
  }
}

export function renderToolUseErrorMessage(
  result: ToolResultBlockParam['content'],
  { verbose }: { verbose: boolean },
): React.ReactNode {
  if (!verbose && typeof result === 'string') {
    // FileReadTool throws from call() so errors lack <tool_use_error> wrapping —
    // check the raw string directly for the cwd note marker.
    if (result.includes(FILE_NOT_FOUND_CWD_NOTE)) {
      return (
        <MessageResponse>
          <Text color="error">{t('toolUI.fileRead.fileNotFound')}</Text>
        </MessageResponse>
      );
    }
    if (extractTag(result, 'tool_use_error')) {
      return (
        <MessageResponse>
          <Text color="error">{t('toolUI.fileRead.errorReading')}</Text>
        </MessageResponse>
      );
    }
  }
  return <FallbackToolUseErrorMessage result={result} verbose={verbose} />;
}

export function userFacingName(input: Partial<Input> | undefined): string {
  if (input?.file_path?.startsWith(getPlansDirectory())) {
    return t('toolUI.fileRead.nameReadingPlan');
  }
  if (input?.file_path && getAgentOutputTaskId(input.file_path)) {
    return t('toolUI.fileRead.nameReadAgentOutput');
  }
  return t('toolUI.fileRead.nameRead');
}

export function getToolUseSummary(input: Partial<Input> | undefined): string | null {
  if (!input?.file_path) {
    return null;
  }
  // For agent output files, just show the task ID
  const agentTaskId = getAgentOutputTaskId(input.file_path);
  if (agentTaskId) {
    return agentTaskId;
  }
  return getDisplayPath(input.file_path);
}
