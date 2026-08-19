import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const command = {
  name: 'vim',
  description: t('cmd.descVim'),
  supportsNonInteractive: false,
  type: 'local',
  load: () => import('./vim.js')} satisfies Command

export default command
