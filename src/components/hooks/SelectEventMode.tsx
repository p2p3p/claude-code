/**
 * SelectEventMode is the entrypoint of the Hooks config menu, where the user
 * sees the list of available hook events.
 *
 * The /hooks menu is read-only: selecting an event lets you browse its
 * configured hooks but not modify them. To add or change hooks, users should
 * edit settings.json directly or ask Claude.
 */

import figures from 'figures';
import { t } from '../../utils/i18n/index.js'
import * as React from 'react';
import type { HookEvent } from 'src/entrypoints/agentSdkTypes.js';
import type { HookEventMetadata } from 'src/utils/hooks/hooksConfigManager.js';
import { Box, Link, Text } from '@anthropic/ink';
import { plural } from '../../utils/stringUtils.js';
import { Select } from '../CustomSelect/select.js';
import { Dialog } from '@anthropic/ink';

type Props = {
  hookEventMetadata: Record<HookEvent, HookEventMetadata>;
  hooksByEvent: Partial<Record<HookEvent, number>>;
  totalHooksCount: number;
  restrictedByPolicy: boolean;
  onSelectEvent: (event: HookEvent) => void;
  onCancel: () => void;
};

export function SelectEventMode({
  hookEventMetadata,
  hooksByEvent,
  totalHooksCount,
  restrictedByPolicy,
  onSelectEvent,
  onCancel,
}: Props): React.ReactNode {
  const subtitle = t('selecteventmode.subtitle', totalHooksCount);

  return (
    <Dialog title={t('selecteventmode.hooks')} subtitle={subtitle} onCancel={onCancel}>
      <Box flexDirection="column" gap={1}>
        {restrictedByPolicy && (
          <Box flexDirection="column">
            <Text color="suggestion">{figures.info} {t('selecteventmode.hooksRestrictedByPolicy')}</Text>
            <Text dimColor>
              {t('selecteventmode.managedSettingsOnly')}
            </Text>
          </Box>
        )}

        <Box flexDirection="column">
          <Text dimColor>
            {figures.info} {t('selecteventmode.readOnly')}{' '}
            <Link url="https://code.claude.com/docs/en/hooks">{t('selecteventmode.learnMore')}</Link>
          </Text>
        </Box>

        <Box flexDirection="column">
          <Select
            onChange={value => {
              onSelectEvent(value as HookEvent);
            }}
            onCancel={onCancel}
            options={Object.entries(hookEventMetadata).map(([name, metadata]) => {
              const count = hooksByEvent[name as HookEvent] || 0;
              return {
                label:
                  count > 0 ? (
                    <Text>
                      {name} <Text color="suggestion">({count})</Text>
                    </Text>
                  ) : (
                    name
                  ),
                value: name,
                description: metadata.summary,
              };
            })}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
