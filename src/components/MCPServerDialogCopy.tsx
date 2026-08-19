import React from 'react';
import { t } from '../utils/i18n/index.js'
import { Link, Text } from '@anthropic/ink';

export function MCPServerDialogCopy(): React.ReactNode {
  return (
    <Text>
      MCP servers may execute code or access system resources. All tool calls require approval. Learn more in the{' '}
      <Link url="https://code.claude.com/docs/en/mcp">{t('mcpserverdialogcopy.mCPDocumentation')}</Link>.
    </Text>
  );
}
