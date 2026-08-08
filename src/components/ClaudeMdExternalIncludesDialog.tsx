import React, { useCallback } from 'react';
import { logEvent } from 'src/services/analytics/index.js';
import { Box, Dialog, Link, Text } from '@anthropic/ink';
import type { ExternalClaudeMdInclude } from '../utils/claudemd.js';
import { saveCurrentProjectConfig } from '../utils/config.js';
import { t } from '../utils/i18n/index.js';
import { Select } from './CustomSelect/index.js';

type Props = {
  onDone(): void;
  isStandaloneDialog?: boolean;
  externalIncludes?: ExternalClaudeMdInclude[];
};

export function ClaudeMdExternalIncludesDialog({
  onDone,
  isStandaloneDialog,
  externalIncludes,
}: Props): React.ReactNode {
  React.useEffect(() => {
    // Log when dialog is shown
    logEvent('tengu_claude_md_includes_dialog_shown', {});
  }, []);

  const handleSelection = useCallback(
    (value: 'yes' | 'no') => {
      if (value === 'no') {
        logEvent('tengu_claude_md_external_includes_dialog_declined', {});
        // Mark that we've shown the dialog but it was declined
        saveCurrentProjectConfig(current => ({
          ...current,
          hasClaudeMdExternalIncludesApproved: false,
          hasClaudeMdExternalIncludesWarningShown: true,
        }));
      } else {
        logEvent('tengu_claude_md_external_includes_dialog_accepted', {});
        saveCurrentProjectConfig(current => ({
          ...current,
          hasClaudeMdExternalIncludesApproved: true,
          hasClaudeMdExternalIncludesWarningShown: true,
        }));
      }

      onDone();
    },
    [onDone],
  );

  const handleEscape = useCallback(() => {
    handleSelection('no');
  }, [handleSelection]);

  return (
    <Dialog
      title={t('claudeMdExternalIncludes.title')}
      color="warning"
      onCancel={handleEscape}
      hideBorder={!isStandaloneDialog}
      hideInputGuide={!isStandaloneDialog}
    >
      <Text>
        {t('claudeMdExternalIncludes.body')}
      </Text>

      {externalIncludes && externalIncludes.length > 0 && (
        <Box flexDirection="column">
          <Text dimColor>{t('claudeMdExternalIncludes.externalImports')}</Text>
          {externalIncludes.map((include, i) => (
            <Text key={i} dimColor>
              {'  '}
              {include.path}
            </Text>
          ))}
        </Box>
      )}

      <Text dimColor>
        {t('claudeMdExternalIncludes.warning')}{' '}
        <Link url="https://code.claude.com/docs/en/security" />{' '}
      </Text>

      <Select
        options={[
          { label: t('claudeMdExternalIncludes.yes'), value: 'yes' },
          { label: t('claudeMdExternalIncludes.no'), value: 'no' },
        ]}
        onChange={value => handleSelection(value as 'yes' | 'no')}
      />
    </Dialog>
  );
}
