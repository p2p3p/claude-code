import type { ContentBlockParam } from '@anthropic-ai/sdk/resources/index.mjs';
import type { Command } from '../commands.js';
import { AGENT_TOOL_NAME } from '@claude-code-best/builtin-tools/tools/AgentTool/constants.js';
import { t } from '../utils/i18n/index.js';

const statusline = {
  type: 'prompt',
  description: t('cmd.descStatusline'),
  contentLength: 0, // Dynamic content
  aliases: [],
  name: 'statusline',
  progressMessage: t('statuslineCmd.progressMessage'),
  allowedTools: [AGENT_TOOL_NAME, 'Read(~/**)', 'Edit(~/.claude/settings.json)'],
  source: 'builtin',
  disableNonInteractive: true,
  async getPromptForCommand(args): Promise<ContentBlockParam[]> {
    const prompt = args.trim() || t('statuslineCmd.defaultPrompt');
    return [
      {
        type: 'text',
        text: t('statuslineCmd.createAgent', AGENT_TOOL_NAME, prompt)},
    ];
  }} satisfies Command;

export default statusline;
