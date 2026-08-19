import type { Command } from '../../commands.js'
import { isSkillSearchCompiledIn } from '../../services/skillSearch/featureCheck.js'
import { t } from '../../utils/i18n/index.js'

const skillSearch = {
  type: 'local-jsx',
  name: 'skill-search',
  description: t('cmd.descSkillSearch'),
  argumentHint: '[start|stop|about|status]',
  // Visible whenever the subsystem is compiled in (build flag); runtime
  // activation is separate and operator-controlled via /skill-search start.
  isEnabled: () => isSkillSearchCompiledIn(),
  isHidden: false,
  load: () => import('./skillSearchPanel.js')} satisfies Command

export default skillSearch
