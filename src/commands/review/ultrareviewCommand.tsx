import type { ContentBlockParam } from '@anthropic-ai/sdk/resources/messages.js';
import type { LocalJSXCommandCall, LocalJSXCommandOnDone } from '../../types/command.js';
import { t } from '../../utils/i18n/index.js';
import { checkOverageGate, confirmOverage, launchRemoteReview } from './reviewRemote.js';
import { UltrareviewOverageDialog } from './UltrareviewOverageDialog.js';

function contentBlocksToString(blocks: ContentBlockParam[]): string {
  return blocks
    .map(b => (b.type === 'text' ? b.text : ''))
    .filter(Boolean)
    .join('\n');
}

async function launchAndDone(
  args: string,
  context: Parameters<LocalJSXCommandCall>[1],
  onDone: LocalJSXCommandOnDone,
  billingNote: string,
  signal?: AbortSignal,
): Promise<void> {
  const result = await launchRemoteReview(args, context, billingNote);
  // User hit Escape during the ~5s launch — the dialog already showed
  // "cancelled" and unmounted, so skip onDone (would write to a dead
  // transcript slot) and let the caller skip confirmOverage.
  if (signal?.aborted) return;
  if (result) {
    onDone(contentBlocksToString(result), { shouldQuery: true });
  } else {
    // Precondition failures now return specific ContentBlockParam[] above.
    // null only reaches here on teleport failure (PR mode) or non-github
    // repo — both are CCR/repo connectivity issues.
    onDone(t('ultrareview.launchFailed'), {
      display: 'system'});
  }
}

export const call: LocalJSXCommandCall = async (onDone, context, args) => {
  const gate = await checkOverageGate();

  if (gate.kind === 'not-enabled') {
    onDone(t('ultrareview.freeUsed'), {
      display: 'system'});
    return null;
  }

  if (gate.kind === 'low-balance') {
    onDone(
      t('ultrareview.lowBalance', gate.available.toFixed(2)),
      { display: 'system' },
    );
    return null;
  }

  if (gate.kind === 'needs-confirm') {
    return (
      <UltrareviewOverageDialog
        onProceed={async signal => {
          await launchAndDone(args, context, onDone, t('ultrareview.billingNote'), signal);
          // Only persist the confirmation flag after a non-aborted launch —
          // otherwise Escape-during-launch would leave the flag set and
          // skip this dialog on the next attempt.
          if (!signal.aborted) confirmOverage();
        }}
        onCancel={() => onDone(t('ultrareview.cancelled'), { display: 'system' })}
      />
    );
  }

  // gate.kind === 'proceed'
  await launchAndDone(args, context, onDone, gate.billingNote);
  return null;
};
