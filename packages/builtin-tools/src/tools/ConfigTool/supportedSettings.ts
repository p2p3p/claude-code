import { feature } from 'bun:bundle'
import { getRemoteControlAtStartup } from 'src/utils/config.js'
import {
  EDITOR_MODES,
  NOTIFICATION_CHANNELS,
  TEAMMATE_MODES,
} from 'src/utils/configConstants.js'
import { getModelOptions } from 'src/utils/model/modelOptions.js'
import { validateModel } from 'src/utils/model/validateModel.js'
import { THEME_NAMES, THEME_SETTINGS } from 'src/utils/theme.js'
import { t } from '../../../../../src/utils/i18n/index.js'

/** AppState keys that can be synced for immediate UI effect */
type SyncableAppStateKey = 'verbose' | 'mainLoopModel' | 'thinkingEnabled'

type SettingConfig = {
  source: 'global' | 'settings'
  type: 'boolean' | 'string'
  description: string
  path?: string[]
  options?: readonly string[]
  getOptions?: () => string[]
  appStateKey?: SyncableAppStateKey
  /** Async validation called when writing/setting a value */
  validateOnWrite?: (v: unknown) => Promise<{ valid: boolean; error?: string }>
  /** Format value when reading/getting for display */
  formatOnRead?: (v: unknown) => unknown
}

export const SUPPORTED_SETTINGS: Record<string, SettingConfig> = {
  theme: {
    source: 'global',
    type: 'string',
    description: t('configSetting.theme'),
    options: feature('AUTO_THEME') ? THEME_SETTINGS : THEME_NAMES,
  },
  editorMode: {
    source: 'global',
    type: 'string',
    description: t('configSetting.editorMode'),
    options: EDITOR_MODES,
  },
  verbose: {
    source: 'global',
    type: 'boolean',
    description: t('configSetting.verbose'),
    appStateKey: 'verbose',
  },
  preferredNotifChannel: {
    source: 'global',
    type: 'string',
    description: t('configSetting.preferredNotifChannel'),
    options: NOTIFICATION_CHANNELS,
  },
  autoCompactEnabled: {
    source: 'global',
    type: 'boolean',
    description: t('configSetting.autoCompactEnabled'),
  },
  autoMemoryEnabled: {
    source: 'settings',
    type: 'boolean',
    description: t('configSetting.autoMemoryEnabled'),
  },
  autoDreamEnabled: {
    source: 'settings',
    type: 'boolean',
    description: t('configSetting.autoDreamEnabled'),
  },
  fileCheckpointingEnabled: {
    source: 'global',
    type: 'boolean',
    description: t('configSetting.fileCheckpointingEnabled'),
  },
  showTurnDuration: {
    source: 'global',
    type: 'boolean',
    description: t('configSetting.showTurnDuration'),
  },
  terminalProgressBarEnabled: {
    source: 'global',
    type: 'boolean',
    description: t('configSetting.terminalProgressBarEnabled'),
  },
  todoFeatureEnabled: {
    source: 'global',
    type: 'boolean',
    description: t('configSetting.todoFeatureEnabled'),
  },
  model: {
    source: 'settings',
    type: 'string',
    description: t('configSetting.model'),
    appStateKey: 'mainLoopModel',
    getOptions: () => {
      try {
        return getModelOptions()
          .filter(o => o.value !== null)
          .map(o => o.value as string)
      } catch {
        return ['sonnet', 'opus', 'haiku']
      }
    },
    validateOnWrite: v => validateModel(String(v)),
    formatOnRead: v => (v === null ? 'default' : v),
  },
  alwaysThinkingEnabled: {
    source: 'settings',
    type: 'boolean',
    description: t('configSetting.alwaysThinkingEnabled'),
    appStateKey: 'thinkingEnabled',
  },
  'permissions.defaultMode': {
    source: 'settings',
    type: 'string',
    description: t('configSetting.permissionsDefaultMode'),
    options: feature('TRANSCRIPT_CLASSIFIER')
      ? ['default', 'plan', 'acceptEdits', 'dontAsk', 'auto']
      : ['default', 'plan', 'acceptEdits', 'dontAsk'],
  },
  language: {
    source: 'settings',
    type: 'string',
    description: t('configSetting.language'),
  },
  teammateMode: {
    source: 'global',
    type: 'string',
    description: t('configSetting.teammateMode'),
    options: TEAMMATE_MODES,
  },
  ...(process.env.USER_TYPE === 'ant'
    ? {
        classifierPermissionsEnabled: {
          source: 'settings' as const,
          type: 'boolean' as const,
          description: t('configSetting.classifierPermissionsEnabled'),
        },
      }
    : {}),
  ...(feature('VOICE_MODE')
    ? {
        voiceEnabled: {
          source: 'settings' as const,
          type: 'boolean' as const,
          description: t('configSetting.voiceEnabled'),
        },
      }
    : {}),
  ...(feature('BRIDGE_MODE')
    ? {
        remoteControlAtStartup: {
          source: 'global' as const,
          type: 'boolean' as const,
          description: t('configSetting.remoteControlAtStartup'),
          formatOnRead: () => getRemoteControlAtStartup(),
        },
      }
    : {}),
  ...(feature('KAIROS') || feature('KAIROS_PUSH_NOTIFICATION')
    ? {
        taskCompleteNotifEnabled: {
          source: 'global' as const,
          type: 'boolean' as const,
          description: t('configSetting.taskCompleteNotifEnabled'),
        },
        inputNeededNotifEnabled: {
          source: 'global' as const,
          type: 'boolean' as const,
          description: t('configSetting.inputNeededNotifEnabled'),
        },
        agentPushNotifEnabled: {
          source: 'global' as const,
          type: 'boolean' as const,
          description: t('configSetting.agentPushNotifEnabled'),
        },
      }
    : {}),
}

export function isSupported(key: string): boolean {
  return key in SUPPORTED_SETTINGS
}

export function getConfig(key: string): SettingConfig | undefined {
  return SUPPORTED_SETTINGS[key]
}

export function getOptionsForSetting(key: string): string[] | undefined {
  const config = SUPPORTED_SETTINGS[key]
  if (!config) return undefined
  if (config.options) return [...config.options]
  if (config.getOptions) return config.getOptions()
  return undefined
}

export function getPath(key: string): string[] {
  const config = SUPPORTED_SETTINGS[key]
  return config?.path ?? key.split('.')
}
