import React from 'react';
import { MessageResponse } from 'src/components/MessageResponse.js';
import { Text } from '@anthropic/ink';
import { jsonStringify } from 'src/utils/slowOperations.js';
import type { Input, Output } from './ConfigTool.js';
import { t } from 'src/utils/i18n/index.js';

export function renderToolUseMessage(input: Partial<Input>): React.ReactNode {
  if (!input.setting) return null;
  if (input.value === undefined) {
    return <Text dimColor>{t('toolUI.config.getting', input.setting)}</Text>;
  }
  return (
    <Text dimColor>
      {t('toolUI.config.settingTo', input.setting, jsonStringify(input.value))}
    </Text>
  );
}

export function renderToolResultMessage(content: Output): React.ReactNode {
  if (!content.success) {
    return (
      <MessageResponse>
        <Text color="error">{t('toolUI.config.failed', content.error)}</Text>
      </MessageResponse>
    );
  }
  if (content.operation === 'get') {
    return (
      <MessageResponse>
        <Text>
          <Text bold>{content.setting}</Text> = {jsonStringify(content.value)}
        </Text>
      </MessageResponse>
    );
  }
  return (
    <MessageResponse>
      <Text>
        {t('toolUI.config.setTo', content.setting, jsonStringify(content.newValue))}
      </Text>
    </MessageResponse>
  );
}

export function renderToolUseRejectedMessage(): React.ReactNode {
  return <Text color="warning">{t('toolUI.config.rejected')}</Text>;
}
