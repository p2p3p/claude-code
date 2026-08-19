import { getPluginErrorMessage, type PluginError } from '../../types/plugin.js';
import { t } from '../../utils/i18n/index.js';

export function formatErrorMessage(error: PluginError): string {
  switch (error.type) {
    case 'path-not-found':
      return t('pluginErrors.pathNotFound', error.component, error.path);
    case 'git-auth-failed':
      return t('pluginErrors.gitAuthFailed', error.authType.toUpperCase(), error.gitUrl);
    case 'git-timeout':
      return t('pluginErrors.gitTimeout', error.operation, error.gitUrl);
    case 'network-error':
      return t('pluginErrors.networkError', error.url, error.details ?? '');
    case 'manifest-parse-error':
      return t('pluginErrors.manifestParseError', error.manifestPath, error.parseError);
    case 'manifest-validation-error':
      return t('pluginErrors.manifestValidationError', error.manifestPath, error.validationErrors.join(', '));
    case 'plugin-not-found':
      return t('pluginErrors.pluginNotFound', error.pluginId, error.marketplace);
    case 'marketplace-not-found':
      return t('pluginErrors.marketplaceNotFound', error.marketplace);
    case 'marketplace-load-failed':
      return t('pluginErrors.marketplaceLoadFailed', error.marketplace, error.reason);
    case 'mcp-config-invalid':
      return t('pluginErrors.mcpConfigInvalid', error.serverName, error.validationError);
    case 'mcp-server-suppressed-duplicate': {
      if (error.duplicateOf.startsWith('plugin:')) {
        const plugin = error.duplicateOf.split(':')[1] ?? '?';
        return t('pluginErrors.mcpServerSuppressedDuplicatePlugin', error.serverName, plugin);
      }
      return t('pluginErrors.mcpServerSuppressedDuplicateConfig', error.serverName, error.duplicateOf);
    }
    case 'hook-load-failed':
      return t('pluginErrors.hookLoadFailed', error.hookPath, error.reason);
    case 'component-load-failed':
      return t('pluginErrors.componentLoadFailed', error.component, error.path, error.reason);
    case 'mcpb-download-failed':
      return t('pluginErrors.mcpbDownloadFailed', error.url, error.reason);
    case 'mcpb-extract-failed':
      return t('pluginErrors.mcpbExtractFailed', error.mcpbPath, error.reason);
    case 'mcpb-invalid-manifest':
      return t('pluginErrors.mcpbInvalidManifest', error.mcpbPath, error.validationError);
    case 'marketplace-blocked-by-policy':
      return error.blockedByBlocklist
        ? t('pluginErrors.blockedByBlocklist', error.marketplace)
        : t('pluginErrors.notInAllowedList', error.marketplace);
    case 'dependency-unsatisfied':
      return error.reason === 'not-enabled'
        ? t('pluginErrors.depNotEnabled', error.dependency)
        : t('pluginErrors.depNotInstalled', error.dependency);
    case 'lsp-config-invalid':
      return t('pluginErrors.lspConfigInvalid', error.serverName, error.validationError);
    case 'lsp-server-start-failed':
      return t('pluginErrors.lspServerStartFailed', error.serverName, error.reason);
    case 'lsp-server-crashed':
      return error.signal
        ? t('pluginErrors.lspCrashedSignal', error.plugin, error.serverName, error.signal)
        : t('pluginErrors.lspCrashedExitCode', error.plugin, error.serverName, error.exitCode ?? 'unknown');
    case 'lsp-request-timeout':
      return t('pluginErrors.lspRequestTimeout', error.serverName, error.method, error.timeoutMs);
    case 'lsp-request-failed':
      return t('pluginErrors.lspRequestFailed', error.serverName, error.method, error.error);
    case 'plugin-cache-miss':
      return t('pluginErrors.pluginCacheMiss', error.plugin, error.installPath);
    case 'generic-error':
      return error.error;
  }
  const _exhaustive: never = error;
  return getPluginErrorMessage(_exhaustive);
}

export function getErrorGuidance(error: PluginError): string | null {
  switch (error.type) {
    case 'path-not-found':
      return t('pluginErrors.guidance.pathNotFound');
    case 'git-auth-failed':
      return error.authType === 'ssh'
        ? t('pluginErrors.guidance.gitAuthFailedSsh')
        : t('pluginErrors.guidance.gitAuthFailedHttps');
    case 'git-timeout':
    case 'network-error':
      return t('pluginErrors.guidance.gitTimeout');
    case 'manifest-parse-error':
      return t('pluginErrors.guidance.manifestParseError');
    case 'manifest-validation-error':
      return t('pluginErrors.guidance.manifestValidationError');
    case 'plugin-not-found':
      return t('pluginErrors.guidance.pluginNotFound', error.marketplace);
    case 'marketplace-not-found':
      return error.availableMarketplaces.length > 0
        ? t('pluginErrors.guidance.marketplaceNotFoundAvailable', error.availableMarketplaces.join(', '))
        : t('pluginErrors.guidance.marketplaceNotFound');
    case 'mcp-config-invalid':
      return t('pluginErrors.guidance.mcpConfigInvalid');
    case 'mcp-server-suppressed-duplicate': {
      if (error.duplicateOf.startsWith('plugin:')) {
        const winningPlugin = error.duplicateOf.split(':')[1] ?? 'the other plugin';
        return t('pluginErrors.guidance.mcpServerSuppressedDuplicatePlugin', winningPlugin);
      }
      return t('pluginErrors.guidance.mcpServerSuppressedDuplicateConfig', error.duplicateOf);
    }
    case 'hook-load-failed':
      return t('pluginErrors.guidance.hookLoadFailed');
    case 'component-load-failed':
      return t('pluginErrors.guidance.componentLoadFailed', error.component);
    case 'mcpb-download-failed':
      return t('pluginErrors.guidance.mcpbDownloadFailed');
    case 'mcpb-extract-failed':
      return t('pluginErrors.guidance.mcpbExtractFailed');
    case 'mcpb-invalid-manifest':
      return t('pluginErrors.guidance.mcpbInvalidManifest');
    case 'marketplace-blocked-by-policy':
      if (error.blockedByBlocklist) {
        return t('pluginErrors.guidance.blockedByBlocklist');
      }
      return error.allowedSources.length > 0
        ? t('pluginErrors.guidance.allowedSources', error.allowedSources.join(', '))
        : t('pluginErrors.guidance.contactAdmin');
    case 'dependency-unsatisfied':
      return error.reason === 'not-enabled'
        ? t('pluginErrors.guidance.depNotEnabled', error.dependency)
        : t('pluginErrors.guidance.depNotInstalled', error.dependency);
    case 'lsp-config-invalid':
      return t('pluginErrors.guidance.lspConfigInvalid');
    case 'lsp-server-start-failed':
    case 'lsp-server-crashed':
    case 'lsp-request-timeout':
    case 'lsp-request-failed':
      return t('pluginErrors.guidance.lspServerCheckLogs');
    case 'plugin-cache-miss':
      return t('pluginErrors.guidance.pluginCacheMiss');
    case 'marketplace-load-failed':
    case 'generic-error':
      return null;
  }
  const _exhaustive: never = error;
  return null;
}
