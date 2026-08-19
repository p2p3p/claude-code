import chalk from 'chalk';
import figures from 'figures';
import * as React from 'react';
import { color, Text } from '@anthropic/ink';
import type { MCPServerConnection } from '../services/mcp/types.js';
import { getAccountInformation, isClaudeAISubscriber } from './auth.js';
import { getLargeMemoryFiles, getMemoryFiles, MAX_MEMORY_CHARACTER_COUNT } from './claudemd.js';
import { getDoctorDiagnostic } from './doctorDiagnostic.js';
import { getAWSRegion, getDefaultVertexRegion, isEnvTruthy } from './envUtils.js';
import { getDisplayPath } from './file.js';
import { formatNumber } from './format.js';
import { getIdeClientName, type IDEExtensionInstallationStatus, isJetBrainsIde, toIDEDisplayName } from './ide.js';
import { getClaudeAiUserDefaultModelDescription, modelDisplayString } from './model/model.js';
import { getAPIProvider } from './model/providers.js';
import { getMTLSConfig } from './mtls.js';
import { t } from './i18n/index.js';
import { checkInstall } from './nativeInstaller/index.js';
import { getProxyUrl } from './proxy.js';
import { SandboxManager } from './sandbox/sandbox-adapter.js';
import { getSettingsWithAllErrors } from './settings/allErrors.js';
import { getEnabledSettingSources, getSettingSourceDisplayNameCapitalized } from './settings/constants.js';
import { getManagedFileSettingsPresence, getPolicySettingsOrigin, getSettingsForSource } from './settings/settings.js';
import type { ThemeName } from './theme.js';

export type Property = {
  label?: string;
  value: React.ReactNode | Array<string>;
};

export type Diagnostic = React.ReactNode;

export function buildSandboxProperties(): Property[] {
  if (process.env.USER_TYPE !== 'ant') {
    return [];
  }

  const isSandboxed = SandboxManager.isSandboxingEnabled();

  return [
    {
      label: t('status.bashSandbox'),
      value: isSandboxed ? t('status.enabled') : t('status.disabled')},
  ];
}

export function buildIDEProperties(
  mcpClients: MCPServerConnection[],
  ideInstallationStatus: IDEExtensionInstallationStatus | null = null,
  theme: ThemeName,
): Property[] {
  const ideClient = mcpClients?.find(client => client.name === 'ide');

  if (ideInstallationStatus) {
    const ideName = toIDEDisplayName(ideInstallationStatus.ideType);
    const pluginOrExtension = isJetBrainsIde(ideInstallationStatus.ideType) ? 'plugin' : 'extension';

    if (ideInstallationStatus.error) {
      return [
        {
          label: t('status.ide'),
          value: (
            <Text>
              {color('error', theme)(figures.cross)} {t('status.ideErrorInstalling', { ideName, pluginOrExtension, error: ideInstallationStatus.error })}
              {'\n'}{t('status.ideRestartHint')}
            </Text>
          )},
      ];
    }

    if (ideInstallationStatus.installed) {
      if (ideClient && ideClient.type === 'connected') {
        if (ideInstallationStatus.installedVersion !== ideClient.serverInfo?.version) {
          return [
            {
              label: t('status.ide'),
              value: t('status.ideConnectedVersionMismatch', { ideName, pluginOrExtension, installedVersion: ideInstallationStatus.installedVersion, serverVersion: ideClient.serverInfo?.version ?? '' })},
          ];
        } else {
          return [
            {
              label: t('status.ide'),
              value: t('status.ideConnectedVersion', { ideName, pluginOrExtension, installedVersion: ideInstallationStatus.installedVersion })},
          ];
        }
      } else {
        return [
          {
            label: t('status.ide'),
            value: t('status.ideInstalled', { ideName, pluginOrExtension })},
        ];
      }
    }
  } else if (ideClient) {
    const ideName = getIdeClientName(ideClient) ?? 'IDE';
    if (ideClient.type === 'connected') {
      return [
        {
          label: t('status.ide'),
          value: t('status.ideConnected', { ideName })},
      ];
    } else {
      return [
        {
          label: t('status.ide'),
          value: `${color('error', theme)(figures.cross)} ${t('status.ideNotConnected', { ideName })}`},
      ];
    }
  }

  return [];
}

