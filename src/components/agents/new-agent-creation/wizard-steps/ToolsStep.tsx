import { type ReactNode } from 'react';
import type { Tools } from '../../../../Tool.js';
import { Byline, KeyboardShortcutHint } from '@anthropic/ink';
import { t } from '../../../../utils/i18n/index.js';
import { ConfigurableShortcutHint } from '../../../ConfigurableShortcutHint.js';
import { useWizard } from '../../../wizard/index.js';
import { WizardDialogLayout } from '../../../wizard/WizardDialogLayout.js';
import { ToolSelector } from '../../ToolSelector.js';
import type { AgentWizardData } from '../types.js';

type Props = {
  tools: Tools;
};

export function ToolsStep({ tools }: Props): ReactNode {
  const { goNext, goBack, updateWizardData, wizardData } = useWizard<AgentWizardData>();

  const handleComplete = (selectedTools: string[] | undefined): void => {
    updateWizardData({ selectedTools });
    goNext();
  };

  // Pass through undefined to preserve "all tools" semantic
  // ToolSelector will expand it internally for display purposes
  const initialTools = wizardData.selectedTools;

  return (
    <WizardDialogLayout
      subtitle={t('toolsstep.selectTools')}
      footerText={
        <Byline>
          <KeyboardShortcutHint shortcut="Enter" action={t('shortcutHint.toggleSelection')} />
          <KeyboardShortcutHint shortcut="↑↓" action={t('shortcutHint.navigate')} />
          <ConfigurableShortcutHint action="confirm:no" context="Confirmation" fallback="Esc" description={t('desc.goBack')} />
        </Byline>
      }
    >
      <ToolSelector tools={tools} initialTools={initialTools} onComplete={handleComplete} onCancel={goBack} />
    </WizardDialogLayout>
  );
}
