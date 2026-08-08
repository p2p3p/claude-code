import type { Command, LocalCommandCall } from '../types/command.js'
import { t } from '../utils/i18n/index.js'

const call: LocalCommandCall = async () => {
  return {
    type: 'text',
    value: MACRO.BUILD_TIME
      ? `${MACRO.VERSION} (built ${MACRO.BUILD_TIME})`
      : MACRO.VERSION,
  }
}

const version = {
  type: 'local',
  name: 'version',
  description: t('cmd.descVersion'),
  // Was Ant-only upstream; for fork subscribers we want this universally
  // available — version info is harmless and useful for bug reports.
  isEnabled: () => true,
  supportsNonInteractive: true,
  load: () => Promise.resolve({ call }),
} satisfies Command

export default version
