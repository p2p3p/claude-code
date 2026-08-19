import React, { useEffect, useState } from 'react';
import { t } from '../utils/i18n/index.js'
import type { CommandResultDisplay } from 'src/commands.js';
import { logEvent } from 'src/services/analytics/index.js';
import { logForDebugging } from 'src/utils/debug.js';
import { Box, Text, Dialog } from '@anthropic/ink';
import { execFileNoThrow } from '../utils/execFileNoThrow.js';
import { getPlansDirectory } from '../utils/plans.js';
import { setCwd } from '../utils/Shell.js';
import { cleanupWorktree, getCurrentWorktreeSession, keepWorktree, killTmuxSession } from '../utils/worktree.js';
import { Select } from './CustomSelect/select.js';
import { Spinner } from './Spinner.js';

// Inline require breaks the cycle this file would otherwise close:
// sessionStorage → commands → exit → ExitFlow → here. All call sites
// are inside callbacks, so the lazy require never sees an undefined import.
function recordWorktreeExit(): void {
  /* eslint-disable @typescript-eslint/no-require-imports */
  (require('../utils/sessionStorage.js') as typeof import('../utils/sessionStorage.js')).saveWorktreeState(null);
  /* eslint-enable @typescript-eslint/no-require-imports */
}

type Props = {
  onDone: (result?: string, options?: { display?: CommandResultDisplay }) => void;
  onCancel?: () => void;
};

