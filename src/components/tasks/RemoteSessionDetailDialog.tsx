import figures from 'figures';
import React, { useMemo, useState } from 'react';
import type { SDKMessage } from 'src/entrypoints/agentSdkTypes.js';
import type { ToolUseContext } from 'src/Tool.js';
import type { DeepImmutable } from 'src/types/utils.js';
import type { CommandResultDisplay } from '../../commands.js';
import { DIAMOND_FILLED, DIAMOND_OPEN } from '../../constants/figures.js';
import { useElapsedTime } from '../../hooks/useElapsedTime.js';
import { type KeyboardEvent, Box, Link, Text } from '@anthropic/ink';
import type { RemoteAgentTaskState } from '../../tasks/RemoteAgentTask/RemoteAgentTask.js';
import { getRemoteTaskSessionUrl } from '../../tasks/RemoteAgentTask/RemoteAgentTask.js';
import { AGENT_TOOL_NAME, LEGACY_AGENT_TOOL_NAME } from '@claude-code-best/builtin-tools/tools/AgentTool/constants.js';
import { ASK_USER_QUESTION_TOOL_NAME } from '@claude-code-best/builtin-tools/tools/AskUserQuestionTool/prompt.js';
import { EXIT_PLAN_MODE_V2_TOOL_NAME } from '@claude-code-best/builtin-tools/tools/ExitPlanModeTool/constants.js';
import { openBrowser } from '../../utils/browser.js';
import { errorMessage } from '../../utils/errors.js';
import { formatDuration, truncateToWidth } from '../../utils/format.js';
import { toInternalMessages } from '../../utils/messages/mappers.js';
import { EMPTY_LOOKUPS, normalizeMessages } from '../../utils/messages.js';
import { teleportResumeCodeSession } from '../../utils/teleport.js';
import { Select } from '../CustomSelect/select.js';
import { t } from '../../utils/i18n/index.js';
import { Byline, Dialog, KeyboardShortcutHint } from '@anthropic/ink';
import { Message } from '../Message.js';
import { formatReviewStageCounts, RemoteSessionProgress } from './RemoteSessionProgress.js';
import { AssistantMessage } from 'src/types/message.js';

type Props = {
  session: DeepImmutable<RemoteAgentTaskState>;
  toolUseContext: ToolUseContext;
  onDone: (result?: string, options?: { display?: CommandResultDisplay }) => void;
  onBack?: () => void;
  onKill?: () => void;
};

// Compact one-line summary: tool name + first meaningful string arg.
// Lighter than tool.renderToolUseMessage (no registry lookup / schema parse).
// Collapses whitespace so multi-line inputs (e.g. Bash command text)
// render on one line.
function translatePhaseLabel(phase: 'needs_input' | 'plan_ready' | undefined): string {
  if (phase === 'needs_input') return t('taskDetail.phaseNeedsInput');
  if (phase === 'plan_ready') return t('taskDetail.phasePlanReady');
  return t('taskDetail.running');
}

export function formatToolUseSummary(name: string, input: unknown): string {
  // plan_ready phase is only reached via ExitPlanMode tool
  if (name === EXIT_PLAN_MODE_V2_TOOL_NAME) {
    return t('taskDetail.reviewPlanInWeb');
  }
  if (!input || typeof input !== 'object') return name;
  // AskUserQuestion: show the question text as a CTA, not the tool name.
  // Input shape is {questions: [{question, header, options}]}.
  if (name === ASK_USER_QUESTION_TOOL_NAME && 'questions' in input) {
    const qs = input.questions;
    if (Array.isArray(qs) && qs[0] && typeof qs[0] === 'object') {
      // Prefer question (full text) over header (max-12-char tag). header
      // is a required schema field so checking it first would make the
      // question fallback dead code.
      const q =
        'question' in qs[0] && typeof qs[0].question === 'string' && qs[0].question
          ? qs[0].question
          : 'header' in qs[0] && typeof qs[0].header === 'string'
            ? qs[0].header
            : null;
      if (q) {
        const oneLine = q.replace(/\s+/g, ' ').trim();
        return t('taskDetail.answerInBrowser', truncateToWidth(oneLine, 50));
      }
    }
  }
  for (const v of Object.values(input)) {
    if (typeof v === 'string' && v.trim()) {
      const oneLine = v.replace(/\s+/g, ' ').trim();
      return `${name} ${truncateToWidth(oneLine, 60)}`;
    }
  }
  return name;
}

