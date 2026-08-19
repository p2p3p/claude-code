import { spawnSync } from 'child_process'
import { t } from '../../../utils/i18n/index.js'
import { execFileNoThrow } from '../../../utils/execFileNoThrow.js'
import { buildCliLaunch, quoteCliLaunch } from '../../../utils/cliLaunch.js'
import type {
  BgEngine,
  BgStartOptions,
  BgStartResult,
  SessionEntry} from '../engine.js'

export class TmuxEngine implements BgEngine {
  readonly name = 'tmux' as const
  readonly supportsInteractiveInput = true

  async available(): Promise<boolean> {
    const { code } = await execFileNoThrow('tmux', ['-V'], { useCwd: false })
    return code === 0
  }

  async start(opts: BgStartOptions): Promise<BgStartResult> {
    const launch = buildCliLaunch(opts.args, {
      env: {
        ...opts.env,
        CLAUDE_CODE_SESSION_KIND: 'bg',
        CLAUDE_CODE_SESSION_NAME: opts.sessionName,
        CLAUDE_CODE_SESSION_LOG: opts.logPath,
        CLAUDE_CODE_TMUX_SESSION: opts.sessionName} as NodeJS.ProcessEnv})

    const cmd = quoteCliLaunch(launch)

    const result = spawnSync(
      'tmux',
      ['new-session', '-d', '-s', opts.sessionName, cmd],
      { stdio: 'inherit', env: launch.env },
    )

    if (result.status !== 0) {
      throw new Error(t('tmuxEngine.createFailed'))
    }

    // tmux doesn't directly report the child PID; we return 0.
    // The actual session process writes its own PID file.
    return {
      pid: 0,
      sessionName: opts.sessionName,
      logPath: opts.logPath,
      engineUsed: 'tmux'}
  }

  async attach(session: SessionEntry): Promise<void> {
    if (!session.tmuxSessionName) {
      throw new Error(t('tmuxEngine.noSessionName', session.sessionId))
    }

    const result = spawnSync(
      'tmux',
      ['attach-session', '-t', session.tmuxSessionName],
      { stdio: 'inherit' },
    )

    if (result.status !== 0) {
      throw new Error(t('tmuxEngine.attachFailed', session.tmuxSessionName))
    }
  }
}
