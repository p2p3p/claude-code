import React from 'react';
import type { Input } from './TeamCreateTool.js';
import { t } from 'src/utils/i18n/index.js';

export function renderToolUseMessage(input: Partial<Input>): React.ReactNode {
  return t('toolUI.teamCreate.create', input.team_name);
}
