import React from 'react';
import { t } from '../../utils/i18n/index.js'
import { Box, Text } from '@anthropic/ink';
import { Byline } from '@anthropic/ink';

type Props = {
  serverToolsCount: number;
  serverPromptsCount: number;
  serverResourcesCount: number;
};

export function CapabilitiesSection({
  serverToolsCount,
  serverPromptsCount,
  serverResourcesCount,
}: Props): React.ReactNode {
  const capabilities = [];
  if (serverToolsCount > 0) {
    capabilities.push('tools');
  }
  if (serverResourcesCount > 0) {
    capabilities.push('resources');
  }
  if (serverPromptsCount > 0) {
    capabilities.push('prompts');
  }

  return (
    <Box>
      <Text bold>{t('capabilitiessection.capabilities')} </Text>
      <Text color="text">{capabilities.length > 0 ? <Byline>{capabilities}</Byline> : 'none'}</Text>
    </Box>
  );
}
