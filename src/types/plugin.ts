import type { LspServerConfig } from '../services/lsp/types.js'
import type { McpServerConfig } from '../services/mcp/types.js'
import type { BundledSkillDefinition } from '../skills/bundledSkills.js'
import type {
  CommandMetadata,
  PluginAuthor,
  PluginManifest} from '../utils/plugins/schemas.js'
import type { HooksSettings } from '../utils/settings/types.js'
import { t } from '../utils/i18n/index.js'

export type { PluginAuthor, PluginManifest, CommandMetadata }

/**
 * Definition for a built-in plugin that ships with the CLI.
 * Built-in plugins appear in the /plugin UI and can be enabled/disabled by
 * users (persisted to user settings).
 */
export type BuiltinPluginDefinition = {
  /** Plugin name (used in `{name}@builtin` identifier) */
  name: string
  /** Description shown in the /plugin UI */
  description: string
  /** Optional version string */
  version?: string
  /** Skills provided by this plugin */
  skills?: BundledSkillDefinition[]
  /** Hooks provided by this plugin */
  hooks?: HooksSettings
  /** MCP servers provided by this plugin */
  mcpServers?: Record<string, McpServerConfig>
  /** Whether this plugin is available (e.g. based on system capabilities). Unavailable plugins are hidden entirely. */
  isAvailable?: () => boolean
  /** Default enabled state before the user sets a preference (defaults to true) */
  defaultEnabled?: boolean
}

export type PluginRepository = {
  url: string
  branch: string
  lastUpdated?: string
  commitSha?: string
}

export type PluginConfig = {
  repositories: Record<string, PluginRepository>
}

export type LoadedPlugin = {
  name: string
  manifest: PluginManifest
  path: string
  source: string
  repository: string // Repository identifier, usually same as source
  enabled?: boolean
  isBuiltin?: boolean // true for built-in plugins that ship with the CLI
  sha?: string // Git commit SHA for version pinning (from marketplace entry source)
  commandsPath?: string
  commandsPaths?: string[] // Additional command paths from manifest
  commandsMetadata?: Record<string, CommandMetadata> // Metadata for named commands from object-mapping format
  agentsPath?: string
  agentsPaths?: string[] // Additional agent paths from manifest
  skillsPath?: string
  skillsPaths?: string[] // Additional skill paths from manifest
  outputStylesPath?: string
  outputStylesPaths?: string[] // Additional output style paths from manifest
  hooksConfig?: HooksSettings
  mcpServers?: Record<string, McpServerConfig>
  lspServers?: Record<string, LspServerConfig>
  settings?: Record<string, unknown>
}

export type PluginComponent =
  | 'commands'
  | 'agents'
  | 'skills'
  | 'hooks'
  | 'output-styles'

/**
 * Discriminated union of plugin error types.
 * Each error type has specific contextual data for better debugging and user guidance.
 *
 * This replaces the previous string-based error matching approach with type-safe
 * error handling that can't break when error messages change.
 *
 * IMPLEMENTATION STATUS:
 * Currently used in production (2 types):
 * - generic-error: Used for various plugin loading failures
 * - plugin-not-found: Used when plugin not found in marketplace
 *
 * Planned for future use (10 types - see TODOs in pluginLoader.ts):
 * - path-not-found, git-auth-failed, git-timeout, network-error
 * - manifest-parse-error, manifest-validation-error
 * - marketplace-not-found, marketplace-load-failed
 * - mcp-config-invalid, hook-load-failed, component-load-failed
 *
 * These unused types support UI formatting and provide a clear roadmap for
 * improving error specificity. They can be incrementally implemented as
 * error creation sites are refactored.
 */
export type PluginError =
  | {
      type: 'path-not-found'
      source: string
      plugin?: string
      path: string
      component: PluginComponent
    }
  | {
      type: 'git-auth-failed'
      source: string
      plugin?: string
      gitUrl: string
      authType: 'ssh' | 'https'
    }
  | {
      type: 'git-timeout'
      source: string
      plugin?: string
      gitUrl: string
      operation: 'clone' | 'pull'
    }
  | {
      type: 'network-error'
      source: string
      plugin?: string
      url: string
      details?: string
    }
  | {
      type: 'manifest-parse-error'
      source: string
      plugin?: string
      manifestPath: string
      parseError: string
    }
  | {
      type: 'manifest-validation-error'
      source: string
      plugin?: string
      manifestPath: string
      validationErrors: string[]
    }
  | {
      type: 'plugin-not-found'
      source: string
      pluginId: string
      marketplace: string
    }
  | {
      type: 'marketplace-not-found'
      source: string
      marketplace: string
      availableMarketplaces: string[]
    }
  | {
      type: 'marketplace-load-failed'
      source: string
      marketplace: string
      reason: string
    }
  | {
      type: 'mcp-config-invalid'
      source: string
      plugin: string
      serverName: string
      validationError: string
    }
  | {
      type: 'mcp-server-suppressed-duplicate'
      source: string
      plugin: string
      serverName: string
      duplicateOf: string
    }
  | {
      type: 'lsp-config-invalid'
      source: string
      plugin: string
      serverName: string
      validationError: string
    }
  | {
      type: 'hook-load-failed'
      source: string
      plugin: string
      hookPath: string
      reason: string
    }
  | {
      type: 'component-load-failed'
      source: string
      plugin: string
      component: PluginComponent
      path: string
      reason: string
    }
  | {
      type: 'mcpb-download-failed'
      source: string
      plugin: string
      url: string
      reason: string
    }
  | {
      type: 'mcpb-extract-failed'
      source: string
      plugin: string
      mcpbPath: string
      reason: string
    }
  | {
      type: 'mcpb-invalid-manifest'
      source: string
      plugin: string
      mcpbPath: string
      validationError: string
    }
  | {
      type: 'lsp-config-invalid'
      source: string
      plugin: string
      serverName: string
      validationError: string
    }
  | {
      type: 'lsp-server-start-failed'
      source: string
      plugin: string
      serverName: string
      reason: string
    }
  | {
      type: 'lsp-server-crashed'
      source: string
      plugin: string
      serverName: string
      exitCode: number | null
      signal?: string
    }
  | {
      type: 'lsp-request-timeout'
      source: string
      plugin: string
      serverName: string
      method: string
      timeoutMs: number
    }
  | {
      type: 'lsp-request-failed'
      source: string
      plugin: string
      serverName: string
      method: string
      error: string
    }
  | {
      type: 'marketplace-blocked-by-policy'
      source: string
      plugin?: string
      marketplace: string
      blockedByBlocklist?: boolean // true if blocked by blockedMarketplaces, false if not in strictKnownMarketplaces
      allowedSources: string[] // Formatted source strings (e.g., "github:owner/repo")
    }
  | {
      type: 'dependency-unsatisfied'
      source: string
      plugin: string
      dependency: string
      reason: 'not-enabled' | 'not-found'
    }
  | {
      type: 'plugin-cache-miss'
      source: string
      plugin: string
      installPath: string
    }
  | {
      type: 'generic-error'
      source: string
      plugin?: string
      error: string
    }

