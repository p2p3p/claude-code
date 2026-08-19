/**
 * Sensitive-value masking for logs / diagnostics. Never print full keys.
 */

/** Mask a key, keeping only the last 4 chars (e.g. sk-...abcd). */
export function maskKey(key: string | undefined | null): string {
  if (!key) return ''
  if (key.length <= 8) return '***'
  return `${key.slice(0, 3)}...${key.slice(-4)}`
}