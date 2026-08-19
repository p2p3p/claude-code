import {
  clearAccount,
  DEFAULT_BASE_URL,
  loadAccount,
  saveAccount,
} from './accounts.js'
import { startLogin, waitForLogin } from './login.js'
import { confirmPairing } from './pairing.js'
import { runWeixinMcpServer } from './server.js'
import type { WeixinServerDeps } from './server.js'
import { t } from '../../../src/utils/i18n/index.js'

function printUsage(): void {
  process.stdout.write(
    [
      t('weixin.usage'),
      '  ccb weixin serve',
      '  ccb weixin login',
      '  ccb weixin login clear',
      '  ccb weixin access pair <code>',
      '',
      t('weixin.sessionEnablement'),
      '  ccb --channels plugin:weixin@builtin',
    ].join('\n') + '\n',
  )
}

async function runLogin(clear = false): Promise<void> {
  if (clear) {
    clearAccount()
    process.stdout.write(t('weixin.accountCleared') + '\n')
    return
  }

  const existing = loadAccount()
  if (existing) {
    process.stdout.write(
      [
        t('weixin.alreadyConnected'),
        t('weixin.userId', existing.userId || 'unknown'),
        t('weixin.connectedSince', existing.savedAt),
        '',
        t('weixin.disconnectHint'),
        t('weixin.restartHint'),
        '  ccb --channels plugin:weixin@builtin',
      ].join('\n') + '\n',
    )
    return
  }

  process.stdout.write(t('weixin.startingLogin') + '\n\n')
  const qr = await startLogin(DEFAULT_BASE_URL)
  process.stdout.write(
    t('weixin.scanQr', qr.qrcodeUrl || '') + '\n\n',
  )

  const result = await waitForLogin({
    qrcodeId: qr.qrcodeId,
    apiBaseUrl: DEFAULT_BASE_URL,
  })

  if (!result.connected || !result.token) {
    process.stderr.write(t('weixin.loginFailed', result.message) + '\n')
    process.exit(1)
  }

  saveAccount({
    token: result.token,
    baseUrl: result.baseUrl || DEFAULT_BASE_URL,
    userId: result.userId,
    savedAt: new Date().toISOString(),
  })

  process.stdout.write(
    [
      t('weixin.connectedSuccess'),
      t('weixin.userId', result.userId || 'unknown'),
      t('weixin.baseUrl', result.baseUrl || DEFAULT_BASE_URL),
      '',
      t('weixin.restartHint'),
      '  ccb --channels plugin:weixin@builtin',
    ].join('\n') + '\n',
  )
}

function runAccess(args: string[]): void {
  if (args[0] !== 'pair' || !args[1]) {
    printUsage()
    process.exit(1)
  }

  const userId = confirmPairing(args[1])
  if (!userId) {
    process.stderr.write(t('weixin.invalidPairingCode') + '\n')
    process.exit(1)
  }

  process.stdout.write(t('weixin.pairedSuccess', userId) + '\n')
}

export async function handleWeixinCli(
  args: string[],
  serverDeps?: WeixinServerDeps,
  version?: string,
): Promise<void> {
  const [subcommand, ...rest] = args

  switch (subcommand) {
    case 'serve':
      if (!serverDeps) {
        process.stderr.write(t('weixin.serveUnavailable') + '\n')
        process.exit(1)
      }
      await runWeixinMcpServer(version ?? '0.0.0', serverDeps)
      return
    case 'login':
      await runLogin(rest[0] === 'clear')
      return
    case 'access':
      runAccess(rest)
      return
    default:
      printUsage()
  }
}
