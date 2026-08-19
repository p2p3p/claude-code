import * as React from 'react';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';
import { PromptInputHelpMenu } from '../PromptInput/PromptInputHelpMenu.js';

export function General(): React.ReactNode {
  return (
    <Box flexDirection="column" paddingY={1} gap={1}>
      <Box flexDirection="column" gap={1}>
        <Text bold>{t('help.gettingStarted')}</Text>
        <Box flexDirection="column">
          <Text>
            <Text bold>1. </Text>
            <Text>{t('help.askDesc')}</Text>
          </Text>
          <Text>
            <Text bold>2. </Text>
            <Text>{t('help.reviewDesc')}</Text>
          </Text>
          <Text>
            <Text bold>3. </Text>
            <Text>{t('help.type')}</Text>
            <Text bold>/commit</Text>
            <Text>{t('help.toCommit')}</Text>
            <Text bold>/help</Text>
            <Text>{t('help.forCommands')}</Text>
            <Text bold>?</Text>
            <Text>{t('help.forShortcuts')}</Text>
          </Text>
        </Box>
      </Box>
      <Box flexDirection="column">
        <Box>
          <Text bold>{t('help.shortcuts')}</Text>
        </Box>
        <PromptInputHelpMenu gap={2} fixedWidth={true} />
      </Box>
    </Box>
  );
}