function UltraplanSessionDetail({ session, onDone, onBack, onKill }: Omit<Props, 'toolUseContext'>): React.ReactNode {
  const running = session.status === 'running' || session.status === 'pending';
  const phase = session.ultraplanPhase;
  const statusText = running ? translatePhaseLabel(phase) : session.status;
  const elapsedTime = useElapsedTime(session.startTime, running, 1000, 0, session.endTime);

  // Counts are eventually correct (lag ≤ poll interval). agentsWorking starts
  // at 1 (the main session agent) and increments per subagent spawn. toolCalls
  // is main-session only — subagent calls may not surface in this stream.
  const { agentsWorking, toolCalls, lastToolCall } = useMemo(() => {
    let spawns = 0;
    let calls = 0;
    let lastBlock: { name: string; input: unknown } | null = null;
    for (const msg of session.log) {
      if (msg.type !== 'assistant') continue;
      const content = (msg.message as { content?: unknown[] })?.content ?? [];
      for (const block of content as Array<{ type: string; name: string; input: unknown }>) {
        if (block.type !== 'tool_use') continue;
        calls++;
        lastBlock = block;
        if (block.name === AGENT_TOOL_NAME || block.name === LEGACY_AGENT_TOOL_NAME) {
          spawns++;
        }
      }
    }
    return {
      agentsWorking: 1 + spawns,
      toolCalls: calls,
      lastToolCall: lastBlock ? formatToolUseSummary(lastBlock.name, lastBlock.input) : null,
    };
  }, [session.log]);

  const sessionUrl = getRemoteTaskSessionUrl(session.sessionId);
  const goBackOrClose = onBack ?? (() => onDone('Remote session details dismissed', { display: 'system' }));
  const [confirmingStop, setConfirmingStop] = useState(false);

  if (confirmingStop) {
    return (
      <Dialog title={t('taskDetail.stopUltraplan') + '?'} onCancel={() => setConfirmingStop(false)} color="background">
        <Box flexDirection="column" gap={1}>
          <Text dimColor>{t('taskDetail.stopUltraplanDesc')}</Text>
          <Select
            options={[
              { label: t('taskDetail.terminateSession'), value: 'stop' as const },
              { label: t('taskDetail.back'), value: 'back' as const },
            ]}
            onChange={v => {
              if (v === 'stop') {
                onKill?.();
                goBackOrClose();
              } else {
                setConfirmingStop(false);
              }
            }}
          />
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      title={
        <Text>
          <Text color="background">{phase === 'plan_ready' ? DIAMOND_FILLED : DIAMOND_OPEN} </Text>
          <Text bold>{t('taskDetail.ultraplan')}</Text>
          <Text dimColor>
            {' · '}
            {elapsedTime}
            {' · '}
            {statusText}
          </Text>
        </Text>
      }
      onCancel={goBackOrClose}
      color="background"
    >
      <Box flexDirection="column" gap={1}>
        <Text>
          {phase === 'plan_ready' && <Text color="success">{figures.tick} </Text>}
          {t('taskDetail.agentsStatus', agentsWorking, phase ? (phase === 'plan_ready' ? t('taskDetail.verbDone') : t('taskDetail.verbWaiting')) : t('taskDetail.verbWorking'))} · {t('taskDetail.toolCalls', toolCalls)}
        </Text>
        {lastToolCall && <Text dimColor>{lastToolCall}</Text>}
        <Link url={sessionUrl}>
          <Text dimColor>{sessionUrl}</Text>
        </Link>
        <Select
          options={[
            {
              label: t('taskDetail.reviewInWeb'),
              value: 'open' as const,
            },
            ...(onKill && running ? [{ label: t('taskDetail.stopUltraplan'), value: 'stop' as const }] : []),
            { label: t('taskDetail.back'), value: 'back' as const },
          ]}
          onChange={v => {
            switch (v) {
              case 'open':
                void openBrowser(sessionUrl);
                // Close the dialog so the user lands back at the prompt with
                // any half-written input intact (inputValue persists across
                // the showBashesDialog toggle).
                onDone();
                return;
              case 'stop':
                setConfirmingStop(true);
                return;
              case 'back':
                goBackOrClose();
                return;
            }
          }}
        />
      </Box>
    </Dialog>
  );
}

const STAGES = ['finding', 'verifying', 'synthesizing'] as const;
const STAGE_LABELS: Record<(typeof STAGES)[number], string> = {
  finding: t('taskDetail.find'),
  verifying: t('taskDetail.verify'),
  synthesizing: t('taskDetail.dedupe'),
};

// Setup → Find → Verify → Dedupe pipeline. Current stage in cloud teal,
// rest dim. When completed, all stages dim with a trailing green ✓. The
// "Setup" label shows before the orchestrator writes its first progress
// snapshot (container boot + repo clone), so the 0-found display doesn't
// look like a hung finder.
function StagePipeline({
  stage,
  completed,
  hasProgress,
}: {
  stage: 'finding' | 'verifying' | 'synthesizing' | undefined;
  completed: boolean;
  hasProgress: boolean;
}): React.ReactNode {
  const currentIdx = stage ? STAGES.indexOf(stage) : -1;
  const inSetup = !completed && !hasProgress;
  return (
    <Text>
      {inSetup ? <Text color="background">{t('taskDetail.setup')}</Text> : <Text dimColor>{t('taskDetail.setup')}</Text>}
      <Text dimColor> → </Text>
      {STAGES.map((s, i) => {
        const isCurrent = !completed && !inSetup && i === currentIdx;
        return (
          <React.Fragment key={s}>
            {i > 0 && <Text dimColor> → </Text>}
            {isCurrent ? <Text color="background">{STAGE_LABELS[s]}</Text> : <Text dimColor>{STAGE_LABELS[s]}</Text>}
          </React.Fragment>
        );
      })}
      {completed && <Text color="success"> ✓</Text>}
    </Text>
  );
}

// Stage-appropriate counts line. Running-state formatting delegates to
// formatReviewStageCounts (shared with the pill) so the two views can't
// drift; completed state is dialog-specific (findings summary).
function reviewCountsLine(session: DeepImmutable<RemoteAgentTaskState>): string {
  const p = session.reviewProgress;
  // No progress data — the orchestrator never wrote a snapshot. Don't
  // claim "0 findings" when completed; we just don't know.
  if (!p) return session.status === 'completed' ? t('taskDetail.reviewDone') : t('taskDetail.reviewSettingUp');
  const verified = p.bugsVerified;
  const refuted = p.bugsRefuted ?? 0;
  if (session.status === 'completed') {
    const parts = [t('taskDetail.reviewFindings', verified)];
    if (refuted > 0) parts.push(t('taskDetail.reviewRefuted', refuted));
    return parts.join(' · ');
  }
  return formatReviewStageCounts(p.stage, p.bugsFound, verified, refuted);
}

type MenuAction = 'open' | 'stop' | 'back' | 'dismiss';

function ReviewSessionDetail({ session, onDone, onBack, onKill }: Omit<Props, 'toolUseContext'>): React.ReactNode {
  const completed = session.status === 'completed';
  const running = session.status === 'running' || session.status === 'pending';
  const [confirmingStop, setConfirmingStop] = useState(false);

  // useElapsedTime drives the 1Hz tick so the timer advances while the
  // dialog is open — the previous inline elapsed-time calculation only
  // re-rendered on session state changes (poll interval), which looked
  // like the clock was stuck.
  const elapsedTime = useElapsedTime(session.startTime, running, 1000, 0, session.endTime);

  const handleClose = () => onDone('Remote session details dismissed', { display: 'system' });
  const goBackOrClose = onBack ?? handleClose;

  const sessionUrl = getRemoteTaskSessionUrl(session.sessionId);
  const statusLabel = completed ? t('taskDetail.phasePlanReady') : running ? t('taskDetail.running') : session.status;

  if (confirmingStop) {
    return (
      <Dialog title={t('taskDetail.stopUltrareview') + '?'} onCancel={() => setConfirmingStop(false)} color="background">
        <Box flexDirection="column" gap={1}>
          <Text dimColor>
            {t('taskDetail.stopUltrareviewDesc')}
          </Text>
          <Select
            options={[
              { label: t('taskDetail.stopUltrareview'), value: 'stop' as const },
              { label: t('taskDetail.back'), value: 'back' as const },
            ]}
            onChange={v => {
              if (v === 'stop') {
                onKill?.();
                goBackOrClose();
              } else {
                setConfirmingStop(false);
              }
            }}
          />
        </Box>
      </Dialog>
    );
  }

  const options: { label: string; value: MenuAction }[] = completed
    ? [
        { label: t('taskDetail.openInWeb'), value: 'open' },
        { label: t('taskDetail.dismiss'), value: 'dismiss' },
      ]
    : [
        { label: t('taskDetail.openInWeb'), value: 'open' },
        ...(onKill && running ? [{ label: t('taskDetail.stopUltrareview'), value: 'stop' as const }] : []),
        { label: t('taskDetail.back'), value: 'back' },
      ];

  const handleSelect = (action: MenuAction) => {
    switch (action) {
      case 'open':
        void openBrowser(sessionUrl);
        onDone();
        break;
      case 'stop':
        setConfirmingStop(true);
        break;
      case 'back':
        goBackOrClose();
        break;
      case 'dismiss':
        handleClose();
        break;
    }
  };

  return (
    <Dialog
      title={
        <Text>
          <Text color="background">{completed ? DIAMOND_FILLED : DIAMOND_OPEN} </Text>
          <Text bold>{t('taskDetail.ultrareview')}</Text>
          <Text dimColor>
            {' · '}
            {elapsedTime}
            {' · '}
            {statusLabel}
          </Text>
        </Text>
      }
      onCancel={goBackOrClose}
      color="background"
      inputGuide={exitState =>
        exitState.pending ? (
          <Text>{t('common.pressAgain', exitState.keyName)}</Text>
        ) : (
          <Byline>
            <KeyboardShortcutHint shortcut="Enter" action={t('taskDetail.select')} />
            <KeyboardShortcutHint shortcut="Esc" action={t('taskDetail.goBack')} />
          </Byline>
        )
      }
    >
      <Box flexDirection="column" gap={1}>
        <StagePipeline
          stage={session.reviewProgress?.stage}
          completed={completed}
          hasProgress={!!session.reviewProgress}
        />

        <Box flexDirection="column">
          <Text>{reviewCountsLine(session)}</Text>
          <Link url={sessionUrl}>
            <Text dimColor>{sessionUrl}</Text>
          </Link>
        </Box>

        <Select options={options} onChange={handleSelect} />
      </Box>
    </Dialog>
  );
}

export function RemoteSessionDetailDialog({ session, toolUseContext, onDone, onBack, onKill }: Props): React.ReactNode {
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [teleportError, setTeleportError] = useState<string | null>(null);

  // Get last few messages from remote session for display.
  // Scan all messages (not just the last 3 raw entries) because the tail of
  // the log is often thinking-only blocks that normalise to 'progress' type.
  // Placed before the early returns so hook call order is stable (Rules of Hooks).
  // Ultraplan/review sessions never read this — skip the normalize work for them.
  const lastMessages = useMemo(() => {
    if (session.isUltraplan || session.isRemoteReview) return [];
    return normalizeMessages(toInternalMessages(session.log as SDKMessage[]))
      .filter(_ => _.type !== 'progress')
      .slice(-3);
  }, [session]);

  if (session.isUltraplan) {
    return <UltraplanSessionDetail session={session} onDone={onDone} onBack={onBack} onKill={onKill} />;
  }

  // Review sessions get the stage-pipeline view; everything else keeps the
  // generic label/value + recent-messages dialog below.
  if (session.isRemoteReview) {
    return <ReviewSessionDetail session={session} onDone={onDone} onBack={onBack} onKill={onKill} />;
  }

  const handleClose = () => onDone('Remote session details dismissed', { display: 'system' });

  // Component-specific shortcuts shown in UI hints (t=teleport, space=dismiss,
  // left=back). These are state-dependent actions, not standard dialog keybindings.
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      onDone('Remote session details dismissed', { display: 'system' });
    } else if (e.key === 'left' && onBack) {
      e.preventDefault();
      onBack();
    } else if (e.key === 't' && !isTeleporting) {
      e.preventDefault();
      void handleTeleport();
    } else if (e.key === 'return') {
      e.preventDefault();
      handleClose();
    }
  };

  // Handle teleporting to remote session
  async function handleTeleport(): Promise<void> {
    setIsTeleporting(true);
    setTeleportError(null);

    try {
      await teleportResumeCodeSession(session.sessionId);
    } catch (err) {
      setTeleportError(errorMessage(err));
    } finally {
      setIsTeleporting(false);
    }
  }

  // Truncate title if too long (for display purposes)
  const displayTitle = truncateToWidth(session.title, 50);

  // Map TaskStatus to display status (handle 'pending')
  const displayStatus = session.status === 'pending' ? 'starting' : session.status;

  return (
    <Box flexDirection="column" tabIndex={0} autoFocus onKeyDown={handleKeyDown}>
      <Dialog
        title={t('taskDetail.remoteSessionTitle')}
        onCancel={handleClose}
        color="background"
        inputGuide={exitState =>
          exitState.pending ? (
            <Text>{t('common.pressAgain', exitState.keyName)}</Text>
          ) : (
            <Byline>
              {onBack && <KeyboardShortcutHint shortcut="←" action={t('taskDetail.goBack')} />}
              <KeyboardShortcutHint shortcut="Esc/Enter/Space" action={t('taskDetail.close')} />
              {!isTeleporting && <KeyboardShortcutHint shortcut="t" action={t('taskDetail.teleport')} />}
            </Byline>
          )
        }
      >
        <Box flexDirection="column">
          <Text>
            <Text bold>{t('taskDetail.status')}</Text>:{' '}
            {displayStatus === 'running' || displayStatus === 'starting' ? (
              <Text color="background">{t(`taskDetail.${displayStatus}`)}</Text>
            ) : displayStatus === 'completed' ? (
              <Text color="success">{t('taskDetail.completed')}</Text>
            ) : (
              <Text color="error">{displayStatus}</Text>
            )}
          </Text>
          <Text>
            <Text bold>{t('taskDetail.runtime')}</Text>: {formatDuration((session.endTime ?? Date.now()) - session.startTime)}
          </Text>
          <Text wrap="truncate-end">
            <Text bold>{t('taskDetail.title')}</Text>: {displayTitle}
          </Text>
          <Text>
            <Text bold>{t('taskDetail.progress')}</Text>: <RemoteSessionProgress session={session} />
          </Text>
          <Text>
            <Text bold>{t('taskDetail.sessionUrl')}</Text>:{' '}
            <Link url={getRemoteTaskSessionUrl(session.sessionId)}>
              <Text dimColor>{getRemoteTaskSessionUrl(session.sessionId)}</Text>
            </Link>
          </Text>
        </Box>

        {/* Remote session messages section */}
        {session.log.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Text>
              <Text bold>{t('taskDetail.recentMessages')}</Text>:
            </Text>
            <Box flexDirection="column" height={10} overflowY="hidden">
              {lastMessages.map((msg, i) => (
                <Message
                  key={i}
                  message={msg as AssistantMessage}
                  lookups={EMPTY_LOOKUPS}
                  addMargin={i > 0}
                  tools={toolUseContext.options.tools}
                  commands={toolUseContext.options.commands}
                  verbose={toolUseContext.options.verbose}
                  inProgressToolUseIDs={new Set()}
                  progressMessagesForMessage={[]}
                  shouldAnimate={false}
                  shouldShowDot={false}
                  style="condensed"
                  isTranscriptMode={false}
                  isStatic={true}
                />
              ))}
            </Box>
            <Box marginTop={1}>
              <Text dimColor italic>
                {t('taskDetail.showingLastOf', lastMessages.length, session.log.length)}
              </Text>
            </Box>
          </Box>
        )}

        {/* Teleport error message */}
        {teleportError && (
          <Box marginTop={1}>
            <Text color="error">{t('taskDetail.teleportFailed', teleportError)}</Text>
          </Box>
        )}

        {/* Teleporting status */}
        {isTeleporting && <Text color="background">{t('taskDetail.teleporting')}</Text>}
      </Dialog>
    </Box>
  );
}
