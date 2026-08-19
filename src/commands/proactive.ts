/**
 * /proactive — Toggle proactive (autonomous tick-driven) mode.
 *
 * When enabled, the model receives periodic <tick> prompts and works
 * autonomously between user inputs.  SleepTool controls pacing.
 */
import { t } from '../utils/i18n/index.js'
import { feature } from 'bun:bundle'
import type { ToolUseContext } from '../Tool.js'
import type {
  Command,
  LocalJSXCommandContext,
  LocalJSXCommandOnDone} from '../types/command.js'

const proactive = {
  bridgeSafe: true,
  type: 'local-jsx',
  name: 'proactive',
  description: t('cmd.descProactive'),
  isEnabled: () => {
    if (feature('PROACTIVE') || feature('KAIROS')) {
      return true
    }
    return false
  },
  immediate: true,
  load: () =>
    Promise.resolve({
      async call(
        onDone: LocalJSXCommandOnDone,
        _context: ToolUseContext & LocalJSXCommandContext,
      ): Promise<React.ReactNode> {
        // Dynamic require to avoid pulling proactive into non-gated builds
        const mod =
          require('../proactive/index.js') as typeof import('../proactive/index.js')

        if (mod.isProactiveActive()) {
          mod.deactivateProactive()
          onDone(t('proactiveCmd.disabled'), { display: 'system' })
        } else {
          mod.activateProactive('slash_command')
          onDone(
            t('proactiveCmd.enabled'),
            {
              display: 'system',
              metaMessages: [t('proactiveCmd.systemReminder')]},
          )
        }
        return null
      }})} satisfies Command

export default proactive
