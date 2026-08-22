import { describe, expect, test } from 'bun:test'
import { SAFE_ENV_VARS } from '../managedEnvConstants.js'

describe('SAFE_ENV_VARS', () => {
  // Vars in this set are applied to process.env from project-scoped
  // settings.json BEFORE the trust dialog (managedEnv.ts). Anything that can
  // redirect traffic or swap credentials must stay out.
  test('excludes vars that redirect traffic or swap credentials', () => {
    for (const key of [
      'BASE_URL',
      'API_KEY',
      'ANTHROPIC_BASE_URL',
      'ANTHROPIC_API_KEY',
      'ANTHROPIC_AUTH_TOKEN',
      'ANTHROPIC_BEDROCK_BASE_URL',
      'ANTHROPIC_VERTEX_BASE_URL',
      'ANTHROPIC_FOUNDRY_BASE_URL',
      'HTTPS_PROXY',
      'HTTP_PROXY',
      'NODE_EXTRA_CA_CERTS',
      'NODE_TLS_REJECT_UNAUTHORIZED',
      'CCR_CONTROL_PLANE_BASE_URL',
    ]) {
      expect(SAFE_ENV_VARS.has(key)).toBe(false)
    }
  })

  test('still allows model and behavior settings', () => {
    expect(SAFE_ENV_VARS.has('MODEL')).toBe(true)
    expect(SAFE_ENV_VARS.has('ANTHROPIC_DEFAULT_SONNET_MODEL')).toBe(true)
    expect(SAFE_ENV_VARS.has('BASH_DEFAULT_TIMEOUT_MS')).toBe(true)
  })
})
