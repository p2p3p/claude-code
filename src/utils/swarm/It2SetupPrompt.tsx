import React, { useCallback, useEffect, useState } from 'react';
import { t } from '../i18n/index.js'
import { type OptionWithDescription, Select } from '../../components/CustomSelect/index.js';
import { Pane } from '@anthropic/ink';
import { Spinner } from '../../components/Spinner.js';
import { useExitOnCtrlCDWithKeybindings } from '../../hooks/useExitOnCtrlCDWithKeybindings.js';
// eslint-disable-next-line custom-rules/prefer-use-keybindings -- enter to proceed through setup steps
import { Box, Text, useInput } from '@anthropic/ink';
import { useKeybinding } from '../../keybindings/useKeybinding.js';
import {
  detectPythonPackageManager,
  getPythonApiInstructions,
  installIt2,
  markIt2SetupComplete,
  type PythonPackageManager,
  setPreferTmuxOverIterm2,
  verifyIt2Setup,
} from './backends/it2Setup.js';

type SetupStep =
  | 'initial'
  | 'installing'
  | 'install-failed'
  | 'verify-api'
  | 'api-instructions'
  | 'verifying'
  | 'success'
  | 'failed';

type Props = {
  onDone: (result: 'installed' | 'use-tmux' | 'cancelled') => void;
  tmuxAvailable: boolean;
};

