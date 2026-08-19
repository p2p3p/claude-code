import * as React from 'react';
import { FLAG_ICON } from '../../constants/figures.js';
import { Box, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js';

/**
 * ANT-ONLY: Banner shown in the transcript that prompts users to report
 * issues via /issue. Appears when friction is detected in the conversation.
 */
export function IssueFlagBanner(): React.ReactNode {
  if (process.env.USER_TYPE !== 'ant') {
    return null;
  }

  return (
    <Box flexDirection="row" marginTop={1} width="100%">
      <Box minWidth={2}>
        <Text color="warning">{FLAG_ICON}</Text>
      </Box>
      <Text>
        <Text dimColor>{t('issueFlagBanner.antOnly')} </Text>
        <Text color="warning" bold>
          {t('componentsUi.issueBannerQuestion')}
        </Text>
        <Text dimColor> /issue {t('componentsUi.issueBannerActions')}</Text>
      </Text>
    </Box>
  );
}
