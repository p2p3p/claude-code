import { feature } from 'bun:bundle';
import { t } from '../utils/i18n/index.js'
import * as React from 'react';
import { Box, Text } from '@anthropic/ink';
import type { ContextData } from '../utils/analyzeContext.js';
import { generateContextSuggestions } from '../utils/contextSuggestions.js';
import { getDisplayPath } from '../utils/file.js';
import { formatTokens } from '../utils/format.js';
import { getSourceDisplayName, type SettingSource } from '../utils/settings/constants.js';
import { plural } from '../utils/stringUtils.js';
import { ContextSuggestions } from './ContextSuggestions.js';

const RESERVED_CATEGORY_NAME = 'Autocompact buffer';

/**
 * One-liner for the legend header showing what context-collapse has done.
 * Returns null when nothing's summarized/staged so we don't add visual
 * noise in the common case. This is the one place a user can see that
 * their context was rewritten — the <collapsed> placeholders are isMeta
 * and don't appear in the conversation view.
 */
function CollapseStatus(): React.ReactNode {
  if (feature('CONTEXT_COLLAPSE')) {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { getStats, isContextCollapseEnabled } =
      require('../services/contextCollapse/index.js') as typeof import('../services/contextCollapse/index.js');
    /* eslint-enable @typescript-eslint/no-require-imports */
    if (!isContextCollapseEnabled()) return null;

    const s = getStats();
    const { health: h } = s;

    const parts: string[] = [];
    if (s.collapsedSpans > 0) {
      parts.push(t('contextvisualization.collapseSpanSummarized', s.collapsedSpans, plural(s.collapsedSpans, 'span'), s.collapsedMessages));
    }
    if (s.stagedSpans > 0) parts.push(t('contextvisualization.collapseStaged', s.stagedSpans));
    const summary =
      parts.length > 0
        ? parts.join(', ')
        : h.totalSpawns > 0
          ? t('contextvisualization.collapseNothingStaged', h.totalSpawns, plural(h.totalSpawns, 'spawn'))
          : t('contextvisualization.collapseWaitingForFirstTrigger');

    let line2: React.ReactNode = null;
    if (h.totalErrors > 0) {
      line2 = (
        <Text color="warning">
          {t('contextvisualization.collapseErrors')} {h.totalErrors}/{h.totalSpawns} {t('contextvisualization.collapseSpawnsFailed')}
          {h.lastError ? ` ${t('contextvisualization.collapseLastError', h.lastError.slice(0, 60))}` : ''}
        </Text>
      );
    } else if (h.emptySpawnWarningEmitted) {
      line2 = <Text color="warning">{t('ui.collapseIdle', h.totalEmptySpawns)}</Text>;
    }

    return (
      <>
        <Text dimColor>{t('ui.contextStrategyCollapse', summary)}</Text>
        {line2}
      </>
    );
  }
  return null;
}

// Order for displaying source groups: Project > User > Managed > Plugin > Built-in
const SOURCE_DISPLAY_ORDER = [
  t('settingSourceDisplay.project'),
  t('settingSourceDisplay.user'),
  t('settingSourceDisplay.managed'),
  t('settingSourceDisplay.plugin'),
  t('settingSourceDisplay.builtin'),
];

/** Group items by source type for display, sorted by tokens descending within each group */
function groupBySource<T extends { source: SettingSource | 'plugin' | 'built-in'; tokens: number }>(
  items: T[],
): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = getSourceDisplayName(item.source);
    const existing = groups.get(key) || [];
    existing.push(item);
    groups.set(key, existing);
  }
  // Sort each group by tokens descending
  for (const [key, group] of groups.entries()) {
    groups.set(
      key,
      group.sort((a, b) => b.tokens - a.tokens),
    );
  }
  // Return groups in consistent order
  const orderedGroups = new Map<string, T[]>();
  for (const source of SOURCE_DISPLAY_ORDER) {
    const group = groups.get(source);
    if (group) {
      orderedGroups.set(source, group);
    }
  }
  return orderedGroups;
}

interface Props {
  data: ContextData;
}