export function It2SetupPrompt({ onDone, tmuxAvailable }: Props): React.ReactNode {
  const [step, setStep] = useState<SetupStep>('initial');
  const [packageManager, setPackageManager] = useState<PythonPackageManager | null>(null);
  const [error, setError] = useState<string | null>(null);
  const exitState = useExitOnCtrlCDWithKeybindings();

  // Detect package manager on mount
  useEffect(() => {
    void detectPythonPackageManager().then(pm => {
      setPackageManager(pm);
    });
  }, []);

  const handleCancel = useCallback(() => {
    onDone('cancelled');
  }, [onDone]);

  useKeybinding('confirm:no', handleCancel, {
    context: 'Confirmation',
    isActive: step !== 'installing' && step !== 'verifying',
  });

  // Handle keyboard input for verification step
  useInput((_input, key) => {
    if (step === 'api-instructions' && key.return) {
      setStep('verifying');
      void verifyIt2Setup().then(result => {
        if (result.success) {
          markIt2SetupComplete();
          setStep('success');
          setTimeout(onDone, 1500, 'installed' as const);
        } else {
          setError(result.error || 'Verification failed');
          setStep('failed');
        }
      });
    }
  });

  // Handle installation
  async function handleInstall(): Promise<void> {
    if (!packageManager) {
      setError('No Python package manager found (uvx, pipx, or pip)');
      setStep('failed');
      return;
    }

    setStep('installing');
    const result = await installIt2(packageManager);

    if (result.success) {
      // Show Python API instructions
      setStep('api-instructions');
    } else {
      setError(result.error || 'Installation failed');
      setStep('install-failed');
    }
  }

  // Handle using tmux instead
  function handleUseTmux(): void {
    setPreferTmuxOverIterm2(true);
    onDone('use-tmux');
  }

  // Render based on current step
  const renderContent = (): React.ReactNode => {
    switch (step) {
      case 'initial':
        return renderInitialPrompt();
      case 'installing':
        return renderInstalling();
      case 'install-failed':
        return renderInstallFailed();
      case 'api-instructions':
        return renderApiInstructions();
      case 'verifying':
        return renderVerifying();
      case 'success':
        return renderSuccess();
      case 'failed':
        return renderFailed();
      default:
        return null;
    }
  };

  function renderInitialPrompt(): React.ReactNode {
    const options: OptionWithDescription<string>[] = [
      {
        label: t('it2SetupPrompt.installNow'),
        value: 'install',
        description: packageManager
          ? `Uses ${packageManager} to install the it2 CLI tool`
          : 'Requires Python (uvx, pipx, or pip)',
      },
    ];

    if (tmuxAvailable) {
      options.push({
        label: t('it2SetupPrompt.useTmuxInstead'),
        value: 'tmux',
        description: t('it2SetupPrompt.opensTeammatesTmux'),
      });
    }

    options.push({
      label: t('it2SetupPrompt.cancel'),
      value: 'cancel',
      description: t('it2SetupPrompt.skipTeammate'),
    });

    return (
      <Box flexDirection="column" gap={1}>
        <Text>
          To use native iTerm2 split panes for teammates, you need the <Text bold>it2</Text> CLI tool.
        </Text>
        <Text dimColor>{t('it2setupprompt.thisEnablesTeammatesToAppearAsSplitPanesWithinYourCurrentWindow')}</Text>
        <Box marginTop={1}>
          <Select
            options={options}
            onChange={value => {
              switch (value) {
                case 'install':
                  void handleInstall();
                  break;
                case 'tmux':
                  handleUseTmux();
                  break;
                case 'cancel':
                  onDone('cancelled');
                  break;
              }
            }}
            onCancel={() => onDone('cancelled')}
          />
        </Box>
      </Box>
    );
  }

  function renderInstalling(): React.ReactNode {
    return (
      <Box flexDirection="column" gap={1}>
        <Box>
          <Spinner />
          <Text> Installing it2 using {packageManager}…</Text>
        </Box>
        <Text dimColor>{t('it2setupprompt.thisMayTakeAMoment')}</Text>
      </Box>
    );
  }

  function renderInstallFailed(): React.ReactNode {
    const options: OptionWithDescription<string>[] = [
      {
        label: t('it2SetupPrompt.tryAgain'),
        value: 'retry',
        description: t('it2SetupPrompt.retryInstallation'),
      },
    ];

    if (tmuxAvailable) {
      options.push({
        label: t('it2SetupPrompt.useTmuxInstead'),
        value: 'tmux',
        description: t('it2SetupPrompt.fallsBackTmux'),
      });
    }

    options.push({
      label: t('it2SetupPrompt.cancel'),
      value: 'cancel',
      description: t('it2SetupPrompt.skipTeammate'),
    });

    return (
      <Box flexDirection="column" gap={1}>
        <Text color="error">{t('it2setupprompt.installationFailed')}</Text>
        {error && <Text dimColor>{error}</Text>}
        <Text dimColor>
          You can try installing manually:{' '}
          {packageManager === 'uvx'
            ? 'uv tool install it2'
            : packageManager === 'pipx'
              ? 'pipx install it2'
              : 'pip install --user it2'}
        </Text>
        <Box marginTop={1}>
          <Select
            options={options}
            onChange={value => {
              switch (value) {
                case 'retry':
                  void handleInstall();
                  break;
                case 'tmux':
                  handleUseTmux();
                  break;
                case 'cancel':
                  onDone('cancelled');
                  break;
              }
            }}
            onCancel={() => onDone('cancelled')}
          />
        </Box>
      </Box>
    );
  }

  function renderApiInstructions(): React.ReactNode {
    const instructions = getPythonApiInstructions();
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="success">✓ it2 installed successfully</Text>
        <Box flexDirection="column" marginTop={1}>
          {instructions.map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Enter when ready to verify…</Text>
        </Box>
      </Box>
    );
  }

  function renderVerifying(): React.ReactNode {
    return (
      <Box>
        <Spinner />
        <Text> Verifying it2 can communicate with iTerm2…</Text>
      </Box>
    );
  }

  function renderSuccess(): React.ReactNode {
    return (
      <Box flexDirection="column">
        <Text color="success">✓ iTerm2 split pane support is ready</Text>
        <Text dimColor>{t('it2setupprompt.teammatesWillNowAppearAsSplitPanes')}</Text>
      </Box>
    );
  }

  function renderFailed(): React.ReactNode {
    const options: OptionWithDescription<string>[] = [
      {
        label: t('it2SetupPrompt.tryAgain'),
        value: 'retry',
        description: t('it2SetupPrompt.verifyConnection'),
      },
    ];

    if (tmuxAvailable) {
      options.push({
        label: t('it2SetupPrompt.useTmuxInstead'),
        value: 'tmux',
        description: t('it2SetupPrompt.fallsBackTmux'),
      });
    }

    options.push({
      label: t('it2SetupPrompt.cancel'),
      value: 'cancel',
      description: t('it2SetupPrompt.skipTeammate'),
    });

    return (
      <Box flexDirection="column" gap={1}>
        <Text color="error">{t('it2setupprompt.verificationFailed')}</Text>
        {error && <Text dimColor>{error}</Text>}
        <Text>{t('it2setupprompt.makeSure')}</Text>
        <Box flexDirection="column" paddingLeft={2}>
          <Text>· Python API is enabled in iTerm2 preferences</Text>
          <Text>· You may need to restart iTerm2 after enabling</Text>
        </Box>
        <Box marginTop={1}>
          <Select
            options={options}
            onChange={value => {
              switch (value) {
                case 'retry':
                  setStep('verifying');
                  void verifyIt2Setup().then(result => {
                    if (result.success) {
                      markIt2SetupComplete();
                      setStep('success');
                      setTimeout(onDone, 1500, 'installed' as const);
                    } else {
                      setError(result.error || 'Verification failed');
                      setStep('failed');
                    }
                  });
                  break;
                case 'tmux':
                  handleUseTmux();
                  break;
                case 'cancel':
                  onDone('cancelled');
                  break;
              }
            }}
            onCancel={() => onDone('cancelled')}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Pane color="permission">
      <Box flexDirection="column" gap={1} paddingBottom={1}>
        <Text bold color="permission">
          iTerm2 Split Pane Setup
        </Text>
        {renderContent()}
        {step !== 'installing' && step !== 'verifying' && step !== 'success' && (
          <Text dimColor italic>
            {exitState.pending ? <>Press {exitState.keyName} again to exit</> : <>{t('it2setupprompt.escToCancel')}</>}
          </Text>
        )}
      </Box>
    </Pane>
  );
}
