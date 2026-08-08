import * as React from 'react';
import { Box, Link, Text } from '@anthropic/ink';
import type { ToolProgressData } from 'src/Tool.js';
import type { ProgressMessage } from 'src/types/message.js';
import type { ArtifactOutput } from './ArtifactTool.js';
import { t } from 'src/utils/i18n/index.js';

export function renderToolResultMessage(
  content: ArtifactOutput,
  _progressMessagesForMessage: ProgressMessage<ToolProgressData>[],
  _options: { verbose: boolean; theme?: string },
): React.ReactNode {
  if (content.error) {
    return (
      <Box>
        <Text color="error">{t('toolUI.artifact.uploadFailed', content.error)}</Text>
      </Box>
    );
  }
  if (!content.url) return null;
  return (
    <Box flexDirection="column">
      <Box>
        <Text>
          <Text color="success">↑</Text>{' '}{t('toolUI.artifact.uploaded')}
          <Link url={content.url}>
            <Text color="warning">{content.url}</Text>
          </Link>
        </Text>
      </Box>
      {content.expiresAt ? (
        <Box>
          <Text dimColor>{t('toolUI.artifact.expires')}{content.expiresAt}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
