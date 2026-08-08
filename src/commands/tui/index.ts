import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getIsNonInteractiveSession } from '../../bootstrap/state.js'
import { getClaudeConfigHomeDir } from '../../utils/envUtils.js'
import type { Command, LocalCommandResult } from '../../types/command.js'
import { t } from '../../utils/i18n/index.js'

/**
 * Path to the TUI-mode marker file.
 *
 * When this file exists, the user has opted in to flicker-free TUI mode
 * (alternate screen buffer via CLAUDE_CODE_NO_FLICKER=1). The marker is
 * session-independent: it persists across restarts so the user only needs to
 * run `/tui on` once.
 *
 * Shell-profile integration: add the following to ~/.bashrc / ~/.zshrc to
 * auto-enable TUI mode when the marker is present:
 *
 *   [ -f "$HOME/.claude/.tui-mode" ] && export CLAUDE_CODE_NO_FLICKER=1
 *
 * Note: setting CLAUDE_CODE_NO_FLICKER at runtime cannot retroactively enter
 * the alternate screen buffer — the Ink render tree is already mounted. The
 * change takes effect on the NEXT session start.
 */
export function getTuiMarkerPath(): string {
  return join(getClaudeConfigHomeDir(), '.tui-mode')
}

/**
 * Returns true when the TUI-mode marker file is present, meaning the user has
 * opted in to flicker-free alternate-screen rendering.
 */
export function isTuiModeEnabled(): boolean {
  return existsSync(getTuiMarkerPath())
}

const USAGE_TEXT = [
  'Usage: /tui [subcommand]',
  '',
  '  (no args)   Toggle flicker-free TUI mode (alternate screen buffer)',
  '  on          Enable TUI mode',
  '  off         Disable TUI mode',
  '  status      Show current TUI mode state',
  '',
  'TUI mode uses the ANSI alternate screen buffer (\\x1b[?1049h) so the',
  'Claude Code UI occupies a clean full-screen area with no scroll-back',
  'flicker.  The setting is stored in ~/.claude/.tui-mode and takes effect',
  'on the next session start.',
  '',
  'Shell-profile integration (auto-enable on every start):',
  '  [ -f "$HOME/.claude/.tui-mode" ] && export CLAUDE_CODE_NO_FLICKER=1',
  '',
  'Environment override:',
  '  CLAUDE_CODE_NO_FLICKER=1   force on (overrides marker)',
  '  CLAUDE_CODE_NO_FLICKER=0   force off (overrides marker)',
].join('\n')

function enableTui(): LocalCommandResult {
  const markerPath = getTuiMarkerPath()
  mkdirSync(getClaudeConfigHomeDir(), { recursive: true })
  writeFileSync(markerPath, new Date().toISOString(), 'utf8')
  return {
    type: 'text',
    value: [
      t('tui.enabledTitle'),
      '',
      t('tui.markerWritten', markerPath),
      '',
      t('tui.flickerFreeDesc'),
      '',
      '  [ -f "$HOME/.claude/.tui-mode" ] && export CLAUDE_CODE_NO_FLICKER=1',
      '',
      t('tui.toDisable'),
    ].join('\n'),
  }
}

function disableTui(): LocalCommandResult {
  const markerPath = getTuiMarkerPath()
  if (!existsSync(markerPath)) {
    return {
      type: 'text',
      value: t('tui.wasNotActive'),
    }
  }
  unlinkSync(markerPath)
  return {
    type: 'text',
    value: [
      t('tui.disabledTitle'),
      '',
      t('tui.markerRemoved', markerPath),
      '',
      t('tui.standardModeDesc'),
      '',
      t('tui.toReenable'),
    ].join('\n'),
  }
}

export async function callTui(args: string): Promise<LocalCommandResult> {
  const sub = args.trim().toLowerCase()

  // ── status ──────────────────────────────────────────────────────────
  if (sub === 'status') {
    const enabled = isTuiModeEnabled()
    const markerPath = getTuiMarkerPath()
    const envVal = process.env.CLAUDE_CODE_NO_FLICKER
    let envLine: string
    if (envVal === '1' || envVal === 'true') {
      envLine = t('tui.envForcedOn', envVal)
    } else if (envVal === '0' || envVal === 'false') {
      envLine = t('tui.envForcedOff', envVal)
    } else {
      envLine = t('tui.envNotSet')
    }
    return {
      type: 'text',
      value: [
        t('tui.statusTitle'),
        '',
        t('tui.markerFile', enabled ? t('tui.present') : t('tui.absent'), markerPath),
        t('tui.modeLabel', enabled ? t('tui.enabled') : t('tui.disabled')),
        t('tui.envVarLabel', envLine),
        '',
        t('tui.changesNextSession'),
      ].join('\n'),
    }
  }

  // ── on ───────────────────────────────────────────────────────────────
  if (sub === 'on') {
    return enableTui()
  }

  // ── off ──────────────────────────────────────────────────────────────
  if (sub === 'off') {
    return disableTui()
  }

  // ── toggle (legacy default) ──────────────────────────────────────────
  if (sub === '' || sub === 'toggle') {
    return isTuiModeEnabled() ? disableTui() : enableTui()
  }

  // ── unknown subcommand ───────────────────────────────────────────────
  return {
    type: 'text',
    value: [t('tui.unknownSubcommand', sub), '', USAGE_TEXT].join('\n'),
  }
}

const tuiCommand: Command = {
  type: 'local-jsx',
  name: 'tui',
  description: t('cmd.descTui'),
  isHidden: false,
  isEnabled: () => !getIsNonInteractiveSession(),
  argumentHint: '[status|on|off|toggle]',
  bridgeSafe: true,
  getBridgeInvocationError: args =>
    args.trim()
      ? undefined
      : 'Use /tui status/on/off/toggle over Remote Control.',
  load: () => import('./panel.js'),
}

export const tuiNonInteractive: Command = {
  type: 'local',
  name: 'tui',
  description: t('cmd.descTui'),
  isHidden: false,
  isEnabled: () => getIsNonInteractiveSession(),
  supportsNonInteractive: true,
  bridgeSafe: true,
  load: async () => ({
    call: callTui,
  }),
}

export default tuiCommand
