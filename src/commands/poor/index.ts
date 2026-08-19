import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const poor = {
  type: 'local',
  name: 'poor',
  description: t('cmd.descPoor'),
  supportsNonInteractive: false,
  load: () => import('./poor.js')} satisfies Command

export default poor
