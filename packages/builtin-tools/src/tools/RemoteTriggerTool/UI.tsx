import React from 'react';
import { MessageResponse } from 'src/components/MessageResponse.js';
import { Text } from '@anthropic/ink';
import { countCharInString } from 'src/utils/stringUtils.js';
import type { Input, Output } from './RemoteTriggerTool.js';
import { t } from 'src/utils/i18n/index.js';

export function renderToolUseMessage(input: Partial<Input>): React.ReactNode {
  return `${input.action ?? ''}${input.trigger_id ? ` ${input.trigger_id}` : ''}`;
}

export function renderToolResultMessage(output: Output): React.ReactNode {
  const lines = countCharInString(output.json, '\n') + 1;
  return (
    <MessageResponse>
      <Text>
        HTTP {output.status} <Text dimColor>{t('toolUI.remoteTrigger.lines', lines)}</Text>
      </Text>
    </MessageResponse>
  );
}
