import * as React from 'react';
import { Text } from '@anthropic/ink';
import { t } from '../utils/i18n/index.js';

export function InterruptedByUser(): React.ReactNode {
  return (
    <>
      <Text dimColor>{t('interrupted.label')}</Text>
      {process.env.USER_TYPE === 'ant' ? (
        <Text dimColor>{t('interrupted.antOnlyReportIssue')}</Text>
      ) : (
        <Text dimColor>{t('interrupted.whatShouldClaudeDo')}</Text>
      )}
    </>
  );
}
