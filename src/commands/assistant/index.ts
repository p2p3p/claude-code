import type { Command } from '../../commands.js'
import { isAssistantEnabled } from './gate.js'
import { t } from '../../utils/i18n/index.js'

const assistant = {
  type: 'local-jsx',
  name: 'assistant',
  description: t('cmd.descAssistant'),
  isEnabled: isAssistantEnabled,
  get isHidden() {
    return !isAssistantEnabled()
  },
  immediate: true,
  load: () => import('./assistant.js')} satisfies Command

export default assistant
