import type { Command } from '@commander-js/extra-typings'
import { t } from '../../utils/i18n/index.js'
import {
  createTask,
  getTask,
  updateTask,
  listTasks,
  getTasksDir} from '../../utils/tasks.js'
import { getRecentActivity } from '../../utils/logoV2Utils.js'
import type { LogOption } from '../../types/logs.js'

const DEFAULT_LIST = 'default'

// ─── Group C: Task CRUD ──────────────────────────────────────────────────────

export async function taskCreateHandler(
  subject: string,
  opts: { description?: string; list?: string },
): Promise<void> {
  const listId = opts.list || DEFAULT_LIST
  const id = await createTask(listId, {
    subject,
    description: opts.description || '',
    status: 'pending',
    blocks: [],
    blockedBy: []})
  console.log(t('cli.createdTask', id, subject))
}

export async function taskListHandler(opts: {
  list?: string
  pending?: boolean
  json?: boolean
}): Promise<void> {
  const listId = opts.list || DEFAULT_LIST
  let tasks = await listTasks(listId)

  if (opts.pending) {
    tasks = tasks.filter(t => t.status === 'pending')
  }

  if (opts.json) {
    console.log(JSON.stringify(tasks, null, 2))
    return
  }

  if (tasks.length === 0) {
    console.log(t('cli.noTasksFound'))
    return
  }

  for (const task of tasks) {
    console.log(t('cli.taskEntry', task.status, task.id, task.subject))
    if (task.description) console.log(`    ${task.description}`)
    if (task.owner) console.log(t('cli.taskOwner', task.owner))
  }
}

export async function taskGetHandler(
  id: string,
  opts: { list?: string },
): Promise<void> {
  const listId = opts.list || DEFAULT_LIST
  const task = await getTask(listId, id)
  if (!task) {
    console.error(t('cli.taskNotFound', id))
    process.exitCode = 1
    return
  }
  console.log(JSON.stringify(task, null, 2))
}

export async function taskUpdateHandler(
  id: string,
  opts: {
    list?: string
    status?: string
    subject?: string
    description?: string
    owner?: string
    clearOwner?: boolean
  },
): Promise<void> {
  const listId = opts.list || DEFAULT_LIST
  const updates: Record<string, unknown> = {}

  if (opts.status) updates.status = opts.status
  if (opts.subject) updates.subject = opts.subject
  if (opts.description) updates.description = opts.description
  if (opts.owner) updates.owner = opts.owner
  if (opts.clearOwner) updates.owner = undefined

  const task = await updateTask(listId, id, updates)
  if (!task) {
    console.error(t('cli.taskNotFound', id))
    process.exitCode = 1
    return
  }
  console.log(t('cli.updatedTask', id, task.status, task.subject))
}

export async function taskDirHandler(opts: { list?: string }): Promise<void> {
  const listId = opts.list || DEFAULT_LIST
  console.log(getTasksDir(listId))
}

// ─── Group B: Log / Error / Export ───────────────────────────────────────────

export async function logHandler(
  logId: string | number | undefined,
): Promise<void> {
  const logs = await getRecentActivity()

  if (logId === undefined) {
    if (logs.length === 0) {
      console.log(t('cli.noRecentSessions'))
      return
    }
    for (let i = 0; i < Math.min(logs.length, 20); i++) {
      const log = logs[i]!
      const date = log.modified
        ? new Date(log.modified).toLocaleString()
        : 'unknown'
      const title =
        (log as Record<string, unknown>).title || log.sessionId || 'untitled'
      console.log(`  ${i}: ${title}  (${date})`)
    }
    return
  }

  const idx = typeof logId === 'string' ? parseInt(logId, 10) : logId
  const log =
    Number.isFinite(idx) && idx >= 0 && idx < logs.length
      ? logs[idx]
      : logs.find(l => l.sessionId === String(logId))

  if (!log) {
    console.error(t('cli.logSessionNotFound', logId))
    process.exitCode = 1
    return
  }

  console.log(JSON.stringify(log, null, 2))
}

export async function errorHandler(num: number | undefined): Promise<void> {
  // Error log viewing — shows recent session errors
  const logs = await getRecentActivity()
  const count = num ?? 5

  console.log(t('cli.lastSessions', count))
  for (let i = 0; i < Math.min(count, logs.length); i++) {
    const log = logs[i]!
    const date = log.modified
      ? new Date(log.modified).toLocaleString()
      : 'unknown'
    console.log(`  ${i}: ${log.sessionId}  (${date})`)
  }
}

export async function exportHandler(
  source: string,
  outputFile: string,
): Promise<void> {
  const { writeFile, readFile } = await import('fs/promises')
  const logs = await getRecentActivity()

  // Try as index first
  const idx = parseInt(source, 10)
  let log: LogOption | undefined
  if (Number.isFinite(idx) && idx >= 0 && idx < logs.length) {
    log = logs[idx]
  } else {
    log = logs.find(l => l.sessionId === source)
  }

  if (!log) {
    // Try as file path
    try {
      const content = await readFile(source, 'utf-8')
      await writeFile(outputFile, content, 'utf-8')
      console.log(t('cli.exportedFile', source, outputFile))
      return
    } catch {
      console.error(t('cli.sourceNotFound', source))
      process.exitCode = 1
      return
    }
  }

  await writeFile(outputFile, JSON.stringify(log, null, 2), 'utf-8')
  console.log(t('cli.exportedSession', log.sessionId, outputFile))
}

// ─── Group D: Completion ─────────────────────────────────────────────────────

export async function completionHandler(
  shell: string,
  opts: { output?: string },
  _program: Command,
): Promise<void> {
  const { regenerateCompletionCache } = await import(
    '../../utils/completionCache.js'
  )

  if (opts.output) {
    // Generate and write to file
    await regenerateCompletionCache()
    console.log(t('cli.completionCacheRegenerated', shell))
  } else {
    // Regenerate and output to stdout
    await regenerateCompletionCache()
    console.log(t('cli.completionCacheRegenerated', shell))
  }
}
