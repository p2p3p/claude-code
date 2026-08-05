import figures from 'figures';
import * as React from 'react';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';
import { getPluginTrustMessage } from '../../utils/plugins/marketplaceHelpers.js';

export function PluginTrustWarning(): React.ReactNode {
  const customMessage = getPluginTrustMessage();
  return (
    <Box marginBottom={1}>
      <Text color="claude">{figures.warning} </Text>
      <Text dimColor italic>
        {t('pluginUI.trustWarning')}{customMessage ? ` ${customMessage}` : ''}
      </Text>
    </Box>
  );
}
