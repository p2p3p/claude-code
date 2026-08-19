import { join } from 'node:path'
import type { LocalCommandCall } from '../../types/command.js'
import { getClaudeConfigHomeDir } from '../../utils/envUtils.js'
import { t } from '../../utils/i18n/index.js'
import {
  analyzeObservations,
  applySkillLifecycleDecision,
  compareExistingSkills,
  decideSkillLifecycle,
  exportInstincts,
  findPromotionCandidates,
  generateSkillCandidates,
  ingestTranscript,
  listKnownProjects,
  loadInstincts,
  promoteGapToDraft,
  prunePendingInstincts,
  readObservations,
  readSkillGaps,
  resolveProjectContext,
  saveInstinct,
  upsertInstinct} from '../../services/skillLearning/index.js'

export const call: LocalCommandCall = async (
  args,
): Promise<{ type: 'text'; value: string }> => {
  const parts = args.trim().split(/\s+/).filter(Boolean)
  const sub = parts[0] ?? 'status'
  const project = resolveProjectContext(process.cwd())
  const rootDir = process.env.CLAUDE_SKILL_LEARNING_HOME
  const options = { project, rootDir }

  switch (sub) {
    case 'status': {
      const [observations, instincts] = await Promise.all([
        readObservations(options),
        loadInstincts(options),
      ])
      return {
        type: 'text',
        value: [
          t('skillLearning.statusHeader', project.projectName, project.projectId),
          t('skillLearning.observationsCount', observations.length),
          t('skillLearning.instinctsCount', instincts.length),
        ].join('\n')}
    }
    case 'ingest': {
      const transcript = parts[1]
      if (!transcript) {
        return {
          type: 'text',
          value: t('skillLearning.usageIngest')}
      }
      const minSessionLength = parseFlagNumber(
        parts,
        '--min-session-length',
        10,
      )
      const observations = await ingestTranscript(transcript, options)
      if (observations.length < minSessionLength) {
        return {
          type: 'text',
          value: t('skillLearning.sessionTooShort', observations.length, minSessionLength)}
      }
      const instincts = analyzeObservations(observations)
      const saved = []
      for (const instinct of instincts) {
        saved.push(await upsertInstinct(instinct, options))
      }
      return {
        type: 'text',
        value: t('skillLearning.ingested', observations.length, saved.length)}
    }
    case 'evolve': {
      const generate = parts.includes('--generate')
      const instincts = await loadInstincts(options)
      const drafts = generateSkillCandidates(instincts, { cwd: process.cwd() })
      const written = []
      if (generate) {
        for (const draft of drafts) {
          const roots = [
            join(process.cwd(), '.claude', 'skills'),
            join(getClaudeConfigHomeDir(), 'skills'),
          ]
          const existing = await compareExistingSkills(draft, roots)
          const decision = decideSkillLifecycle(draft, existing)
          const result = await applySkillLifecycleDecision(decision)
          written.push(
            t('skillLearning.evolveResult', decision.type, result.activePath ?? result.archivedPath ?? result.deletedPath ?? t('skillLearning.noActiveWrite')),
          )
        }
      }
      return {
        type: 'text',
        value: generate
          ? t('skillLearning.evolveGenerated', written.length, written.join('\n'))
          : t('skillLearning.evolveFound', drafts.length)}
    }
    case 'export': {
      const output = parts[1] ?? 'skill-learning-instincts.json'
      const scope = parseFlagString(parts, '--scope')
      const minConf = parseFlagNumber(parts, '--min-conf', undefined)
      const domain = parseFlagString(parts, '--domain')
      const filter = (instincts: Awaited<ReturnType<typeof loadInstincts>>) =>
        instincts.filter(i => {
          if (scope && i.scope !== scope) return false
          if (minConf !== undefined && i.confidence < minConf) return false
          if (domain && i.domain !== domain) return false
          return true
        })
      const all = await loadInstincts(options)
      const filtered = filter(all)
      if (filtered.length !== all.length) {
        await exportInstincts(output, options)
        // Re-write with filtered payload to honor filter args.
        const { writeFile } = await import('node:fs/promises')
        await writeFile(output, `${JSON.stringify(filtered, null, 2)}\n`)
      } else {
        await exportInstincts(output, options)
      }
      const parts2: string[] = [
        t('skillLearning.exported', filtered.length, output),
      ]
      if (scope || minConf !== undefined || domain) {
        const filters: string[] = []
        if (scope) filters.push(`scope=${scope}`)
        if (minConf !== undefined) filters.push(`min-conf=${minConf}`)
        if (domain) filters.push(`domain=${domain}`)
        parts2.push(t('skillLearning.exportFilters', filters.join(', ')))
      }
      return { type: 'text', value: parts2.join(' ') }
    }
    case 'import': {
      const input = parts[1]
      if (!input) {
        return {
          type: 'text',
          value: t('skillLearning.usageImport')}
      }
      const scope = parseFlagString(parts, '--scope')
      const minConf = parseFlagNumber(parts, '--min-conf', undefined)
      const domain = parseFlagString(parts, '--domain')
      const dryRun = parts.includes('--dry-run')
      // Read + filter first so --dry-run can truly skip persistence. The
      // previous `importInstincts(...)` call wrote to disk before branching
      // on --dry-run, which defeated the purpose of the flag.
      const { readFile: readFileFs } = await import('node:fs/promises')
      const parsed = JSON.parse(await readFileFs(input, 'utf8')) as Awaited<
        ReturnType<typeof loadInstincts>
      >
      const filtered = parsed.filter(i => {
        if (scope && i.scope !== scope) return false
        if (minConf !== undefined && i.confidence < minConf) return false
        if (domain && i.domain !== domain) return false
        return true
      })
      if (dryRun) {
        return {
          type: 'text',
          value: t('skillLearning.dryRun', filtered.length, parsed.length)}
      }
      for (const instinct of filtered) {
        await upsertInstinct(instinct, options)
      }
      return {
        type: 'text',
        value: t('skillLearning.imported', filtered.length, parsed.length)}
    }
    case 'prune': {
      const maxAgeIndex = parts.indexOf('--max-age')
      const maxAge =
        maxAgeIndex >= 0 && parts[maxAgeIndex + 1]
          ? Number(parts[maxAgeIndex + 1])
          : 30
      const pruned = await prunePendingInstincts(maxAge, options)
      return {
        type: 'text',
        value: t('skillLearning.pruned', pruned.length)}
    }
    case 'promote': {
      const target = parts[1]
      if (!target) {
        const gaps = await readSkillGaps(project, rootDir)
        const instincts = await loadInstincts(options)
        const candidates = findPromotionCandidates(instincts)
        const lines = [
          t('skillLearning.promoteCandidatesHeader', project.projectName, project.projectId),
          t('skillLearning.pendingGaps', gaps.filter(g => g.status === 'pending').length),
          t('skillLearning.globalEligible', candidates.length),
          '',
          t('skillLearning.promoteUsage'),
        ]
        return { type: 'text', value: lines.join('\n') }
      }

      if (target === 'gap') {
        const gapKey = parts[2]
        if (!gapKey) {
          return {
            type: 'text',
            value: t('skillLearning.usagePromoteGap')}
        }
        const updated = await promoteGapToDraft(gapKey, project, rootDir)
        if (!updated) {
          return { type: 'text', value: t('skillLearning.noGapFound', gapKey) }
        }
        return {
          type: 'text',
          value: t('skillLearning.promotedGap', gapKey, updated.status, updated.draft?.skillPath ?? t('skillLearning.none'))}
      }

      if (target === 'instinct') {
        const instinctId = parts[2]
        if (!instinctId) {
          return {
            type: 'text',
            value: t('skillLearning.usagePromoteInstinct')}
        }
        const projectInstincts = await loadInstincts(options)
        const match = projectInstincts.find(i => i.id === instinctId)
        if (!match) {
          return {
            type: 'text',
            value: t('skillLearning.noInstinctFound', instinctId)}
        }
        if (match.scope === 'global') {
          return {
            type: 'text',
            value: t('skillLearning.instinctAlreadyGlobal', instinctId)}
        }
        const globalCopy = { ...match, scope: 'global' as const }
        await saveInstinct(globalCopy, { scope: 'global', rootDir })
        return {
          type: 'text',
          value: t('skillLearning.promotedInstinct', instinctId)}
      }

      return {
        type: 'text',
        value: t('skillLearning.usagePromote')}
    }
    case 'projects': {
      const projects = listKnownProjects()
      if (projects.length === 0) {
        return { type: 'text', value: t('skillLearning.noKnownProjects') }
      }
      const lines = [t('skillLearning.knownProjectsHeader')]
      for (const record of projects) {
        const projectOptions = { project: record, rootDir }
        const [instincts, observations] = await Promise.all([
          loadInstincts(projectOptions),
          readObservations(projectOptions),
        ])
        lines.push(
          t('skillLearning.projectLine', record.projectName, record.projectId, instincts.length, observations.length, record.lastSeenAt),
        )
      }
      return { type: 'text', value: lines.join('\n') }
    }
    default:
      return {
        type: 'text',
        value: t('skillLearning.usageDefault')}
  }
}

function parseFlagString(parts: string[], flag: string): string | undefined {
  const eqForm = parts.find(p => p.startsWith(`${flag}=`))
  if (eqForm) return eqForm.slice(flag.length + 1) || undefined
  const idx = parts.indexOf(flag)
  if (idx >= 0 && parts[idx + 1] && !parts[idx + 1].startsWith('--')) {
    return parts[idx + 1]
  }
  return undefined
}

function parseFlagNumber<T extends number | undefined>(
  parts: string[],
  flag: string,
  fallback: T,
): number | T {
  const raw = parseFlagString(parts, flag)
  if (raw === undefined) return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}