export function buildMcpProperties(clients: MCPServerConnection[] = [], theme: ThemeName): Property[] {
  const servers = clients.filter(client => client.name !== 'ide');
  if (!servers.length) {
    return [];
  }

  // Summary instead of a full server list — 20+ servers wrapped onto many
  // rows, dominating the Status pane. Show counts by state + /mcp hint.
  const byState = { connected: 0, pending: 0, needsAuth: 0, failed: 0 };
  for (const s of servers) {
    if (s.type === 'connected') byState.connected++;
    else if (s.type === 'pending') byState.pending++;
    else if (s.type === 'needs-auth') byState.needsAuth++;
    else byState.failed++;
  }
  const parts: string[] = [];
  if (byState.connected) parts.push(color('success', theme)(t('status.mcpConnected', { count: byState.connected })));
  if (byState.needsAuth) parts.push(color('warning', theme)(t('status.mcpNeedAuth', { count: byState.needsAuth })));
  if (byState.pending) parts.push(color('inactive', theme)(t('status.mcpPending', { count: byState.pending })));
  if (byState.failed) parts.push(color('error', theme)(t('status.mcpFailed', { count: byState.failed })));

  return [
    {
      label: t('status.mcpServers'),
      value: `${parts.join(', ')} ${color('inactive', theme)(t('status.slashMcp'))}`},
  ];
}

export async function buildMemoryDiagnostics(): Promise<Diagnostic[]> {
  const files = await getMemoryFiles();
  const largeFiles = getLargeMemoryFiles(files);

  const diagnostics: Diagnostic[] = [];

  largeFiles.forEach(file => {
    const displayPath = getDisplayPath(file.path);
    diagnostics.push(
      t('status.largeMemoryFile', { displayPath, chars: formatNumber(file.content.length), maxChars: formatNumber(MAX_MEMORY_CHARACTER_COUNT) }),
    );
  });

  return diagnostics;
}

export function buildSettingSourcesProperties(): Property[] {
  const enabledSources = getEnabledSettingSources();

  // Filter to only sources that actually have settings loaded
  const sourcesWithSettings = enabledSources.filter(source => {
    const settings = getSettingsForSource(source);
    return settings !== null && Object.keys(settings).length > 0;
  });

  // Map internal names to user-friendly names
  // For policySettings, distinguish between remote and local (or skip if neither exists)
  const sourceNames = sourcesWithSettings
    .map(source => {
      if (source === 'policySettings') {
        const origin = getPolicySettingsOrigin();
        if (origin === null) {
          return null; // Skip - no policy settings exist
        }
        switch (origin) {
          case 'remote':
            return t('status.enterpriseManagedRemote');
          case 'plist':
            return t('status.enterpriseManagedPlist');
          case 'hklm':
            return t('status.enterpriseManagedHklm');
          case 'file': {
            const { hasBase, hasDropIns } = getManagedFileSettingsPresence();
            if (hasBase && hasDropIns) {
              return t('status.enterpriseManagedFileDropins');
            }
            if (hasDropIns) {
              return t('status.enterpriseManagedDropins');
            }
            return t('status.enterpriseManagedFile');
          }
          case 'hkcu':
            return t('status.enterpriseManagedHkcu');
        }
      }
      return getSettingSourceDisplayNameCapitalized(source);
    })
    .filter((name): name is string => name !== null);

  return [
    {
      label: t('status.settingSources'),
      value: sourceNames},
  ];
}

export async function buildInstallationDiagnostics(): Promise<Diagnostic[]> {
  const installWarnings = await checkInstall();
  return installWarnings.map(warning => warning.message);
}

export async function buildInstallationHealthDiagnostics(): Promise<Diagnostic[]> {
  const diagnostic = await getDoctorDiagnostic();
  const items: Diagnostic[] = [];

  const { errors: validationErrors } = getSettingsWithAllErrors();
  if (validationErrors.length > 0) {
    const invalidFiles = Array.from(new Set(validationErrors.map(error => error.file)));
    const fileList = invalidFiles.join(', ');

    items.push(t('status.invalidSettingsFiles', { fileList }));
  }

  // Add warnings from doctor diagnostic (includes leftover installations, config mismatches, etc.)
  diagnostic.warnings.forEach(warning => {
    items.push(warning.issue);
  });

  if (diagnostic.hasUpdatePermissions === false) {
    items.push(t('status.noWritePermAutoUpdates'));
  }

  return items;
}

export function buildAccountProperties(): Property[] {
  const accountInfo = getAccountInformation();
  if (!accountInfo) {
    return [];
  }

  const properties: Property[] = [];

  if (accountInfo.subscription) {
    properties.push({
      label: t('status.loginMethod'),
      value: t('status.subscriptionAccount', { subscription: accountInfo.subscription })});
  }

  if (accountInfo.tokenSource) {
    properties.push({
      label: t('status.authToken'),
      value: accountInfo.tokenSource});
  }

  if (accountInfo.apiKeySource) {
    properties.push({
      label: t('status.apiKey'),
      value: accountInfo.apiKeySource});
  }

  // Hide sensitive account info in demo mode
  if (accountInfo.organization && !process.env.IS_DEMO) {
    properties.push({
      label: t('status.organization'),
      value: accountInfo.organization});
  }
  if (accountInfo.email && !process.env.IS_DEMO) {
    properties.push({
      label: t('status.email'),
      value: accountInfo.email});
  }

  return properties;
}

