import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const resume: Command = {
  type: 'local-jsx',
  name: 'resume',
  description: t('cmd.descResume'),
  aliases: ['continue'],
  argumentHint: '[conversation id or search term]',
  load: () => import('./resume.js'),
}

export default resume
