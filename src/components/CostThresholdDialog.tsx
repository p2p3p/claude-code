import React from 'react';
import { Box, Dialog, Link, Text } from '@anthropic/ink';
import { Select } from './CustomSelect/index.js';
import { t } from '../utils/i18n/index.js';

type Props = {
  onDone: () => void;
};

export function CostThresholdDialog({ onDone }: Props): React.ReactNode {
  return (
    <Dialog title={t('costThreshold.title')} onCancel={onDone}>
      <Box flexDirection="column">
        <Text>{t('costThreshold.learnMore')}</Text>
        <Link url="https://code.claude.com/docs/en/costs" />
      </Box>
      <Select
        options={[
          {
            value: 'ok',
            label: t('costThreshold.gotIt'),
          },
        ]}
        onChange={onDone}
      />
    </Dialog>
  );
}
