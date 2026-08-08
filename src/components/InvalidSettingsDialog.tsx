import React from 'react';
import { Text, Dialog } from '@anthropic/ink';
import type { ValidationError } from '../utils/settings/validation.js';
import { t } from '../utils/i18n/index.js';
import { Select } from './CustomSelect/index.js';
import { ValidationErrorsList } from './ValidationErrorsList.js';

type Props = {
  settingsErrors: ValidationError[];
  onContinue: () => void;
  onExit: () => void;
};

/**
 * Dialog shown when settings files have validation errors.
 * User must choose to continue (skipping invalid files) or exit to fix them.
 */
export function InvalidSettingsDialog({ settingsErrors, onContinue, onExit }: Props): React.ReactNode {
  function handleSelect(value: string): void {
    if (value === 'exit') {
      onExit();
    } else {
      onContinue();
    }
  }

  return (
    <Dialog title={t('invalidsettingsdialog.settingsError')} onCancel={onExit} color="warning">
      <ValidationErrorsList errors={settingsErrors} />
      <Text dimColor>{t('invalidSettings.filesSkipped')}</Text>
      <Select
        options={[
          { label: t('invalidSettings.exitAndFix'), value: 'exit' },
          {
            label: t('invalidSettings.continueWithout'),
            value: 'continue',
          },
        ]}
        onChange={handleSelect}
      />
    </Dialog>
  );
}
