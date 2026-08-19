import React from 'react';
import { Text } from '@anthropic/ink';
import { Select } from './CustomSelect/index.js';
import { t } from '../utils/i18n/index.js';
import { Dialog } from '@anthropic/ink';

export type ChannelDowngradeChoice = 'downgrade' | 'stay' | 'cancel';

type Props = {
  currentVersion: string;
  onChoice: (choice: ChannelDowngradeChoice) => void;
};

/**
 * Dialog shown when switching from latest to stable channel.
 * Allows user to choose whether to downgrade or stay on current version.
 */
export function ChannelDowngradeDialog({ currentVersion, onChoice }: Props): React.ReactNode {
  function handleSelect(value: ChannelDowngradeChoice): void {
    onChoice(value);
  }

  function handleCancel(): void {
    onChoice('cancel');
  }

  return (
    <Dialog title={t('channeldowngradedialog.switchToStableChannel')} onCancel={handleCancel} color="permission" hideBorder hideInputGuide>
      <Text>
        The stable channel may have an older version than what you&apos;re currently running ({currentVersion}).
      </Text>
      <Text dimColor>{t('channelDowngrade.howToHandle')}</Text>
      <Select
        options={[
          {
            label: t('channelDowngrade.allowDowngrade'),
            value: 'downgrade' as ChannelDowngradeChoice},
          {
            label: `Stay on current version (${currentVersion}) until stable catches up`,
            value: 'stay' as ChannelDowngradeChoice},
        ]}
        onChange={handleSelect}
      />
    </Dialog>
  );
}
