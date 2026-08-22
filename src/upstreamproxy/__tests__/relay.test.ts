import { describe, expect, test } from 'bun:test'
import { isAllowedControlPlaneUrl } from '../relay.js'

describe('isAllowedControlPlaneUrl', () => {
  test('accepts the Anthropic control plane over TLS', () => {
    expect(
      isAllowedControlPlaneUrl(
        'wss://api.anthropic.com/v1/code/upstreamproxy/ws',
      ),
    ).toBe(true)
    expect(
      isAllowedControlPlaneUrl(
        'https://api.anthropic.com/v1/code/upstreamproxy/ca-cert',
      ),
    ).toBe(true)
    expect(isAllowedControlPlaneUrl('wss://foo.ant.dev/ws')).toBe(true)
  })

  test('accepts loopback so tests can run without a control plane', () => {
    expect(isAllowedControlPlaneUrl('ws://127.0.0.1:1234/ws')).toBe(true)
    expect(isAllowedControlPlaneUrl('http://localhost:1234/ca')).toBe(true)
  })

  test('rejects arbitrary hosts', () => {
    expect(isAllowedControlPlaneUrl('wss://attacker.example/ws')).toBe(false)
    expect(isAllowedControlPlaneUrl('ws://attacker.example/ws')).toBe(false)
  })

  test('rejects hosts that only look like the control plane', () => {
    // userinfo: resolves to evil.example, reads as api.anthropic.com
    expect(
      isAllowedControlPlaneUrl('wss://api.anthropic.com@evil.example/ws'),
    ).toBe(false)
    expect(
      isAllowedControlPlaneUrl('wss://api.anthropic.com.evil.example/ws'),
    ).toBe(false)
    expect(isAllowedControlPlaneUrl('wss://notanthropic.com/ws')).toBe(false)
    expect(
      isAllowedControlPlaneUrl('wss://evil.example/?x=api.anthropic.com'),
    ).toBe(false)
  })

  test('requires TLS for non-loopback targets', () => {
    expect(isAllowedControlPlaneUrl('ws://api.anthropic.com/ws')).toBe(false)
    expect(isAllowedControlPlaneUrl('http://api.anthropic.com/ca')).toBe(false)
  })

  test('rejects unparseable input', () => {
    expect(isAllowedControlPlaneUrl('not-a-url')).toBe(false)
    expect(isAllowedControlPlaneUrl('')).toBe(false)
  })
})
