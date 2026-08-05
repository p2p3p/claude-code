import type { TranslationDict } from './en.js'
import en from './en.js'
import zh_CN from './zh_CN.js'

type FlatDict = Record<string, string | ((...args: any[]) => string)>

function flatten(obj: object, prefix = ''): FlatDict {
  const r: FlatDict = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') Object.assign(r, flatten(v, key))
    else r[key] = v
  }
  return r
}

const dicts: Record<string, FlatDict> = {
  en: flatten(en),
  zh_CN: flatten(zh_CN),
}

let locale = 'en'

export function getLocale(): string { return locale }

export function setLocale(l: string) {
  if (dicts[l]) { locale = l }
}

export function getAvailableLocales(): string[] {
  return Object.keys(dicts)
}

export function registerLocale(name: string, dict: TranslationDict) {
  dicts[name] = flatten(dict as object)
}

export function t(key: string, ...args: any[]): string {
  const v = dicts[locale]?.[key] ?? dicts.en?.[key]
  if (!v) return key
  return typeof v === 'function' ? v(...args) : v
}