/**
 * MCP subcommand handlers — extracted from main.tsx for lazy loading.
 * These are dynamically imported only when the corresponding `claude mcp *` command runs.
 */

import { stat } from 'fs/promises';
import pMap from 'p-map';
import { cwd } from 'process';
import { MCPServerDesktopImportDialog } from '../../components/MCPServerDesktopImportDialog.js';
import { wrappedRender as render } from '@anthropic/ink';
import { KeybindingSetup } from '../../keybindings/KeybindingProviderSetup.js';
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent} from '../../services/analytics/index.js';
import {
  clearMcpClientConfig,
  clearServerTokensFromLocalStorage,
  getMcpClientConfig,
  readClientSecret,
  saveMcpClientSecret} from '../../services/mcp/auth.js';
import { connectToServer, getMcpServerConnectionBatchSize } from '../../services/mcp/client.js';
import {
  addMcpConfig,
  getAllMcpConfigs,
  getMcpConfigByName,
  getMcpConfigsByScope,
  removeMcpConfig} from '../../services/mcp/config.js';
import type { ConfigScope, ScopedMcpServerConfig } from '../../services/mcp/types.js';
import { describeMcpConfigFilePath, ensureConfigScope, getScopeLabel } from '../../services/mcp/utils.js';
import { AppStateProvider } from '../../state/AppState.js';
import { getCurrentProjectConfig, getGlobalConfig, saveCurrentProjectConfig } from '../../utils/config.js';
import { isFsInaccessible } from '../../utils/errors.js';
import { gracefulShutdown } from '../../utils/gracefulShutdown.js';
import { safeParseJSON } from '../../utils/json.js';
import { getPlatform } from '../../utils/platform.js';
import { cliError, cliOk } from '../exit.js';
import { t } from '../../utils/i18n/index.js';

async function checkMcpServerHealth(name: string, server: ScopedMcpServerConfig): Promise<string> {
  try {
    const result = await connectToServer(name, server);
    if (result.type === 'connected') {
      return t('mcp.connected');
    } else if (result.type === 'needs-auth') {
      return t('mcp.needsAuth');
    } else {
      return t('mcp.failedToConnect');
    }
  } catch (_error) {
    return t('mcp.connectionError');
  }
}

// mcp serve (lines 4512–4532)
export async function mcpServeHandler({ debug, verbose }: { debug?: boolean; verbose?: boolean }): Promise<void> {
  const providedCwd = cwd();
  logEvent('tengu_mcp_start', {});

  try {
    await stat(providedCwd);
  } catch (error) {
    if (isFsInaccessible(error)) {
      cliError(t('mcp.dirDoesNotExist', providedCwd));
    }
    throw error;
  }

  try {
    const { setup } = await import('../../setup.js');
    await setup(providedCwd, 'default', false, false, undefined, false);
    const { startMCPServer } = await import('../../entrypoints/mcp.js');
    await startMCPServer(providedCwd, debug ?? false, verbose ?? false);
  } catch (error) {
    cliError(t('mcp.failedToStartServer', error));
  }
}

// mcp remove (lines 4545–4635)
export async function mcpRemoveHandler(name: string, options: { scope?: string }): Promise<void> {
  // Look up config before removing so we can clean up secure storage
  const serverBeforeRemoval = getMcpConfigByName(name);

  const cleanupSecureStorage = () => {
    if (serverBeforeRemoval && (serverBeforeRemoval.type === 'sse' || serverBeforeRemoval.type === 'http')) {
      clearServerTokensFromLocalStorage(name, serverBeforeRemoval);
      clearMcpClientConfig(name, serverBeforeRemoval);
    }
  };

  try {
    if (options.scope) {
      const scope = ensureConfigScope(options.scope);
      logEvent('tengu_mcp_delete', {
        name: name as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        scope: scope as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS});

      await removeMcpConfig(name, scope);
      cleanupSecureStorage();
      process.stdout.write(`${t('mcp.removedServer', name, scope)}\n`);
      cliOk(t('mcp.fileModified', describeMcpConfigFilePath(scope)));
    }

    // If no scope specified, check where the server exists
    const projectConfig = getCurrentProjectConfig();
    const globalConfig = getGlobalConfig();

    // Check if server exists in project scope (.mcp.json)
    const { servers: projectServers } = getMcpConfigsByScope('project');
    const mcpJsonExists = !!projectServers[name];

    // Count how many scopes contain this server
    const scopes: Array<Exclude<ConfigScope, 'dynamic'>> = [];
    if (projectConfig.mcpServers?.[name]) scopes.push('local');
    if (mcpJsonExists) scopes.push('project');
    if (globalConfig.mcpServers?.[name]) scopes.push('user');

    if (scopes.length === 0) {
      cliError(t('mcp.serverNotFound', name));
    } else if (scopes.length === 1) {
      // Server exists in only one scope, remove it
      const scope = scopes[0]!;
      logEvent('tengu_mcp_delete', {
        name: name as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        scope: scope as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS});

      await removeMcpConfig(name, scope);
      cleanupSecureStorage();
      process.stdout.write(`${t('mcp.removedServerQuoted', name, scope)}\n`);
      cliOk(t('mcp.fileModified', describeMcpConfigFilePath(scope)));
    } else {
      // Server exists in multiple scopes
      process.stderr.write(`${t('mcp.existsInMultipleScopes', name)}\n`);
      scopes.forEach(scope => {
        process.stderr.write(`  - ${getScopeLabel(scope)} (${describeMcpConfigFilePath(scope)})\n`);
      });
      process.stderr.write(`\n${t('mcp.removeFromScopeHint')}\n`);
      scopes.forEach(scope => {
        process.stderr.write(`  claude mcp remove "${name}" -s ${scope}\n`);
      });
      cliError();
    }
  } catch (error) {
    cliError((error as Error).message);
  }
}

