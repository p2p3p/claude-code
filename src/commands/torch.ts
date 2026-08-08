import type { Command, LocalJSXCommandOnDone } from '../types/command.js'
import type { ReactNode } from 'react'
import { t } from '../utils/i18n/index.js'

const call = async (onDone: LocalJSXCommandOnDone): Promise<ReactNode> => {
  onDone(
    'torch: Reserved internal debug command. No implementation is available in this build.',
    { display: 'system' },
  )
  return null
}

export default {
  type: 'local-jsx',
  name: 'torch',
  description: t('torchCmd.internalDevDebug'),
  isEnabled: () => true,
  isHidden: true,
  load: () => Promise.resolve({ call }),
} satisfies Command
