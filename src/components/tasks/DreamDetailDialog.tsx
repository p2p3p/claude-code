import React from 'react';
import type { DeepImmutable } from 'src/types/utils.js';
import { useElapsedTime } from '../../hooks/useElapsedTime.js';
import { type KeyboardEvent, Box, Text } from '@anthropic/ink';
import { useKeybindings } from '../../keybindings/useKeybinding.js';
import type { DreamTaskState } from '../../tasks/DreamTask/DreamTask.js';
import { t } from '../../utils/i18n/index.js';
import { Byline, Dialog, KeyboardShortcutHint } from '@anthropic/ink';

type Props = {
  task: DeepImmutable<DreamTaskState>;
  onDone: () => void;
  onBack?: () => void;
  onKill?: () => void;
};

// How many recent turns to render. Earlier turns collapse to a count.
const VISIBLE_TURNS = 6;

export function DreamDetailDialog({ task, onDone, onBack, onKill }: Props): React.ReactNode {
  const elapsedTime = useElapsedTime(task.startTime, task.status === 'running', 1000, 0);

  // Dialog handles confirm:no (Esc) → onCancel. Wire confirm:yes (Enter/y) too.
  useKeybindings({ 'confirm:yes': onDone }, { context: 'Confirmation' });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      onDone();
    } else if (e.key === 'left' && onBack) {
      e.preventDefault();
      onBack();
    } else if (e.key === 'x' && task.status === 'running' && onKill) {
      e.preventDefault();
      onKill();
    }
  };

  // Turns with text to show. Tool-only turns (text='') are dropped entirely —
  // the per-turn toolUseCount already captures that work.
  const visibleTurns = task.turns.filter(t => t.text !== '');
  const shown = visibleTurns.slice(-VISIBLE_TURNS);
  const hidden = visibleTurns.length - shown.length;

  return (
    <Box flexDirection="column" tabIndex={0} autoFocus onKeyDown={handleKeyDown}>
      <Dialog
        title={t('taskDetail.memoryConsolidation')}
        subtitle={
          <Text dimColor>
            {elapsedTime} · {t('taskDetail.reviewingSessions', task.sessionsReviewing)}
            {task.filesTouched.length > 0 && (
              <>
                {' '}
                · {t('taskDetail.filesTouched', task.filesTouched.length)}
              </>
            )}
          </Text>
        }
        onCancel={onDone}
        color="background"
        inputGuide={exitState =>
          exitState.pending ? (
            <Text>{t('common.pressAgain', exitState.keyName)}</Text>
          ) : (
            <Byline>
              {onBack && <KeyboardShortcutHint shortcut="←" action={t('taskDetail.goBack')} />}
              <KeyboardShortcutHint shortcut="Esc/Enter/Space" action={t('taskDetail.close')} />
              {task.status === 'running' && onKill && <KeyboardShortcutHint shortcut="x" action={t('taskDetail.stop')} />}
            </Byline>
          )
        }
      >
        <Box flexDirection="column" gap={1}>
          <Text>
            <Text bold>{t('taskDetail.status')}:</Text>{' '}
            {task.status === 'running' ? (
              <Text color="background">{t('taskDetail.running')}</Text>
            ) : task.status === 'completed' ? (
              <Text color="success">{t('taskDetail.completed')}</Text>
            ) : (
              <Text color="error">{t('taskDetail.failed')}</Text>
            )}
          </Text>

          {shown.length === 0 ? (
            <Text dimColor>{task.status === 'running' ? t('taskDetail.start') : t('taskDetail.noTextOutput')}</Text>
          ) : (
            <>
              {hidden > 0 && (
                <Text dimColor>
                  {t('taskDetail.earlierTurns', hidden)}
                </Text>
              )}
              {shown.map((turn, i) => (
                <Box key={i} flexDirection="column">
                  <Text wrap="wrap">{turn.text}</Text>
                  {turn.toolUseCount > 0 && (
                    <Text dimColor>
                      {'  '}({turn.toolUseCount} {t('taskDetail.tools')})
                    </Text>
                  )}
                </Box>
              ))}
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