// mcp list (lines 4641–4688)
export async function mcpListHandler(): Promise<void> {
  logEvent('tengu_mcp_list', {});
  const { servers: configs } = await getAllMcpConfigs();
  if (Object.keys(configs).length === 0) {
    console.log(t('mcp.noServersConfigured'));
  } else {
    console.log(`${t('mcp.checkingHealth')}\n`);

    // Check servers concurrently
    const entries = Object.entries(configs);
    const results = await pMap(
      entries,
      async ([name, server]) => ({
        name,
        server,
        status: await checkMcpServerHealth(name, server)}),
      { concurrency: getMcpServerConnectionBatchSize() },
    );

    for (const { name, server, status } of results) {
      // Intentionally excluding sse-ide servers here since they're internal
      if (server.type === 'sse') {
        console.log(`${name}: ${server.url} (SSE) - ${status}`);
      } else if (server.type === 'http') {
        console.log(`${name}: ${server.url} (HTTP) - ${status}`);
      } else if (server.type === 'claudeai-proxy') {
        console.log(`${name}: ${server.url} - ${status}`);
      } else if (!server.type || server.type === 'stdio') {
        const stdioServer = server as { command: string; args: string[]; type?: string };
        const args = Array.isArray(stdioServer.args) ? stdioServer.args : [];
        console.log(`${name}: ${stdioServer.command} ${args.join(' ')} - ${status}`);
      }
    }
  }
  // Use gracefulShutdown to properly clean up MCP server connections
  // (process.exit bypasses cleanup handlers, leaving child processes orphaned)
  await gracefulShutdown(0);
}

// mcp get (lines 4694–4786)
export async function mcpGetHandler(name: string): Promise<void> {
  logEvent('tengu_mcp_get', {
    name: name as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS});
  const server = getMcpConfigByName(name);
  if (!server) {
    cliError(t('mcp.serverNotFound', name));
  }

  console.log(`${name}:`);
  console.log(`  ${t('mcp.scope', getScopeLabel(server.scope))}`);

  // Check server health
  const status = await checkMcpServerHealth(name, server);
  console.log(`  ${t('mcp.status', status)}`);

  // Intentionally excluding sse-ide servers here since they're internal
  if (server.type === 'sse') {
    console.log(`  ${t('mcp.typeSSE')}`);
    console.log(`  ${t('mcp.url', server.url)}`);
    if (server.headers) {
      console.log(`  ${t('mcp.headers')}`);
      for (const [key, value] of Object.entries(server.headers)) {
        console.log(`    ${key}: ${value}`);
      }
    }
    if (server.oauth?.clientId || server.oauth?.callbackPort) {
      const parts: string[] = [];
      if (server.oauth.clientId) {
        parts.push(t('mcp.clientIdConfigured'));
        const clientConfig = getMcpClientConfig(name, server);
        if (clientConfig?.clientSecret) parts.push(t('mcp.clientSecretConfigured'));
      }
      if (server.oauth.callbackPort) parts.push(t('mcp.callbackPort', server.oauth.callbackPort));
      console.log(`  ${t('mcp.oauth', parts.join(', '))}`);
    }
  } else if (server.type === 'http') {
    console.log(`  ${t('mcp.typeHTTP')}`);
    console.log(`  ${t('mcp.url', server.url)}`);
    if (server.headers) {
      console.log(`  ${t('mcp.headers')}`);
      for (const [key, value] of Object.entries(server.headers)) {
        console.log(`    ${key}: ${value}`);
      }
    }
    if (server.oauth?.clientId || server.oauth?.callbackPort) {
      const parts: string[] = [];
      if (server.oauth.clientId) {
        parts.push(t('mcp.clientIdConfigured'));
        const clientConfig = getMcpClientConfig(name, server);
        if (clientConfig?.clientSecret) parts.push(t('mcp.clientSecretConfigured'));
      }
      if (server.oauth.callbackPort) parts.push(t('mcp.callbackPort', server.oauth.callbackPort));
      console.log(`  ${t('mcp.oauth', parts.join(', '))}`);
    }
  } else if (server.type === 'stdio') {
    console.log(`  ${t('mcp.typeStdio')}`);
    console.log(`  ${t('mcp.command', server.command)}`);
    const args = Array.isArray(server.args) ? server.args : [];
    console.log(`  ${t('mcp.args', args.join(' '))}`);
    if (server.env) {
      console.log(`  ${t('mcp.environment')}`);
      for (const [key, value] of Object.entries(server.env)) {
        console.log(`    ${key}=${value}`);
      }
    }
  }
  console.log(`\n${t('mcp.removeServerHint', name, server.scope)}`);
  // Use gracefulShutdown to properly clean up MCP server connections
  // (process.exit bypasses cleanup handlers, leaving child processes orphaned)
  await gracefulShutdown(0);
}

