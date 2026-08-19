import type { Command } from '../commands.js'
import type { LocalCommandCall } from '../types/command.js'
import {
  canUserConfigureAdvisor,
  isValidAdvisorModel,
  modelSupportsAdvisor} from '../utils/advisor.js'
import {
  getDefaultMainLoopModelSetting,
  normalizeModelStringForAPI,
  parseUserSpecifiedModel} from '../utils/model/model.js'
import { validateModel } from '../utils/model/validateModel.js'
import { updateSettingsForSource } from '../utils/settings/settings.js'
import { t } from '../utils/i18n/index.js'

const call: LocalCommandCall = async (args, context) => {
  const arg = args.trim().toLowerCase()
  const baseModel = parseUserSpecifiedModel(
    context.getAppState().mainLoopModel ?? getDefaultMainLoopModelSetting(),
  )

  if (!arg) {
    const current = context.getAppState().advisorModel
    if (!current) {
      return {
        type: 'text',
        value: t('advisorMessages.advisorNotSet')}
    }
    if (!modelSupportsAdvisor(baseModel)) {
      return {
        type: 'text',
        value: t('advisorMessages.advisorInactive', current, baseModel)}
    }
    return {
      type: 'text',
      value: t('advisorMessages.advisorStatus', current)}
  }

  if (arg === 'unset' || arg === 'off') {
    const prev = context.getAppState().advisorModel
    context.setAppState(s => {
      if (s.advisorModel === undefined) return s
      return { ...s, advisorModel: undefined }
    })
    updateSettingsForSource('userSettings', { advisorModel: undefined })
    return {
      type: 'text',
      value: prev
        ? t('advisorMessages.advisorDisabledWas', prev)
        : t('advisorMessages.advisorAlreadyUnset')}
  }

  const normalizedModel = normalizeModelStringForAPI(arg)
  const resolvedModel = parseUserSpecifiedModel(arg)
  const { valid, error } = await validateModel(resolvedModel)
  if (!valid) {
    return {
      type: 'text',
      value: error
        ? t('advisorMessages.invalidAdvisorModel', error)
        : t('advisorMessages.unknownModel', arg, resolvedModel)}
  }

  if (!isValidAdvisorModel(resolvedModel)) {
    return {
      type: 'text',
      value: t('advisorMessages.cannotUseAsAdvisor', arg, resolvedModel)}
  }

  context.setAppState(s => {
    if (s.advisorModel === normalizedModel) return s
    return { ...s, advisorModel: normalizedModel }
  })
  updateSettingsForSource('userSettings', { advisorModel: normalizedModel })

  if (!modelSupportsAdvisor(baseModel)) {
    return {
      type: 'text',
      value: t('advisorMessages.advisorSetWarning', normalizedModel, baseModel)}
  }

  return {
    type: 'text',
    value: t('advisorMessages.advisorSet', normalizedModel)}
}

const advisor = {
  type: 'local',
  name: 'advisor',
  description: t('cmd.descAdvisor'),
  argumentHint: '[<model>|off]',
  isEnabled: () => canUserConfigureAdvisor(),
  get isHidden() {
    return !canUserConfigureAdvisor()
  },
  supportsNonInteractive: true,
  load: () => Promise.resolve({ call })} satisfies Command

export default advisor
