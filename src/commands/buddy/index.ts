import type { Command } from '../../commands.js'
import { isBuddyLive } from '../../buddy/useBuddyNotification.js'
import { t } from '../../utils/i18n/index.js'

const buddy = {
  type: 'local-jsx',
  name: 'buddy',
  description: t('cmd.descBuddy'),
  argumentHint: '[pet|off]',
  immediate: true,
  get isHidden() {
    return !isBuddyLive()
  },
  load: () => import('./buddy.js')} satisfies Command

export default buddy
