import { getFeatureValue_CACHED_MAY_BE_STALE } from 'src/services/analytics/growthbook'
import { t } from 'src/utils/i18n/index.js'
import simple_plan from './prompts/simple_plan.txt'
import visual_plan from './prompts/visual_plan.txt'
import three_subagents_with_critique from './prompts/three_subagents_with_critique.txt'

export type PromptIdentifier = keyof typeof PROMPTS

const DEFAULT_PROMPT_IDENTIFIER = 'simple_plan'

const PROMPTS = {
  simple_plan,
  visual_plan,
  three_subagents_with_critique}

export function isValidPromptIdentifier(value: string): boolean {
  return value in PROMPTS
}

export function getPromptIdentifier(): PromptIdentifier {
  const promptIdentifier = getFeatureValue_CACHED_MAY_BE_STALE(
    'tengu_ultraplan_prompt_identifier',
    DEFAULT_PROMPT_IDENTIFIER,
  )
  return isValidPromptIdentifier(promptIdentifier)
    ? promptIdentifier
    : DEFAULT_PROMPT_IDENTIFIER
}

export function getPromptText(id: PromptIdentifier): string {
  return PROMPTS[id].trimEnd()
}

const DEFAULT_DIALOG = {
  timeEstimate: t('ultraplanDialog.aFewMinutes'),
  dialogBody: t('ultraplanDialog.dialogBody'),
  dialogPipeline: t('ultraplanDialog.planExecute'),
  usageBlurb: t('ultraplanDialog.usageBlurbDefault')}

export const DIALOG_CONFIG = {
  simple_plan: DEFAULT_DIALOG,
  visual_plan: DEFAULT_DIALOG,
  three_subagents_with_critique: {
    timeEstimate: t('ultraplanDialog.tenToThirtyMin'),
    dialogBody: t('ultraplanDialog.dialogBody'),
    dialogPipeline: t('ultraplanDialog.scopeCritique'),
    usageBlurb: t('ultraplanDialog.usageBlurbAdvanced')}}

export function getDialogConfig(id?: PromptIdentifier) {
  return DIALOG_CONFIG[id ?? getPromptIdentifier()]
}