export function buildAPIProviderProperties(): Property[] {
  const apiProvider = getAPIProvider();

  const properties: Property[] = [];

  if (apiProvider !== 'anthropic') {
    const providerLabel = {
      bedrock: t('status.providerBedrock'),
      vertex: t('status.providerVertex'),
      foundry: t('status.providerFoundry'),
      gemini: t('status.providerGemini'),
      grok: t('status.providerGrok'),
      openai: t('status.providerOpenai')}[apiProvider];
    properties.push({
      label: t('status.apiProvider'),
      value: providerLabel});
  }

  if (apiProvider === 'anthropic') {
    const anthropicBaseUrl = process.env.BASE_URL;
    if (anthropicBaseUrl) {
      properties.push({
        label: t('status.anthropicBaseUrl'),
        value: anthropicBaseUrl});
    }
  } else if (apiProvider === 'bedrock') {
    const bedrockBaseUrl = process.env.BEDROCK_BASE_URL;
    if (bedrockBaseUrl) {
      properties.push({
        label: t('status.bedrockBaseUrl'),
        value: bedrockBaseUrl});
    }

    properties.push({
      label: t('status.awsRegion'),
      value: getAWSRegion()});

    if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
      properties.push({
        value: t('status.awsAuthSkipped')});
    }
  } else if (apiProvider === 'vertex') {
    const vertexBaseUrl = process.env.VERTEX_BASE_URL;
    if (vertexBaseUrl) {
      properties.push({
        label: t('status.vertexBaseUrl'),
        value: vertexBaseUrl});
    }

    const gcpProject = process.env.ANTHROPIC_VERTEX_PROJECT_ID;
    if (gcpProject) {
      properties.push({
        label: t('status.gcpProject'),
        value: gcpProject});
    }

    properties.push({
      label: t('status.defaultRegion'),
      value: getDefaultVertexRegion()});

    if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH)) {
      properties.push({
        value: t('status.gcpAuthSkipped')});
    }
  } else if (apiProvider === 'foundry') {
    const foundryBaseUrl = process.env.ANTHROPIC_FOUNDRY_BASE_URL;
    if (foundryBaseUrl) {
      properties.push({
        label: t('status.foundryBaseUrl'),
        value: foundryBaseUrl});
    }

    const foundryResource = process.env.ANTHROPIC_FOUNDRY_RESOURCE;
    if (foundryResource) {
      properties.push({
        label: t('status.foundryResource'),
        value: foundryResource});
    }

    if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH)) {
      properties.push({
        value: t('status.foundryAuthSkipped')});
    }
  } else if (apiProvider === 'gemini') {
    const geminiBaseUrl = process.env.BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
    properties.push({
      label: t('status.geminiBaseUrl'),
      value: geminiBaseUrl});
  } else if (apiProvider === 'grok') {
    const grokBaseUrl = process.env.BASE_URL;
    properties.push({
      label: t('status.grokBaseUrl'),
      value: grokBaseUrl});
  } else if (apiProvider === 'openai') {
    const openaiBaseUrl = process.env.BASE_URL;
    properties.push({
      label: t('status.openaiBaseUrl'),
      value: openaiBaseUrl});
  }

  const proxyUrl = getProxyUrl();
  if (proxyUrl) {
    properties.push({
      label: t('status.proxy'),
      value: proxyUrl});
  }

  const mtlsConfig = getMTLSConfig();
  if (process.env.NODE_EXTRA_CA_CERTS) {
    properties.push({
      label: t('status.additionalCaCerts'),
      value: process.env.NODE_EXTRA_CA_CERTS});
  }
  if (mtlsConfig) {
    if (mtlsConfig.cert && process.env.CLAUDE_CODE_CLIENT_CERT) {
      properties.push({
        label: t('status.mtlsClientCert'),
        value: process.env.CLAUDE_CODE_CLIENT_CERT});
    }

    if (mtlsConfig.key && process.env.CLAUDE_CODE_CLIENT_KEY) {
      properties.push({
        label: t('status.mtlsClientKey'),
        value: process.env.CLAUDE_CODE_CLIENT_KEY});
    }
  }

  return properties;
}

export function getModelDisplayLabel(mainLoopModel: string | null): string {
  let modelLabel = modelDisplayString(mainLoopModel);

  if (mainLoopModel === null && isClaudeAISubscriber()) {
    const description = getClaudeAiUserDefaultModelDescription();

    modelLabel = `${chalk.bold(t('status.default'))} ${description}`;
  }

  return modelLabel;
}
