import type { Command } from '../../commands.js'
import { t } from '../../utils/i18n/index.js'

const artifacts = {
  type: 'local-jsx',
  name: 'artifacts',
  description: t('cmd.descArtifacts'),
  isEnabled: () => true,
  load: () => import('./artifacts.js')} satisfies Command

export default artifacts
