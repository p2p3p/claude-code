import chalk from 'chalk'
import { logForDebugging } from 'src/utils/debug.js'
import { fileHistoryEnabled } from 'src/utils/fileHistory.js'
import {
  getInitialSettings,
  getSettings_DEPRECATED,
  getSettingsForSource,
} from 'src/utils/settings/settings.js'
import { shouldOfferTerminalSetup } from '../../commands/terminalSetup/terminalSetup.js'
import { getDesktopUpsellConfig } from '../../components/DesktopUpsell/DesktopUpsellStartup.js'
import { color } from '@anthropic/ink'
import { shouldShowOverageCreditUpsell } from '../../components/LogoV2/OverageCreditUpsell.js'
import { getShortcutDisplay } from '../../keybindings/shortcutFormat.js'
import { isKairosCronEnabled } from '@claude-code-best/builtin-tools/tools/ScheduleCronTool/prompt.js'
import { is1PApiCustomer } from '../../utils/auth.js'
import { countConcurrentSessions } from '../../utils/concurrentSessions.js'
import { getGlobalConfig } from '../../utils/config.js'
import {
  getEffortEnvOverride,
  modelSupportsEffort,
} from '../../utils/effort.js'
import { env } from '../../utils/env.js'
import { cacheKeys } from '../../utils/fileStateCache.js'
import { getWorktreeCount } from '../../utils/git.js'
import {
  detectRunningIDEsCached,
  getSortedIdeLockfiles,
  isCursorInstalled,
  isSupportedTerminal,
  isSupportedVSCodeTerminal,
  isVSCodeInstalled,
  isWindsurfInstalled,
} from '../../utils/ide.js'
import {
  getMainLoopModel,
  getUserSpecifiedModelSetting,
} from '../../utils/model/model.js'
import { getPlatform } from '../../utils/platform.js'
import { isPluginInstalled } from '../../utils/plugins/installedPluginsManager.js'
import { loadKnownMarketplacesConfigSafe } from '../../utils/plugins/marketplaceManager.js'
import { OFFICIAL_MARKETPLACE_NAME } from '../../utils/plugins/officialMarketplace.js'
import {
  getCurrentSessionAgentColor,
  isCustomTitleEnabled,
} from '../../utils/sessionStorage.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../analytics/growthbook.js'
import {
  formatGrantAmount,
  getCachedOverageCreditGrant,
} from '../api/overageCreditGrant.js'
import {
  checkCachedPassesEligibility,
  formatCreditAmount,
  getCachedReferrerReward,
} from '../api/referral.js'
import { getSessionsSinceLastShown } from './tipHistory.js'
import { t } from '../../utils/i18n/index.js'
import type { Tip, TipContext } from './types.js'

let _isOfficialMarketplaceInstalledCache: boolean | undefined
async function isOfficialMarketplaceInstalled(): Promise<boolean> {
  if (_isOfficialMarketplaceInstalledCache !== undefined) {
    return _isOfficialMarketplaceInstalledCache
  }
  const config = await loadKnownMarketplacesConfigSafe()
  _isOfficialMarketplaceInstalledCache = OFFICIAL_MARKETPLACE_NAME in config
  return _isOfficialMarketplaceInstalledCache
}

async function isMarketplacePluginRelevant(
  pluginName: string,
  context: TipContext | undefined,
  signals: { filePath?: RegExp; cli?: string[] },
): Promise<boolean> {
  if (!(await isOfficialMarketplaceInstalled())) {
    return false
  }
  if (isPluginInstalled(`${pluginName}@${OFFICIAL_MARKETPLACE_NAME}`)) {
    return false
  }
  const { bashTools } = context ?? {}
  if (signals.cli && bashTools?.size) {
    if (signals.cli.some(cmd => bashTools.has(cmd))) {
      return true
    }
  }
  if (signals.filePath && context?.readFileState) {
    const readFiles = cacheKeys(context.readFileState)
    if (readFiles.some(fp => signals.filePath!.test(fp))) {
      return true
    }
  }
  return false
}

