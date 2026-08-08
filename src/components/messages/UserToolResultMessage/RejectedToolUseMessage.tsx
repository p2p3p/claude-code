import * as React from 'react';
import { t } from '../../../utils/i18n/index.js'
import { Text } from '@anthropic/ink';
import { MessageResponse } from '../../MessageResponse.js';

export function RejectedToolUseMessage(): React.ReactNode {
  return (
    <MessageResponse height={1}>
      <Text dimColor>{t('rejectedtoolusemessage.toolUseRejected')}</Text>
    </MessageResponse>
  );
}
