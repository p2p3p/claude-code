import { type ReactNode } from 'react';
import { t } from '../../../../utils/i18n/index.js';
import { ConfigurableShortcutHint } from '../../../ConfigurableShortcutHint.js';
import { Byline, KeyboardShortcutHint } from '@anthropic/ink';
import { useWizard } from '../../../wizard/index.js';
import { WizardDialogLayout } from '../../../wizard/WizardDialogLayout.js';
import { ModelSelector } from '../../ModelSelector.js';
import type { AgentWizardData } from '../types.js';

export function ModelStep(): ReactNode {
  const { goNext, goBack, updateWizardData, wizardData } = useWizard<AgentWizardData>();

  const handleComplete = (model?: string): void => {
    updateWizardData({ selectedModel: model });
    goNext();
  };

  return (
    <WizardDialogLayout
      subtitle={t('modelstep.selectModel')}
      footerText={
        <Byline>
          <KeyboardShortcutHint shortcut="↑↓" action={t('shortcutHint.navigate')} />
          <KeyboardShortcutHint shortcut="Enter" action={t('shortcutHint.select')} />
          <ConfigurableShortcutHint action="confirm:no" context="Confirmation" fallback="Esc" description={t('desc.goBack')} />
        </Byline>
      }
    >
      <ModelSelector initialModel={wizardData.selectedModel} onComplete={handleComplete} onCancel={goBack} />
    </WizardDialogLayout>
  );
}
