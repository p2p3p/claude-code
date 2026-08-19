// In its own file to avoid circular dependencies
import { t } from 'src/utils/i18n/index.js'

export const FILE_EDIT_TOOL_NAME = 'Edit'

// Permission pattern for granting session-level access to the project's .claude/ folder
export const CLAUDE_FOLDER_PERMISSION_PATTERN = '/.claude/**'

// Permission pattern for granting session-level access to the global ~/.claude/ folder
export const GLOBAL_CLAUDE_FOLDER_PERMISSION_PATTERN = '~/.claude/**'

/** Returns the localized error message for unexpected file modification. */
export const FILE_UNEXPECTEDLY_MODIFIED_ERROR = (): string =>
  t('toolUI.fileEdit.unexpectedlyModified')
