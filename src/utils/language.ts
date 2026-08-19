import { getGlobalConfig, saveGlobalConfig } from './config.js'
import { getSystemLocaleLanguage } from './intl.js'
import { setLocale } from './i18n/index.js'
import { clearSystemPromptSections } from '../constants/systemPromptSections.js'

export type PreferredLanguage = 'auto' | 'en' | 'zh'
export type ResolvedLanguage = 'en' | 'zh'

/**
 * Resolve the effective display language.
 * Priority: GlobalConfig.preferredLanguage → system locale → default 'en'.
 */
export function getResolvedLanguage(): ResolvedLanguage {
  const pref = getGlobalConfig().preferredLanguage ?? 'auto'
  if (pref === 'en' || pref === 'zh') return pref
  const sysLang = getSystemLocaleLanguage()
  return sysLang === 'zh' ? 'zh' : 'en'
}

/**
 * Persist the language preference and apply it immediately: resolve 'auto'
 * against the system locale, switch the UI locale, then refresh the memoized
 * language instruction in the system prompt. Shared by the /lang command and
 * the /config settings panel so both stay in sync.
 */
export function applyLanguagePreference(lang: PreferredLanguage): ResolvedLanguage {
  saveGlobalConfig(current => ({ ...current, preferredLanguage: lang }))
  const resolved = getResolvedLanguage()
  setLocale(resolved === 'zh' ? 'zh_CN' : 'en')
  clearSystemPromptSections()
  return resolved
}

const DISPLAY_NAMES: Record<string, string> = {
  auto: 'Auto (follow system)',
  en: 'English',
  zh: '简体中文'}

export function getLanguageDisplayName(lang: string): string {
  return DISPLAY_NAMES[lang] ?? lang
}