export function WorktreeExitDialog({ onDone, onCancel }: Props): React.ReactNode {
  const [status, setStatus] = useState<'loading' | 'asking' | 'keeping' | 'removing' | 'done'>('loading');
  const [changes, setChanges] = useState<string[]>([]);
  const [commitCount, setCommitCount] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string | undefined>();
  const worktreeSession = getCurrentWorktreeSession();

  useEffect(() => {
    async function loadChanges() {
      let changeLines: string[] = [];
      const gitStatus = await execFileNoThrow('git', ['status', '--porcelain']);
      if (gitStatus.stdout) {
        changeLines = gitStatus.stdout.split('\n').filter(_ => _.trim() !== '');
        setChanges(changeLines);
      }

      // Check for commits to eject
      if (worktreeSession) {
        // Get commits in worktree that are not in original branch
        const { stdout: commitsStr } = await execFileNoThrow('git', [
          'rev-list',
          '--count',
          `${worktreeSession.originalHeadCommit}..HEAD`,
        ]);
        const count = parseInt(commitsStr.trim(), 10) || 0;
        setCommitCount(count);

        // If no changes and no commits, clean up silently
        if (changeLines.length === 0 && count === 0) {
          setStatus('removing');
          void cleanupWorktree()
            .then(() => {
              process.chdir(worktreeSession.originalCwd);
              setCwd(worktreeSession.originalCwd);
              recordWorktreeExit();
              getPlansDirectory.cache.clear?.();
              setResultMessage(t('worktreeExit.noChanges'));
            })
            .catch(error => {
              logForDebugging(`Failed to clean up worktree: ${error}`, {
                level: 'error'});
              setResultMessage(t('worktreeExit.cleanupFailed'));
            })
            .then(() => {
              setStatus('done');
            });
          return;
        } else {
          setStatus('asking');
        }
      }
    }
    void loadChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worktreeSession]);

  useEffect(() => {
    if (status === 'done') {
      onDone(resultMessage);
    }
  }, [status, onDone, resultMessage]);

  if (!worktreeSession) {
    onDone(t('worktreeExit.noActiveSession'), { display: 'system' });
    return null;
  }

  if (status === 'loading' || status === 'done') {
    return null;
  }

  async function handleSelect(value: string) {
    if (!worktreeSession) return;

    const hasTmux = Boolean(worktreeSession.tmuxSessionName);

    if (value === 'keep' || value === 'keep-with-tmux') {
      setStatus('keeping');
      logEvent('tengu_worktree_kept', {
        commits: commitCount,
        changed_files: changes.length});
      await keepWorktree();
      process.chdir(worktreeSession.originalCwd);
      setCwd(worktreeSession.originalCwd);
      recordWorktreeExit();
      getPlansDirectory.cache.clear?.();
      if (hasTmux) {
        setResultMessage(
          t('worktreeExit.keptSavedAtWithTmux', {
            path: worktreeSession.worktreePath,
            branch: worktreeSession.worktreeBranch,
            session: worktreeSession.tmuxSessionName}),
        );
      } else {
        setResultMessage(
          t('worktreeExit.keptSavedAt', {
            path: worktreeSession.worktreePath,
            branch: worktreeSession.worktreeBranch}),
        );
      }
      setStatus('done');
    } else if (value === 'keep-kill-tmux') {
      setStatus('keeping');
      logEvent('tengu_worktree_kept', {
        commits: commitCount,
        changed_files: changes.length});
      if (worktreeSession.tmuxSessionName) {
        await killTmuxSession(worktreeSession.tmuxSessionName);
      }
      await keepWorktree();
      process.chdir(worktreeSession.originalCwd);
      setCwd(worktreeSession.originalCwd);
      recordWorktreeExit();
      getPlansDirectory.cache.clear?.();
      setResultMessage(
        t('worktreeExit.keptWithTmux', {
          path: worktreeSession.worktreePath,
          branch: worktreeSession.worktreeBranch}),
      );
      setStatus('done');
    } else if (value === 'remove' || value === 'remove-with-tmux') {
      setStatus('removing');
      logEvent('tengu_worktree_removed', {
        commits: commitCount,
        changed_files: changes.length});
      if (worktreeSession.tmuxSessionName) {
        await killTmuxSession(worktreeSession.tmuxSessionName);
      }
      try {
        await cleanupWorktree();
        process.chdir(worktreeSession.originalCwd);
        setCwd(worktreeSession.originalCwd);
        recordWorktreeExit();
        getPlansDirectory.cache.clear?.();
      } catch (error) {
        logForDebugging(`Failed to clean up worktree: ${error}`, {
          level: 'error'});
        setResultMessage(t('worktreeExit.cleanupFailed'));
        setStatus('done');
        return;
      }
      const tmuxNote = hasTmux ? t('worktreeExit.tmuxTerminated') : '';
      if (commitCount > 0 && changes.length > 0) {
        setResultMessage(
          t('worktreeExit.removedWithCommitsAndChanges', { count: commitCount, note: tmuxNote }),
        );
      } else if (commitCount > 0) {
        setResultMessage(
          t('worktreeExit.removedWithCommits', { count: commitCount, branch: worktreeSession.worktreeBranch, note: tmuxNote }),
        );
      } else if (changes.length > 0) {
        setResultMessage(`${t('worktreeExit.uncommittedDiscarded')}${tmuxNote}`);
      } else {
        setResultMessage(`${t('worktreeExit.removed')}${tmuxNote}`);
      }
      setStatus('done');
    }
  }

  if (status === 'keeping') {
    return (
      <Box flexDirection="row" marginY={1}>
        <Spinner />
        <Text>{t('worktreeExit.keepingWorktree')}</Text>
      </Box>
    );
  }

  if (status === 'removing') {
    return (
      <Box flexDirection="row" marginY={1}>
        <Spinner />
        <Text>{t('worktreeExit.removingWorktree')}</Text>
      </Box>
    );
  }

  const branchName = worktreeSession.worktreeBranch;
  const hasUncommitted = changes.length > 0;
  const hasCommits = commitCount > 0;

  let subtitle = '';
  if (hasUncommitted && hasCommits) {
    subtitle = `You have ${changes.length} uncommitted ${t('singularPlural.file', changes.length)} and ${commitCount} ${t('singularPlural.commit', commitCount)} on ${branchName}. All will be lost if you remove.`;
  } else if (hasUncommitted) {
    subtitle = `You have ${changes.length} uncommitted ${t('singularPlural.file', changes.length)}. These will be lost if you remove the worktree.`;
  } else if (hasCommits) {
    subtitle = `You have ${commitCount} ${t('singularPlural.commit', commitCount)} on ${branchName}. The branch will be deleted if you remove the worktree.`;
  } else {
    subtitle = t('worktreeExit.workingInWorktree');
  }

  function handleCancel() {
    if (onCancel) {
      // Abort exit and return to the session
      onCancel();
      return;
    }
    // Fallback: treat Escape as "keep" if no onCancel provided
    void handleSelect('keep');
  }

  const removeDescription =
    hasUncommitted || hasCommits ? t('ui.allChangesLost') : t('ui.cleanupWorktree');

  const hasTmuxSession = Boolean(worktreeSession.tmuxSessionName);

  const options = hasTmuxSession
    ? [
        {
          label: t('worktreeExit.keepWorktreeAndTmux'),
          value: 'keep-with-tmux',
          description: `Stays at ${worktreeSession.worktreePath}. Reattach with: tmux attach -t ${worktreeSession.tmuxSessionName}`},
        {
          label: t('worktreeExit.keepWorktreeKillTmux'),
          value: 'keep-kill-tmux',
          description: `Keeps worktree at ${worktreeSession.worktreePath}, terminates tmux session.`},
        {
          label: t('worktreeExit.removeWorktreeAndTmux'),
          value: 'remove-with-tmux',
          description: removeDescription},
      ]
    : [
        {
          label: t('worktreeExit.keepWorktree'),
          value: 'keep',
          description: `Stays at ${worktreeSession.worktreePath}`},
        {
          label: t('worktreeExit.removeWorktree'),
          value: 'remove',
          description: removeDescription},
      ];

  const defaultValue = hasTmuxSession ? 'keep-with-tmux' : 'keep';

  return (
    <Dialog title={t('worktreeexitdialog.exitingWorktreeSession')} subtitle={subtitle} onCancel={handleCancel}>
      <Select defaultFocusValue={defaultValue} options={options} onChange={handleSelect} />
    </Dialog>
  );
}
