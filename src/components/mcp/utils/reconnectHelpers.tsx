import type { Command } from '../../../commands.js';
import type { MCPServerConnection, ServerResource } from '../../../services/mcp/types.js';
import type { Tool } from '../../../Tool.js';
import { t } from '../../../utils/i18n/index.js';

export interface ReconnectResult {
  message: string;
  success: boolean;
}

/**
 * Handles the result of a reconnect attempt and returns an appropriate user message
 */
export function handleReconnectResult(
  result: {
    client: MCPServerConnection;
    tools: Tool[];
    commands: Command[];
    resources?: ServerResource[];
  },
  serverName: string,
): ReconnectResult {
  switch (result.client.type) {
    case 'connected':
      return {
        message: t('mcpReconnect.reconnected', serverName),
        success: true};

    case 'needs-auth':
      return {
        message: t('mcpReconnect.requiresAuthOption', serverName),
        success: false};

    case 'failed':
      return {
        message: t('reconnect.failedToReconnect', serverName),
        success: false};

    default:
      return {
        message: t('mcpReconnect.unknownResult', serverName),
        success: false};
  }
}

/**
 * Handles errors from reconnect attempts
 */
export function handleReconnectError(error: unknown, serverName: string): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return t('mcpErrors.reconnectError', serverName, errorMessage);
}
