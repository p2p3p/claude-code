/**
 * Shared Intl object instances with lazy initialization.
 *
 * Intl constructors are expensive (~0.05-0.1ms each), so we cache instances
 * for reuse across the codebase instead of creating new ones each time.
 * Lazy initialization ensures we only pay the cost when actually needed.
 */

// Segmenters for Unicode text processing (lazily initialized)
let graphemeSegmenter: Intl.Segmenter | null = null
let wordSegmenter: Intl.Segmenter | null = null

export function getGraphemeSegmenter(): Intl.Segmenter {
  if (!graphemeSegmenter) {
    graphemeSegmenter = new Intl.Segmenter(undefined, {
      granularity: 'grapheme'})
  }
  return graphemeSegmenter
}

/**
 * Extract the first grapheme cluster from a string.
 * Returns '' for empty strings.
 */
export function firstGrapheme(text: string): string {
  if (!text) return ''
  const segments = getGraphemeSegmenter().segment(text)
  const first = segments[Symbol.iterator]().next().value
  return first?.segment ?? ''
}

/**
 * Extract the last grapheme cluster from a string.
 * Returns '' for empty strings.
 */
export function lastGrapheme(text: string): string {
  if (!text) return ''
  let last = ''
  for (const { segment } of getGraphemeSegmenter().segment(text)) {
    last = segment
  }
  return last
}

export function getWordSegmenter(): Intl.Segmenter {
  if (!wordSegmenter) {
    wordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' })
  }
  return wordSegmenter
}

// RelativeTimeFormat cache (keyed by style:numeric)
const rtfCache = new Map<string, Intl.RelativeTimeFormat>()

export function getRelativeTimeFormat(
  style: 'long' | 'short' | 'narrow',
  numeric: 'always' | 'auto',
): Intl.RelativeTimeFormat {
  const key = `${style}:${numeric}`
  let rtf = rtfCache.get(key)
  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat('en', { style, numeric })
    rtfCache.set(key, rtf)
  }
  return rtf
}

// Timezone is constant for the process lifetime
let cachedTimeZone: string | null = null

export function getTimeZone(): string {
  if (!cachedTimeZone) {
    cachedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  return cachedTimeZone
}

// System locale language subtag (e.g. 'en', 'ja') is constant for the process
// lifetime. null = not yet computed; undefined = computed but unavailable (so
// a stripped-ICU environment fails once instead of retrying on every call).
let cachedSystemLocaleLanguage: string | undefined | null = null

// Extract a bare language subtag (e.g. 'zh' from 'zh-CN', 'zh_CN' or 'zh_Hans').
function extractLanguageSubtag(value: string): string | undefined {
  const match = value.trim().match(/^([a-z]{2,3})(?:[-_])/i)
  if (match) return match[1].toLowerCase()
  const bare = value.trim().match(/^([a-z]{2,3})$/i)
  if (bare) return bare[1].toLowerCase()
  return undefined
}

// Android/Termux: LANG is always en_US.UTF-8 regardless of system locale.
// Use getprop to read the actual device language.
function getAndroidLocaleLanguage(): string | undefined {
  try {
    const { execFileSync } = require('child_process') as typeof import('child_process')
    // Inline the array to avoid lazy-module initialization order issues in production builds.
    for (const prop of ['persist.sys.locale', 'ro.product.locale', 'persist.sys.language', 'ro.product.locale.language']) {
      try {
        const value = execFileSync('getprop', [prop], { encoding: 'utf8', timeout: 1000 }).trim()
        const lang = extractLanguageSubtag(value)
        if (lang) return lang
      } catch {
        // Property missing or unreadable — try the next one.
      }
    }
  } catch {
    // getprop not available — not Android.
  }
  return undefined
}

// Fallback for non-Android platforms: LANG/LC_ALL/LC_CTYPE carry the locale.
function getEnvLocaleLanguage(): string | undefined {
  for (const envKey of ['LANG', 'LC_ALL', 'LC_CTYPE', 'LANGUAGE']) {
    const value = process.env[envKey]
    if (!value) continue
    const lang = extractLanguageSubtag(value)
    if (lang && lang !== 'c' && lang !== 'posix') return lang
  }
  return undefined
}

// Last resort: ask Intl for its resolved locale.
function getIntlLocaleLanguage(): string | undefined {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale
    return new Intl.Locale(locale).language
  } catch {
    return undefined
  }
}

export function getSystemLocaleLanguage(): string | undefined {
  if (cachedSystemLocaleLanguage === null) {
    cachedSystemLocaleLanguage =
      getAndroidLocaleLanguage() ?? getEnvLocaleLanguage() ?? getIntlLocaleLanguage()
  }
  return cachedSystemLocaleLanguage
}
