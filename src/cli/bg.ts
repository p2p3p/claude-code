import { readdir, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { getClaudeConfigHomeDir } from '../utils/envUtils.js'
import { isProcessRunning } from '../utils/genericProcessUtils.js'
import { jsonParse } from '../utils/slowOperations.js'
import { t } from '../utils/i18n/index.js'
import { selectEngine } from './bg/engines/index.js'
import type { SessionEntry } from './bg/engine.js'

export type { SessionEntry } from './bg/engine.js'

function getSessionsDir(): string {
  return join(getClaudeConfigHomeDir(), 'sessions')
}

export async function listLiveSessions(): Promise<SessionEntry[]> {
  const dir = getSessionsDir()
  let files: string[]
  try {
    files = await readdir(dir)
  } catch {
    return []
  }

  const sessions: SessionEntry[] = []
  for (const file of files) {
    if (!/^\d+\.json$/.test(file)) continue
    const pid = parseInt(file.slice(0, -5), 10)

    if (!isProcessRunning(pid)) {
      void unlink(join(dir, file)).catch(() => {})
      continue
    }

    try {
      const raw = await readFile(join(dir, file), 'utf-8')
      const entry = jsonParse(raw) as SessionEntry
      sessions.push(entry)
    } catch {
      // Corrupt file — skip
    }
  }

  return sessions
}

export function findSession(
  sessions: SessionEntry[],
  target: string,
): SessionEntry | undefined {
  const asNum = parseInt(target, 10)
  return sessions.find(
    s =>
      s.sessionId === target ||
      s.pid === asNum ||
      (s.name && s.name === target),
  )
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString()
}

/**
 * Resolve the engine type for an existing session.
 * Backward-compatible: sessions without an `engine` field are inferred
 * from the presence of `tmuxSessionName`.
 */
function resolveSessionEngine(session: SessionEntry): 'tmux' | 'detached' {
  if (session.engine) return session.engine
  return session.tmuxSessionName ? 'tmux' : 'detached'
}

/**
 * `claude daemon status` / `claude ps` — list live sessions.
 */
export async function psHandler(_args: string[]): Promise<void> {
  const sessions = await listLiveSessions()

  if (sessions.length === 0) {
    console.log(t('cli.noActiveSessions'))
    return
  }

  console.log(t('cli.activeSessions', sessions.length) + ':\n')

  for (const s of sessions) {
    const engineType = resolveSessionEngine(s)
    const parts: string[] = [
      `  ${t('cli.sessionPid')} ${s.pid}`,
      `  ${t('cli.sessionKind')} ${s.kind}`,
      `  ${t('cli.sessionEngine')} ${engineType}`,
      `  ${t('cli.sessionId')} ${s.sessionId}`,
      `  ${t('cli.sessionCwd')} ${s.cwd}`,
    ]

    if (s.name) parts.push(`  ${t('cli.sessionName')} ${s.name}`)
    if (s.startedAt) parts.push(`  ${t('cli.sessionStarted')} ${formatTime(s.startedAt)}`)
    if (s.status) parts.push(`  ${t('cli.sessionStatus')} ${s.status}`)
    if (s.waitingFor) parts.push(`  ${t('cli.sessionWaitingFor')} ${s.waitingFor}`)
    if (s.bridgeSessionId) parts.push(`  ${t('cli.sessionBridge')} ${s.bridgeSessionId}`)
    if (s.tmuxSessionName) parts.push(`  ${t('cli.sessionTmux')} ${s.tmuxSessionName}`)
    if (s.logPath) parts.push(`  ${t('cli.sessionLog')} ${s.logPath}`)

    console.log(parts.join('\n'))
    console.log()
  }
}

/**
 * `claude daemon logs <target>` — show logs for a session.
 */
export async function logsHandler(target: string | undefined): Promise<void> {
  const sessions = await listLiveSessions()

  if (!target) {
    if (sessions.length === 0) {
      console.log(t('cli.noActiveSessions'))
      return
    }
    if (sessions.length === 1) {
      target = sessions[0]!.sessionId
    } else {
      console.log(t('cli.multipleSessionsActive'))
      for (const s of sessions) {
        const label = s.name ? `${s.name} (${s.sessionId})` : s.sessionId
        console.log(`  ${label}  PID=${s.pid}`)
      }
      return
    }
  }

  const session = findSession(sessions, target)
  if (!session) {
    console.error(t('cli.sessionNotFound', target))
    process.exitCode = 1
    return
  }

  if (!session.logPath) {
    console.log(t('cli.noLogPathForSession', session.sessionId))
    return
  }

  try {
    const content = await readFile(session.logPath, 'utf-8')
    process.stdout.write(content)
  } catch (e) {
    console.error(t('cli.failedToReadLog', session.logPath))
    console.error(e instanceof Error ? e.message : String(e))
    process.exitCode = 1
  }
}

/**
 * `claude daemon attach <target>` — attach to a background session.
 *
 * Engine-aware: tmux sessions use tmux attach, detached sessions use log tail.
 */
export async function attachHandler(target: string | undefined): Promise<void> {
  const sessions = await listLiveSessions()

  if (!target) {
    // Find bg sessions (tmux or detached)
    const bgSessions = sessions.filter(
      s => s.tmuxSessionName || s.engine === 'detached',
    )
    if (bgSessions.length === 0) {
      console.log(t('cli.noBackgroundSessions'))
      return
    }
    if (bgSessions.length === 1) {
      target = bgSessions[0]!.sessionId
    } else {
      console.log(t('cli.multipleBackgroundSessions'))
      for (const s of bgSessions) {
        const label = s.name ? `${s.name} (${s.sessionId})` : s.sessionId
        const engineType = resolveSessionEngine(s)
        console.log(`  ${label}  PID=${s.pid}  engine=${engineType}`)
      }
      return
    }
  }

  const session = findSession(sessions, target)
  if (!session) {
    console.error(t('cli.sessionNotFound', target))
    process.exitCode = 1
    return
  }

  const engineType = resolveSessionEngine(session)

  try {
    if (engineType === 'tmux') {
      const { TmuxEngine } = await import('./bg/engines/tmux.js')
      const tmux = new TmuxEngine()
      if (!(await tmux.available())) {
        console.error(t('cli.tmuxNotAvailable'))
        process.exitCode = 1
        return
      }
      await tmux.attach(session)
    } else {
      const { DetachedEngine } = await import('./bg/engines/detached.js')
      const detached = new DetachedEngine()
      await detached.attach(session)
    }
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e))
    process.exitCode = 1
  }
}

