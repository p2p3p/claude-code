import { existsSync } from 'fs'
import { resolve } from 'path'
import { t } from '../utils/i18n/index.js'
import { logForDebugging } from 'src/utils/debug.js'

const SSH_TIMEOUT_MS = 60_000
const REMOTE_BIN_DIR = '~/.local/bin'
const REMOTE_CLI_FILE = 'claude-code-cli.js'
const REMOTE_WRAPPER = 'claude'

export interface DeployOptions {
  host: string
  remotePlatform: string
  remoteArch: string
  localVersion: string
  onProgress?: (msg: string) => void
}

async function runSshCommand(
  host: string,
  command: string,
  timeoutMs = SSH_TIMEOUT_MS,
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn(['ssh', '-o', 'ConnectTimeout=10', host, command], {
    stdout: 'pipe',
    stderr: 'pipe'})

  const timer = setTimeout(() => proc.kill(), timeoutMs)

  try {
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ])
    const exitCode = await proc.exited
    return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode }
  } finally {
    clearTimeout(timer)
  }
}

function findLocalBinary(): string {
  const projectRoot = resolve(import.meta.dir, '../..')
  const distPath = resolve(projectRoot, 'dist/cli.js')
  if (existsSync(distPath)) return distPath

  const devPath = resolve(projectRoot, 'src/entrypoints/cli.tsx')
  if (existsSync(devPath)) return devPath

  throw new Error(t('sshDeploy.cannotFindBinary'))
}

export async function deployBinary(options: DeployOptions): Promise<string> {
  const { host, remotePlatform, remoteArch, localVersion, onProgress } = options

  if (remotePlatform !== 'linux' && remotePlatform !== 'darwin') {
    throw new Error(t('sshDeploy.unsupportedPlatform', remotePlatform))
  }

  logForDebugging(
    `[SSHDeploy] deploying to ${host} (${remotePlatform}/${remoteArch}, v${localVersion})`,
  )

  const localBinary = findLocalBinary()
  logForDebugging(`[SSHDeploy] local binary: ${localBinary}`)

  onProgress?.('Creating remote directory...')
  const mkdirResult = await runSshCommand(host, `mkdir -p ${REMOTE_BIN_DIR}`)
  if (mkdirResult.exitCode !== 0) {
    throw new Error(t('sshDeploy.mkdirFailed', mkdirResult.stderr))
  }

  onProgress?.('Uploading binary...')
  const remotePath = `${REMOTE_BIN_DIR}/${REMOTE_CLI_FILE}`
  const scpProc = Bun.spawn(
    ['scp', '-o', 'ConnectTimeout=10', localBinary, `${host}:${remotePath}`],
    { stdout: 'pipe', stderr: 'pipe' },
  )
  const scpTimer = setTimeout(() => scpProc.kill(), SSH_TIMEOUT_MS)
  const scpStderr = await new Response(scpProc.stderr).text()
  const scpExit = await scpProc.exited
  clearTimeout(scpTimer)

  if (scpExit !== 0) {
    throw new Error(t('sshDeploy.scpFailed', String(scpExit), scpStderr.trim()))
  }

  onProgress?.('Installing wrapper script...')
  const wrapperScript = [
    `cat > ${REMOTE_BIN_DIR}/${REMOTE_WRAPPER} << 'WRAPPER'`,
    '#!/bin/sh',
    `exec bun ${REMOTE_BIN_DIR}/${REMOTE_CLI_FILE} "$@"`,
    'WRAPPER',
    `chmod +x ${REMOTE_BIN_DIR}/${REMOTE_WRAPPER}`,
  ].join('\n')

  const wrapperResult = await runSshCommand(host, wrapperScript)
  if (wrapperResult.exitCode !== 0) {
    throw new Error(t('sshDeploy.wrapperFailed', wrapperResult.stderr))
  }

  onProgress?.('Verifying installation...')
  const verifyResult = await runSshCommand(
    host,
    `${REMOTE_BIN_DIR}/${REMOTE_WRAPPER} --version`,
  )
  if (verifyResult.exitCode !== 0) {
    throw new Error(t('sshDeploy.verifyFailed', String(verifyResult.exitCode), verifyResult.stderr))
  }

  logForDebugging(
    `[SSHDeploy] deployed successfully, remote version: ${verifyResult.stdout}`,
  )
  onProgress?.(`Deployed v${verifyResult.stdout}`)

  return `${REMOTE_BIN_DIR}/${REMOTE_WRAPPER}`
}