const externalTips: Tip[] = [
  {
    id: 'new-user-warmup',
    content: async () => t('tips.newUserWarmup'),
    cooldownSessions: 3,
    async isRelevant() {
      const config = getGlobalConfig()
      return config.numStartups < 10
    },
  },
  {
    id: 'plan-mode-for-complex-tasks',
    content: async () => t('tips.planModeForComplexTasks', getShortcutDisplay('chat:cycleMode', 'Chat', 'shift+tab')),
    cooldownSessions: 5,
    isRelevant: async () => {
      const config = getGlobalConfig()
      // Show to users who haven't used plan mode recently (7+ days)
      const daysSinceLastUse = config.lastPlanModeUse
        ? (Date.now() - config.lastPlanModeUse) / (1000 * 60 * 60 * 24)
        : Infinity
      return daysSinceLastUse > 7
    },
  },
  {
    id: 'default-permission-mode-config',
    content: async () => t('tips.defaultPermissionModeConfig'),
    cooldownSessions: 10,
    isRelevant: async () => {
      try {
        const config = getGlobalConfig()
        const settings = getSettings_DEPRECATED()
        // Show if they've used plan mode but haven't set a default
        const hasUsedPlanMode = Boolean(config.lastPlanModeUse)
        const hasDefaultMode = Boolean(settings?.permissions?.defaultMode)
        return hasUsedPlanMode && !hasDefaultMode
      } catch (error) {
        logForDebugging(
          `Failed to check default-permission-mode-config tip relevance: ${error}`,
          { level: 'warn' },
        )
        return false
      }
    },
  },
  {
    id: 'git-worktrees',
    content: async () => t('tips.gitWorktrees'),
    cooldownSessions: 10,
    isRelevant: async () => {
      try {
        const config = getGlobalConfig()
        const worktreeCount = await getWorktreeCount()
        return worktreeCount <= 1 && config.numStartups > 50
      } catch (_) {
        return false
      }
    },
  },
  {
    id: 'color-when-multi-clauding',
    content: async () => t('tips.colorWhenMultiClauding'),
    cooldownSessions: 10,
    isRelevant: async () => {
      if (getCurrentSessionAgentColor()) return false
      const count = await countConcurrentSessions()
      return count >= 2
    },
  },
  {
    id: 'terminal-setup',
    content: async () =>
      env.terminal === 'Apple_Terminal'
        ? t('tips.terminalSetupApple')
        : t('tips.terminalSetupOther'),
    cooldownSessions: 10,
    async isRelevant() {
      const config = getGlobalConfig()
      if (env.terminal === 'Apple_Terminal') {
        return !config.optionAsMetaKeyInstalled
      }
      return !config.shiftEnterKeyBindingInstalled
    },
  },
  {
    id: 'shift-enter',
    content: async () =>
      env.terminal === 'Apple_Terminal'
        ? t('tips.shiftEnterApple')
        : t('tips.shiftEnterOther'),
    cooldownSessions: 10,
    async isRelevant() {
      const config = getGlobalConfig()
      return Boolean(
        (env.terminal === 'Apple_Terminal'
          ? config.optionAsMetaKeyInstalled
          : config.shiftEnterKeyBindingInstalled) && config.numStartups > 3,
      )
    },
  },
  {
    id: 'shift-enter-setup',
    content: async () =>
      env.terminal === 'Apple_Terminal'
        ? t('tips.shiftEnterSetupApple')
        : t('tips.shiftEnterSetupOther'),
    cooldownSessions: 10,
    async isRelevant() {
      if (!shouldOfferTerminalSetup()) {
        return false
      }
      const config = getGlobalConfig()
      return !(env.terminal === 'Apple_Terminal'
        ? config.optionAsMetaKeyInstalled
        : config.shiftEnterKeyBindingInstalled)
    },
  },
  {
    id: 'memory-command',
    content: async () => t('tips.memoryCommand'),
    cooldownSessions: 15,
    async isRelevant() {
      const config = getGlobalConfig()
      return config.memoryUsageCount <= 0
    },
  },
  {
    id: 'theme-command',
    content: async () => t('tips.themeCommand'),
    cooldownSessions: 20,
    isRelevant: async () => true,
  },
  {
    id: 'colorterm-truecolor',
    content: async () => t('tips.colortermTruecolor'),
    cooldownSessions: 30,
    isRelevant: async () => !process.env.COLORTERM && chalk.level < 3,
  },
  {
    id: 'powershell-tool-env',
    content: async () => t('tips.powershellToolEnv'),
    cooldownSessions: 20,
    isRelevant: async () =>
      getPlatform() === 'windows' &&
      process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL === undefined &&
      getSettings_DEPRECATED().defaultShell === undefined,
  },
  {
    id: 'status-line',
    content: async () => t('tips.statusLine'),
    cooldownSessions: 25,
    isRelevant: async () => getSettings_DEPRECATED().statusLine === undefined,
  },
  {
    id: 'prompt-queue',
    content: async () => t('tips.promptQueue'),
    cooldownSessions: 5,
    async isRelevant() {
      const config = getGlobalConfig()
      return config.promptQueueUseCount <= 3
    },
  },
  {
    id: 'enter-to-steer-in-relatime',
    content: async () => t('tips.enterToSteerInRealtime'),
    cooldownSessions: 20,
    isRelevant: async () => true,
  },
  {
    id: 'todo-list',
    content: async () => t('tips.todoList'),
    cooldownSessions: 20,
    isRelevant: async () => true,
  },
  {
    id: 'vscode-command-install',
    content: async () =>
      t('tips.vscodeCommandInstall', env.terminal === 'vscode' ? 'code' : env.terminal),
    cooldownSessions: 0,
    async isRelevant() {
      // Only show this tip if we're in a VS Code-style terminal
      if (!isSupportedVSCodeTerminal()) {
        return false
      }
      if (getPlatform() !== 'macos') {
        return false
      }

      // Check if the relevant command is available
      switch (env.terminal) {
        case 'vscode':
          return !(await isVSCodeInstalled())
        case 'cursor':
          return !(await isCursorInstalled())
        case 'windsurf':
          return !(await isWindsurfInstalled())
        default:
          return false
      }
    },
  },
  {
    id: 'ide-upsell-external-terminal',
    content: async () => t('tips.ideUpsellExternalTerminal'),
    cooldownSessions: 4,
    async isRelevant() {
      if (isSupportedTerminal()) {
        return false
      }

      // Use lockfiles as a (quicker) signal for running IDEs
      const lockfiles = await getSortedIdeLockfiles()
      if (lockfiles.length !== 0) {
        return false
      }

      const runningIDEs = await detectRunningIDEsCached()
      return runningIDEs.length > 0
    },
  },
  {
    id: 'install-github-app',
    content: async () => t('tips.installGithubApp'),
    cooldownSessions: 10,
    isRelevant: async () => !getGlobalConfig().githubActionSetupCount,
  },
  {
    id: 'install-slack-app',
    content: async () => t('tips.installSlackApp'),
    cooldownSessions: 10,
    isRelevant: async () => !getGlobalConfig().slackAppInstallCount,
  },
  {
    id: 'permissions',
    content: async () => t('tips.permissions'),
    cooldownSessions: 10,
    async isRelevant() {
      const config = getGlobalConfig()
      return config.numStartups > 10
    },
  },
  {
    id: 'drag-and-drop-images',
    content: async () => t('tips.dragAndDropImages'),
    cooldownSessions: 10,
    isRelevant: async () => !env.isSSH(),
  },
  {
    id: 'paste-images-mac',
    content: async () => t('tips.pasteImagesMac'),
    cooldownSessions: 10,
    isRelevant: async () => getPlatform() === 'macos',
  },
  {
    id: 'double-esc',
    content: async () => t('tips.doubleEsc'),
    cooldownSessions: 10,
    isRelevant: async () => !fileHistoryEnabled(),
  },
  {
    id: 'double-esc-code-restore',
    content: async () => t('tips.doubleEscCodeRestore'),
    cooldownSessions: 10,
    isRelevant: async () => fileHistoryEnabled(),
  },
  {
    id: 'continue',
    content: async () => t('tips.continue'),
    cooldownSessions: 10,
    isRelevant: async () => true,
  },
  {
    id: 'rename-conversation',
    content: async () => t('tips.renameConversation'),
    cooldownSessions: 15,
    isRelevant: async () =>
      isCustomTitleEnabled() && getGlobalConfig().numStartups > 10,
  },
  {
    id: 'custom-commands',
    content: async () => t('tips.customCommands'),
    cooldownSessions: 15,
    async isRelevant() {
      const config = getGlobalConfig()
      return config.numStartups > 10
    },
  },
  {
    id: 'shift-tab',
    content: async () =>
      t('tips.shiftTab', getShortcutDisplay('chat:cycleMode', 'Chat', 'shift+tab')),
    cooldownSessions: 10,
    isRelevant: async () => true,
  },
  {
    id: 'image-paste',
    content: async () =>
      t('tips.imagePaste', getShortcutDisplay('chat:imagePaste', 'Chat', 'ctrl+v')),
    cooldownSessions: 20,
    isRelevant: async () => true,
  },
  {
    id: 'custom-agents',
    content: async () => t('tips.customAgents'),
    cooldownSessions: 15,
    async isRelevant() {
      const config = getGlobalConfig()
      return config.numStartups > 5
    },
  },
  {
    id: 'agent-flag',
    content: async () => t('tips.agentFlag'),
    cooldownSessions: 15,
    async isRelevant() {
      const config = getGlobalConfig()
      return config.numStartups > 5
    },
  },
  {
    id: 'desktop-app',
    content: async () => t('tips.desktopApp'),
    cooldownSessions: 15,
    isRelevant: async () => getPlatform() !== 'linux',
  },
  {
    id: 'desktop-shortcut',
    content: async () => t('tips.desktopShortcut'),
    cooldownSessions: 15,
    isRelevant: async () => {
      if (!getDesktopUpsellConfig().enable_shortcut_tip) return false
      return (
        process.platform === 'darwin' ||
        (process.platform === 'win32' && process.arch === 'x64')
      )
    },
  },
  {
    id: 'web-app',
    content: async () => t('tips.webApp'),
    cooldownSessions: 15,
    isRelevant: async () => true,
  },
  {
    id: 'mobile-app',
    content: async () => t('tips.mobileApp'),
    cooldownSessions: 15,
    isRelevant: async () => true,
  },
  {
    id: 'opusplan-mode-reminder',
    content: async () =>
      t('tips.opusplanModeReminder', getShortcutDisplay('chat:cycleMode', 'Chat', 'shift+tab')),
    cooldownSessions: 2,
    async isRelevant() {
      if (process.env.USER_TYPE === 'ant') return false
      const config = getGlobalConfig()
      const modelSetting = getUserSpecifiedModelSetting()
      const hasOpusPlanMode = modelSetting === 'opusplan'
      // Show reminder if they have Opus Plan Mode and haven't used plan mode recently (3+ days)
      const daysSinceLastUse = config.lastPlanModeUse
        ? (Date.now() - config.lastPlanModeUse) / (1000 * 60 * 60 * 24)
        : Infinity
      return hasOpusPlanMode && daysSinceLastUse > 3
    },
  },
  {
    id: 'frontend-design-plugin',
    content: async (ctx?) => {
      const blue = color('suggestion', ctx?.theme ?? 'dark')
      return `${t('tips.frontendDesignPlugin')}:\n${blue(`/plugin install frontend-design@${OFFICIAL_MARKETPLACE_NAME}`)}`
    },
    cooldownSessions: 3,
    isRelevant: async (context?) =>
      isMarketplacePluginRelevant('frontend-design', context, {
        filePath: /\.(html|css|htm)$/i,
      }),
  },
  {
    id: 'vercel-plugin',
    content: async (ctx?) => {
      const blue = color('suggestion', ctx?.theme ?? 'dark')
      return `${t('tips.vercelPlugin')}:\n${blue(`/plugin install vercel@${OFFICIAL_MARKETPLACE_NAME}`)}`
    },
    cooldownSessions: 3,
    isRelevant: async (context?) =>
      isMarketplacePluginRelevant('vercel', context, {
        filePath: /(?:^|[/\\])vercel\.json$/i,
        cli: ['vercel'],
      }),
  },
  {
    id: 'effort-high-nudge',
    content: async () => {
      const variant = getFeatureValue_CACHED_MAY_BE_STALE<
        'off' | 'copy_a' | 'copy_b'
      >('tengu_tide_elm', 'off')
      return variant === 'copy_b'
        ? t('tips.effortHighNudgeB')
        : t('tips.effortHighNudgeA')
    },
    cooldownSessions: 3,
    isRelevant: async () => {
      if (!is1PApiCustomer()) return false
      if (!modelSupportsEffort(getMainLoopModel())) return false
      if (getSettingsForSource('policySettings')?.effortLevel !== undefined) {
        return false
      }
      if (getEffortEnvOverride() !== undefined) return false
      const persisted = getInitialSettings().effortLevel
      if (persisted === 'high' || persisted === 'max') return false
      return (
        getFeatureValue_CACHED_MAY_BE_STALE<'off' | 'copy_a' | 'copy_b'>(
          'tengu_tide_elm',
          'off',
        ) !== 'off'
      )
    },
  },
  {
    id: 'subagent-fanout-nudge',
    content: async () => {
      const variant = getFeatureValue_CACHED_MAY_BE_STALE<
        'off' | 'copy_a' | 'copy_b'
      >('tengu_tern_alloy', 'off')
      return variant === 'copy_b'
        ? t('tips.subagentFanoutNudgeB')
        : t('tips.subagentFanoutNudgeA')
    },
    cooldownSessions: 3,
    isRelevant: async () => {
      if (!is1PApiCustomer()) return false
      return (
        getFeatureValue_CACHED_MAY_BE_STALE<'off' | 'copy_a' | 'copy_b'>(
          'tengu_tern_alloy',
          'off',
        ) !== 'off'
      )
    },
  },
  {
    id: 'loop-command-nudge',
    content: async () => {
      const variant = getFeatureValue_CACHED_MAY_BE_STALE<
        'off' | 'copy_a' | 'copy_b'
      >('tengu_timber_lark', 'off')
      return variant === 'copy_b'
        ? t('tips.loopCommandNudgeB')
        : t('tips.loopCommandNudgeA')
    },
    cooldownSessions: 3,
    isRelevant: async () => {
      if (!is1PApiCustomer()) return false
      if (!isKairosCronEnabled()) return false
      return (
        getFeatureValue_CACHED_MAY_BE_STALE<'off' | 'copy_a' | 'copy_b'>(
          'tengu_timber_lark',
          'off',
        ) !== 'off'
      )
    },
  },
  {
    id: 'guest-passes',
    content: async () => {
      const reward = getCachedReferrerReward()
      return reward
        ? t('tips.guestPassesWithReward', formatCreditAmount(reward))
        : t('tips.guestPassesNoReward')
    },
    cooldownSessions: 3,
    isRelevant: async () => {
      const config = getGlobalConfig()
      if (config.hasVisitedPasses) {
        return false
      }
      const { eligible } = checkCachedPassesEligibility()
      return eligible
    },
  },
  {
    id: 'overage-credit',
    content: async () => {
      const info = getCachedOverageCreditGrant()
      const amount = info ? formatGrantAmount(info) : null
      if (!amount) return ''
      return t('tips.overageCredit', amount)
    },
    cooldownSessions: 3,
    isRelevant: async () => shouldShowOverageCreditUpsell(),
  },
  {
    id: 'feedback-command',
    content: async () => t('tips.feedbackCommand'),
    cooldownSessions: 15,
    async isRelevant() {
      if (process.env.USER_TYPE === 'ant') {
        return false
      }
      const config = getGlobalConfig()
      return config.numStartups > 5
    },
  },
]
const internalOnlyTips: Tip[] =
  process.env.USER_TYPE === 'ant'
    ? [
        {
          id: 'important-claudemd',
          content: async () => t('tips.importantClaudemd'),
          cooldownSessions: 30,
          isRelevant: async () => true,
        },
        {
          id: 'skillify',
          content: async () => t('tips.skillify'),
          cooldownSessions: 15,
          isRelevant: async () => true,
        },
      ]
    : []

function getCustomTips(): Tip[] {
  const settings = getInitialSettings()
  const override = settings.spinnerTipsOverride
  if (!override?.tips?.length) return []

  return override.tips.map((content, i) => ({
    id: `custom-tip-${i}`,
    content: async () => content,
    cooldownSessions: 0,
    isRelevant: async () => true,
  }))
}

export async function getRelevantTips(context?: TipContext): Promise<Tip[]> {
  const settings = getInitialSettings()
  const override = settings.spinnerTipsOverride
  const customTips = getCustomTips()

  // If excludeDefault is true and there are custom tips, skip built-in tips entirely
  if (override?.excludeDefault && customTips.length > 0) {
    return customTips
  }

  // Otherwise, filter built-in tips as before and combine with custom
  const tips = [...externalTips, ...internalOnlyTips]
  const isRelevant = await Promise.all(
    tips.map(_ => _.isRelevant?.(context) ?? Promise.resolve(true)),
  )
  const filtered = tips
    .filter((_, index) => isRelevant[index])
    .filter(_ => getSessionsSinceLastShown(_.id) >= _.cooldownSessions)

  return [...filtered, ...customTips]
}
