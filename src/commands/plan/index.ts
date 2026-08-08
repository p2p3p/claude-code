import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const plan = {
  bridgeSafe: true,
  getBridgeInvocationError(args: string) {
    const subcommand = args.trim().split(/\s+/)[0]
    if (subcommand === 'open') {
      return "Opening the local editor via /plan open isn't available over Remote Control."
    }
    return undefined
  },
  type: 'local-jsx',
  name: 'plan',
  description: t('cmd.descPlan'),
  argumentHint: '[open|<description>]',
  load: () => import('./plan.js'),
} satisfies Command

export default plan
