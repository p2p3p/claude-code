import React, { useEffect, useState } from 'react';
import { t } from '../utils/i18n/index.js';
import type { CommandResultDisplay } from '../commands.js';
// eslint-disable-next-line custom-rules/prefer-use-keybindings -- raw input for "any key" dismiss and y/n prompt
import { Box, Text, useInput, LoadingState } from '@anthropic/ink';
import { getDesktopInstallStatus, openCurrentSessionInDesktop } from '../utils/desktopDeepLink.js';
import { openBrowser } from '../utils/browser.js';

import { errorMessage } from '../utils/errors.js';
import { gracefulShutdown } from '../utils/gracefulShutdown.js';
import { flushSessionStorage } from '../utils/sessionStorage.js';

const DESKTOP_DOCS_URL = 'https://clau.de/desktop';

export function getDownloadUrl(): string {
  switch (process.platform) {
    case 'win32':
      return 'https://claude.ai/api/desktop/win32/x64/exe/latest/redirect';
    default:
      return 'https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect';
  }
}

type DesktopHandoffState = 'checking' | 'prompt-download' | 'flushing' | 'opening' | 'success' | 'error';

type Props = {
  onDone: (result?: string, options?: { display?: CommandResultDisplay }) => void;
};

export function DesktopHandoff({ onDone }: Props): React.ReactNode {
  const [state, setState] = useState<DesktopHandoffState>('checking');
  const [error, setError] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string>('');

  // Handle keyboard input for error and prompt-download states
  useInput(input => {
    if (state === 'error') {
      onDone(error ?? t('desktopHandoff.unknownError'), { display: 'system' });
      return;
    }
    if (state === 'prompt-download') {
      if (input === 'y' || input === 'Y') {
        openBrowser(getDownloadUrl()).catch(() => {});
        onDone(t('desktopHandoff.startingDownload', DESKTOP_DOCS_URL), { display: 'system' });
      } else if (input === 'n' || input === 'N') {
        onDone(t('desktopHandoff.desktopAppRequired', DESKTOP_DOCS_URL), { display: 'system' });
      }
    }
  });

  useEffect(() => {
    async function performHandoff(): Promise<void> {
      // Check Desktop install status
      setState('checking');
      const installStatus = await getDesktopInstallStatus();

      if (installStatus.status === 'not-installed') {
        setDownloadMessage(t('desktopHandoff.notInstalled'));
        setState('prompt-download');
        return;
      }

      if (installStatus.status === 'version-too-old') {
        setDownloadMessage(t('desktopHandoff.versionTooOld', installStatus.version, '1.1.2396'));
        setState('prompt-download');
        return;
      }

      // Flush session storage to ensure transcript is fully written
      setState('flushing');
      await flushSessionStorage();

      // Open the deep link (uses claude-dev:// in dev mode)
      setState('opening');
      const result = await openCurrentSessionInDesktop();

      if (!result.success) {
        setError(result.error ?? t('desktopHandoff.failedToOpen'));
        setState('error');
        return;
      }

      // Success - exit the CLI
      setState('success');

      // Give the user a moment to see the success message
      setTimeout(
        async (onDone: Props['onDone']) => {
          onDone(t('desktopHandoff.sessionTransferred'), { display: 'system' });
          await gracefulShutdown(0, 'other');
        },
        500,
        onDone,
      );
    }

    performHandoff().catch(err => {
      setError(errorMessage(err));
      setState('error');
    });
  }, [onDone]);

  if (state === 'error') {
    return (
      <Box flexDirection="column" paddingX={2}>
        <Text color="error">{t('desktopHandoff.error').replace('{error}', error)}</Text>
        <Text dimColor>{t('desktopHandoff.pressAnyKeyContinue')}</Text>
      </Box>
    );
  }

  if (state === 'prompt-download') {
    return (
      <Box flexDirection="column" paddingX={2}>
        <Text>{downloadMessage}</Text>
        <Text>{t('desktopHandoff.downloadNow')}</Text>
      </Box>
    );
  }

  const messages: Record<Exclude<DesktopHandoffState, 'error' | 'prompt-download'>, string> = {
    checking: t('desktopHandoff.checking'),
    flushing: t('desktopHandoff.flushing'),
    opening: t('desktopHandoff.opening'),
    success: t('desktopHandoff.success')};

  return <LoadingState message={messages[state]} />;
}
