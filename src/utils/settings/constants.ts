import { getAllowedSettingSources } from '../../bootstrap/state.js'
import { t } from '../i18n/index.js'

/**
 * All possible sources where settings can come from
 * Order matters - later sources override earlier ones
 */
export const SETTING_SOURCES = [
  // User settings (global)
  'userSettings',

  // Project settings (shared per-directory)
  'projectSettings',

  // Local settings (gitignored)
  'localSettings',

  // Flag settings (from --settings flag)
  'flagSettings',

  // Policy settings (managed-settings.json or remote settings from API)
  'policySettings',
] as const

export type SettingSource = (typeof SETTING_SOURCES)[number]

export function getSettingSourceName(source: SettingSource): string {
  switch (source) {
    case 'userSettings':
      return t('settingSourceDisplay.sourceNameUser')
    case 'projectSettings':
      return t('settingSourceDisplay.sourceNameProject')
    case 'localSettings':
      return t('settingSourceDisplay.sourceNameProjectGitignored')
    case 'flagSettings':
      return t('settingSourceDisplay.sourceNameCliFlag')
    case 'policySettings':
      return t('settingSourceDisplay.sourceNameManaged')
  }
}

/**
 * Get short display name for a setting source (capitalized, for context/skills UI)
 * @param source The setting source or 'plugin'/'built-in'
 * @returns Short capitalized display name like 'User', 'Project', 'Plugin'
 */
export function getSourceDisplayName(
  source: SettingSource | 'plugin' | 'built-in',
): string {
  switch (source) {
    case 'userSettings':
      return t('settingSourceDisplay.user')
    case 'projectSettings':
      return t('settingSourceDisplay.project')
    case 'localSettings':
      return t('settingSourceDisplay.local')
    case 'flagSettings':
      return t('settingSourceDisplay.flag')
    case 'policySettings':
      return t('settingSourceDisplay.managed')
    case 'plugin':
      return t('settingSourceDisplay.plugin')
    case 'built-in':
      return t('settingSourceDisplay.builtin')
  }
}

/**
 * Get display name for a setting or permission rule source (lowercase, for inline use)
 * @param source The setting source or permission rule source
 * @returns Display name for the source in lowercase
 */
export function getSettingSourceDisplayNameLowercase(
  source: SettingSource | 'cliArg' | 'command' | 'session',
): string {
  switch (source) {
    case 'userSettings':
      return t('settingSourceDisplay.userSettings')
    case 'projectSettings':
      return t('settingSourceDisplay.sharedProjectSettings')
    case 'localSettings':
      return t('settingSourceDisplay.projectLocalSettings')
    case 'flagSettings':
      return t('settingSourceDisplay.cliArgs')
    case 'policySettings':
      return t('settingSourceDisplay.enterpriseManaged')
    case 'cliArg':
      return t('settingSourceDisplay.cliArg')
    case 'command':
      return t('settingSourceDisplay.commandConfiguration')
    case 'session':
      return t('settingSourceDisplay.currentSession')
  }
}

/**
 * Get display name for a setting or permission rule source (capitalized, for UI labels)
 * @param source The setting source or permission rule source
 * @returns Display name for the source with first letter capitalized
 */
export function getSettingSourceDisplayNameCapitalized(
  source: SettingSource | 'cliArg' | 'command' | 'session',
): string {
  switch (source) {
    case 'userSettings':
      return t('settingSourceDisplay.userSettingsCap')
    case 'projectSettings':
      return t('settingSourceDisplay.sharedProjectSettingsCap')
    case 'localSettings':
      return t('settingSourceDisplay.projectLocalSettingsCap')
    case 'flagSettings':
      return t('settingSourceDisplay.cliArgsCap')
    case 'policySettings':
      return t('settingSourceDisplay.enterpriseManagedCap')
    case 'cliArg':
      return t('settingSourceDisplay.cliArgCap')
    case 'command':
      return t('settingSourceDisplay.commandConfigurationCap')
    case 'session':
      return t('settingSourceDisplay.currentSessionCap')
  }
}

/**
 * Parse the --setting-sources CLI flag into SettingSource array
 * @param flag Comma-separated string like "user,project,local"
 * @returns Array of SettingSource values
 */
export function parseSettingSourcesFlag(flag: string): SettingSource[] {
  if (flag === '') return []

  const names = flag.split(',').map(s => s.trim())
  const result: SettingSource[] = []

  for (const name of names) {
    switch (name) {
      case 'user':
        result.push('userSettings')
        break
      case 'project':
        result.push('projectSettings')
        break
      case 'local':
        result.push('localSettings')
        break
      default:
        throw new Error(
          `Invalid setting source: ${name}. Valid options are: user, project, local`,
        )
    }
  }

  return result
}

/**
 * Get enabled setting sources with policy/flag always included
 * @returns Array of enabled SettingSource values
 */
export function getEnabledSettingSources(): SettingSource[] {
  const allowed = getAllowedSettingSources()

  // Always include policy and flag settings
  const result = new Set<SettingSource>(allowed)
  result.add('policySettings')
  result.add('flagSettings')
  return Array.from(result)
}

/**
 * Check if a specific source is enabled
 * @param source The source to check
 * @returns true if the source should be loaded
 */
export function isSettingSourceEnabled(source: SettingSource): boolean {
  const enabled = getEnabledSettingSources()
  return enabled.includes(source)
}

/**
 * Editable setting sources (excludes policySettings and flagSettings which are read-only)
 */
export type EditableSettingSource = Exclude<
  SettingSource,
  'policySettings' | 'flagSettings'
>

/**
 * List of sources where permission rules can be saved, in display order.
 * Used by permission-rule and hook-save UIs to present source options.
 */
export const SOURCES = [
  'localSettings',
  'projectSettings',
  'userSettings',
] as const satisfies readonly EditableSettingSource[]

/**
 * The JSON Schema URL for Claude Code settings
 * You can edit the contents at https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/claude-code-settings.json
 */
export const CLAUDE_CODE_SETTINGS_SCHEMA_URL =
  'https://json.schemastore.org/claude-code-settings.json'
