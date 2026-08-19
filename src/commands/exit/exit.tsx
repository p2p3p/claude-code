import { feature } from 'bun:bundle';
import { spawnSync } from 'child_process';
import sample from 'lodash-es/sample.js';
import * as React from 'react';
import { ExitFlow } from '../../components/ExitFlow.js';
import type { LocalJSXCommandOnDone } from '../../types/command.js';
import { isBgSession } from '../../utils/concurrentSessions.js';
import { gracefulShutdown } from '../../utils/gracefulShutdown.js';
import { t } from '../../utils/i18n/index.js';
import { getCurrentWorktreeSession } from '../../utils/worktree.js';

const GOODBYE_MESSAGES = [
  t('exitCmd.goodbye1'),
  t('exitCmd.goodbye2'),
  t('exitCmd.goodbye3'),
  t('exitCmd.goodbye4'),
];

function getRandomGoodbyeMessage(): string {
  return sample(GOODBYE_MESSAGES) ?? GOODBYE_MESSAGES[0]!;
}

export async function call(onDone: LocalJSXCommandOnDone): Promise<React.ReactNode> {
  // Inside a `claude --bg` tmux session: detach instead of kill. The REPL
  // keeps running; `claude attach` can reconnect. Covers /exit, /quit,
  // ctrl+c, ctrl+d — all funnel through here via REPL's handleExit.
  if (feature('BG_SESSIONS') && isBgSession()) {
    onDone();
    spawnSync('tmux', ['detach-client'], { stdio: 'ignore' });
    return null;
  }

  const showWorktree = getCurrentWorktreeSession() !== null;

  if (showWorktree) {
    return <ExitFlow showWorktree={showWorktree} onDone={onDone} onCancel={() => onDone()} />;
  }

  onDone(getRandomGoodbyeMessage());
  await gracefulShutdown(0, 'prompt_input_exit');
  return null;
}
