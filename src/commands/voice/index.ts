import type { Command } from '../../commands.js'
import { isVoiceAvailable } from '../../voice/voiceModeEnabled.js'
import { t } from '../../utils/i18n/index.js'

const voice = {
  type: 'local',
  name: 'voice',
  description: t('cmd.descVoice'),
  isEnabled: () => isVoiceAvailable(),
  get isHidden() {
    return !isVoiceAvailable()
  },
  supportsNonInteractive: false,
  load: () => import('./voice.js'),
} satisfies Command

export default voice
