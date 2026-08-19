import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const mcp = {
  type: 'local-jsx',
  name: 'mcp',
  description: t('cmd.descMcp'),
  immediate: true,
  argumentHint: '[enable|disable [server-name]]',
  load: () => import('./mcp.js')} satisfies Command

export default mcp
