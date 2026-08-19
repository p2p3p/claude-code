import { t } from '../utils/i18n/index.js';
import sample from 'lodash-es/sample.js';
import React from 'react';
import { gracefulShutdown } from '../utils/gracefulShutdown.js';
import { WorktreeExitDialog } from './WorktreeExitDialog.js';

const GOODBYE_MESSAGES = [t('exitFlow.goodbye'), t('exitFlow.seeYa'), t('exitFlow.bye'), t('exitFlow.catchYouLater')];

function getRandomGoodbyeMessage(): string {
  return sample(GOODBYE_MESSAGES) ?? t('exitFlow.goodbye');
}

type Props = {
  onDone: (message?: string) => void;
  onCancel?: () => void;
  showWorktree: boolean;
};

export function ExitFlow({ showWorktree, onDone, onCancel }: Props): React.ReactNode {
  async function onExit(resultMessage?: string) {
    onDone(resultMessage ?? getRandomGoodbyeMessage());
    await gracefulShutdown(0, 'prompt_input_exit');
  }

  if (showWorktree) {
    return <WorktreeExitDialog onDone={onExit} onCancel={onCancel} />;
  }

  return null;
}
