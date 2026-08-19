import React, { useMemo, useState } from 'react'
import { Box, Dialog, Text, useInput } from '@anthropic/ink'
import type { ToolUseContext } from '../../Tool.js'
import type {
  LocalJSXCommandContext,
  LocalJSXCommandOnDone} from '../../types/command.js'
import { getGlobalConfig } from '../../utils/config.js'
import { getSystemLocaleLanguage } from '../../utils/intl.js'
import {
  type PreferredLanguage,
  applyLanguagePreference,
  getLanguageDisplayName,
  getResolvedLanguage} from '../../utils/language.js'
import { t } from '../../utils/i18n/index.js'

const VALID_LANGS: readonly PreferredLanguage[] = ['en', 'zh', 'auto']
const OPTION_COLUMN_WIDTH = 26

function LangPanel({ onDone }: { onDone: LocalJSXCommandOnDone }): React.ReactNode {
  const pref = getGlobalConfig().preferredLanguage ?? 'auto'
  const resolved = getResolvedLanguage()
  // The Auto option always follows the system locale — display that actual
  // system language so it stays constant regardless of the current choice.
  const systemLang = getSystemLocaleLanguage() === 'zh' ? 'zh' : 'en'
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.max(0, VALID_LANGS.indexOf(pref as PreferredLanguage)),
  )

  const options = useMemo(
    () =>
      VALID_LANGS.map(value => ({
        value,
        label: getLanguageDisplayName(value)})),
    [],
  )

  const applySelected = () => {
    const option = options[selectedIndex]
    if (!option) return
    const newResolved = applyLanguagePreference(option.value)
    const suffix =
      option.value === 'auto' ? ` → ${getLanguageDisplayName(newResolved)}` : ''
    onDone(t('cmdMgmt.langSet', getLanguageDisplayName(option.value)) + suffix, {
      display: 'system'})
  }

  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex(index => Math.max(0, index - 1))
      return
    }
    if (key.downArrow) {
      setSelectedIndex(index => Math.min(options.length - 1, index + 1))
      return
    }
    if (key.return) {
      applySelected()
    }
  })

  const currentSuffix =
    pref === 'auto' ? ` → ${getLanguageDisplayName(resolved)}` : ''

  return (
    <Dialog
      title={t('cmdMgmt.langPanelTitle')}
      subtitle={t('cmdMgmt.langCurrent', getLanguageDisplayName(pref)) + currentSuffix}
      onCancel={() => onDone(t('cmdMgmt.langPanelDismissed'), { display: 'system' })}
      color="background"
      hideInputGuide
    >
      <Box flexDirection="column">
        {options.map((option, index) => (
          <Box key={option.value} flexDirection="row">
            <Text>{`${index === selectedIndex ? '›' : ' '} ${option.label}`.padEnd(OPTION_COLUMN_WIDTH)}</Text>
            {option.value === 'auto' && <Text dimColor>→ {getLanguageDisplayName(systemLang)}</Text>}
          </Box>
        ))}
        <Box marginTop={1}>
          <Text dimColor>{t('cmdMgmt.langPanelHint')}</Text>
        </Box>
      </Box>
    </Dialog>
  )
}

export async function call(
  onDone: LocalJSXCommandOnDone,
  _context: ToolUseContext & LocalJSXCommandContext,
  args?: string,
): Promise<React.ReactNode> {
  // Bare args still apply directly for backwards compatibility, but the
  // primary UX is the interactive panel shown when no args are given.
  const trimmed = (args ?? '').trim().toLowerCase()

  if (trimmed) {
    if (!VALID_LANGS.includes(trimmed as PreferredLanguage)) {
      onDone(t('cmdMgmt.langInvalid', trimmed), { display: 'system' })
      return null
    }
    const resolved = applyLanguagePreference(trimmed as PreferredLanguage)
    const suffix =
      trimmed === 'auto' ? ` → ${getLanguageDisplayName(resolved)}` : ''
    onDone(t('cmdMgmt.langSet', getLanguageDisplayName(trimmed)) + suffix, {
      display: 'system'})
    return null
  }

  return <LangPanel onDone={onDone} />
}
