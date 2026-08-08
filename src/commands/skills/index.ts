import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const skills = {
  type: 'local-jsx',
  name: 'skills',
  description: t('cmd.descSkills'),
  load: () => import('./skills.js'),
} satisfies Command

export default skills
