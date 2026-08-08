import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const claimMain = {
  type: 'local',
  name: 'claim-main',
  description: t('cmd.descClaimMain'),
  supportsNonInteractive: false,
  load: () => import('./claim-main.js'),
} satisfies Command

export default claimMain
