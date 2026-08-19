import React, { useMemo, useState } from 'react';
import { Box, Text, useInput } from '@anthropic/ink';
import { Dialog } from '@anthropic/ink';
import { useRegisterOverlay } from '../../context/overlayContext.js';
import type { LocalJSXCommandOnDone } from '../../types/command.js';
import { isSkillSearchEnabled } from '../../services/skillSearch/featureCheck.js';
import { t } from '../../utils/i18n/index.js'

type SkillSearchAction = {
  label: string;
  description: string;
  run: () => Promise<string>;
};

const ACTION_LABEL_COLUMN_WIDTH = 28;

const ABOUT_TEXT = `${t('skillSearch.aboutText')}\n\n${t('skillSearch.statusEnabled', isSkillSearchEnabled())}`;

function getStatusText(): string {
  return [
    t('skillSearch.statusTitle'),
    t('skillSearch.statusEnabled', isSkillSearchEnabled()),
    '',
    t('skillSearch.statusDescText'),
  ].join('\n');
}

async function startSkillSearch(): Promise<string> {
  if (isSkillSearchEnabled() && process.env.SKILL_SEARCH_ENABLED !== '0') {
    return t('skillSearch.alreadyEnabled');
  }

  process.env.SKILL_SEARCH_ENABLED = '1';
  const lines = [t('skillSearch.enabledMsg', 'SKILL_SEARCH_ENABLED=1')];

  try {
    const { clearSkillIndexCache } = await import('../../services/skillSearch/localSearch.js');
    clearSkillIndexCache();
    lines.push(t('skillSearch.cacheCleared'));
  } catch {
    lines.push(t('skillSearch.cacheSkipped'));
  }

  return lines.join('\n');
}

async function stopSkillSearch(): Promise<string> {
  if (!isSkillSearchEnabled()) {
    return t('skillSearch.alreadyDisabled');
  }
  process.env.SKILL_SEARCH_ENABLED = '0';
  return t('skillSearch.disabledMsg', 'SKILL_SEARCH_ENABLED=0');
}

function SkillSearchPanel({ onDone }: { onDone: LocalJSXCommandOnDone }): React.ReactNode {
  useRegisterOverlay('skill-search-panel');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = useMemo<SkillSearchAction[]>(
    () => [
      {
        label: t('cmdSystemUI.skillStatus'),
        description: t('skillSearch.statusDesc'),
        run: () => Promise.resolve(getStatusText())},
      {
        label: t('cmdSystemUI.skillStart'),
        description: t('skillSearch.startDesc'),
        run: startSkillSearch},
      {
        label: t('cmdSystemUI.skillStop'),
        description: t('skillSearch.stopDesc'),
        run: stopSkillSearch},
      {
        label: t('cmdSystemUI.skillAbout'),
        description: t('skillSearch.aboutDesc'),
        run: () => Promise.resolve(ABOUT_TEXT)},
    ],
    [],
  );

  const selectCurrent = () => {
    const action = actions[selectedIndex];
    if (!action) return;
    void action.run().then(result => {
      onDone(result, { display: 'system' });
    });
  };

  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex(index => Math.max(0, index - 1));
      return;
    }
    if (key.downArrow) {
      setSelectedIndex(index => Math.min(actions.length - 1, index + 1));
      return;
    }
    if (key.return) {
      selectCurrent();
    }
  });

  return (
    <Dialog
      title={t("cmdSystemUI.skillSearch")}
      subtitle={t('skillSearch.actionsCount', actions.length)}
      onCancel={() => onDone(t('cmdSystemUI.skillDismissed'), { display: 'system' })}
      color="background"
      hideInputGuide
    >
      <Box flexDirection="column">
        {actions.map((action, index) => (
          <Box key={action.label} flexDirection="row">
            <Text>{`${index === selectedIndex ? '›' : ' '} ${action.label}`.padEnd(ACTION_LABEL_COLUMN_WIDTH)}</Text>
            <Text dimColor>{action.description}</Text>
          </Box>
        ))}
        <Box marginTop={1}>
          <Text dimColor>{t("cmdSystemUI.skillNav")}</Text>
        </Box>
      </Box>
    </Dialog>
  );
}

export async function call(onDone: LocalJSXCommandOnDone, _context: unknown, args?: string): Promise<React.ReactNode> {
  const trimmed = args?.trim() ?? '';

  if (trimmed === 'start') {
    onDone(await startSkillSearch(), { display: 'system' });
    return null;
  }
  if (trimmed === 'stop') {
    onDone(await stopSkillSearch(), { display: 'system' });
    return null;
  }
  if (trimmed === 'about') {
    onDone(ABOUT_TEXT, { display: 'system' });
    return null;
  }
  if (trimmed === 'status') {
    onDone(getStatusText(), { display: 'system' });
    return null;
  }

  return <SkillSearchPanel onDone={onDone} />;
}