/**
 * `claude daemon kill <target>` — kill a session.
 */
export async function killHandler(target: string | undefined): Promise<void> {
  const sessions = await listLiveSessions()

  if (!target) {
    if (sessions.length === 0) {
      console.log(t('cli.noActiveSessionsToKill'))
      return
    }
    console.log(t('cli.specifySessionToKill'))
    for (const s of sessions) {
      const label = s.name ? `${s.name} (${s.sessionId})` : s.sessionId
      console.log(`  ${label}  PID=${s.pid}`)
    }
    return
  }

  const session = findSession(sessions, target)
  if (!session) {
    console.error(t('cli.sessionNotFound', target))
    process.exitCode = 1
    return
  }

  console.log(t('cli.killingSession', session.sessionId, session.pid))

  try {
    process.kill(session.pid, 'SIGTERM')
  } catch {
    console.log(t('cli.sessionAlreadyExited'))
    return
  }

  await new Promise(resolve => setTimeout(resolve, 2000))

  if (isProcessRunning(session.pid)) {
    try {
      process.kill(session.pid, 'SIGKILL')
      console.log(t('cli.sessionForceKilled'))
    } catch {
      console.log(t('cli.sessionExitedGracePeriod'))
    }
  } else {
    console.log(t('cli.sessionStopped'))
  }

  const pidFile = join(getSessionsDir(), `${session.pid}.json`)
  void unlink(pidFile).catch(() => {})
}

/**
 * `claude daemon bg [args]` — start a background session.
 *
 * Cross-platform: uses TmuxEngine on macOS/Linux when tmux is available,
 * falls back to DetachedEngine on Windows or when tmux is absent.
 */
export async function handleBgStart(args: string[]): Promise<void> {
  const engine = await selectEngine()

  // Strip --bg/--background from args (for backward-compat shortcut)
  const filteredArgs = args.filter(a => a !== '--bg' && a !== '--background')

  // Engines without interactive TTY input (e.g. detached) require -p/--print
  // or piped input. Tmux provides a virtual terminal so it works without -p.
  if (
    !engine.supportsInteractiveInput &&
    !filteredArgs.some(a => a === '-p' || a === '--print' || a === '--pipe')
  ) {
    console.error(t('cli.bgDetachedError'))
    if (process.platform !== 'win32') {
      console.error(
        '\n' +
          t('cli.bgInstallTmux').replace('{installCmd}', process.platform === 'darwin' ? t('cli.bgInstallTmuxDarwin') : t('cli.bgInstallTmuxLinux')),
      )
    }
    process.exitCode = 1
    return
  }

  const sessionName = `claude-bg-${randomUUID().slice(0, 8)}`
  const logPath = join(
    getClaudeConfigHomeDir(),
    'sessions',
    'logs',
    `${sessionName}.log`,
  )

  try {
    const result = await engine.start({
      sessionName,
      args: filteredArgs,
      env: { ...process.env },
      logPath,
      cwd: process.cwd()})

    console.log(t('cli.bgSessionStarted', result.sessionName))
    console.log(`  ${t('cli.bgEngine')} ${result.engineUsed}`)
    console.log(`  ${t('cli.bgLog')} ${result.logPath}`)
    console.log()
    console.log(t('cli.bgAttachHint', result.sessionName))
    console.log(t('cli.bgStatusHint'))
    console.log(t('cli.bgKillHint', result.sessionName))
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e))
    process.exitCode = 1
  }
}
