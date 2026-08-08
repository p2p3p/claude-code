import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const attach = {
  type: 'local',
  name: 'attach',
  description: t('cmd.descAttach'),
  supportsNonInteractive: false,
  load: () => import('./attach.js'),
} satisfies Command

export default attach
