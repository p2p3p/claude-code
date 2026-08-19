import { randomUUID } from 'crypto'
import { t } from '../../utils/i18n/index.js'
import { listTemplates, loadTemplate } from '../../jobs/templates.js'
import {
  createJob,
  readJobState,
  appendJobReply,
  getJobDir} from '../../jobs/state.js'

/**
 * Entry point for template job commands: `new`, `list`, `reply`.
 * Called from cli.tsx fast-path.
 */
export async function templatesMain(args: string[]): Promise<void> {
  const subcommand = args[0]

  switch (subcommand) {
    case 'list':
      handleList()
      break
    case 'new':
      handleNew(args.slice(1))
      break
    case 'reply':
      handleReply(args.slice(1))
      break
    case 'status':
      handleStatus(args.slice(1))
      break
    default:
      console.error(t('templateJobs.unknownCommand', subcommand))
      printUsage()
      process.exitCode = 1
  }
}

function printUsage(): void {
  console.log(t('templateJobs.usage'))
}

function handleStatus(args: string[]): void {
  const jobId = args[0]
  if (!jobId) {
    console.error(t('templateJobs.usageStatus'))
    process.exitCode = 1
    return
  }

  const state = readJobState(jobId)
  if (!state) {
    console.error(t('templateJobs.jobNotFound', jobId))
    process.exitCode = 1
    return
  }

  console.log(t('templateJobs.jobLabel', state.jobId))
  console.log(t('templateJobs.templateLabel', state.templateName))
  console.log(t('templateJobs.statusLabel', state.status))
  console.log(t('templateJobs.createdLabel', state.createdAt))
  console.log(t('templateJobs.updatedLabel', state.updatedAt))
  console.log(t('templateJobs.argsLabel', state.args.join(' ') || t('templateJobs.none')))
}

function handleList(): void {
  const templates = listTemplates()

  if (templates.length === 0) {
    console.log(t('templateJobs.noTemplatesFound'))
    console.log(t('templateJobs.placeTemplates'))
    return
  }

  console.log(t('templateJobs.templatesFound', templates.length))

  for (const tpl of templates) {
    console.log(`  ${tpl.name}`)
    console.log(`    ${tpl.description}`)
    console.log(t('templateJobs.pathLabel', tpl.filePath))
    console.log()
  }
}

function handleNew(args: string[]): void {
  const templateName = args[0]
  if (!templateName) {
    console.error(t('templateJobs.usageNew'))
    process.exitCode = 1
    return
  }

  const template = loadTemplate(templateName)
  if (!template) {
    console.error(t('templateJobs.templateNotFound', templateName))
    console.log(t('templateJobs.availableTemplates'))
    for (const tpl of listTemplates()) {
      console.log(`  ${tpl.name}`)
    }
    process.exitCode = 1
    return
  }

  const jobId = randomUUID().slice(0, 8)
  const inputText = args.slice(1).join(' ')
  const rawContent = `---\n${Object.entries(template.frontmatter)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}\n---\n${template.content}`

  const dir = createJob(
    jobId,
    templateName,
    rawContent,
    inputText,
    args.slice(1),
  )

  console.log(t('templateJobs.jobCreated', jobId))
  console.log(t('templateJobs.templateLabel', templateName))
  console.log(t('templateJobs.directoryLabel', dir))
  if (inputText) {
    console.log(t('templateJobs.inputLabel', inputText))
  }
}

function handleReply(args: string[]): void {
  const jobId = args[0]
  const text = args.slice(1).join(' ')

  if (!jobId || !text) {
    console.error(t('templateJobs.usageReply'))
    process.exitCode = 1
    return
  }

  const state = readJobState(jobId)
  if (!state) {
    console.error(t('templateJobs.jobNotFound', jobId))
    process.exitCode = 1
    return
  }

  const ok = appendJobReply(jobId, text)
  if (ok) {
    console.log(t('templateJobs.replyAdded', jobId))
    console.log(t('templateJobs.directoryLabel', getJobDir(jobId)))
  } else {
    console.error(t('templateJobs.replyFailed', jobId))
    process.exitCode = 1
  }
}
