import type { LocalJSXCommandOnDone } from '../../types/command.js';
import { t } from '../../utils/i18n/index.js';

export async function call(onDone: LocalJSXCommandOnDone): Promise<undefined> {
  onDone(
    t('cmdMgmt.outputStyleDeprecated'),
    { display: 'system' },
  );
}
