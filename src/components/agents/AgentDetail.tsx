import figures from 'figures';
import { t } from '../../utils/i18n/index.js'
import * as React from 'react';
import { type KeyboardEvent, Box, Text } from '@anthropic/ink';
import { useKeybinding } from '../../keybindings/useKeybinding.js';
import type { Tools } from '../../Tool.js';
import { getAgentColor } from '@claude-code-best/builtin-tools/tools/AgentTool/agentColorManager.js';
import { getMemoryScopeDisplay } from '@claude-code-best/builtin-tools/tools/AgentTool/agentMemory.js';
import { resolveAgentTools } from '@claude-code-best/builtin-tools/tools/AgentTool/agentToolUtils.js';
import { type AgentDefinition, isBuiltInAgent } from '@claude-code-best/builtin-tools/tools/AgentTool/loadAgentsDir.js';
import { getAgentModelDisplay } from '../../utils/model/agent.js';
import { Markdown } from '../Markdown.js';
import { getActualRelativeAgentFilePath } from './agentFileUtils.js';

type Props = {
  agent: AgentDefinition;
  tools: Tools;
  allAgents?: AgentDefinition[];
  onBack: () => void;
};

export function AgentDetail({ agent, tools, onBack }: Props): React.ReactNode {
  const resolvedTools = resolveAgentTools(agent, tools, false);
  const filePath = getActualRelativeAgentFilePath(agent);
  const backgroundColor = getAgentColor(agent.agentType);

  // Handle Esc to go back
  useKeybinding('confirm:no', onBack, { context: 'Confirmation' });

  // Handle Enter to go back
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'return') {
      e.preventDefault();
      onBack();
    }
  };

  function renderToolsList(): React.ReactNode {
    if (resolvedTools.hasWildcard) {
      return <Text>{t('agentdetail.allTools')}</Text>;
    }

    if (!agent.tools || agent.tools.length === 0) {
      return <Text>{t('agentDetail.none')}</Text>;
    }

    return (
      <>
        {resolvedTools.validTools.length > 0 && <Text>{resolvedTools.validTools.join(', ')}</Text>}
        {resolvedTools.invalidTools.length > 0 && (
          <Text color="warning">
            {figures.warning} Unrecognized: {resolvedTools.invalidTools.join(', ')}
          </Text>
        )}
      </>
    );
  }

  return (
    <Box flexDirection="column" gap={1} tabIndex={0} autoFocus onKeyDown={handleKeyDown}>
      <Text dimColor>{filePath}</Text>

      <Box flexDirection="column">
        <Text>
          <Text bold>{t('agentdetail.description')}</Text> {t('agentDetail.tellsWhenToUse')}:
        </Text>
        <Box marginLeft={2}>
          <Text>{agent.whenToUse}</Text>
        </Box>
      </Box>

      <Box>
        <Text>
          <Text bold>{t('agentdetail.tools')}</Text>:{' '}
        </Text>
        {renderToolsList()}
      </Box>

      <Text>
        <Text bold>{t('agentdetail.model')}</Text>: {getAgentModelDisplay(agent.model)}
      </Text>

      {agent.permissionMode && (
        <Text>
          <Text bold>{t('agentdetail.permissionMode')}</Text>: {agent.permissionMode}
        </Text>
      )}

      {agent.memory && (
        <Text>
          <Text bold>{t('agentdetail.memory')}</Text>: {getMemoryScopeDisplay(agent.memory)}
        </Text>
      )}

      {agent.hooks && Object.keys(agent.hooks).length > 0 && (
        <Text>
          <Text bold>{t('agentdetail.hooks')}</Text>: {Object.keys(agent.hooks).join(', ')}
        </Text>
      )}

      {agent.skills && agent.skills.length > 0 && (
        <Text>
          <Text bold>{t('agentdetail.skills')}</Text>:{' '}
          {agent.skills.length > 10 ? `${agent.skills.length} ${t('agentDetail.nSkills')}` : agent.skills.join(', ')}
        </Text>
      )}

      {backgroundColor && (
        <Box>
          <Text>
            <Text bold>{t('agentdetail.color')}</Text>:{' '}
            <Text backgroundColor={backgroundColor} color="inverseText">
              {' '}
              {agent.agentType}{' '}
            </Text>
          </Text>
        </Box>
      )}

      {!isBuiltInAgent(agent) && (
        <>
          <Box>
            <Text>
              <Text bold>{t('agentdetail.systemPrompt')}</Text>:
            </Text>
          </Box>
          <Box marginLeft={2} marginRight={2}>
            <Markdown>{agent.getSystemPrompt()}</Markdown>
          </Box>
        </>
      )}
    </Box>
  );
}
