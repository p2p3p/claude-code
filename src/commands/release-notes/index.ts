import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const releaseNotes: Command = {
  description: t('cmd.descReleaseNotes'),
  name: 'release-notes',
  type: 'local',
  supportsNonInteractive: true,
  load: () => import('./release-notes.js'),
}

export default releaseNotes
