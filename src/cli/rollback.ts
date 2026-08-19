/**
 * `claude rollback [target]` — roll back to a previous Claude Code version.
 *
 * ANT-only command (USER_TYPE === "ant").
 *
 * Options:
 *   --list      List recent published versions
 *   --dry-run   Show what would be installed without installing
 *   --safe      Roll back to the server-pinned safe version
 */
import { t } from '../utils/i18n/index.js'

export async function rollback(
  target?: string,
  options?: { list?: boolean; dryRun?: boolean; safe?: boolean },
): Promise<void> {
  if (options?.list) {
    console.log(t('rollback.recentVersions'))
    console.log(t('rollback.versionListingRequires'))
    console.log(t('rollback.useUpdateList'))
    return
  }

  if (options?.safe) {
    console.log(t('rollback.safeRollback'))
    if (options.dryRun) {
      console.log(t('rollback.dryRunNoChanges'))
      return
    }
    console.log(t('rollback.safeVersionRequires'))
    console.log(t('rollback.contactOncall'))
    return
  }

  if (!target) {
    console.error(t('rollback.usage'))
    process.exitCode = 1
    return
  }

  console.log(t('rollback.rollingBack', target))

  if (options?.dryRun) {
    console.log(t('rollback.dryRunInstall', target))
    return
  }

  // Version rollback via npm/bun
  const { spawnSync } = await import('child_process')
  const result = spawnSync(
    'npm',
    ['install', '-g', `@anthropic-ai/claude-code@${target}`],
    { stdio: 'inherit' },
  )

  if (result.status !== 0) {
    console.error(t('rollback.rollbackFailed', result.status))
    process.exitCode = result.status ?? 1
  } else {
    console.log(t('rollback.rollbackSuccess', target))
  }
}
