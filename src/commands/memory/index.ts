import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const memory: Command = {
  type: 'local-jsx',
  name: 'memory',
  description: t('cmd.descMemory'),
  load: () => import('./memory.js'),
}

export default memory
