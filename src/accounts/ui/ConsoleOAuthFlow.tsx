import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent} from 'src/services/analytics/index.js';
import { installOAuthTokens } from '../../cli/handlers/auth.js';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';
import {
  setClipboard,
  useTerminalNotification,
  Box,
  Link,
  Text,
  KeyboardShortcutHint,
  useInput} from '@anthropic/ink';
import { useKeybinding } from '../../keybindings/useKeybinding.js';
import { getSSLErrorHint } from '@ant/model-provider';
import { t } from '../../utils/i18n/index.js';
import { sendNotification } from '../../services/notifier.js';
import {
  completeChatGPTDeviceLogin,
  removeChatGPTAuth,
  requestChatGPTDeviceCode,
  type ChatGPTDeviceCode} from '../../services/api/openai/chatgptAuth.js';
import { clearOpenAIClientCache } from '../../services/api/openai/client.js';
import { OAuthService } from '../../services/oauth/index.js';
import { getOauthAccountInfo, validateForceLoginOrg } from '../../utils/auth.js';
import { openBrowser } from '../../utils/browser.js';
import { logError } from '../../utils/log.js';
import { getSettings_DEPRECATED, updateSettingsForSource } from '../../utils/settings/settings.js';
import { logForDebugging } from '../../utils/debug.js';
import type { EnvPlatform, EnvConfig, EnvSubEntry } from 'src/utils/settings/types.js';
import {
  applyKeyGroupEnv,
  clearActivePlatform,
  parseApiKeys,
  readActivePlatformFor} from '../index.js';
import { activatePlatform, clearProviderClientCache } from '../index.js';
import { getCurrentActive } from '../index.js';
import { resetAppStateMainLoopModel } from 'src/bootstrap/state.js';
import { CHINA_LLM_PROVIDERS, type ProviderPreset, resolveChinaProviderBaseURL } from './chinaLlmProviders.js';
import { Select } from '../../components/CustomSelect/select.js';
import { Spinner } from '../../components/Spinner.js';
import TextInput from '../../components/TextInput.js';

type Props = {
  onDone(success?: boolean): void;
  startingMessage?: string;
  mode?: 'login' | 'setup-token';
  forceLoginMethod?: 'claudeai';
  /** Reports whether we are inside a sub-screen (field/key editor etc.) so the
   *  host Dialog can disable its own Esc, letting sub-screens Esc step back
   *  one level instead of the Dialog closing the whole login. */
  onSubscreenChange?: (inSubscreen: boolean) => void;
};

type KeyGroupLayer = 'openai' | 'gemini' | 'anthropic' | 'chatgpt-sub' | 'claude-sub'

type OAuthStatus =
  | { state: 'idle' } // First screen: cross-layer account list (switch/use)
  | { state: 'layer_select' } // Pick a compatibility layer for a new account
  | {
      state: 'platform_edit';
      layer: KeyGroupLayer;
      editingBaseUrl: string | null; // null = adding a new platform
      baseUrl: string;
      keys: string; // comma-separated API keys
      model: string;
      cachedModels?: string[];
      activeField: PlatformField;
    } // Add/edit a platform: base URL, model; keys live in platform_keys_edit
  | {
      state: 'platform_keys_edit';
      layer: KeyGroupLayer;
      returnTo: Extract<OAuthStatus, { state: 'platform_edit' }>;
    } // Standalone key management screen (list / add / edit / delete)
  | {
      state: 'platform_model_picker';
      layer: KeyGroupLayer;
      editingBaseUrl: string | null;
      baseUrl: string;
      keys: string;
      model: string;
    } // Standalone model picker (fetch /v1/models, select a model)
  | {
      state: 'chatgpt_subscription';
      phase: 'requesting' | 'waiting';
      deviceCode?: ChatGPTDeviceCode;
    } // ChatGPT account subscription via Codex OAuth device flow
  | { state: 'china_provider_select'; activeIndex: number } // China LLM: pick provider
  | { state: 'china_mode_select'; provider: ProviderPreset; activeIndex: number } // China LLM: pick access mode
  | { state: 'china_model_select'; provider: ProviderPreset; mode: 'api' | 'coding-plan'; activeIndex: number } // China LLM: pick model
  | { state: 'china_apikey'; provider: ProviderPreset; mode: 'api' | 'coding-plan'; modelId: string; apiKey: string } // China LLM: enter API key
  | { state: 'ready_to_start' } // Flow started, waiting for browser to open
  | { state: 'waiting_for_login'; url: string } // Browser opened, waiting for user to login
  | { state: 'about_to_retry'; nextState: OAuthStatus }
  | { state: 'success'; token?: string }
  | {
      state: 'error';
      message: string;
      toRetry?: OAuthStatus;
    };

