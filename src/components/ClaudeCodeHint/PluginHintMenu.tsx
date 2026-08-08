import * as React from 'react';
import { t } from '../../utils/i18n/index.js'
import { Box, Text } from '@anthropic/ink';
import { Select } from '../CustomSelect/select.js';
import { PermissionDialog } from '../permissions/PermissionDialog.js';

type Props = {
  pluginName: string;
  pluginDescription?: string;
  marketplaceName: string;
  sourceCommand: string;
  onResponse: (response: 'yes' | 'no' | 'disable') => void;
};

const AUTO_DISMISS_MS = 30_000;

export function PluginHintMenu({
  pluginName,
  pluginDescription,
  marketplaceName,
  sourceCommand,
  onResponse,
}: Props): React.ReactNode {
  const onResponseRef = React.useRef(onResponse);
  onResponseRef.current = onResponse;

  React.useEffect(() => {
    const timeoutId = setTimeout(ref => ref.current('no'), AUTO_DISMISS_MS, onResponseRef);
    return () => clearTimeout(timeoutId);
  }, []);

  function onSelect(value: string): void {
    switch (value) {
      case 'yes':
        onResponse('yes');
        break;
      case 'disable':
        onResponse('disable');
        break;
      default:
        onResponse('no');
    }
  }

  const options = [
    {
      label: (
        <Text>
          {t('pluginhintmenu.yesInstallPrefix')}
          <Text bold>{pluginName}</Text>
        </Text>
      ),
      value: 'yes',
    },
    {
      label: t('pluginHintMenu.no'),
      value: 'no',
    },
    {
      label: t('pluginhintmenu.noAndDontShowAgain'),
      value: 'disable',
    },
  ];

  return (
    <PermissionDialog title={t('pluginhintmenu.pluginRecommendation')}>
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Box marginBottom={1}>
          <Text dimColor>
            {t('pluginhintmenu.commandSuggestsInstallingPrefix')}
            <Text bold>{sourceCommand}</Text>
            {t('pluginhintmenu.commandSuggestsInstallingSuffix')}
          </Text>
        </Box>
        <Box>
          <Text dimColor>{t('pluginhintmenu.plugin')}</Text>
          <Text> {pluginName}</Text>
        </Box>
        <Box>
          <Text dimColor>{t('pluginhintmenu.marketplace')}</Text>
          <Text> {marketplaceName}</Text>
        </Box>
        {pluginDescription && (
          <Box>
            <Text dimColor>{pluginDescription}</Text>
          </Box>
        )}
        <Box marginTop={1}>
          <Text>{t('pluginhintmenu.wouldYouLikeToInstallIt')}</Text>
        </Box>
        <Box>
          <Select options={options} onChange={onSelect} onCancel={() => onResponse('no')} />
        </Box>
      </Box>
    </PermissionDialog>
  );
}
