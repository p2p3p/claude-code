/**
 * MCP add CLI subcommand
 *
 * Extracted from main.tsx to enable direct testing.
 */
import { type Command, Option } from '@commander-js/extra-typings'
import { cliError, cliOk } from '../../cli/exit.js'
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent} from '../../services/analytics/index.js'
import {
  readClientSecret,
  saveMcpClientSecret} from '../../services/mcp/auth.js'
import { addMcpConfig } from '../../services/mcp/config.js'
import {
  describeMcpConfigFilePath,
  ensureConfigScope,
  ensureTransport,
  parseHeaders} from '../../services/mcp/utils.js'
import {
  getXaaIdpSettings,
  isXaaEnabled} from '../../services/mcp/xaaIdpLogin.js'
import { parseEnvVars } from '../../utils/envUtils.js'
import { t } from '../../utils/i18n/index.js'
import { jsonStringify } from '../../utils/slowOperations.js'

/**
 * Registers the `mcp add` subcommand on the given Commander command.
 */
export function registerMcpAddCommand(mcp: Command): void {
  mcp
    .command('add <name> <commandOrUrl> [args...]')
    .description(t('mcpAddCmd.addMcpServer'))
    .option(
      '-s, --scope <scope>',
      'Configuration scope (local, user, or project)',
      'local',
    )
    .option(
      '-t, --transport <transport>',
      'Transport type (stdio, sse, http). Defaults to stdio if not specified.',
    )
    .option(
      '-e, --env <env...>',
      'Set environment variables (e.g. -e KEY=value)',
    )
    .option(
      '-H, --header <header...>',
      'Set WebSocket headers (e.g. -H "X-Api-Key: abc123" -H "X-Custom: value")',
    )
    .option('--client-id <clientId>', 'OAuth client ID for HTTP/SSE servers')
    .option(
      '--client-secret',
      'Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)',
    )
    .option(
      '--callback-port <port>',
      'Fixed port for OAuth callback (for servers requiring pre-registered redirect URIs)',
    )
    .helpOption('-h, --help', 'Display help for command')
    .addOption(
      new Option(
        '--xaa',
        "Enable XAA (SEP-990) for this server. Requires 'claude mcp xaa setup' first. Also requires --client-id and --client-secret (for the MCP server's AS).",
      ).hideHelp(!isXaaEnabled()),
    )
    .action(async (name, commandOrUrl, args, options) => {
      // Commander.js handles -- natively: it consumes -- and everything after becomes args
      const actualCommand = commandOrUrl
      const actualArgs = args

      // If no name is provided, error
      if (!name) {
        cliError(
          'Error: Server name is required.\n' +
            'Usage: claude mcp add <name> <command> [args...]',
        )
      } else if (!actualCommand) {
        cliError(
          'Error: Command is required when server name is provided.\n' +
            'Usage: claude mcp add <name> <command> [args...]',
        )
      }

      try {
        const scope = ensureConfigScope(options.scope)
        const transport = ensureTransport(options.transport)

        // XAA fail-fast: validate at add-time, not auth-time.
        if (options.xaa && !isXaaEnabled()) {
          cliError(
            'Error: --xaa requires CLAUDE_CODE_ENABLE_XAA=1 in your environment',
          )
        }
        const xaa = Boolean(options.xaa)
        if (xaa) {
          const missing: string[] = []
          if (!options.clientId) missing.push('--client-id')
          if (!options.clientSecret) missing.push('--client-secret')
          if (!getXaaIdpSettings()) {
            missing.push(
              "'claude mcp xaa setup' (settings.xaaIdp not configured)",
            )
          }
          if (missing.length) {
            cliError(`Error: --xaa requires: ${missing.join(', ')}`)
          }
        }

        // Check if transport was explicitly provided
        const transportExplicit = options.transport !== undefined

        // Check if the command looks like a URL (likely incorrect usage)
        const looksLikeUrl =
          actualCommand.startsWith('http://') ||
          actualCommand.startsWith('https://') ||
          actualCommand.startsWith('localhost') ||
          actualCommand.endsWith('/sse') ||
          actualCommand.endsWith('/mcp')

        logEvent('tengu_mcp_add', {
          type: transport as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
          scope:
            scope as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
          source:
            'command' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
          transport:
            transport as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
          transportExplicit: transportExplicit,
          looksLikeUrl: looksLikeUrl})

        if (transport === 'sse') {
          if (!actualCommand) {
            cliError('Error: URL is required for SSE transport.')
          }

          const headers = options.header
            ? parseHeaders(options.header)
            : undefined

          const callbackPort = options.callbackPort
            ? parseInt(options.callbackPort, 10)
            : undefined
          const oauth =
            options.clientId || callbackPort || xaa
              ? {
                  ...(options.clientId ? { clientId: options.clientId } : {}),
                  ...(callbackPort ? { callbackPort } : {}),
                  ...(xaa ? { xaa: true } : {})}
              : undefined

          const clientSecret =
            options.clientSecret && options.clientId
              ? await readClientSecret()
              : undefined

          const serverConfig = {
            type: 'sse' as const,
            url: actualCommand,
            headers,
            oauth}
          await addMcpConfig(name, serverConfig, scope)

          if (clientSecret) {
            saveMcpClientSecret(name, serverConfig, clientSecret)
          }

          process.stdout.write(
            t('mcpAdd.addedSse', name, actualCommand, scope),
          )
          if (headers) {
            process.stdout.write(
              t('mcpAdd.headers', jsonStringify(headers, null, 2)),
            )
          }
        } else if (transport === 'http') {
          if (!actualCommand) {
            cliError(t('mcpAdd.urlRequiredHttp'))
          }

          const headers = options.header
            ? parseHeaders(options.header)
            : undefined

          const callbackPort = options.callbackPort
            ? parseInt(options.callbackPort, 10)
            : undefined
          const oauth =
            options.clientId || callbackPort || xaa
              ? {
                  ...(options.clientId ? { clientId: options.clientId } : {}),
                  ...(callbackPort ? { callbackPort } : {}),
                  ...(xaa ? { xaa: true } : {})}
              : undefined

          const clientSecret =
            options.clientSecret && options.clientId
              ? await readClientSecret()
              : undefined

          const serverConfig = {
            type: 'http' as const,
            url: actualCommand,
            headers,
            oauth}
          await addMcpConfig(name, serverConfig, scope)

          if (clientSecret) {
            saveMcpClientSecret(name, serverConfig, clientSecret)
          }

          process.stdout.write(
            t('mcpAdd.addedHttp', name, actualCommand, scope),
          )
          if (headers) {
            process.stdout.write(
              t('mcpAdd.headers', jsonStringify(headers, null, 2)),
            )
          }
        } else {
          if (
            options.clientId ||
            options.clientSecret ||
            options.callbackPort ||
            options.xaa
          ) {
            process.stderr.write(t('mcpAdd.extrasIgnoredStdio'))
          }

          // Warn if this looks like a URL but transport wasn't explicitly specified
          if (!transportExplicit && looksLikeUrl) {
            process.stderr.write(t('mcpAdd.looksLikeUrl', actualCommand))
            process.stderr.write(t('mcpAdd.httpHint', name, actualCommand))
            process.stderr.write(t('mcpAdd.sseHint', name, actualCommand))
          }

          const env = parseEnvVars(options.env)
          await addMcpConfig(
            name,
            { type: 'stdio', command: actualCommand, args: actualArgs, env },
            scope,
          )

          process.stdout.write(
            t('mcpAdd.addedStdio', name, actualCommand, actualArgs.join(' '), scope),
          )
        }
        cliOk(t('mcpAdd.fileModified', describeMcpConfigFilePath(scope)))
      } catch (error) {
        cliError((error as Error).message)
      }
    })
}
