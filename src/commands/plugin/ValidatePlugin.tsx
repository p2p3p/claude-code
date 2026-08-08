import figures from 'figures';
import * as React from 'react';
import { useEffect } from 'react';
import { Box, Text } from '@anthropic/ink';
import { errorMessage } from '../../utils/errors.js';
import { logError } from '../../utils/log.js';
import { validateManifest } from '../../utils/plugins/validatePlugin.js';
import { t } from '../../utils/i18n/index.js';

type Props = {
  onComplete: (result?: string) => void;
  path?: string;
};

export function ValidatePlugin({ onComplete, path }: Props): React.ReactNode {
  useEffect(() => {
    async function runValidation() {
      // If no path provided, show usage
      if (!path) {
        onComplete(
          t('pluginUI.validateUsage') + '\n\n' +
            t('pluginUI.validateDescription') + '\n\n' +
            t('pluginUI.examples') + '\n' +
            '  /plugin validate .claude-plugin/plugin.json\n' +
            '  /plugin validate /path/to/plugin-directory\n' +
            '  /plugin validate .\n\n' +
            t('pluginUI.validateDirectoryHint') + '\n' +
            t('pluginUI.validateDirectoryHint2') + '\n\n' +
            t('pluginUI.orFromCli') + '\n' +
            '  claude plugin validate <path>',
        );
        return;
      }

      try {
        const result = await validateManifest(path);

        let output = '';

        // Add header
        output += `${t('pluginUI.validatingManifest', result.fileType, result.filePath)}\n\n`;

        // Show errors
        if (result.errors.length > 0) {
          output += `${figures.cross} ${t('pluginUI.foundErrors', result.errors.length)}\n\n`;

          result.errors.forEach(error => {
            output += `  ${figures.pointer} ${error.path}: ${error.message}\n`;
          });

          output += '\n';
        }

        // Show warnings
        if (result.warnings.length > 0) {
          output += `${figures.warning} ${t('pluginUI.foundWarnings', result.warnings.length)}\n\n`;

          result.warnings.forEach(warning => {
            output += `  ${figures.pointer} ${warning.path}: ${warning.message}\n`;
          });

          output += '\n';
        }

        // Show success or failure
        if (result.success) {
          if (result.warnings.length > 0) {
            output += `${figures.tick} ${t('pluginUI.validationPassedWarnings')}\n`;
          } else {
            output += `${figures.tick} ${t('pluginUI.validationPassed')}\n`;
          }

          // Exit with code 0 (success)
          process.exitCode = 0;
        } else {
          output += `${figures.cross} ${t('pluginUI.validationFailed')}\n`;

          // Exit with code 1 (validation failure)
          process.exitCode = 1;
        }

        onComplete(output);
      } catch (error) {
        // Exit with code 2 (unexpected error)
        process.exitCode = 2;

        logError(error);

        onComplete(`${figures.cross} ${t('pluginUI.unexpectedErrorValidation', errorMessage(error))}`);
      }
    }

    void runValidation();
  }, [onComplete, path]);

  return (
    <Box flexDirection="column">
      <Text>{t('pluginUI.runningValidation')}</Text>
    </Box>
  );
}
