import type { Command } from '../../commands.js'
import { env } from '../../utils/env.js'
import { t } from '../../utils/i18n/index.js'

// Terminals that natively support CSI u / Kitty keyboard protocol
const NATIVE_CSIU_TERMINALS: Record<string, string> = {
  ghostty: 'Ghostty',
  kitty: 'Kitty',
  'iTerm.app': 'iTerm2',
  WezTerm: 'WezTerm'}

const terminalSetup = {
  type: 'local-jsx',
  name: 'terminal-setup',
  description:
    env.terminal === 'Apple_Terminal'
      ? t('cmd.descTerminalSetupApple')
      : t('cmd.descTerminalSetup'),
  isHidden: env.terminal !== null && env.terminal in NATIVE_CSIU_TERMINALS,
  load: () => import('./terminalSetup.js')} satisfies Command

export default terminalSetup