const PASTE_HERE_MSG = t('loginFlow.pasteCodeHere');
export function ConsoleOAuthFlow({
  onDone,
  startingMessage,
  mode = 'login',
  forceLoginMethod: forceLoginMethodProp,
  onSubscreenChange}: Props): React.ReactNode {
  const settings = getSettings_DEPRECATED() || {};
  const forceLoginMethod = forceLoginMethodProp ?? settings.forceLoginMethod;
  const orgUUID = settings.forceLoginOrgUUID;
  const forcedMethodMessage =
    forceLoginMethod === 'claudeai'
      ? t('loginFlow.preSelectedSub')
      : null;

  const terminal = useTerminalNotification();

  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus>(() => {
    if (mode === 'setup-token') {
      return { state: 'ready_to_start' };
    }
    if (forceLoginMethod === 'claudeai') {
      return { state: 'ready_to_start' };
    }
    return { state: 'idle' };
  });

  // Any state other than the top-level account list is a sub-screen: the host
  // Dialog must leave Esc to the sub-screen (step back) instead of closing the
  // whole login with its own confirm:no handler.
  useEffect(() => {
    onSubscreenChange?.(oauthStatus.state !== 'idle');
  }, [oauthStatus.state, onSubscreenChange]);

  const [pastedCode, setPastedCode] = useState('');
  const [cursorOffset, setCursorOffset] = useState(0);
  const [oauthService] = useState(() => new OAuthService());
  const [loginWithClaudeAi, setLoginWithClaudeAi] = useState(() => {
    // Use Claude AI auth for setup-token mode to support user:inference scope
    return mode === 'setup-token' || forceLoginMethod === 'claudeai';
  });
  // After a few seconds we suggest the user to copy/paste url if the
  // browser did not open automatically. In this flow we expect the user to
  // copy the code from the browser and paste it in the terminal
  const [showPastePrompt, setShowPastePrompt] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // Remember which login method the user last selected, so Esc back to the
  // idle method list restores the previous cursor position instead of resetting
  // to the first option.
  const [idleIndex, setIdleIndex] = useState(0);

  // Cross-level memory for the China provider flow. When the user moves up a
  // level (model → mode → provider → idle) and re-enters a list, these keep the
  // cursor where it was instead of resetting to the first entry.
  const lastModelIndexRef = useRef(0);
  const lastModeIndexRef = useRef(0);
  const lastProviderIndexRef = useRef(0);

  const textInputColumns = useTerminalSize().columns - PASTE_HERE_MSG.length - 1;

  // Log forced login method on mount
  useEffect(() => {
    if (forceLoginMethod === 'claudeai') {
      logEvent('tengu_oauth_claudeai_forced', {});
    }
  }, [forceLoginMethod]);

  // Retry logic
  useEffect(() => {
    if (oauthStatus.state === 'about_to_retry') {
      const timer = setTimeout(setOAuthStatus, 1000, oauthStatus.nextState);
      return () => clearTimeout(timer);
    }
  }, [oauthStatus]);

  // Handle Enter to continue on success state
  useKeybinding(
    'confirm:yes',
    () => {
      logEvent('tengu_oauth_success', { loginWithClaudeAi });
      onDone();
    },
    {
      context: 'Confirmation',
      isActive: oauthStatus.state === 'success' && mode !== 'setup-token'},
  );

  // Handle Enter to retry on error state
  useKeybinding(
    'confirm:yes',
    () => {
      if (oauthStatus.state === 'error' && oauthStatus.toRetry) {
        setPastedCode('');
        setOAuthStatus({
          state: 'about_to_retry',
          nextState: oauthStatus.toRetry});
      }
    },
    {
      context: 'Confirmation',
      isActive: oauthStatus.state === 'error' && !!oauthStatus.toRetry},
  );

  // Handle Esc to go back from non-select sub-flows. China selects handle their
  // own Esc via Select onCancel; this covers the OAuth waiting screen (also
  // cancels the in-flight OAuth flow).
  useKeybinding(
    'confirm:no',
    () => {
      if (oauthStatus.state === 'waiting_for_login') {
        handleCancelOAuth();
      }
      setOAuthStatus({ state: 'idle' });
    },
    {
      context: 'Confirmation',
      isActive:
        oauthStatus.state === 'waiting_for_login' ||
        oauthStatus.state === 'error'},
  );

  useEffect(() => {
    if (pastedCode === 'c' && oauthStatus.state === 'waiting_for_login' && showPastePrompt && !urlCopied) {
      void setClipboard(oauthStatus.url).then(raw => {
        if (raw) process.stdout.write(raw);
        setUrlCopied(true);
        setTimeout(setUrlCopied, 2000, false);
      });
      setPastedCode('');
    }
  }, [pastedCode, oauthStatus, showPastePrompt, urlCopied]);

  async function handleSubmitCode(value: string, url: string) {
    try {
      // Expecting format "authorizationCode#state" from the authorization callback URL
      const [authorizationCode, state] = value.split('#');

      if (!authorizationCode || !state) {
        setOAuthStatus({
          state: 'error',
          message: t('loginFlow.invalidCode'),
          toRetry: { state: 'waiting_for_login', url }});
        return;
      }

      // Track which path the user is taking (manual code entry)
      logEvent('tengu_oauth_manual_entry', {});
      oauthService.handleManualAuthCodeInput({
        authorizationCode,
        state});
    } catch (err: unknown) {
      logError(err);
      setOAuthStatus({
        state: 'error',
        message: (err as Error).message,
        toRetry: { state: 'waiting_for_login', url }});
    }
  }

  const startOAuth = useCallback(async () => {
    try {
      cancelledLoginRef.current = false;
      logEvent('tengu_oauth_flow_start', { loginWithClaudeAi });

      const result = await oauthService
        .startOAuthFlow(
          async url => {
            setOAuthStatus({ state: 'waiting_for_login', url });
            setTimeout(setShowPastePrompt, 3000, true);
          },
          {
            loginWithClaudeAi,
            inferenceOnly: mode === 'setup-token',
            expiresIn: mode === 'setup-token' ? 365 * 24 * 60 * 60 : undefined, // 1 year for setup-token
            orgUUID},
        )
        .catch(err => {
          const isTokenExchangeError = err.message.includes('Token exchange failed');
          // Enterprise TLS proxies (Zscaler et al.) intercept the token
          // exchange POST and cause cryptic SSL errors. Surface an
          // actionable hint so the user isn't stuck in a login loop.
          const sslHint = getSSLErrorHint(err);
          if (cancelledLoginRef.current) {
            throw err;
          }
          setOAuthStatus({
            state: 'error',
            message:
              sslHint ??
              (isTokenExchangeError
                ? t('loginFlow.failedExchange')
                : err.message),
            toRetry: mode === 'setup-token' ? { state: 'ready_to_start' } : { state: 'idle' }});
          logEvent('tengu_oauth_token_exchange_error', {
            error: err.message,
            ssl_error: sslHint !== null});
          throw err;
        });

      if (cancelledLoginRef.current) {
        return;
      }
      if (mode === 'setup-token') {
        // For setup-token mode, return the OAuth access token directly (it can be used as an API key)
        // Don't save to keychain - the token is displayed for manual use with CLAUDE_CODE_OAUTH_TOKEN
        setOAuthStatus({ state: 'success', token: result.accessToken });
      } else {
        await installOAuthTokens(result);

        const orgResult = await validateForceLoginOrg();
        if (!orgResult.valid) {
          throw new Error((orgResult as { valid: false; message: string }).message);
        }
        // Save as claude-sub subscription account
        const accountInfo = getOauthAccountInfo();
        const email = accountInfo?.emailAddress ?? 'claude-user';
        const groups = getSettings_DEPRECATED()?.env ?? {};
        const subs = (groups['claude-sub'] ?? []) as EnvSubEntry[];
        const exists = subs.some(s => s.email === email);
        const nextSubs = exists ? subs : [...subs, { email, model: 'opus' }];
        updateSettingsForSource('userSettings', {
          env: {
            ...groups,
            'claude-sub': nextSubs,
            current: { layer: 'claude-sub', account: email }}} as unknown as Parameters<typeof updateSettingsForSource>[1]);
        if (cancelledLoginRef.current) {
          return;
        }
        setOAuthStatus({ state: 'success' });
        void sendNotification(
          {
            message: 'Claude Code login successful',
            notificationType: 'auth_success'},
          terminal,
        );
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      const sslHint = getSSLErrorHint(err);
      if (cancelledLoginRef.current) {
        return;
      }
      setOAuthStatus({
        state: 'error',
        message: sslHint ?? errorMessage,
        toRetry: {
          state: mode === 'setup-token' ? 'ready_to_start' : 'idle'}});
      logEvent('tengu_oauth_error', {
        error: errorMessage as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        ssl_error: sslHint !== null});
    }
  }, [oauthService, setShowPastePrompt, loginWithClaudeAi, mode, orgUUID]);

  const pendingOAuthStartRef = useRef(false);
  const cancelledLoginRef = useRef(false);
  const handleCancelOAuth = useCallback(() => {
    cancelledLoginRef.current = true;
    // Reject the in-flight waitForAuthorizationCode promise so startOAuth
    // settles and pendingOAuthStartRef gets reset. Without this, a second
    // entry into ready_to_start (e.g. switching between Claude AI and Console)
    // never re-triggers startOAuth and the screen stays blank.
    oauthService.cancel();
  }, [oauthService]);

  useEffect(() => {
    if (oauthStatus.state === 'ready_to_start' && !pendingOAuthStartRef.current) {
      pendingOAuthStartRef.current = true;
      // Start OAuth flow and reset the pending flag when complete
      void startOAuth().finally(() => {
        pendingOAuthStartRef.current = false;
      });
    }
  }, [oauthStatus.state, startOAuth]);

  // Auto-exit for setup-token mode
  useEffect(() => {
    if (mode === 'setup-token' && oauthStatus.state === 'success') {
      // Delay to ensure static content is fully rendered before exiting
      const timer = setTimeout(
        (loginWithClaudeAi, onDone) => {
          logEvent('tengu_oauth_success', { loginWithClaudeAi });
          // Don't clear terminal so the token remains visible
          onDone();
        },
        500,
        loginWithClaudeAi,
        onDone,
      );
      return () => clearTimeout(timer);
    }
  }, [mode, oauthStatus, loginWithClaudeAi, onDone]);

  // Cleanup OAuth service when component unmounts
  useEffect(() => {
    return () => {
      oauthService.cleanup();
    };
  }, [oauthService]);

  return (
    <Box flexDirection="column" gap={1}>
      {oauthStatus.state === 'waiting_for_login' && showPastePrompt && (
        <Box flexDirection="column" key="urlToCopy" gap={1} paddingBottom={1}>
          <Box paddingX={1}>
            <Text dimColor>{t('loginFlow.browserDidntOpen')}</Text>
            {urlCopied ? (
              <Text color="success">{t('loginFlow.copied')}</Text>
            ) : (
              <Text dimColor>
                <KeyboardShortcutHint shortcut="c" action={t('shortcutHint.copy')} parens />
              </Text>
            )}
          </Box>
          <Link url={oauthStatus.url}>
            <Text dimColor>{oauthStatus.url}</Text>
          </Link>
        </Box>
      )}
      {mode === 'setup-token' && oauthStatus.state === 'success' && oauthStatus.token && (
        <Box key="tokenOutput" flexDirection="column" gap={1} paddingTop={1}>
          <Text color="success">{t('loginFlow.tokenCreated')}</Text>
          <Box flexDirection="column" gap={1}>
            <Text>{t('login.oauthToken')}</Text>
            <Text color="warning">{oauthStatus.token}</Text>
            <Text dimColor>{t('loginFlow.storeTokenSecurely')}</Text>
            <Text dimColor>{t('loginFlow.useToken')}</Text>
          </Box>
        </Box>
      )}
      <Box paddingLeft={1} flexDirection="column" gap={1}>
        <OAuthStatusMessage
          oauthStatus={oauthStatus}
          mode={mode}
          startingMessage={startingMessage}
          forcedMethodMessage={forcedMethodMessage}
          showPastePrompt={showPastePrompt}
          pastedCode={pastedCode}
          setPastedCode={setPastedCode}
          cursorOffset={cursorOffset}
          setCursorOffset={setCursorOffset}
          textInputColumns={textInputColumns}
          handleSubmitCode={handleSubmitCode}
          setOAuthStatus={setOAuthStatus}
          setLoginWithClaudeAi={setLoginWithClaudeAi}
          onDone={onDone}
          idleIndex={idleIndex}
          setIdleIndex={setIdleIndex}
          lastModelIndexRef={lastModelIndexRef}
          lastModeIndexRef={lastModeIndexRef}
          lastProviderIndexRef={lastProviderIndexRef}
        />
      </Box>
    </Box>
  );
}

type PlatformField = 'base_url' | 'api_key' | 'model' | '__done__';
const PLATFORM_FIELDS: PlatformField[] = ['base_url', 'api_key', 'model', '__done__'];

/** Read the platform list for a layer from userSettings. */
function getLayerPlatforms(layer: KeyGroupLayer): EnvPlatform[] {
  const groups = getSettings_DEPRECATED()?.env
  return groups?.[layer] ?? []
}

/**
 * Save a platform (base URL + keys + models) into userSettings.env.
 * When the base URL already exists, keys are merged (dedup); otherwise a new
 * platform is appended. Returns the merged EnvConfig for immediate use.
 */
function saveKeyGroupPlatform(
  layer: KeyGroupLayer,
  platform: EnvPlatform,
  existingGroups: EnvConfig | undefined,
  originalBaseUrl?: string,
): EnvConfig {
  const layerPlatforms: EnvPlatform[] = (existingGroups?.[layer] ?? []).map(p => ({
    ...p,
    keys: [...p.keys]}))

  // Match by originalBaseUrl when editing (user may have changed baseUrl),
  // otherwise match by platform.baseUrl (add mode).
  const matchKey = originalBaseUrl ?? platform.baseUrl
  const idx = layerPlatforms.findIndex(p => p.baseUrl === matchKey)
  if (idx >= 0) {
    // Replace keys with whatever the user submitted (edit mode = overwrite).
    const prev = layerPlatforms[idx]!
    layerPlatforms[idx] = {
      ...prev,
      baseUrl: platform.baseUrl,
      keys: [...platform.keys],
      model: platform.model ?? prev.model}
  } else {
    layerPlatforms.push({ baseUrl: platform.baseUrl, keys: [...platform.keys], model: platform.model })
  }

  return {
    ...existingGroups,
    [layer]: layerPlatforms}
}

const KEY_GROUP_LAYERS: KeyGroupLayer[] = ['openai', 'gemini', 'anthropic']
const SUBSCRIPTION_LAYERS: KeyGroupLayer[] = ['chatgpt-sub', 'claude-sub']

function layerLabel(layer: KeyGroupLayer): string {
  // Subscription layers use their own key (login.chatgpt-sub, login.claude-sub)
  return t(`login.${layer === 'anthropic' ? 'anthropic' : layer}`)
}

/**
 * First login screen: a cross-layer list of every configured platform/account.
 * Enter uses the selected platform (switch + finish login); Space edits it;
 * "add account" picks a layer then fills the form; "manage key groups" opens
 * the maintenance screen; "other login methods" leads to OAuth/subscription
 * flows. This replaces the old "pick a login method" first screen.
 */
// Remember the highlighted option across sub-screen round-trips (the Select
// remounts when returning, which would otherwise drop focus back to #1).
let lastAccountFocusValue: string | undefined
let lastKeyFocusValue: string | undefined

function validFocusValue(
  value: string | undefined,
  values: ReadonlyArray<string | number>,
): string | undefined {
  return value !== undefined && values.includes(value) ? value : undefined
}

function AccountManagerForm({
  setOAuthStatus,
  onDone,
  startingMessage}: {
  setOAuthStatus: (status: OAuthStatus) => void;
  onDone: () => void;
  startingMessage?: string;
}): React.ReactNode {
  const entries: Array<{ layer: KeyGroupLayer; platform: EnvPlatform; value: string } | { layer: KeyGroupLayer; account: EnvSubEntry; value: string }> = [];
  let flatIdx = 0;
  for (const layer of KEY_GROUP_LAYERS) {
    const platforms = getLayerPlatforms(layer);
    for (const platform of platforms) {
      entries.push({ layer, platform, value: `account:${flatIdx++}` });
    }
  }
  for (const layer of SUBSCRIPTION_LAYERS) {
    const subs = (getSettings_DEPRECATED()?.env?.[layer] ?? []) as EnvSubEntry[];
    for (const account of subs) {
      entries.push({ layer, account, value: `account:${flatIdx++}` });
    }
  }

  const cur = getCurrentActive();

  const options = [
    ...entries.map(e => {
      const isActive = 'platform' in e
        ? cur?.layer === e.layer && cur?.account === e.platform.baseUrl
        : cur?.layer === e.layer && cur?.account === e.account.email;
      const label = 'platform' in e ? e.platform.baseUrl : e.account.email;
      const meta = 'platform' in e
        ? ` · ${t('keyGroup.keysCount', e.platform.keys.length)}`
        : '';
      return {
        label: (
          <Text>
            {isActive ? <Text color="success">✔ </Text> : null}
            {label} · <Text dimColor>{layerLabel(e.layer)}</Text>
            {meta}
            {'\n'}
          </Text>
        ),
        value: e.value};
    }),
    {
      label: (
        <Text>
          <Text color="success">＋</Text> {t('keyGroup.addAccount')}
          {'\n'}
        </Text>
      ),
      value: '__add__'},
    {
      label: (
        <Text>
          {t('keyGroup.done')} →
          {'\n'}
        </Text>
      ),
      value: '__done__'},
  ];

  // Align with the restored highlight (defaultFocusValue) so Space / Shift+D
  // act on the same option the arrow is on after returning from a sub-screen.
  const focusedRef = useRef<string>(
    validFocusValue(lastAccountFocusValue, options.map(o => o.value)) ??
      options[0]?.value ??
      '__add__',
  );

  // Shift+D deletes the highlighted account immediately (combination key,
  // no confirmation needed).
  const doDeleteAccount = useCallback(() => {
    const v = focusedRef.current;
    if (!v.startsWith('account:')) return;
    const e = entries[parseInt(v.replace('account:', ''), 10)];
    if (!e) return;

    const groups = getSettings_DEPRECATED()?.env;
    const nextGroups: EnvConfig = { ...(groups ?? {}) };
    const accountId = 'platform' in e ? e.platform.baseUrl : e.account.email;

    if ('platform' in e) {
      // API platform: delete from the array
      const layerPlatforms = (groups?.[e.layer] ?? []).filter(
        p => (p as EnvPlatform).baseUrl !== accountId,
      );
      if (layerPlatforms.length === 0) {
        (nextGroups as Record<string, unknown>)[e.layer] = undefined;
      } else {
        nextGroups[e.layer] = layerPlatforms;
      }
    } else {
      // Subscription account: delete from the array
      const subs = ((groups?.[e.layer] ?? []) as EnvSubEntry[]).filter(
        s => s.email !== accountId,
      );
      if (subs.length === 0) {
        (nextGroups as Record<string, unknown>)[e.layer] = undefined;
      } else {
        nextGroups[e.layer] = subs;
      }
    }

    // If the deleted account was the active one, reset state.
    if (nextGroups.current?.layer === e.layer && nextGroups.current?.account === accountId) {
      clearActivePlatform(e.layer);
      delete nextGroups.current;
      clearProviderClientCache(e.layer);
      resetAppStateMainLoopModel();
    }
    // IMPORTANT: do NOT touch modelType here. Deleting a platform must not
    // switch the active compatibility layer — modelType only changes when the
    // user explicitly activates / saves a platform.
    updateSettingsForSource('userSettings', {
      env: nextGroups} as unknown as Parameters<typeof updateSettingsForSource>[1]);

    // Adjust the focus so it doesn't snap back to the first option after
    // re-render: stay at the same position (deletedIndex) if it still exists,
    // or move one back when the last entry was deleted.
    const deletedIndex = parseInt(v.replace('account:', ''), 10);
    const remaining = entries.length - 1;
    if (remaining === 0) {
      lastAccountFocusValue = '__add__';
    } else {
      lastAccountFocusValue = `account:${Math.min(deletedIndex, remaining - 1)}`;
    }
    focusedRef.current = lastAccountFocusValue;

    // Re-render the list (settings cache was reset by the write).
    setOAuthStatus({ state: 'idle' });
  }, [entries, setOAuthStatus]);

  useInput(
    (input, key) => {
      if (key.shift && (input || '').toLowerCase() === 'd') {
        doDeleteAccount();
        return;
      }
      // Space edits the highlighted account (enter the edit form).
      if (key.space || input === ' ') {
        const v = focusedRef.current;
        if (v.startsWith('account:')) {
          const e = entries[parseInt(v.replace('account:', ''), 10)];
          if (!e) return;
          // Subscription accounts can't be edited via platform_edit (no baseUrl/keys).
          if (!('platform' in e)) return;
          setOAuthStatus({
            state: 'platform_edit',
            layer: e.layer,
            editingBaseUrl: e.platform.baseUrl,
            baseUrl: e.platform.baseUrl,
            keys: e.platform.keys.join(','),
            model: e.platform.model ?? '',
            activeField: 'base_url'});
        }
      }
    },
    { isActive: true },
  );

  const handleConfirm = useCallback(
    (value: string) => {
      if (value === '__done__') {
        onDone(false);
        return;
      }
      if (value === '__add__') {
        setOAuthStatus({ state: 'layer_select' });
        return;
      }
      if (!value.startsWith('account:')) return;
      const e = entries[parseInt(value.replace('account:', ''), 10)];
      if (!e) return;
      // Enter = switch to this platform and finish login.
      const ok = activatePlatform(e.layer, e.platform.baseUrl);
      logForDebugging(`[handleConfirm] activatePlatform(${e.layer}, ${e.platform.baseUrl}) = ${ok}, model=${e.platform.model}`);
      if (!ok) {
        setOAuthStatus({ state: 'error', message: t('keyGroup.activateFailed', e.platform.baseUrl) });
        return;
      }
      logEvent('tengu_key_group_activated', {});
      setOAuthStatus({ state: 'success' });
      void onDone();
    },
    [entries, onDone, setOAuthStatus],
  );

  return (
    <Box flexDirection="column" gap={1} marginTop={1}>
      {startingMessage ? <Text bold>{startingMessage}</Text> : null}
      <Text bold>{t('keyGroup.accountTitle')}</Text>
      <Text dimColor>{t('keyGroup.manageDesc')}</Text>
      <Box>
        <Select
          options={options}
          defaultFocusValue={validFocusValue(lastAccountFocusValue, options.map(o => o.value))}
          onFocus={value => {
            focusedRef.current = value;
            lastAccountFocusValue = value;
          }}
          // No onCancel here: at the top level, Esc returns to the Dialog's
          // two-press "exit login" flow instead of closing everything in one
          // keypress.
          onChange={handleConfirm}
        />
      </Box>
      {entries.length === 0 ? (
        <Text dimColor>{t('keyGroup.noPlatforms')}</Text>
      ) : null}
      <Text dimColor>
        <Text dimColor>{t('keyGroup.manageHint')}</Text>
      </Text>
    </Box>
  );
}

function LayerSelectForm({
  status,
  setOAuthStatus,
  setLoginWithClaudeAi}: {
  status: Extract<OAuthStatus, { state: 'layer_select' }>;
  setOAuthStatus: (status: OAuthStatus) => void;
  setLoginWithClaudeAi: (value: boolean) => void;
}): React.ReactNode {
  const options = [
    // Three compatibility layers
    ...KEY_GROUP_LAYERS.map((layer, i) => ({
      label: (
        <Text>
          {layerLabel(layer)}
          {'\n'}
        </Text>
      ),
      value: `layer:${i}`})),
    // Subscriptions
    {
      label: (
        <Text>
          {t('login.chatgpt')}
          {'\n'}
        </Text>
      ),
      value: 'chatgpt_subscription'},
    {
      label: (
        <Text>
          {t('loginFlow.claudeAccount')}
          {'\n'}
        </Text>
      ),
      value: 'claude_oauth'},
    // China providers
    {
      label: (
        <Text>
          {t('login.china')} · <Text dimColor>{t('login.chinaDesc')}</Text>
          {'\n'}
        </Text>
      ),
      value: 'china_providers'},
  ];

  const handleConfirm = useCallback(
    (value: string) => {
      if (value === 'chatgpt_subscription') {
        logEvent('tengu_chatgpt_subscription_selected', {});
        setOAuthStatus({ state: 'chatgpt_subscription', phase: 'requesting' });
        return;
      }
      if (value === 'claude_oauth') {
        setLoginWithClaudeAi(true);
        setOAuthStatus({ state: 'ready_to_start' });
        return;
      }
      if (value === 'china_providers') {
        logEvent('tengu_china_providers_selected', {});
        setOAuthStatus({ state: 'china_provider_select', activeIndex: 0 });
        return;
      }
      if (!value.startsWith('layer:')) return;
      const layer = KEY_GROUP_LAYERS[parseInt(value.replace('layer:', ''), 10)];
      if (!layer) return;
      setOAuthStatus({
        state: 'platform_edit',
        layer,
        editingBaseUrl: null,
        baseUrl: '',
        keys: '',
        model: '',
        activeField: 'base_url'});
    },
    [setOAuthStatus, setLoginWithClaudeAi],
  );

  return (
    <Box flexDirection="column" gap={1} marginTop={1}>
      <Text bold>{t('keyGroup.layerSelectTitle')}</Text>
      <Text dimColor>{t('keyGroup.layerSelectDesc')}</Text>
      <Box>
        <Select
          options={options}
          defaultFocusValue={options[0]?.value}
          onCancel={() => {
            setOAuthStatus({ state: 'idle' });
          }}
          onChange={handleConfirm}
        />
      </Box>
      <Text dimColor>
        <Text dimColor>{t('keyGroup.layerSelectHint')}</Text>
      </Text>
    </Box>
  );
}

/**
 * Standalone key management screen for one platform: a list of every key with
 * a masked preview, plus "add key" and "done". Enter on a key (or add) drops
 * into a single-line masked TextInput (empty submit deletes the key); Done /
 * returning to the form persists the edited key list back into the platform
 * editor's state.
 */
function KeyGroupKeysForm({
  status,
  setOAuthStatus}: {
  status: Extract<OAuthStatus, { state: 'platform_keys_edit' }>;
  setOAuthStatus: (status: OAuthStatus) => void;
}): React.ReactNode {
  const { returnTo, layer } = status;
  const [keys, setKeys] = useState<string[]>(() => parseApiKeys(returnTo.keys));
  const [mode, setMode] = useState<'list' | 'input'>('list');
  const [index, setIndex] = useState<number | 'new'>(0);
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState(0);
  const columns = useTerminalSize().columns - 20;

  // Apply the edited key list back into the platform-edit state and return.
  const finish = useCallback(() => {
    setOAuthStatus({
      ...returnTo,
      keys: keys.join(','),
      // Land back on the API-key field so the user can continue with Tab /
      // Enter to the model fields — never back to base_url (would loop).
      activeField: 'api_key'});
  }, [keys, returnTo, setOAuthStatus]);

  // Track the highlighted option so Shift+D deletes / ←/→ edits the right key.
  // Initial value aligns with the restored highlight (defaultFocusValue).
  const keyOptions = [
    ...keys.map((_, i) => `key:${i}`),
    '__new__',
    '__done__',
  ];
  const focusedKeyRef = useRef<string>(
    validFocusValue(lastKeyFocusValue, keyOptions) ??
      (keys.length > 0 ? 'key:0' : '__new__'),
  );

  // Drop into the single-key edit input for a given option (fall back to the
// highlighted one for arrows).
  const editFocusedKey = useCallback(
    (explicit?: string) => {
      const v = explicit ?? focusedKeyRef.current;
      if (v === '__new__') {
        setIndex('new');
        setValue('');
        setMode('input');
      } else if (v.startsWith('key:')) {
        const i = parseInt(v.replace('key:', ''), 10);
        setIndex(i);
        setValue(keys[i] ?? '');
        setOffset((keys[i] ?? '').length);
        setMode('input');
      }
    },
    [keys],
  );

  // Shift+D deletes the highlighted key; ←/→ edits it (mobile-friendly, same
  // as Enter via Select). Only in list mode — while typing, keys are literal.
  useInput(
    (input, key) => {
      if (key.shift && (input || '').toLowerCase() === 'd') {
        const v = focusedKeyRef.current;
        if (v.startsWith('key:')) {
          const i = parseInt(v.replace('key:', ''), 10);
          setKeys(prev => prev.filter((_, j) => j !== i));
        }
        return;
      }
      },
    { isActive: mode === 'list' },
  );

  // TextInput's onExit fires on double Ctrl+C / empty Ctrl+D — NOT on Esc.
  // In input mode, Esc must step back to the list, so bind it ourselves.
  useKeybinding(
    'confirm:no',
    () => setMode('list'),
    { context: 'Confirmation', isActive: mode === 'input' },
  );

  if (mode === 'input') {
    return (
      <Box flexDirection="column" gap={1} marginTop={1}>
        <Text bold>{t('keyGroup.keyLabel')}</Text>
        <Box>
          <TextInput
            value={value}
            onChange={v => setValue(v)}
            onSubmit={() => {
              const trimmed = value.trim();
              if (index === 'new') {
                // Dedup: adding a key that's already in the list is a no-op.
                if (trimmed) setKeys(prev => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
              } else if (trimmed) {
                setKeys(prev => {
                  const next = [...prev];
                  next[index] = trimmed;
                  return next;
                });
              } else {
                setKeys(prev => prev.filter((_, i) => i !== index));
              }
              setMode('list');
            }}
            onExit={() => setMode('list')}
            cursorOffset={offset}
            onChangeCursorOffset={setOffset}
            columns={columns}
            mask="*"
            focus={true}
            disableEscapeDoublePress
          />
        </Box>
        <Text dimColor>{t('keyGroup.keysInputHint')}</Text>
      </Box>
    );
  }

  const options = [
    ...keys.map((k, i) => ({
      label: (
        <Text>
          {maskApiKey(k)}
          {'\n'}
        </Text>
      ),
      value: `key:${i}`})),
    {
      label: (
        <Text>
          <Text color="success">＋</Text> {t('keyGroup.addKey')}
          {'\n'}
        </Text>
      ),
      value: '__new__'},
    {
      label: (
        <Text>
          {t('keyGroup.done')} →
          {'\n'}
        </Text>
      ),
      value: '__done__'},
  ];

  return (
    <Box flexDirection="column" gap={1} marginTop={1}>
      <Text bold>{t('keyGroup.keysEditTitle', t(`login.${layer === 'anthropic' ? 'anthropic' : layer}`))}</Text>
      <Text dimColor>{returnTo.baseUrl}</Text>
      {keys.length === 0 ? <Text dimColor>{t('keyGroup.noKeys')}</Text> : null}
      <Box>
        <Select
          options={options}
          defaultFocusValue={validFocusValue(lastKeyFocusValue, options.map(o => o.value))}
          onFocus={value => {
            focusedKeyRef.current = value;
            lastKeyFocusValue = value;
          }}
          onChange={v => {
            if (v === '__done__') {
              finish();
              return;
            }
            editFocusedKey(v);
          }}
          onCancel={finish}
        />
      </Box>
      <Text dimColor>
        <Text dimColor>{t('keyGroup.keysListHint')}</Text>
      </Text>
    </Box>
  );
}

/** Short masked display of an API key (sk-abc1…). */
function maskApiKey(key: string): string {
  if (key.length <= 8) return key
  return key.slice(0, 8) + '\u00b7'.repeat(Math.min(3, key.length - 8))
}

/**
 * Standalone model picker for a platform. Rendered as its own top-level route
 * (like KeyGroupKeysForm) so the form's FormField keybindings are NOT active
 * here — that's what lets ↑↓ move through the Select.
 */
function PlatformModelPickerForm({
  status,
  setOAuthStatus}: {
  status: Extract<OAuthStatus, { state: 'platform_model_picker' }>;
  setOAuthStatus: (status: OAuthStatus) => void;
}): React.ReactNode {
  const { layer, editingBaseUrl, baseUrl, keys, model } = status;
  const [alreadyPersisted, setAlreadyPersisted] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [apiModels, setApiModels] = useState<string[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [addingManual, setAddingManual] = useState(false);
  const [manualValue, setManualValue] = useState('');
  const [manualCursor, setManualCursor] = useState(0);

  const backToForm = useCallback(() => {
    setOAuthStatus({
      state: 'platform_edit',
      layer,
      editingBaseUrl,
      baseUrl,
      keys,
      model,
      cachedModels: apiModels ?? undefined,
      activeField: 'model'});
  }, [setOAuthStatus, layer, editingBaseUrl, baseUrl, keys, model, apiModels]);

  const fetchModels = useCallback(async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const apiKeyList = parseApiKeys(keys);
      const headers: Record<string, string> = {};
      if (apiKeyList.length > 0) {
        headers['Authorization'] = `Bearer ${apiKeyList[0]}`;
      }
      const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/models`, { headers });
      if (!res.ok) {
        setFetchError(t('keyGroup.fetchModelsFailed', res.status));
        setApiModels(null);
        return;
      }
      const data = await res.json();
      const ids: string[] = (data.data ?? []).map((m: { id: string }) => m.id).filter((x: unknown): x is string => typeof x === 'string');
      setApiModels(ids);
      // Persist cached models to the platform config so /model and cross-platform
      // switching can reuse them without re-fetching.
      if (!alreadyPersisted) {
        setAlreadyPersisted(true);
        const groups = getSettings_DEPRECATED()?.env;
        const platforms = groups?.[layer];
        if (platforms) {
          const idx = platforms.findIndex(p => p.baseUrl === baseUrl);
          if (idx >= 0) {
            const updated = [...platforms];
            updated[idx] = { ...updated[idx], cachedModels: ids };
            updateSettingsForSource('userSettings', {
              env: { ...groups, [layer]: updated }} as unknown as Parameters<typeof updateSettingsForSource>[1]);
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setFetchError(t('keyGroup.fetchModelsFailedDetail', msg));
      setApiModels(null);
    } finally {
      setFetching(false);
    }
  }, [baseUrl, keys, layer, alreadyPersisted]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useInput(
    (input) => {
      if (input === 'f' || input === 'F') {
        fetchModels()
      }
    },
    { isActive: true },
  );

  if (fetching && !apiModels) {
    return (
      <Box flexDirection="column" gap={1} marginTop={1}>
        <Text bold>{t('keyGroup.selectModelTitle')}</Text>
        <Text dimColor>{t('keyGroup.fetchingModels')}</Text>
      </Box>
    );
  }

  const options = [
    ...(apiModels ?? []).map(id => ({ label: <Text>{id}{'\n'}</Text>, value: id })),
    // Add a custom model (works even when the fetch failed). Selecting it
    // returns to the form so the user can type the model name.
    { label: <Text>{t('keyGroup.manualInput')}{'\n'}</Text>, value: '__manual__' },
  ];

  if (addingManual) {
    return (
      <Box flexDirection="column" gap={1} marginTop={1}>
        <Text bold>{t('keyGroup.addCustomModelTitle')}</Text>
        <Box>
          <Text>{'  > '}</Text>
          <TextInput
            value={manualValue}
            onChange={setManualValue}
            onSubmit={() => {
              const trimmed = manualValue.trim();
              if (trimmed) {
                // 把手动添加的模型也写进该平台的 cachedModels,这样 /model 能显示
                const groups = getSettings_DEPRECATED()?.env;
                const platforms = groups?.[layer] ?? [];
                const idx = platforms.findIndex(p => p.baseUrl === baseUrl);
                if (idx >= 0) {
                  const updated = [...platforms];
                  updated[idx] = {
                    ...updated[idx],
                    cachedModels: [...(updated[idx].cachedModels ?? []), trimmed]};
                  updateSettingsForSource('userSettings', {
                    env: { ...groups, [layer]: updated }} as unknown as Parameters<typeof updateSettingsForSource>[1]);
                }
                setOAuthStatus({
                  state: 'platform_edit',
                  layer,
                  editingBaseUrl,
                  baseUrl,
                  keys,
                  model: trimmed,
                  // Carry both the fetched list and the manual addition back so
                  // a first-time add persists them on save.
                  cachedModels: [...(apiModels ?? []), trimmed],
                  activeField: 'model'});
              } else {
                setAddingManual(false);
              }
            }}
            onExit={() => setAddingManual(false)}
            cursorOffset={manualCursor}
            onChangeCursorOffset={setManualCursor}
            columns={useTerminalSize().columns - 20}
            focus={true}
          />
        </Box>
        <Text dimColor>{t('keyGroup.addCustomModelHint')}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1} marginTop={1}>
      <Text bold>{t('keyGroup.selectModelTitle')}</Text>
      <Text dimColor>{baseUrl}</Text>
      {fetchError ? (
        <Box flexDirection="column" gap={1}>
          <Text color="warning">{fetchError}</Text>
          <Text dimColor>{t('keyGroup.manualInputHint')}</Text>
        </Box>
      ) : null}
      {!fetchError && (!apiModels || apiModels.length === 0) ? (
        <Text dimColor>{t('keyGroup.noModelsFound')}</Text>
      ) : null}
      <Box>
        <Select
          options={options}
          defaultFocusValue={apiModels?.includes(model) ? model : (apiModels?.[0] ?? undefined)}
          onCancel={backToForm}
          onChange={value => {
            if (value === '__manual__') {
              // Inline input for a custom model — works even on fetch failure.
              setAddingManual(true);
            } else {
              // Fill the model and return to the form. Carry the fetched list
              // back so a first-time add persists cachedModels on save (the
              // auto-persist path only fires for platforms already on disk).
              setOAuthStatus({
                state: 'platform_edit',
                layer,
                editingBaseUrl,
                baseUrl,
                keys,
                model: value,
                cachedModels: apiModels ?? undefined,
                activeField: 'model'});
            }
          }}
        />
      </Box>
      <Text dimColor>
        {t('keyGroup.modelPickerHint')}
        {fetching ? '' : ` ${t('keyGroup.refreshHint')}`}
      </Text>
    </Box>
  );
}

function PlatformEditForm({
  status,
  setOAuthStatus,
  onDone}: {
  status: Extract<OAuthStatus, { state: 'platform_edit' }>;
  setOAuthStatus: (status: OAuthStatus) => void;
  onDone: () => void;
}): React.ReactNode {
  const { layer, editingBaseUrl, baseUrl, keys, model, cachedModels, activeField } = status;
  const displayValues: Record<PlatformField, string> = {
    base_url: baseUrl,
    api_key: keys,
    model};

  const [inputValue, setInputValue] = useState(() => displayValues[activeField]);
  const [inputCursorOffset, setInputCursorOffset] = useState(() => displayValues[activeField].length);
  const [saveError, setSaveError] = useState<string | null>(null);
  const backToManage = useCallback(() => {
    setOAuthStatus({ state: 'idle' });
  }, [setOAuthStatus]);

  const buildState = useCallback(
    (field: PlatformField, value: string, newActive?: PlatformField) => {
      const s = {
        state: 'platform_edit' as const,
        layer,
        editingBaseUrl,
        baseUrl,
        keys,
        model,
        activeField: newActive ?? activeField};
      switch (field) {
        case 'base_url':
          return { ...s, baseUrl: value };
        case 'api_key':
          // The key field has no editable value in the form; keys are managed
          // in the standalone screen. Keep everything as-is.
          return s;
        case 'model':
          return { ...s, model: value };
        case '__done__':
          // Not an input field — keep state as-is (Enter on it saves).
          return s;
      }
    },
    [activeField, layer, editingBaseUrl, baseUrl, keys, model],
  );

  // Jump into the standalone key-management screen for this platform. All
  // current field values are preserved verbatim (do NOT build via buildState:
  // the api_key field has no switch case there and would return undefined).
  const openKeysManage = useCallback(() => {
    setOAuthStatus({
      state: 'platform_keys_edit',
      layer,
      returnTo: {
        state: 'platform_edit',
        layer,
        editingBaseUrl,
        baseUrl,
        keys,
        model,
        activeField: 'api_key'}});
  }, [editingBaseUrl, baseUrl, keys, layer, setOAuthStatus]);

  const doSave = useCallback(() => {
    const finalVals = { ...displayValues, [activeField]: inputValue };
    const finalBaseUrl = finalVals.base_url.trim();

    if (finalBaseUrl) {
      try {
        new URL(finalBaseUrl);
      } catch {
        setSaveError(t('keyGroup.invalidBaseUrl'));
        return;
      }
    } else {
      setSaveError(t('keyGroup.enterBaseUrl'));
      return;
    }

    const finalKeys = parseApiKeys(keys);
    if (finalKeys.length === 0) {
      setSaveError(t('keyGroup.enterApiKey'));
      return;
    }

    const existingGroups = getSettings_DEPRECATED()?.env;
    const nextGroups = saveKeyGroupPlatform(
      layer,
      {
        baseUrl: finalBaseUrl,
        keys: finalKeys,
        model: finalVals.model.trim() || '',
        cachedModels: cachedModels ?? undefined},
      existingGroups,
      // When editing, match the existing entry by its original base URL
      editingBaseUrl ?? undefined,
    );

    const settingsUpdate: Parameters<typeof updateSettingsForSource>[1] = {
      env: nextGroups};
    const { error } = updateSettingsForSource('userSettings', settingsUpdate as unknown as Parameters<typeof updateSettingsForSource>[1]);
    if (error) {
      setSaveError(t('keyGroup.saveFailed', error.message));
      return;
    }

    // Activate the just-saved platform so the current session starts using
    // it immediately (applies env vars and clears cached clients).
    activatePlatform(layer, finalBaseUrl);
    setOAuthStatus({ state: 'success' });
    void onDone();
  }, [activeField, inputValue, displayValues, keys, layer, cachedModels, setOAuthStatus, onDone]);

  const handleEnter = useCallback(() => {
    // Field navigation is done with ↑/↓ (FormField tabs keybindings).
    // Enter on "完成 →" saves; Enter on api_key / model is intercepted by the
    // useInput above (key manage / model picker).
    if (activeField === '__done__') {
      setOAuthStatus(buildState(activeField, inputValue));
      doSave();
    }
  }, [activeField, buildState, doSave, inputValue, setOAuthStatus]);

  const gotoField = useCallback(
    (field: PlatformField) => {
      setOAuthStatus(buildState(activeField, inputValue, field));
      // __done__ / api_key are not editable text fields — set empty so the
      // TextInput (base_url / others) never gets undefined.
      setInputValue(displayValues[field] ?? '');
      setInputCursorOffset((displayValues[field] ?? '').length);
    },
    [activeField, buildState, inputValue, displayValues, setOAuthStatus],
  );

  useKeybinding(
    'tabs:next',
    () => {
      const idx = PLATFORM_FIELDS.indexOf(activeField);
      if (idx < 0) return;
      if (idx < PLATFORM_FIELDS.length - 1) {
        gotoField(PLATFORM_FIELDS[idx + 1]!);
      }
    },
    { context: 'FormField' },
  );
  useKeybinding(
    'tabs:previous',
    () => {
      const idx = PLATFORM_FIELDS.indexOf(activeField);
      if (idx > 0) {
        gotoField(PLATFORM_FIELDS[idx - 1]!);
      }
    },
    { context: 'FormField' },
  );
  useKeybinding(
    'confirm:no',
    backToManage,
    { context: 'Confirmation' },
  );

  // Enter on the API-key / model fields opens their management screen;
// Enter on "完成 →" saves.
  useInput(
    (input, key) => {
      if (activeField === 'api_key') {
        if (key.return) {
          openKeysManage()
        }
      }
      if (activeField === 'model') {
        if (key.return) {
          setOAuthStatus({
            state: 'platform_model_picker',
            layer,
            editingBaseUrl,
            baseUrl,
            keys,
            model});
        }
      }
      if (activeField === '__done__') {
        if (key.return) {
          handleEnter()
        }
      }
    },
    { isActive: true },
  );

  // Inline width for the base_url TextInput — keep it modest so the dimColor
  // hint ("请输入接口地址") fits on the same line.
  const editColumns = Math.min(useTerminalSize().columns - 40, 50);
  const keyCount = parseApiKeys(keys).length;

  const rows: Array<{ field: PlatformField; label: string; value: string; desc: string }> = [
    { field: 'base_url', label: t('login.baseUrl'), value: displayValues.base_url, desc: !displayValues.base_url ? t('keyGroup.enterBaseUrl') : '' },
    { field: 'api_key', label: t('keyGroup.keyGroupManage'), value: t('keyGroup.keysCount', keyCount), desc: keyCount > 0 ? '' : t('keyGroup.enterApiKey') },
    { field: 'model', label: t('keyGroup.modelManage'), value: displayValues.model || t('keyGroup.unsetModel'), desc: '' },
    { field: '__done__', label: t('keyGroup.done'), value: '→ ' + t('keyGroup.confirmToSave'), desc: '' },
  ];

  return (
    <Box flexDirection="column" paddingX={1} gap={1}>
      <Text bold>{editingBaseUrl ? t('keyGroup.editTitle') : t('keyGroup.addTitle', layerLabel(layer))}</Text>
      {rows.map((row, index) => {
        const isSelected = activeField === row.field;
        return (
          <Box key={row.field} flexDirection="row" gap={1}>
            <Text>
              {isSelected ? <Text color="success">❯ </Text> : '  '}
              <Text bold={isSelected}>{index + 1}. {row.label}</Text>
            </Text>
            {isSelected && row.field === 'base_url' ? (
              <>
                <TextInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={() => gotoField('api_key')}
                  cursorOffset={inputCursorOffset}
                  onChangeCursorOffset={setInputCursorOffset}
                  columns={editColumns}
                  focus={true}
                />
                {!inputValue ? <Text dimColor>{t('keyGroup.enterBaseUrl')}</Text> : null}
              </>
            ) : (
              <>
                {row.value ? <Text dimColor>{row.value}</Text> : null}
                {row.desc ? <Text color="warning"> ({row.desc})</Text> : null}
              </>
            )}
          </Box>
        );
      })}
      {saveError ? <Text color="error">{saveError}</Text> : null}
      <Text dimColor>{t('keyGroup.fieldSwitch')}</Text>
    </Box>
  );
}

// Each form is its own component so hooks are never conditionally invoked
// (the parent switch previously changed the hook count between cases, which
// broke React's Rules of Hooks and left stale keybinding contexts after Esc).

type ChinaApiKeyFormProps = {
  status: Extract<OAuthStatus, { state: 'china_apikey' }>;
  setOAuthStatus: (status: OAuthStatus) => void;
  onDone: () => void;
};

function ChinaApiKeyForm({ status, setOAuthStatus, onDone }: ChinaApiKeyFormProps): React.ReactNode {
  const { provider, mode: accessMode, modelId } = status;

  const [chinaKeyValue, setChinaKeyValue] = useState('');
  const [chinaKeyCursor, setChinaKeyCursor] = useState(0);
  const [chinaKeyError, setChinaKeyError] = useState<string | null>(null);

  const doChinaSave = useCallback(() => {
    const effectiveModelId = modelId === '__custom__' ? chinaKeyValue.trim() : modelId;
    if (!effectiveModelId) {
      setChinaKeyError(modelId === '__custom__' ? t('loginFlow.enterModelName') : t('loginFlow.enterApiKey'));
      return;
    }
    if (modelId === '__custom__') {
      logEvent('tengu_china_custom_model_entered', {});
      setOAuthStatus({ state: 'china_apikey', provider, mode: accessMode, modelId: effectiveModelId, apiKey: '' });
      setChinaKeyValue('');
      setChinaKeyError(null);
      return;
    }
    if (!chinaKeyValue.trim()) {
      setChinaKeyError(t('loginFlow.enterApiKey'));
      return;
    }
    const baseUrl = resolveChinaProviderBaseURL(provider.id, accessMode);
    // Save through the key-group system so this provider shows up in the
    // account manager (openai layer) and participates in multi-key rotation,
    // instead of writing a parallel settings.env entry.
    const existingGroups = getSettings_DEPRECATED()?.env;
    const nextGroups = saveKeyGroupPlatform(
      'openai',
      { baseUrl, keys: [chinaKeyValue.trim()], model: modelId },
      existingGroups,
    );
    const { error } = updateSettingsForSource('userSettings', {
      env: nextGroups} as unknown as Parameters<typeof updateSettingsForSource>[1]);
    if (error) {
      setOAuthStatus({
        state: 'error',
        message: t('loginFlow.failedSave'),
        toRetry: { state: 'china_apikey', provider, mode: accessMode, modelId, apiKey: chinaKeyValue }});
    } else {
      applyKeyGroupEnv({ baseUrl, keys: [chinaKeyValue.trim()], model: modelId }, chinaKeyValue.trim(), 'openai');
      activatePlatform('openai', baseUrl);
      // Drop any cached OpenAI client and ChatGPT auth so the new
      // provider/credentials take effect on the next request.
      clearOpenAIClientCache();
      void removeChatGPTAuth().catch(() => {});
      logEvent('tengu_china_login_success', {});
      setOAuthStatus({ state: 'success' });
      void onDone();
    }
  }, [chinaKeyValue, provider, accessMode, modelId, onDone, setOAuthStatus]);

  useKeybinding(
    'confirm:no',
    () => {
      // Restore the cursor to the model the user had selected in the model list,
      // so Esc back from the API key screen doesn't reset to the first entry.
      const allModelIds = [...provider.models.map(m => m.id), '__custom__'];
      let index = allModelIds.indexOf(modelId);
      if (index < 0) index = provider.models.length; // custom model name → back to the __custom__ entry
      setOAuthStatus({ state: 'china_model_select', provider, mode: accessMode, activeIndex: index });
    },
    { context: 'Confirmation' },
  );

  const isCustomModelEntry = modelId === '__custom__';
  const allModels = CHINA_LLM_PROVIDERS.flatMap(p =>
    p.models.map(m => ({ id: m.id, label: m.label, provider: p.label })),
  );
  const modelSuggestions = isCustomModelEntry
    ? chinaKeyValue.trim()
      ? allModels.filter(m => m.id.toLowerCase().includes(chinaKeyValue.trim().toLowerCase()))
      : allModels
    : [];
  const keyPage = isCustomModelEntry
    ? provider.apiKeyPage
    : accessMode === 'coding-plan' && provider.codingPlan
      ? provider.codingPlan.purchasePage
      : provider.apiKeyPage;
  const keyFormat = isCustomModelEntry
    ? provider.keyFormat
    : accessMode === 'coding-plan' && provider.codingPlan
      ? provider.codingPlan.keyFormat
      : provider.keyFormat;
  const chinaColumns = useTerminalSize().columns - 12;

  return (
    <Box flexDirection="column" gap={1} marginTop={1}>
      <Text bold>
        {provider.icon} {provider.label} {isCustomModelEntry ? t('login.customModel') : t('login.apiKey')}
      </Text>
      <Box flexDirection="column" gap={0}>
        {isCustomModelEntry ? (
          <Text dimColor> {t('loginFlow.browseModels', provider.modelsPage)}</Text>
        ) : (
          <>
            <Text dimColor> {t('loginFlow.getYourKey', keyPage)}</Text>
            <Text dimColor>
              {' '}
              {accessMode === 'coding-plan' ? t('loginFlow.useCodingPlan') : t('loginFlow.providerFreeTier_' + provider.id)}
            </Text>
            <Text dimColor> {t('loginFlow.keyFormat', keyFormat)}</Text>
          </>
        )}
      </Box>
      <Box>
        <Text>{isCustomModelEntry ? t('login.modelName') : t('login.apiKeyLabel')}</Text>
        <TextInput
          value={chinaKeyValue}
          onChange={v => {
            setChinaKeyValue(v);
            setChinaKeyError(null);
          }}
          onSubmit={doChinaSave}
          cursorOffset={chinaKeyCursor}
          onChangeCursorOffset={setChinaKeyCursor}
          columns={chinaColumns}
          mask={isCustomModelEntry ? undefined : '*'}
          focus={true}
        />
      </Box>
      {chinaKeyError ? <Text color="error">{chinaKeyError}</Text> : null}
      {isCustomModelEntry && modelSuggestions.length > 0 && (
        <Box flexDirection="column" gap={0}>
          <Text dimColor>{chinaKeyValue.trim() ? t('loginFlow.matchingModels') : t('loginFlow.knownModels')}</Text>
          {modelSuggestions.map(m => (
            <Text key={m.id} dimColor>
              {' '}
              {m.id}{' '}
              <Text>
                ({m.label} — {m.provider})
              </Text>
            </Text>
          ))}
        </Box>
      )}
      <Text dimColor>
        {isCustomModelEntry ? t('login.enterContinue') : t('login.enterConfirm')}
      </Text>
    </Box>
  );
}

type ChatGPTSubscriptionProps = {
  status: Extract<OAuthStatus, { state: 'chatgpt_subscription' }>;
  setOAuthStatus: (status: OAuthStatus) => void;
  onDone: () => void;
};

function ChatGPTSubscription({ status, setOAuthStatus, onDone }: ChatGPTSubscriptionProps): React.ReactNode {
  const startedRef = useRef(false);

  // Esc cancels the device login; unmounting aborts the in-flight request via
  // the AbortController in the effect cleanup below.
  useKeybinding(
    'confirm:no',
    () => {
      setOAuthStatus({ state: 'idle' });
    },
    { context: 'Confirmation' },
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;
    const controller = new AbortController();
    async function runLogin() {
      try {
        const deviceCode = await requestChatGPTDeviceCode();
        if (cancelled) return;
        setOAuthStatus({
          state: 'chatgpt_subscription',
          phase: 'waiting',
          deviceCode});
        void openBrowser(deviceCode.verificationUrl);
        const tokens = await completeChatGPTDeviceLogin(deviceCode, controller.signal);
        if (cancelled) return;
        const accountId = tokens.accountId ?? 'chatgpt-user';
        const groups = getSettings_DEPRECATED()?.env ?? {};
        const subs = (groups['chatgpt-sub'] ?? []) as EnvSubEntry[];
        // Don't duplicate if already registered
        const exists = subs.some(s => s.email === accountId);
        const nextSubs = exists ? subs : [...subs, { email: accountId, model: 'gpt-5.6-sol' }];
        const { error } = updateSettingsForSource('userSettings', {
          env: {
            ...groups,
            'chatgpt-sub': nextSubs,
            current: { layer: 'chatgpt-sub', account: accountId }}} as unknown as Parameters<typeof updateSettingsForSource>[1]);
        if (error) {
          throw new Error(t('loginFlow.failedSave'));
        }
        // Drop any cached OpenAI client built from prior OpenAI Compatible
        // env vars; the ChatGPT Subscription path bypasses the SDK client
        // entirely (uses createChatGPTResponsesStream) but a stale cached
        // client would still be picked up by sideQuery.
        clearOpenAIClientCache();
        setOAuthStatus({ state: 'success' });
        void onDone();
      } catch (err) {
        if (cancelled) return;
        setOAuthStatus({
          state: 'error',
          message: (err as Error).message,
          toRetry: {
            state: 'chatgpt_subscription',
            phase: 'requesting'}});
      }
    }
    void runLogin();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [setOAuthStatus, onDone]);

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>{t('loginFlow.chatgptSetup')}</Text>
      {status.phase === 'requesting' && (
        <Box>
          <Spinner />
          <Text>{t('login.requestCode')}</Text>
        </Box>
      )}
      {status.phase === 'waiting' && status.deviceCode && (
        <Box flexDirection="column" gap={1}>
          <Text>{t('login.openLink')}</Text>
          <Link url={status.deviceCode.verificationUrl}>
            <Text dimColor>{status.deviceCode.verificationUrl}</Text>
          </Link>
          <Text>
            Enter code: <Text bold>{status.deviceCode.userCode}</Text>
          </Text>
          <Box>
            <Spinner />
            <Text>{t('login.waitingChatgpt')}</Text>
          </Box>
        </Box>
      )}
      <Text dimColor>{t('login.escBack')}</Text>
    </Box>
  );
}

type OAuthStatusMessageProps = {
  oauthStatus: OAuthStatus;
  mode: 'login' | 'setup-token';
  startingMessage: string | undefined;
  forcedMethodMessage: string | null;
  showPastePrompt: boolean;
  pastedCode: string;
  setPastedCode: (value: string) => void;
  cursorOffset: number;
  onDone: () => void;
  setCursorOffset: (offset: number) => void;
  textInputColumns: number;
  handleSubmitCode: (value: string, url: string) => void;
  setOAuthStatus: (status: OAuthStatus) => void;
  setLoginWithClaudeAi: (value: boolean) => void;
  idleIndex: number;
  setIdleIndex: (index: number) => void;
  lastModelIndexRef: React.MutableRefObject<number>;
  lastModeIndexRef: React.MutableRefObject<number>;
  lastProviderIndexRef: React.MutableRefObject<number>;
};

function OAuthStatusMessage({
  oauthStatus,
  mode,
  startingMessage,
  forcedMethodMessage,
  showPastePrompt,
  pastedCode,
  setPastedCode,
  cursorOffset,
  setCursorOffset,
  textInputColumns,
  handleSubmitCode,
  setOAuthStatus,
  setLoginWithClaudeAi,
  onDone,
  idleIndex,
  setIdleIndex,
  lastModelIndexRef,
  lastModeIndexRef,
  lastProviderIndexRef}: OAuthStatusMessageProps): React.ReactNode {
  switch (oauthStatus.state) {
    // First screen: account list (switch platform / add / manage / other).
    case 'idle':
      return (
        <AccountManagerForm
          setOAuthStatus={setOAuthStatus}
          onDone={onDone}
          startingMessage={startingMessage}
        />
      );

    case 'layer_select':
      return (
        <LayerSelectForm status={oauthStatus} setOAuthStatus={setOAuthStatus} setLoginWithClaudeAi={setLoginWithClaudeAi} />
      );

    case 'platform_keys_edit':
      return (
        <KeyGroupKeysForm status={oauthStatus} setOAuthStatus={setOAuthStatus} />
      );

    case 'platform_model_picker':
      return (
        <PlatformModelPickerForm status={oauthStatus} setOAuthStatus={setOAuthStatus} />
      );

    case 'platform_edit':
      return (
        <PlatformEditForm status={oauthStatus} setOAuthStatus={setOAuthStatus} onDone={onDone} />
      );

    case 'chatgpt_subscription':
      return (
        <ChatGPTSubscription status={oauthStatus} setOAuthStatus={setOAuthStatus} onDone={onDone} />
      );

    case 'china_provider_select': {
      return (
        <Box flexDirection="column" gap={1} marginTop={1}>
          <Text bold>{t('login.chinaSelect')}</Text>
          <Text dimColor>{t('loginFlow.directConnection')}</Text>
          <Box>
            <Select
              options={CHINA_LLM_PROVIDERS.map(p => ({
                label: (
                  <Text>
                    {p.icon} {t('loginFlow.providerLabel_' + p.id)} · <Text dimColor>{t('loginFlow.providerDesc_' + p.id)}</Text>
                    {'\n'}
                  </Text>
                ),
                value: p.id}))}
              defaultFocusValue={CHINA_LLM_PROVIDERS[oauthStatus.activeIndex]?.id}
              onFocus={value => {
                const idx = CHINA_LLM_PROVIDERS.findIndex(p => p.id === value);
                if (idx >= 0) lastProviderIndexRef.current = idx;
              }}
              onChange={value => {
                const provider = CHINA_LLM_PROVIDERS.find(p => p.id === value);
                if (!provider) return;
                logEvent('tengu_china_provider_selected', {});
                if (provider.codingPlan) {
                  setOAuthStatus({ state: 'china_mode_select', provider, activeIndex: lastModeIndexRef.current });
                } else {
                  setOAuthStatus({
                    state: 'china_model_select',
                    provider,
                    mode: 'api',
                    activeIndex: lastModelIndexRef.current});
                }
              }}
              onCancel={() => {
                setOAuthStatus({ state: 'idle' });
              }}
            />
          </Box>
          <Text dimColor>{t('login.selectEscHint')}</Text>
        </Box>
      );
    }

    case 'china_mode_select': {
      const { provider } = oauthStatus;
      const modeOptions = [
        { id: 'api' as const, label: t('loginFlow.payAsYouGo'), desc: t('loginFlow.modeDesc_api') },
        { id: 'coding-plan' as const, label: t('loginFlow.codingPlan'), desc: t('loginFlow.modeDesc_codingPlan') },
      ];
      return (
        <Box flexDirection="column" gap={1} marginTop={1}>
          <Text bold>
            {t('loginFlow.selectAccessMode', provider.icon, provider.label)}
          </Text>
          <Box>
            <Select
              options={modeOptions.map(m => ({
                label: (
                  <Text>
                    {m.label} · <Text dimColor>{m.desc}</Text>
                    {'\n'}
                  </Text>
                ),
                value: m.id}))}
              defaultFocusValue={modeOptions[oauthStatus.activeIndex]?.id}
              onFocus={value => {
                const idx = modeOptions.findIndex(m => m.id === value);
                if (idx >= 0) lastModeIndexRef.current = idx;
              }}
              onChange={value => {
                logEvent('tengu_china_mode_selected', {});
                setOAuthStatus({
                  state: 'china_model_select',
                  provider,
                  mode: value as 'api' | 'coding-plan',
                  activeIndex: lastModelIndexRef.current});
              }}
              onCancel={() => {
                const providerIndex = CHINA_LLM_PROVIDERS.findIndex(p => p.id === provider.id);
                setOAuthStatus({ state: 'china_provider_select', activeIndex: Math.max(0, providerIndex) });
              }}
            />
          </Box>
          <Text dimColor>
            {t('loginFlow.noPlan')}
            {provider.id === 'zhipu' ? t('loginFlow.glmFree') : ''}
          </Text>
          <Text dimColor>{t('login.selectEscHint')}</Text>
        </Box>
      );
    }

    case 'china_model_select': {
      const { provider, mode: accessMode, activeIndex } = oauthStatus;
      const models = provider.models;
      const allModelIds = [...models.map(m => m.id), '__custom__'];
      return (
        <Box flexDirection="column" gap={1} marginTop={1}>
          <Text bold>
            {t('loginFlow.selectModel', provider.icon, provider.label)}
          </Text>
          <Box>
            <Select
              options={[
                ...models.map(m => {
                  const priceLabel =
                    m.inputPricePerMTok === 0 && m.outputPricePerMTok === 0
                      ? t('loginFlow.free')
                      : `¥${m.inputPricePerMTok}/¥${m.outputPricePerMTok}`;
                  const tagLabel = m.tags?.length ? ` [${m.tags.join(', ')}]` : '';
                  return {
                    label: (
                      <Text>
                        {m.label} ·{' '}
                        <Text dimColor>
                          {priceLabel} · {m.contextWindow}
                          {tagLabel}
                        </Text>
                        {'\n'}
                      </Text>
                    ),
                    value: m.id};
                }),
                {
                  label: (
                    <Text>
                      {t('loginFlow.customModel')}
                      <Text dimColor>{t('loginFlow.customModelDesc')}</Text>
                      {'\n'}
                    </Text>
                  ),
                  value: '__custom__'},
              ]}
              defaultFocusValue={allModelIds[activeIndex] ?? allModelIds[0]}
              onFocus={value => {
                const idx = allModelIds.indexOf(value);
                if (idx >= 0) lastModelIndexRef.current = idx;
              }}
              onChange={value => {
                logEvent('tengu_china_model_selected', {});
                setOAuthStatus({ state: 'china_apikey', provider, mode: accessMode, modelId: value, apiKey: '' });
              }}
              onCancel={() => {
                const modeIndex = ['api', 'coding-plan'].indexOf(accessMode);
                setOAuthStatus({ state: 'china_mode_select', provider, activeIndex: Math.max(0, modeIndex) });
              }}
            />
          </Box>
          <Text dimColor>{t('login.selectEscHint')}</Text>
        </Box>
      );
    }

    case 'china_apikey':
      return (
        <ChinaApiKeyForm status={oauthStatus} setOAuthStatus={setOAuthStatus} onDone={onDone} />
      );

    case 'success':
      return (
        <Box flexDirection="column">
          {mode === 'setup-token' && oauthStatus.token ? null : (
            <>
              {getOauthAccountInfo()?.emailAddress ? (
                <Text dimColor>
                  {t('login.loggedInAs')} <Text>{getOauthAccountInfo()?.emailAddress}</Text>
                </Text>
              ) : null}
              <Text color="success">
                {t('loginFlow.loginSuccessful')} <Text bold>Enter</Text> {t('loginFlow.toContinue')}
              </Text>
            </>
          )}
        </Box>
      );

    case 'error':
      return (
        <Box flexDirection="column" gap={1}>
          <Text color="error">{t('loginFlow.oauthError', oauthStatus.message)}</Text>

          {oauthStatus.toRetry && (
            <Box marginTop={1}>
              <Text color="permission">
                Press <Text bold>{t('consoleoauthflow.enter2')}</Text> to retry.
              </Text>
            </Box>
          )}

          <Text dimColor>{t('login.escCancel')}</Text>
        </Box>
      );

    default:
      return null;
  }
}
