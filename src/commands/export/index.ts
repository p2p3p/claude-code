import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const exportCommand = {
  type: 'local-jsx',
  name: 'export',
  description: t('cmd.descExport'),
  argumentHint: '[filename]',
  load: () => import('./export.js'),
} satisfies Command

export default exportCommand
