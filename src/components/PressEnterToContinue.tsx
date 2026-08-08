import * as React from 'react';
import { Text } from '@anthropic/ink';
import { t } from '../utils/i18n/index.js';

export function PressEnterToContinue(): React.ReactNode {
  return (
    <Text color="permission">
      {t('onboarding.pressEnter')}
    </Text>
  );
}
