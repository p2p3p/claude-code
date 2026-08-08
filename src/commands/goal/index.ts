import type { Command } from 'src/commands.js'
import { t } from '../../utils/i18n/index.js'

const goal = {
  type: 'local-jsx',
  name: 'goal',
  description: t('cmd.descGoal'),
  argumentHint: '[<objective> | status | clear | pause | resume | complete]',
  bridgeSafe: false,
  load: () => import('./goal.js'),
} satisfies Command

export default goal
