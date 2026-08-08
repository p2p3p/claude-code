import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const detach = {
  type: 'local',
  name: 'detach',
  description: t('cmd.descDetach'),
  supportsNonInteractive: false,
  load: () => import('./detach.js'),
} satisfies Command

export default detach
