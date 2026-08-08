import React, { useCallback, useRef, useState } from 'react';
import { Select } from '../../components/CustomSelect/select.js';
import { Box, Dialog, Text } from '@anthropic/ink';
import { t } from '../../utils/i18n/index.js'

type Props = {
  onProceed: (signal: AbortSignal) => Promise<void>;
  onCancel: () => void;
};

export function UltrareviewOverageDialog({ onProceed, onCancel }: Props): React.ReactNode {
  const [isLaunching, setIsLaunching] = useState(false);
  const abortControllerRef = useRef(new AbortController());

  const handleSelect = useCallback(
    (value: string) => {
      if (value === 'proceed') {
        setIsLaunching(true);
        // If onProceed rejects (e.g. launchRemoteReview throws), onDone is
        // never called and the dialog stays mounted — restore the Select so
        // the user can retry or cancel instead of staring at {t('ultrareview.launching')}.
        void onProceed(abortControllerRef.current.signal).catch(() => setIsLaunching(false));
      } else {
        onCancel();
      }
    },
    [onProceed, onCancel],
  );

  // Escape during launch aborts the in-flight onProceed via signal so the
  // caller can skip side effects (confirmOverage, onDone) — otherwise a
  // fire-and-forget launch would keep running and bill despite "cancelled".
  const handleCancel = useCallback(() => {
    abortControllerRef.current.abort();
    onCancel();
  }, [onCancel]);

  const options = [
    { label: t('ultrareview.proceedBilling'), value: 'proceed' },
    { label: t('ultrareview.cancelOption'), value: 'cancel' },
  ];

  return (
    <Dialog title={t("cmdSystemUI.reviewTitle")} onCancel={handleCancel} color="background">
      <Box flexDirection="column" gap={1}>
        <Text>
          {t('ultrareview.overageMessage')}
        </Text>
        {isLaunching ? (
          <Text color="background">{t('ultrareview.launching')}</Text>
        ) : (
          <Select options={options} onChange={handleSelect} onCancel={handleCancel} />
        )}
      </Box>
    </Dialog>
  );
}
