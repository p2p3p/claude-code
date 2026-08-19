import * as React from 'react';
import { t } from '../../../utils/i18n/index.js'
import { Markdown } from 'src/components/Markdown.js';
import { MessageResponse } from 'src/components/MessageResponse.js';
import { Box, Text } from '@anthropic/ink';

type Props = {
  plan: string;
};

export function RejectedPlanMessage({ plan }: Props): React.ReactNode {
  return (
    <MessageResponse>
      <Box flexDirection="column">
        <Text color="subtle">{t('rejectedplanmessage.userRejectedClaudeAposSPlan')}</Text>
        <Box
          borderStyle="round"
          borderColor="planMode"
          paddingX={1}
          // Necessary for Windows Terminal to render properly
          overflow="hidden"
        >
          <Markdown>{plan}</Markdown>
        </Box>
      </Box>
    </MessageResponse>
  );
}
