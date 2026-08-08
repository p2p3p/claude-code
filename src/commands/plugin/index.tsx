import type { Command } from '../../commands.js';
import { t } from '../../utils/i18n/index.js'

const plugin = {
  type: 'local-jsx',
  name: 'plugin',
  aliases: ['plugins', 'marketplace'],
  description: t('cmd.descPlugin'),
  immediate: true,
  load: () => import('./plugin.js'),
} satisfies Command;

export default plugin;
