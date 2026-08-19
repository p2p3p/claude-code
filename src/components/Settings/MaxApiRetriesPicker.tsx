import { Box, Text, useInput, Byline, KeyboardShortcutHint } from '@anthropic/ink';
import { useState } from 'react';
import { ConfigurableShortcutHint } from '../ConfigurableShortcutHint.js';
import { t } from '../../utils/i18n/index.js';

type MaxApiRetriesPickerProps = {
  initialValue: string;
  onComplete: (value: string | null) => void;
};

const OPTIONS = [
  { labelKey: 'maxApiRetriesDefault', value: 'default', descKey: 'maxApiRetriesDefaultDesc', showValue: '15' },
  { labelKey: 'maxApiRetriesOff', value: 'off', descKey: 'maxApiRetriesOffDesc' },
  { labelKey: 'maxApiRetriesAlways', value: 'always', descKey: 'maxApiRetriesAlwaysDesc' },
  { labelKey: 'maxApiRetriesCustom', value: 'custom', descKey: 'maxApiRetriesCustomDesc' },
] as const;

function optionLabel(option: (typeof OPTIONS)[number]): string {
  switch (option.value) {
    case 'default': return t('settings.maxApiRetriesDefaultWithValue', 15);
    case 'off': return t('settings.maxApiRetriesOff');
    case 'always': return t('settings.maxApiRetriesAlways');
    case 'custom': return t('settings.maxApiRetriesCustom');
    default: return '';
  }
}

function optionDesc(option: (typeof OPTIONS)[number]): string {
  switch (option.value) {
    case 'default': return t('settings.maxApiRetriesDefaultDesc');
    case 'off': return t('settings.maxApiRetriesOffDesc');
    case 'always': return t('settings.maxApiRetriesAlwaysDesc');
    case 'custom': return t('settings.maxApiRetriesCustomDesc');
    default: return '';
  }
}

export function MaxApiRetriesPicker({ initialValue, onComplete }: MaxApiRetriesPickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // When the custom line is selected, digits are captured directly
  const [customInput, setCustomInput] = useState('');
  const [currentValue] = useState(initialValue);

  const isCustomSelected = OPTIONS[selectedIndex]?.value === 'custom';

  useInput((input, key) => {
    // Arrow keys always work for navigation
    if (key.upArrow) {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : OPTIONS.length - 1));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex(prev => (prev < OPTIONS.length - 1 ? prev + 1 : 0));
      return;
    }

    // Enter confirms the current selection
    if (key.return) {
      const option = OPTIONS[selectedIndex];
      if (!option) return;
      if (option.value === 'custom') {
        const num = parseInt(customInput, 10);
        if (!isNaN(num) && num >= 0) {
          onComplete(String(num));
        }
      } else {
        onComplete(option.value);
      }
      return;
    }

    if (key.escape) {
      onComplete(null);
      return;
    }

    // When custom line is selected, capture digits directly
    if (isCustomSelected) {
      if (key.backspace || key.delete) {
        setCustomInput(prev => prev.slice(0, -1));
        return;
      }
      if (/^\d$/.test(input)) {
        setCustomInput(prev => prev + input);
        return;
      }
    }
  });

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold>{t('settings.maxApiRetries')}</Text>
      {OPTIONS.map((option, index) => {
        const isSelected = index === selectedIndex;
        const isCustomLine = option.value === 'custom';
        // Show inline input when custom line is selected
        const showCustomInput = isSelected && isCustomLine;

        return (
          <Box key={option.value} flexDirection="column">
            <Text>
              {isSelected ? <Text color="success">❯ </Text> : '  '}
              <Text>{index + 1}. {optionLabel(option)}</Text>
              {isCustomLine && !showCustomInput && currentValue !== 'off' && currentValue !== 'always' && currentValue !== 'default' && currentValue !== '15' && (
                <Text>: {currentValue}</Text>
              )}
              {showCustomInput && (
                <Text>: {customInput || '0'}</Text>
              )}
              {(option.value === 'default' && (currentValue === '15' || currentValue === 'default')) || (currentValue === option.value && !option.value.startsWith('custom')) ? (
                <Text color="warning"> ({t('settings.maxApiRetriesCurrent')})</Text>
              ) : null}
            </Text>
            <Text dimColor>   {showCustomInput ? t('settings.maxApiRetriesCustomInput') : optionDesc(option)}</Text>
          </Box>
        );
      })}
      <Text dimColor>
        <Byline>
          <KeyboardShortcutHint shortcut="Enter" action={t('shortcutHint.confirm')} />
          <ConfigurableShortcutHint action="confirm:no" context="Settings" fallback="Esc" description={t('desc.cancel')} />
        </Byline>
      </Text>
    </Box>
  );
}