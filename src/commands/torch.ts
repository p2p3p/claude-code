import type { Command, LocalJSXCommandOnDone } from '../types/command.js'
import type { ReactNode } from 'react'
import { t } from '../utils/i18n/index.js'

const call = async (onDone: LocalJSXCommandOnDone): Promise<ReactNode> => {
  onDone(
    t('torchCmd.noImpl'),
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
  load: () => Promise.resolve({ call })} satisfies Command
