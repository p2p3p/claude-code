import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const pipes = {
  type: 'local',
  name: 'pipes',
  description: t('cmd.descPipes'),
  supportsNonInteractive: true,
  load: () => import('./pipes.js')} satisfies Command

export default pipes
