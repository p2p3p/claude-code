import { type ReactNode } from 'react';
import { Box, Byline, KeyboardShortcutHint } from '@anthropic/ink';
import type { SettingSource } from '../../../../utils/settings/constants.js';
import { t } from '../../../../utils/i18n/index.js';
import { ConfigurableShortcutHint } from '../../../ConfigurableShortcutHint.js';
import { Select } from '../../../CustomSelect/select.js';
import { useWizard } from '../../../wizard/index.js';
import { WizardDialogLayout } from '../../../wizard/WizardDialogLayout.js';
import type { AgentWizardData } from '../types.js';

export function LocationStep(): ReactNode {
  const { goNext, updateWizardData, cancel } = useWizard<AgentWizardData>();

  const locationOptions = [
    {
      label: t('agentLocationStep.project'),
      value: 'projectSettings' as SettingSource,
    },
    {
      label: t('agentLocationStep.personal'),
      value: 'userSettings' as SettingSource,
    },
  ];

  return (
    <WizardDialogLayout
      subtitle={t('locationstep.chooseLocation')}
      footerText={
        <Byline>
          <KeyboardShortcutHint shortcut="↑↓" action="navigate" />
          <KeyboardShortcutHint shortcut="Enter" action="select" />
          <ConfigurableShortcutHint action="confirm:no" context="Confirmation" fallback="Esc" description={t('desc.cancel')} />
        </Byline>
      }
    >
      <Box>
        <Select
          key="location-select"
          options={locationOptions}
          onChange={(value: string) => {
            updateWizardData({ location: value as SettingSource });
            goNext();
          }}
          onCancel={() => cancel()}
        />
      </Box>
    </WizardDialogLayout>
  );
}
