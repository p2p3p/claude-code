import figures from 'figures';
import React, { useEffect, useState } from 'react';
import { Box, Text, Dialog } from '@anthropic/ink';
import { logForDebugging } from '../utils/debug.js';
import type { GitFileStatus } from '../utils/git.js';
import { getFileStatus, stashToCleanState } from '../utils/git.js';
import { Select } from './CustomSelect/index.js';
import { Spinner } from './Spinner.js';
import { t } from '../utils/i18n/index.js';

type TeleportStashProps = {
  onStashAndContinue: () => void;
  onCancel: () => void;
};

export function TeleportStash({ onStashAndContinue, onCancel }: TeleportStashProps): React.ReactNode {
  const [gitFileStatus, setGitFileStatus] = useState<GitFileStatus | null>(null);
  const changedFiles = gitFileStatus !== null ? [...gitFileStatus.tracked, ...gitFileStatus.untracked] : [];
  const [loading, setLoading] = useState(true);
  const [stashing, setStashing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load changed files on mount
  useEffect(() => {
    const loadChangedFiles = async () => {
      try {
        const fileStatus = await getFileStatus();
        setGitFileStatus(fileStatus);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logForDebugging(`Error getting changed files: ${errorMessage}`, {
          level: 'error',
        });
        setError(t('teleportStash.failedGetFiles'));
      } finally {
        setLoading(false);
      }
    };

    void loadChangedFiles();
  }, []);

  const handleStash = async () => {
    setStashing(true);
    try {
      logForDebugging('Stashing changes before teleport...');
      const success = await stashToCleanState('Teleport auto-stash');

      if (success) {
        logForDebugging('Successfully stashed changes');
        onStashAndContinue();
      } else {
        setError(t('teleportStash.failedStash'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logForDebugging(`Error stashing changes: ${errorMessage}`, {
        level: 'error',
      });
      setError(t('teleportStash.failedStash'));
    } finally {
      setStashing(false);
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === 'stash') {
      void handleStash();
    } else {
      onCancel();
    }
  };

  if (loading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Spinner />
          <Text> {t('teleportStash.checkingGit')}</Text>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="error">
          {t('teleportStash.error')}{error}
        </Text>
        <Box marginTop={1}>
          <Text dimColor>{t('teleportStash.pressEscape')}</Text>
          <Text bold>{t('teleportStash.escape')}</Text>
          <Text dimColor>{t('teleportStash.toCancel')}</Text>
        </Box>
      </Box>
    );
  }

  const showFileCount = changedFiles.length > 8;

  return (
    <Dialog title={t('teleportStash.title')} onCancel={onCancel}>
      <Text>{t('teleportStash.willSwitch')}</Text>

      <Box flexDirection="column" paddingLeft={2}>
        {changedFiles.length > 0 ? (
          showFileCount ? (
            <Text>{changedFiles.length} {t('teleportStash.filesChanged')}</Text>
          ) : (
            changedFiles.map((file: string, index: number) => <Text key={index}>{file}</Text>)
          )
        ) : (
          <Text dimColor>{t('teleportStash.noChanges')}</Text>
        )}
      </Box>

      <Text>{t('teleportStash.stashPrompt')}</Text>

      {stashing ? (
        <Box>
          <Spinner />
          <Text> {t('teleportStash.stashing')}</Text>
        </Box>
      ) : (
        <Select
          options={[
            { label: t('teleportStash.stashAndContinue'), value: 'stash' },
            { label: t('teleportStash.exit'), value: 'exit' },
          ]}
          onChange={handleSelectChange}
        />
      )}
    </Dialog>
  );
}
