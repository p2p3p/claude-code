import { Doctor } from '../../screens/Doctor.js';
import type { LocalJSXCommandCall } from '../../types/command.js';
import { t } from '../../utils/i18n/index.js'

export const call: LocalJSXCommandCall = (onDone, _context, _args) => {
  return Promise.resolve(<Doctor onDone={onDone} />);
};
