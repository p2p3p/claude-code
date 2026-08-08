import { getIsNonInteractiveSession } from '../../bootstrap/state.js'
import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const command: Command = {
  name: 'chrome',
  description: t('cmd.descChrome'),
  availability: [],
  isEnabled: () => !getIsNonInteractiveSession(),
  type: 'local-jsx',
  load: () => import('./chrome.js'),
}

export default command