export type PluginLoadResult = {
  enabled: LoadedPlugin[]
  disabled: LoadedPlugin[]
  errors: PluginError[]
}

/**
 * Helper function to get a display message from any PluginError
 * Useful for logging and simple error displays
 */
export function getPluginErrorMessage(error: PluginError): string {
  switch (error.type) {
    case 'generic-error':
      return error.error
    case 'path-not-found':
      return t('pluginErrors.pathNotFound', error.component, error.path)
    case 'git-auth-failed':
      return t('pluginErrors.gitAuthFailed', error.authType.toUpperCase(), error.gitUrl)
    case 'git-timeout':
      return t('pluginErrors.gitTimeout', error.operation, error.gitUrl)
    case 'network-error':
      return t('pluginErrors.networkError', error.url, error.details ?? '')
    case 'manifest-parse-error':
      return t('pluginErrors.manifestParseError', error.manifestPath, error.parseError)
    case 'manifest-validation-error':
      return t('pluginErrors.manifestValidationError', error.manifestPath, error.validationErrors.join(', '))
    case 'plugin-not-found':
      return t('pluginErrors.pluginNotFound', error.pluginId, error.marketplace)
    case 'marketplace-not-found':
      return t('pluginErrors.marketplaceNotFound', error.marketplace)
    case 'marketplace-load-failed':
      return t('pluginErrors.marketplaceLoadFailed', error.marketplace, error.reason)
    case 'mcp-config-invalid':
      return t('pluginErrors.mcpConfigInvalid', error.serverName, error.validationError)
    case 'mcp-server-suppressed-duplicate': {
      if (error.duplicateOf.startsWith('plugin:')) {
        const plugin = error.duplicateOf.split(':')[1] ?? '?'
        return t('pluginErrors.mcpServerSuppressedDuplicatePlugin', error.serverName, plugin)
      }
      return t('pluginErrors.mcpServerSuppressedDuplicateConfig', error.serverName, error.duplicateOf)
    }
    case 'hook-load-failed':
      return t('pluginErrors.hookLoadFailed', error.hookPath, error.reason)
    case 'component-load-failed':
      return t('pluginErrors.componentLoadFailed', error.component, error.path, error.reason)
    case 'mcpb-download-failed':
      return t('pluginErrors.mcpbDownloadFailed', error.url, error.reason)
    case 'mcpb-extract-failed':
      return t('pluginErrors.mcpbExtractFailed', error.mcpbPath, error.reason)
    case 'mcpb-invalid-manifest':
      return t('pluginErrors.mcpbInvalidManifest', error.mcpbPath, error.validationError)
    case 'lsp-config-invalid':
      return t('pluginErrors.lspConfigInvalid', error.serverName, error.validationError)
    case 'lsp-server-start-failed':
      return t('pluginErrors.lspServerStartFailed', error.serverName, error.reason)
    case 'lsp-server-crashed':
      if (error.signal) {
        return t('pluginErrors.lspCrashedSignal', error.plugin, error.serverName, error.signal)
      }
      return t('pluginErrors.lspCrashedExitCode', error.plugin, error.serverName, error.exitCode ?? 'unknown')
    case 'lsp-request-timeout':
      return t('pluginErrors.lspRequestTimeout', error.serverName, error.method, error.timeoutMs)
    case 'lsp-request-failed':
      return t('pluginErrors.lspRequestFailed', error.serverName, error.method, error.error)
    case 'marketplace-blocked-by-policy':
      if (error.blockedByBlocklist) {
        return t('pluginErrors.blockedByBlocklist', error.marketplace)
      }
      return t('pluginErrors.notInAllowedList', error.marketplace)
    case 'dependency-unsatisfied':
      return error.reason === 'not-enabled'
        ? t('pluginErrors.depNotEnabled', error.dependency)
        : t('pluginErrors.depNotInstalled', error.dependency)
    case 'plugin-cache-miss':
      return t('pluginErrors.pluginCacheMiss', error.plugin, error.installPath)
  }
}