// mcp add-json (lines 4801–4870)
export async function mcpAddJsonHandler(
  name: string,
  json: string,
  options: { scope?: string; clientSecret?: true },
): Promise<void> {
  try {
    const scope = ensureConfigScope(options.scope);
    const parsedJson = safeParseJSON(json);

    // Read secret before writing config so cancellation doesn't leave partial state
    const needsSecret =
      options.clientSecret &&
      parsedJson &&
      typeof parsedJson === 'object' &&
      'type' in parsedJson &&
      (parsedJson.type === 'sse' || parsedJson.type === 'http') &&
      'url' in parsedJson &&
      typeof parsedJson.url === 'string' &&
      'oauth' in parsedJson &&
      parsedJson.oauth &&
      typeof parsedJson.oauth === 'object' &&
      'clientId' in parsedJson.oauth;
    const clientSecret = needsSecret ? await readClientSecret() : undefined;

    await addMcpConfig(name, parsedJson, scope);

    const transportType =
      parsedJson && typeof parsedJson === 'object' && 'type' in parsedJson
        ? String(parsedJson.type || 'stdio')
        : 'stdio';

    if (
      clientSecret &&
      parsedJson &&
      typeof parsedJson === 'object' &&
      'type' in parsedJson &&
      (parsedJson.type === 'sse' || parsedJson.type === 'http') &&
      'url' in parsedJson &&
      typeof parsedJson.url === 'string'
    ) {
      saveMcpClientSecret(name, { type: parsedJson.type, url: parsedJson.url }, clientSecret);
    }

    logEvent('tengu_mcp_add', {
      scope: scope as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      source: 'json' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      type: transportType as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS});

    cliOk(t('mcp.addedServer', transportType, name, scope));
  } catch (error) {
    cliError((error as Error).message);
  }
}

// mcp add-from-claude-desktop (lines 4881–4927)
export async function mcpAddFromDesktopHandler(options: { scope?: string }): Promise<void> {
  try {
    const scope = ensureConfigScope(options.scope);
    const platform = getPlatform();

    logEvent('tengu_mcp_add', {
      scope: scope as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      platform: platform as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      source: 'desktop' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS});

    const { readClaudeDesktopMcpServers } = await import('../../utils/claudeDesktop.js');
    const servers = await readClaudeDesktopMcpServers();

    if (Object.keys(servers).length === 0) {
      cliOk(t('mcp.noDesktopServers'));
    }

    const { unmount } = await render(
      <AppStateProvider>
        <KeybindingSetup>
          <MCPServerDesktopImportDialog
            servers={servers}
            scope={scope}
            onDone={() => {
              unmount();
            }}
          />
        </KeybindingSetup>
      </AppStateProvider>,
      { exitOnCtrlC: true },
    );
  } catch (error) {
    cliError((error as Error).message);
  }
}

// mcp reset-project-choices (lines 4935–4952)
export async function mcpResetChoicesHandler(): Promise<void> {
  logEvent('tengu_mcp_reset_mcpjson_choices', {});
  saveCurrentProjectConfig(current => ({
    ...current,
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    enableAllProjectMcpServers: false}));
  cliOk(t('mcp.resetChoices'));
}
