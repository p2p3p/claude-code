import React, { useMemo, useState } from 'react'
import {
  Box,
  Dialog,
  Text,
  useInput,
  useTheme,
  type Color} from '@anthropic/ink'
import type { UUID } from 'crypto'
import { getSessionId } from '../../bootstrap/state.js'
import { t } from '../../utils/i18n/index.js'
import type { ToolUseContext } from '../../Tool.js'
import {
  AGENT_COLORS,
  AGENT_COLOR_TO_THEME_COLOR,
  type AgentColorName} from '@claude-code-best/builtin-tools/tools/AgentTool/agentColorManager.js'
import type {
  LocalJSXCommandContext,
  LocalJSXCommandOnDone} from '../../types/command.js'
import {
  getTranscriptPath,
  saveAgentColor} from '../../utils/sessionStorage.js'
import { isTeammate } from '../../utils/teammate.js'
import {
  getTheme,
  themeColorToAnsi,
  type ThemeName} from '../../utils/theme.js'

const ANSI_RESET = '\x1b[0m'

const RESET_ALIASES = ['default', 'reset', 'none', 'gray', 'grey'] as const

const DEFAULT_OPTION = 'default' as const
type ColorOption = AgentColorName | typeof DEFAULT_OPTION

const COLOR_OPTIONS: readonly ColorOption[] = [
  ...AGENT_COLORS,
  DEFAULT_OPTION,
]

async function persistColor(
  color: ColorOption,
  context: ToolUseContext & LocalJSXCommandContext,
): Promise<void> {
  const sessionId = getSessionId() as UUID
  const fullPath = getTranscriptPath()

  // "default" sentinel (not empty string) so truthiness guards
  // in sessionStorage.ts persist the reset across session restarts
  await saveAgentColor(sessionId, color, fullPath)

  context.setAppState(prev => ({
    ...prev,
    standaloneAgentContext: {
      ...prev.standaloneAgentContext,
      name: prev.standaloneAgentContext?.name ?? '',
      color: color === DEFAULT_OPTION ? undefined : color}}))
}

/**
 * Renders a color name string wrapped in the ANSI escape codes for the color
 * it represents (e.g. "cyan" shown in cyan). Mirrors the tinted labels in the
 * picker panel so the success notification's color name matches the applied
 * color.
 */
function colorizedColorName(
  color: AgentColorName,
  themeName: ThemeName,
): string {
  const theme = getTheme(themeName)
  const ansi = themeColorToAnsi(theme[AGENT_COLOR_TO_THEME_COLOR[color]])
  return `${ansi}${color}${ANSI_RESET}`
}

/**
 * Full-screen color picker panel, mirroring the /lang panel: arrow keys to
 * select, Enter to apply, Esc to cancel. Each option's label is tinted with
 * the color it represents so the choice reads as it will be rendered.
 */
function ColorPanel({
  context,
  onDone}: {
  context: ToolUseContext & LocalJSXCommandContext
  onDone: LocalJSXCommandOnDone
}): React.ReactNode {
  const currentColor = context.getAppState().standaloneAgentContext?.color

  const initialIndex = useMemo(() => {
    const idx = currentColor
      ? COLOR_OPTIONS.indexOf(currentColor)
      : COLOR_OPTIONS.length - 1
    return idx === -1 ? COLOR_OPTIONS.length - 1 : idx
  }, [currentColor])

  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [themeName] = useTheme()
  const theme = useMemo(() => getTheme(themeName), [themeName])

  const applySelected = () => {
    const option = COLOR_OPTIONS[selectedIndex]
    void persistColor(option, context)
    onDone(
      option === DEFAULT_OPTION
        ? t('colorCmd.setColor', t('colorCmd.defaultColor'))
        : t('colorCmd.setColor', colorizedColorName(option, themeName)),
      { display: 'system' },
    )
  }

  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex(index => Math.max(0, index - 1))
      return
    }
    if (key.downArrow) {
      setSelectedIndex(index => Math.min(COLOR_OPTIONS.length - 1, index + 1))
      return
    }
    if (key.return) {
      applySelected()
    }
  })

  return (
    <Dialog
      title={t('colorCmd.panelTitle')}
      subtitle={t('colorCmd.panelCurrent', currentColor ?? DEFAULT_OPTION)}
      onCancel={() =>
        onDone(t('colorCmd.panelDismissed'), { display: 'system' })
      }
      color="background"
      hideInputGuide
    >
      <Box flexDirection="column">
        {COLOR_OPTIONS.map((option, index) => {
          const isSelected = index === selectedIndex
          const label =
            option === DEFAULT_OPTION ? t('colorCmd.defaultColor') : option
          const rgb =
            option === DEFAULT_OPTION
              ? undefined
              : (theme[AGENT_COLOR_TO_THEME_COLOR[option]] as Color)
          return (
            <Box key={option} flexDirection="row">
              <Text>{isSelected ? '› ' : '  '}</Text>
              {rgb ? (
                <Text color={rgb}>{label}</Text>
              ) : (
                <Text dimColor>{label}</Text>
              )}
            </Box>
          )
        })}
        <Box marginTop={1}>
          <Text dimColor>{t('colorCmd.panelHint')}</Text>
        </Box>
      </Box>
    </Dialog>
  )
}

export async function call(
  onDone: LocalJSXCommandOnDone,
  context: ToolUseContext & LocalJSXCommandContext,
  args?: string,
): Promise<React.ReactNode> {
  // Teammates cannot set their own color
  if (isTeammate()) {
    onDone(t('colorCmd.cannotSetColor'), { display: 'system' })
    return null
  }

  if (!args || args.trim() === '') {
    return <ColorPanel context={context} onDone={onDone} />
  }

  const colorArg = args.trim().toLowerCase()

  // Handle reset to default (gray)
  if (RESET_ALIASES.includes(colorArg as (typeof RESET_ALIASES)[number])) {
    await persistColor(DEFAULT_OPTION, context)
    onDone(t('colorCmd.setColor', t('colorCmd.defaultColor')), {
      display: 'system'})
    return null
  }

  if (!AGENT_COLORS.includes(colorArg as AgentColorName)) {
    const colorList = AGENT_COLORS.join(', ')
    onDone(t('colorCmd.invalidColor', colorArg, colorList), {
      display: 'system'})
    return null
  }

  await persistColor(colorArg as AgentColorName, context)
  onDone(
    t(
      'colorCmd.setColor',
      colorizedColorName(colorArg as AgentColorName, context.options.theme),
    ),
    { display: 'system' },
  )
  return null
}