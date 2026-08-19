import React from 'react';
import { Text } from '@anthropic/ink';
import { formatTokens } from '../utils/format.js';

type BuiltinStatusLineProps = {
  modelName: string;
  usedTokens: number;
  contextWindowSize: number;
};

function Separator() {
  return <Text dimColor>{' \u2502 '}</Text>;
}

function BuiltinStatusLineInner({
  modelName,

  usedTokens,
  contextWindowSize}: BuiltinStatusLineProps) {

  // Model display: use first two words (e.g. "Opus 4.6") instead of just first word
  const modelParts = modelName.split(' ');
  const shortModel = modelParts.length >= 2 ? `${modelParts[0]} ${modelParts[1]}` : modelName;

  // Token display: "50k/1M"
  const tokenDisplay = `${formatTokens(usedTokens)}/${formatTokens(contextWindowSize)}`;

  return (
    <Text wrap="truncate">
      {/* Model name */}
      <Text>{shortModel}</Text>

      {/* Context usage — just show token counts */}
      <Separator />
      <Text dimColor>{tokenDisplay}</Text>
    </Text>
  );
}

export const BuiltinStatusLine = React.memo(BuiltinStatusLineInner);