export function ContextVisualization({ data }: Props): React.ReactNode {
  const {
    categories,
    totalTokens,
    rawMaxTokens,
    percentage,
    gridRows,
    model,
    memoryFiles,
    mcpTools,
    deferredBuiltinTools = [],
    systemTools,
    systemPromptSections,
    agents,
    skills,
    messageBreakdown,
    cacheHitRate,
    cacheThreshold} = data;

  // Filter out categories with 0 tokens for the legend, and exclude Free space, Autocompact buffer, and deferred
  const visibleCategories = categories.filter(
    cat => cat.tokens > 0 && cat.name !== 'Free space' && cat.name !== RESERVED_CATEGORY_NAME && !cat.isDeferred,
  );
  // Check if MCP tools are deferred (loaded on-demand via tool search)
  const hasDeferredMcpTools = categories.some(cat => cat.isDeferred && cat.name.includes('MCP'));
  // Check if builtin tools are deferred
  const hasDeferredBuiltinTools = deferredBuiltinTools.length > 0;
  const autocompactCategory = categories.find(cat => cat.name === RESERVED_CATEGORY_NAME);

  return (
    <Box flexDirection="column" paddingLeft={1}>
      <Text bold>{t('contextvisualization.contextUsage')}</Text>
      <Box flexDirection="row" gap={2}>
        {/* Fixed size grid */}
        <Box flexDirection="column" flexShrink={0}>
          {gridRows.map((row, rowIndex) => (
            <Box key={rowIndex} flexDirection="row" marginLeft={-1}>
              {row.map((square, colIndex) => {
                if (square.categoryName === 'Free space') {
                  return (
                    <Text key={colIndex} dimColor>
                      {'⛶ '}
                    </Text>
                  );
                }
                if (square.categoryName === RESERVED_CATEGORY_NAME) {
                  return (
                    <Text key={colIndex} color={square.color}>
                      {'⛝ '}
                    </Text>
                  );
                }
                return (
                  <Text key={colIndex} color={square.color}>
                    {square.squareFullness >= 0.7 ? '⛁ ' : '⛀ '}
                  </Text>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* Legend to the right */}
        <Box flexDirection="column" gap={0} flexShrink={0}>
          <Text dimColor>
            {model} · {formatTokens(totalTokens)}/{formatTokens(rawMaxTokens)} {t('contextvisualization.tokens')} ({percentage}%)
          </Text>
          <CollapseStatus />
          {cacheHitRate !== undefined && cacheThreshold !== undefined && (
            <Text color={cacheHitRate < cacheThreshold ? 'warning' : undefined}>
              {t('cacheWarning.label', cacheHitRate.toFixed(0))}
              {cacheHitRate < cacheThreshold ? t('cacheWarning.belowThreshold', cacheThreshold) : ''}
            </Text>
          )}
          <Text> </Text>
          <Text dimColor italic>
            {t('contextvisualization.estimatedUsageByCategory')}
          </Text>
          {visibleCategories.map((cat, index) => {
            const tokenDisplay = formatTokens(cat.tokens);
            // Show "N/A" for deferred categories since they don't count toward context
            const percentDisplay = cat.isDeferred ? t('contextvisualization.na') : `${((cat.tokens / rawMaxTokens) * 100).toFixed(1)}%`;
            const isReserved = cat.name === RESERVED_CATEGORY_NAME;
            const displayName = cat.name;
            // Deferred categories don't appear in grid, so show blank instead of symbol
            const symbol = cat.isDeferred ? ' ' : isReserved ? '⛝' : '⛁';

            return (
              <Box key={index}>
                <Text color={cat.color}>{symbol}</Text>
                <Text> {displayName}: </Text>
                <Text dimColor>
                  {tokenDisplay} {t('contextvisualization.tokens')} ({percentDisplay})
                </Text>
              </Box>
            );
          })}
          {(categories.find(c => c.name === 'Free space')?.tokens ?? 0) > 0 && (
            <Box>
              <Text dimColor>⛶</Text>
              <Text> {t('contextvisualization.freeSpace')} </Text>
              <Text dimColor>
                {formatTokens(categories.find(c => c.name === 'Free space')?.tokens || 0)} (
                {(((categories.find(c => c.name === 'Free space')?.tokens || 0) / rawMaxTokens) * 100).toFixed(1)}
                %)
              </Text>
            </Box>
          )}
          {autocompactCategory && autocompactCategory.tokens > 0 && (
            <Box>
              <Text color={autocompactCategory.color}>⛝</Text>
              <Text dimColor> {t('contextvisualization.autocompactBuffer')}: </Text>
              <Text dimColor>
                {formatTokens(autocompactCategory.tokens)} {t('contextvisualization.tokens')} (
                {((autocompactCategory.tokens / rawMaxTokens) * 100).toFixed(1)}
                %)
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      <Box flexDirection="column" marginLeft={-1}>
        {mcpTools.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Box>
              <Text bold>{t('contextvisualization.mCPTools')}</Text>
              <Text dimColor> · /mcp{hasDeferredMcpTools ? t('contextvisualization.loadedOnDemand') : ''}</Text>
            </Box>
            {/* Show loaded tools first */}
            {mcpTools.some(t => t.isLoaded) && (
              <Box flexDirection="column" marginTop={1}>
                <Text dimColor>{t('contextvisualization.loaded')}</Text>
                {mcpTools
                  .filter(t => t.isLoaded)
                  .map((tool, i) => (
                    <Box key={i}>
                      <Text>└ {tool.name}: </Text>
                      <Text dimColor>{formatTokens(tool.tokens)} {t('contextvisualization.tokens')}</Text>
                    </Box>
                  ))}
              </Box>
            )}
            {/* Show available (deferred) tools */}
            {hasDeferredMcpTools && mcpTools.some(t => !t.isLoaded) && (
              <Box flexDirection="column" marginTop={1}>
                <Text dimColor>{t('contextvisualization.available')}</Text>
                {mcpTools
                  .filter(t => !t.isLoaded)
                  .map((tool, i) => (
                    <Box key={i}>
                      <Text dimColor>└ {tool.name}</Text>
                    </Box>
                  ))}
              </Box>
            )}
            {/* Show all tools normally when not deferred */}
            {!hasDeferredMcpTools &&
              mcpTools.map((tool, i) => (
                <Box key={i}>
                  <Text>└ {tool.name}: </Text>
                  <Text dimColor>{formatTokens(tool.tokens)} {t('contextvisualization.tokens')}</Text>
                </Box>
              ))}
          </Box>
        )}

        {/* Show builtin tools: always-loaded + deferred (ant-only) */}
        {((systemTools && systemTools.length > 0) || hasDeferredBuiltinTools) && process.env.USER_TYPE === 'ant' && (
          <Box flexDirection="column" marginTop={1}>
            <Box>
              <Text bold>{t('contextvisualization.antOnlySystemTools')}</Text>
              {hasDeferredBuiltinTools && <Text dimColor> {t('contextvisualization.someLoadedOnDemand')}</Text>}
            </Box>
            {/* Always-loaded + deferred-but-loaded tools */}
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>{t('contextvisualization.loaded2')}</Text>
              {systemTools?.map((tool, i) => (
                <Box key={`sys-${i}`}>
                  <Text>└ {tool.name}: </Text>
                  <Text dimColor>{formatTokens(tool.tokens)} {t('contextvisualization.tokens')}</Text>
                </Box>
              ))}
              {deferredBuiltinTools
                .filter(t => t.isLoaded)
                .map((tool, i) => (
                  <Box key={`def-${i}`}>
                    <Text>└ {tool.name}: </Text>
                    <Text dimColor>{formatTokens(tool.tokens)} {t('contextvisualization.tokens')}</Text>
                  </Box>
                ))}
            </Box>
            {/* Deferred (not yet loaded) tools */}
            {hasDeferredBuiltinTools && deferredBuiltinTools.some(t => !t.isLoaded) && (
              <Box flexDirection="column" marginTop={1}>
                <Text dimColor>{t('contextvisualization.available2')}</Text>
                {deferredBuiltinTools
                  .filter(t => !t.isLoaded)
                  .map((tool, i) => (
                    <Box key={i}>
                      <Text dimColor>└ {tool.name}</Text>
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
        )}

        {systemPromptSections && systemPromptSections.length > 0 && process.env.USER_TYPE === 'ant' && (
          <Box flexDirection="column" marginTop={1}>
            <Text bold>{t('contextvisualization.antOnlySystemPromptSections')}</Text>
            {systemPromptSections.map((section, i) => (
              <Box key={i}>
                <Text>└ {section.name}: </Text>
                <Text dimColor>{formatTokens(section.tokens)} {t('contextvisualization.tokens')}</Text>
              </Box>
            ))}
          </Box>
        )}

        {agents.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Box>
              <Text bold>{t('contextvisualization.customAgents')}</Text>
              <Text dimColor> · /agents</Text>
            </Box>
            {Array.from(groupBySource(agents).entries()).map(([sourceDisplay, sourceAgents]) => (
              <Box key={sourceDisplay} flexDirection="column" marginTop={1}>
                <Text dimColor>{sourceDisplay}</Text>
                {sourceAgents.map((agent, i) => (
                  <Box key={i}>
                    <Text>└ {agent.agentType}: </Text>
                    <Text dimColor>{formatTokens(agent.tokens)} {t('contextvisualization.tokens')}</Text>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {memoryFiles.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Box>
              <Text bold>{t('contextvisualization.memoryFiles')}</Text>
              <Text dimColor> · /memory</Text>
            </Box>
            {memoryFiles.map((file, i) => (
              <Box key={i}>
                <Text>└ {getDisplayPath(file.path)}: </Text>
                <Text dimColor>{formatTokens(file.tokens)} {t('contextvisualization.tokens')}</Text>
              </Box>
            ))}
          </Box>
        )}

        {skills && skills.tokens > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Box>
              <Text bold>{t('contextvisualization.skills')}</Text>
              <Text dimColor> · /skills</Text>
            </Box>
            {Array.from(groupBySource(skills.skillFrontmatter).entries()).map(([sourceDisplay, sourceSkills]) => (
              <Box key={sourceDisplay} flexDirection="column" marginTop={1}>
                <Text dimColor>{sourceDisplay}</Text>
                {sourceSkills.map((skill, i) => (
                  <Box key={i}>
                    <Text>└ {skill.name}: </Text>
                    <Text dimColor>{formatTokens(skill.tokens)} {t('contextvisualization.tokens')}</Text>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {messageBreakdown && process.env.USER_TYPE === 'ant' && (
          <Box flexDirection="column" marginTop={1}>
            <Text bold>{t('contextvisualization.antOnlyMessageBreakdown')}</Text>

            <Box flexDirection="column" marginLeft={1}>
              <Box>
                <Text>{t('contextvisualization.toolCalls')} </Text>
                <Text dimColor>{formatTokens(messageBreakdown.toolCallTokens)} {t('contextvisualization.tokens')}</Text>
              </Box>

              <Box>
                <Text>{t('contextvisualization.toolResults')} </Text>
                <Text dimColor>{formatTokens(messageBreakdown.toolResultTokens)} {t('contextvisualization.tokens')}</Text>
              </Box>

              <Box>
                <Text>{t('contextvisualization.attachments')} </Text>
                <Text dimColor>{formatTokens(messageBreakdown.attachmentTokens)} {t('contextvisualization.tokens')}</Text>
              </Box>

              <Box>
                <Text>{t('contextvisualization.assistantMessagesNonTool')} </Text>
                <Text dimColor>{formatTokens(messageBreakdown.assistantMessageTokens)} {t('contextvisualization.tokens')}</Text>
              </Box>

              <Box>
                <Text>{t('contextvisualization.userMessagesNonToolResult')} </Text>
                <Text dimColor>{formatTokens(messageBreakdown.userMessageTokens)} {t('contextvisualization.tokens')}</Text>
              </Box>
            </Box>

            {messageBreakdown.toolCallsByType.length > 0 && (
              <Box flexDirection="column" marginTop={1}>
                <Text bold>{t('contextvisualization.antOnlyTopTools')}</Text>
                {messageBreakdown.toolCallsByType.slice(0, 5).map((tool, i) => (
                  <Box key={i} marginLeft={1}>
                    <Text>└ {tool.name}: </Text>
                    <Text dimColor>
                      {t('contextvisualization.callResults', formatTokens(tool.callTokens), formatTokens(tool.resultTokens))}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}

            {messageBreakdown.attachmentsByType.length > 0 && (
              <Box flexDirection="column" marginTop={1}>
                <Text bold>{t('contextvisualization.antOnlyTopAttachments')}</Text>
                {messageBreakdown.attachmentsByType.slice(0, 5).map((attachment, i) => (
                  <Box key={i} marginLeft={1}>
                    <Text>└ {attachment.name}: </Text>
                    <Text dimColor>{formatTokens(attachment.tokens)} {t('contextvisualization.tokens')}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <ContextSuggestions suggestions={generateContextSuggestions(data)} />
    </Box>
  );
}
