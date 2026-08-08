import type { ToolResultBlockParam } from '@anthropic-ai/sdk/resources/index.mjs';
import React from 'react';
import { CtrlOToExpand } from 'src/components/CtrlOToExpand.js';
import { FallbackToolUseErrorMessage } from 'src/components/FallbackToolUseErrorMessage.js';
import { MessageResponse } from 'src/components/MessageResponse.js';
import { Box, Text } from '@anthropic/ink';
import { getDisplayPath } from 'src/utils/file.js';
import { extractTag } from 'src/utils/messages.js';
import { t } from 'src/utils/i18n/index.js';
import type { Input, Output } from './LSPTool.js';
import { getSymbolAtPosition } from './symbolContext.js';

// Lookup map for operation-specific labels
function getLabelConfig(operation: Input['operation']): { singular: string; plural: string; special?: string } {
  switch (operation) {
    case 'goToDefinition': return { singular: t('toolUI.lsp.definition'), plural: t('toolUI.lsp.definitions') };
    case 'findReferences': return { singular: t('toolUI.lsp.reference'), plural: t('toolUI.lsp.references') };
    case 'documentSymbol': return { singular: t('toolUI.lsp.symbol'), plural: t('toolUI.lsp.symbols') };
    case 'workspaceSymbol': return { singular: t('toolUI.lsp.symbol'), plural: t('toolUI.lsp.symbols') };
    case 'hover': return { singular: t('toolUI.lsp.hoverInfo'), plural: t('toolUI.lsp.hoverInfo'), special: t('toolUI.lsp.hoverAvailable') };
    case 'goToImplementation': return { singular: t('toolUI.lsp.implementation'), plural: t('toolUI.lsp.implementations') };
    case 'prepareCallHierarchy': return { singular: t('toolUI.lsp.callItem'), plural: t('toolUI.lsp.callItems') };
    case 'incomingCalls': return { singular: t('toolUI.lsp.caller'), plural: t('toolUI.lsp.callers') };
    case 'outgoingCalls': return { singular: t('toolUI.lsp.callee'), plural: t('toolUI.lsp.callees') };
    default: return { singular: t('toolUI.lsp.result'), plural: t('toolUI.lsp.results') };
  }
}

/**
 * Reusable component for LSP result summaries with collapsed/expanded views
 */
function LSPResultSummary({
  operation,
  resultCount,
  fileCount,
  content,
  verbose,
}: {
  operation: Input['operation'];
  resultCount: number;
  fileCount: number;
  content: string;
  verbose: boolean;
}): React.ReactNode {
  // Get label configuration for this operation
  const labelConfig = getLabelConfig(operation);
  const countLabel = resultCount === 1 ? labelConfig.singular : labelConfig.plural;

  const primaryText =
    operation === 'hover' && resultCount > 0 && labelConfig.special ? (
      <Text>{labelConfig.special}</Text>
    ) : (
      <Text>
        {t('toolUI.lsp.found')}
        <Text bold>{resultCount} </Text>
        {countLabel}
      </Text>
    );

  const secondaryText =
    fileCount > 1 ? (
      <Text>
        {t('toolUI.lsp.across')}
        <Text bold>{fileCount}</Text>
        {t('toolUI.lsp.acrossSuffix')}
      </Text>
    ) : null;

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
        {secondaryText} {resultCount > 0 && <CtrlOToExpand />}
      </Text>
    </MessageResponse>
  );
}

export function userFacingName(): string {
  return t('toolUI.lsp.name');
}

export function renderToolUseMessage(input: Partial<Input>, { verbose }: { verbose: boolean }): React.ReactNode {
  if (!input.operation) {
    return null;
  }

  const parts: string[] = [];

  // For position-based operations (goToDefinition, findReferences, hover, goToImplementation),
  // show the symbol at the position for better context
  if (
    (input.operation === 'goToDefinition' ||
      input.operation === 'findReferences' ||
      input.operation === 'hover' ||
      input.operation === 'goToImplementation') &&
    input.filePath &&
    input.line !== undefined &&
    input.character !== undefined
  ) {
    // Convert from 1-based (user input) to 0-based (internal file reading)
    const symbol = getSymbolAtPosition(input.filePath, input.line - 1, input.character - 1);
    const displayPath = verbose ? input.filePath : getDisplayPath(input.filePath);

    if (symbol) {
      parts.push(`operation: "${input.operation}"`);
      parts.push(`symbol: "${symbol}"`);
      parts.push(`in: "${displayPath}"`);
    } else {
      parts.push(`operation: "${input.operation}"`);
      parts.push(`file: "${displayPath}"`);
      parts.push(`position: ${input.line}:${input.character}`);
    }

    return parts.join(', ');
  }

  // For other operations (documentSymbol, workspaceSymbol),
  // show operation and file without position details
  parts.push(`operation: "${input.operation}"`);

  if (input.filePath) {
    const displayPath = verbose ? input.filePath : getDisplayPath(input.filePath);
    parts.push(`file: "${displayPath}"`);
  }

  return parts.join(', ');
}

export function renderToolUseErrorMessage(
  result: ToolResultBlockParam['content'],
  { verbose }: { verbose: boolean },
): React.ReactNode {
  if (!verbose && typeof result === 'string' && extractTag(result, 'tool_use_error')) {
    return (
      <MessageResponse>
        <Text color="error">{t('toolUI.lsp.operationFailed')}</Text>
      </MessageResponse>
    );
  }
  return <FallbackToolUseErrorMessage result={result} verbose={verbose} />;
}

export function renderToolResultMessage(
  output: Output,
  _progressMessages: unknown[],
  { verbose }: { verbose: boolean },
): React.ReactNode {
  // Use collapsed/expanded view if we have count information
  if (output.resultCount !== undefined && output.fileCount !== undefined) {
    return (
      <LSPResultSummary
        operation={output.operation}
        resultCount={output.resultCount}
        fileCount={output.fileCount}
        content={output.result}
        verbose={verbose}
      />
    );
  }

  // Fallback for error cases where counts aren't available
  // (e.g., LSP server initialization failures, request errors)
  return (
    <MessageResponse>
      <Text>{output.result}</Text>
    </MessageResponse>
  );
}
