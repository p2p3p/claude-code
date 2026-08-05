export type TranslationDict = {
  welcome: { title: string }
  theme: {
    title: string
    letsGetStarted: string
    chooseStyle: string
    helpText: string
    dark: string
    light: string
    darkColorblind: string
    lightColorblind: string
    darkAnsi: string
    lightAnsi: string
    auto: string
    themeSetTo: (t: string) => string
    themePickerDismissed: string
  }
  onboarding: {
    securityTitle: string
    alwaysReview: string
    alwaysReviewDesc: string
    onlyUseTrusted: string
    onlyUseTrustedDesc: string
    pressEnter: string
    useTerminalSetup: string
    terminalSetupDesc: string
    terminalSetupOptApple: string
    terminalSetupOptShift: string
    yesRecommended: string
    noLater: string
    enterConfirm: string
    escSkip: string
  }
  trust: {
    title: string
    guide: string
    yes: string
    no: string
    enterConfirm: string
    escCancel: string
    accessingWorkspace: string
    onceTrusted: string
  }
  ide: { welcomeFor: (n: string) => string; contextFiles: string; contextLines: string; quickLaunch: string; referenceFiles: string; reviewChanges: string; pressEnter: string }
  home: { welcomeBack: string; welcomeBackUser: (n: string) => string }
  feed: { tips: string; recent: string; noRecent: string; homeDirWarning: string; opusNotice: string; notLoggedIn: string; authError: string; debugMode: string; shareEarn: (n: string) => string; shareFriends: string; guestPasses: string; whatsNew: string; noUpdates: string; checkChangelog: string; releaseNotes: string; initClaudeMd: string; antOnlyCommits: string; passesFooter: string; resumeMore: string; unableToFetch: string }
  common: { pressAgain: (k: string) => string; tryCmd: (c: string) => string }
  login: {
    subtitle: string
    selectMethod: string
    anthropic: string
    anthropicDesc: string
    openai: string
    openaiDesc: string
    china: string
    chinaDesc: string
    chatgpt: string
    chatgptDesc: string
    gemini: string
    geminiDesc: string
    anthropicSetup: string
    openaiSetup: string
    openaiDesc2: string
    geminiSetup: string
    chinaSelect: string
    oauthToken: string
    requestCode: string
    openLink: string
    waitingChatgpt: string
    openingBrowser: string
    creatingKey: string
    loggedInAs: string
    baseUrl: string
    apiKey: string
    haiku: string
    sonnet: string
    opus: string
    fieldSwitch: string
    escBack: string
    escBackTimeout: string
    geminiDesc2: string
    customModel: string
    apiKeyLabel: string
    modelName: string
    enterContinue: string
    enterConfirm: string
    escGoBack: string
    loginTitle: string
    pressW: string
    pressWReplace: string
    envOverride: string
    confirmRemove: string
    removing: string
    removeKeyDesc: string
  }
  authPlane: {
    notLoggedIn: string
    enableVault: string
    pressW: string
    step1: string
    step2: string
    step3: string
  }
  workspaceKey: {
    enterKey: string
    obtainFrom: string
    pasteHint: string
    saving: string
    enterSave: string
    escCancel: string
    startTyping: string
  }
  loginFlow: {
    pasteCodeHere: string; preSelectedSub: string; preSelectedApi: string
    invalidCode: string; failedExchange: string; browserDidntOpen: string; copied: string
    tokenCreated: string; storeTokenSecurely: string; useToken: string
    claudeAccount: string; consoleAccount: string; thirdParty: string
    invalidBaseUrl: string; failedSave: string; chatgptSetup: string; geminiModelsRequired: string
    failedSaveError: (m: string) => string; directConnection: string; payAsYouGo: string; codingPlan: string
    selectAccessMode: (i: string, l: string) => string; noPlan: string; glmFree: string
    selectModel: (i: string, l: string) => string; free: string; customModel: string; customModelDesc: string
    enterModelName: string; enterApiKey: string; browseModels: (p: string) => string
    getYourKey: (p: string) => string; useCodingPlan: string; keyFormat: (f: string) => string
    matchingModels: string; knownModels: string; usingThirdParty: string; retrying: string
    loginSuccessful: string; oauthError: (m: string) => string; pressEnterRetry: string; toContinue: string
  }
  cmd: Record<string, string>
  permission: {
    enterPlanMode: string
    exitPlanMode: string
    heresPlan: string
    proceed: string
    allowConnection: string
    allowFetch: string
    skillUse: string
    approveArtifact: (t: string) => string; showReview: string
    yesDontAsk: (s: string, c: string) => string
    enterPath: string
    confirmDelete: string
    autoReadInfo: string
    recentDenials: string
    noAccess: string
    pressAgain: (k: string) => string
  }
  pluginUI: {
    discoverPlugins: string; installed: string; marketplaces: string; errors: string
    noPluginsInstalled: string; escBack: string; managePlugins: string
    enablePlugin: string; disablePlugin: string; uninstall: string
    pluginCommandUsage: string; noPluginErrors: string; reloadToApply: string
    fieldOf: (n: number, t: number) => string; tabNextField: string; enterSave: string
    trustWarning: string; configure: (n: string) => string; pluginOptions: string; plugin: (n: string) => string
    scope: string; version: string; author: string; status: string; enabled: string; disabled: string
    installedComponents: string; commands: string; agents: string; skills: string; hooks: string; mcpServers: string
    builtin: string; flagged: string; project: string; local: string; user: string; enterprise: string; managed: string
    typeToSearch: string; details: string; select: string; pluginDetails: string
    noPluginsMatch: (q: string) => string; noPluginsAvailable: string; addMarketplaceFirst: string
    error: string; by: string; willInstall: string; selectMarketplace: string; noMarketplaces: string
    installPlugins: string; noSummary: string; toggle: string; back: string
    installUser: string; installProject: string; installLocal: string; openHomepage: string; viewOnGitHub: string
    addMarketplace: string; enterMarketplaceSource: string; pleaseEnterSource: string; invalidSourceFormat: string
    addingMarketplace: string; willEnable: string; willDisable: string; validateUsage: string; examples: string
    loading: string
    runningValidation: string
    goBack: string
    install: string
    from: string
    noNewPlugins: string
    allPluginsInstalledInMarketplace: string
    gitRequired: string
    installGit: string
    policyBlocked: string
    contactAdmin: string
    policyRestricts: string
    viewAllowedSources: string
    loadFailed: string
    checkNetwork: string
    allPluginsInstalled: string
    checkLater: string
    noPlugins: string
    addMarketplaceHint: string
    noSearchResults: (q: string) => string
    moreAbove: string
    moreBelow: string
    installing: string
    componentsWillBeDiscovered: string
    pluginTitle: string
    marketplaceTitle: string
    installPluginsTitle: string
    discoverPluginsTitle: string
    noPluginsAvailableTitle: string; removeMarketplace: string; updateMarketplace: string
  }
  breakCache: {
    status: string; statusDesc: string; once: string; onceDesc: string
    always: string; alwaysDesc: string; off: string; offDesc: string
    clearOnce: string; clearOnceDesc: string; actions: string
  }
  installGithub: {
    checkingGitHub: string
    existingWorkflow: string
    repository: string
    whatToDo: string
    workflowExists: string
    updateWorkflow: string
    skipWorkflow: string
    exitNoChanges: string
    viewLatestWorkflow: string
    setupWarnings: string
    warningsDesc: string
    continueAnyway: string
    manualSetup: string; chooseApiKey: string; createToken: string; enterNewKey: string; navSelect: string; useExistingKey: string
  }
  btw: {
    answering: string
  }
  tui: {
    title: string
    status: string
    toggle: string
    on: string
    off: string
    statusDesc: string
    toggleDesc: string
    onDesc: string
    offDesc: string
    helpText: string; actions: string
    dismissed: string
  }
  vaultView: {
    noVaults: string
    vaults: (n: number) => string
    name: string
    status: string
    created: string
    archived: string
    vaultCreated: string
    vaultArchived: string
    noCredentials: (v: string) => string
    credentialsIn: (v: string, n: number) => string
    valueMasked: string
    credentialAdded: string
    credentialArchived: string
    id: string
  }
  memoryStores: {
    noStores: string
    stores: (n: number) => string
    store: string
    name: string
    status: string
    created: string
    archived: string
    storeCreated: string
    storeArchived: string
    noMemories: (s: string) => string
    memoriesIn: (s: string, n: number) => string
    memoryDetail: string
    memoryCreated: string
    memoryUpdated: string
    memoryDeleted: (id: string, storeId: string) => string
    noVersions: (s: string) => string
    versionsIn: (s: string, n: number) => string
    versionRedacted: string
    namespace: string
    content: string
    updated: string
    id: string
    archivedAt: string
    redacted: string
    redactedAt: string
  }
  settings: {
    autoCompact: string; showTips: string; cacheWarnings: string; reduceMotion: string; thinkingMode: string
    promptSuggestions: string; poorMode: string; speculativeExecution: string; rewindCode: string
    verboseOutput: string; terminalProgressBar: string; showStatusTerminalTab: string; showTurnDuration: string; statusLineEnabled: string; fullscreenEnabled: string
    defaultPermissionMode: string; useAutoMode: string; respectGitignore: string; copyFullResponse: string
    copyOnSelect: string; autoUpdateChannel: string; fastMode: string; fastModeOff: string; theme: string; pushWhenIdle: string; pushWhenInputNeeded: string
    pushWhenClaudeDecides: string; outputStyle: string; defaultView: string; aiPreferredLanguage: string; uiLanguage: string; editorMode: string
    showPRStatus: string; model: string; diffTool: string; autoConnectIDE: string; autoInstallIDE: string
    claudeInChrome: string; teammateModel: string; remoteControl: string; externalIncludes: string
    enableLatest: string; enableStable: string; notifications: string; localNotifications: string
    maxApiRetries: string; maxApiRetriesDefault: string; maxApiRetriesOff: string; maxApiRetriesAlways: string; maxApiRetriesCustom: string
    maxApiRetriesDefaultDesc: string; maxApiRetriesOffDesc: string; maxApiRetriesAlwaysDesc: string; maxApiRetriesCustomDesc: string
    maxApiRetriesCustomInput: string; maxApiRetriesCurrent: string
    maxApiRetriesDefaultWithValue: (n: number) => string; maxApiRetriesCustomWithValue: (n: number) => string
    setTo: (key: string, value: string) => string; enabled: string; disabled: string; customApiKey: string
    themeChanged: (v: string) => string; notificationsChanged: (v: string) => string; outputStyleChanged: (v: string) => string; languageChanged: (v: string) => string
    editorModeChanged: (v: string) => string; diffToolChanged: (v: string) => string; autoConnectChanged: (v: boolean) => string; autoInstallChanged: (v: boolean) => string
    autoCompactChanged: (v: boolean) => string; respectGitignoreChanged: (v: boolean) => string; copyFullResponseChanged: (v: boolean) => string
    copyOnSelectChanged: (v: boolean) => string; terminalProgressBarChanged: (v: boolean) => string; terminalTabStatusChanged: (v: boolean) => string
    turnDurationChanged: (v: boolean) => string; remoteControlReset: string; remoteControlChanged: (v: boolean) => string
    autoUpdateChannelChanged: (v: string) => string
  }
  permissionMode: {
    default: string; plan: string; acceptEdits: string; bypassPermissions: string; dontAsk: string; auto: string
  }
  prompt: {
    waiting: (duration: string) => string; goal: (time: string) => string; exitAgain: (key: string) => string; pasting: string; vimInsert: string; bashMode: string; remote: string; rssPid: (rss: string, pid: number) => string; shortcuts: string; holdToSpeak: (key: string) => string; macOptionClick: string; returnToTeamLead: string; interrupt: string; copy: string; nativeSelect: string; manage: string; viewTasks: string; stopAgents: string; showTasks: string; showTeammates: string; hide: string; hideTasks: string
  }
  schedule: {
    noTriggers: string
    triggers: (n: number) => string
    schedule: string
    status: string
    prompt: string
    nextRun: string
    lastRun: string
    created: string
    agent: string
    triggerCreated: string
    triggerUpdated: string
    triggerDeleted: (id: string) => string
    triggerRan: (id: string, runId: string) => string
    triggerEnabled: (id: string) => string
    triggerDisabled: (id: string) => string
    id: string
    runId: string
    enabled: string
    disabled: string
    statusEnabled: string
    statusDisabled: string
  }
  localMemory: {
    noStores: string; storesCount: (n: number) => string; storedEntry: string; in: string
    notFound: string; noEntriesIn: string; addEntryHint: (s: string) => string; entriesCount: (p: { count: number }) => string
    archivedStore: string; renamedTo: (p: { name: string }) => string; error: string; storeCreated: string
    stored: string; value: string; archive: string; create: string; entries: string
  }
  localVault: {
    noSecrets: string; keysCount: (n: number) => string; secretStored: string; redacted: string
    useReveal: (k: string) => string; masked: string; keyNotFound: string; deleted: string; error: string
    secretRevealed: string; delete: string
  }
  teleportError: {
    title: string
    teleportRequires: string
    subscriptionUsed: string
    loginWithClaude: string
    exit: string
  }
  teleportProgress: {
    teleporting: string
    validating: string
    fetchingLogs: string
    gettingBranch: string
    checkingOut: string
  }
  teleportStash: {
    title: string
    checkingGit: string
    error: string
    pressEscape: string
    escape: string
    toCancel: string
    willSwitch: string
    filesChanged: string
    noChanges: string
    stashPrompt: string
    stashing: string
    stashAndContinue: string
    exit: string
    failedGetFiles: string
    failedStash: string
  }
  teleportRepoMismatch: {
    title: string
    noLongerContains: string
    use: string
    cancel: string
    openIn: string
    validating: string
    runFrom: string
  }
  idleReturn: {
    title: (formattedIdle: string, formattedTokens: string) => string
    description: string
    continue: string
    newConversation: string
    dontAsk: string
  }
  exportDialog: {
    title: string
    subtitle: string
    copiedToClipboard: string
    failedExport: (message: string) => string
    cancelled: string
    copyToClipboard: string
    copyDescription: string
    saveToFile: string
    fileDescription: string
    enterFilename: string
    save: string
    goBack: string
    cancel: string
    exportedTo: (filepath: string) => string
  }
  outputStyle: {
    title: string
    description: string
    loading: string
  }
  stats: {
    loading: string
    failedToLoad: string
    noStats: string
    loadingStats: string
    overview: string
    models: string
    hint: string
    favoriteModel: string
    totalTokens: string
    sessions: string
    longestSession: string
    activeDays: string
    longestStreak: string
    day: string
    days: string
    mostActiveDay: string
    currentStreak: string
    shotDistribution: string
    tokensPerDay: string
    noModelData: string
    statsDialogDismissed: string
    of: string
    toScroll: string
    modelsCount: (n: number) => string
    copying: string
    copied: string
    copyFailed: string
    avgPerSession: string
    statsFrom: (days: number) => string
    speculationSaved: string
    peakHour: string
    currentStreakLabel: string
    longestStreakLabel: string
    activeDaysLabel: string
  }
  compactSummary: {
    summarized: string
    summarizedMessages: (count: number, direction: string) => string
    context: (ctx: string) => string
    expandHistory: string
    conversationSummarized: string
    viewSummary: string
  }
  languagePicker: {
    prompt: string
    placeholder: (ellipsis: string) => string
    leaveEmpty: string; enterLanguage: string
  }
  invalidConfig: {
    title: string
    description: (filePath: string) => string
    chooseOption: string
    exitAndFix: string
    resetWithDefault: string; resetDefault: string
  }
  invalidSettings: {
    title: string
    skippedDesc: string
    exitAndFix: string
    continueWithout: string; filesSkipped: string
  }
  thinkingToggle: {
    title: string
    description: string
    enabled: string
    enabledDesc: string
    disabled: string
    disabledDesc: string
    warning: string
    proceed: string
    confirm: string
    exit: string
    cancel: string; desc: string
  }
  resumeTask: {
    loading: string
    retrying: string
    fetching: string
    errorLoading: string
    checkInternet: string
    teleportRequires: string
    loginHint: string
    apiError: string
    otherError: string
    noSessions: string
    for: string
    pressCtrlR: string
    pressToCancel: (key: string) => string
    selectSession: string
    sessionTitle: string
    ctrlR: string
    updated: string
  }
  workflowMultiselect: {
    title: string
    subtitle: string
    moreExamples: string
    mustSelect: string
    navigate: string
    toggle: string
    confirm: string
    cancel: string
  }
  costThreshold: {
    title: string
    learnMore: string
    gotIt: string
  }
  channelDowngrade: {
    title: string
    description: (version: string) => string
    howToHandle: string
    allowDowngrade: string
    stayOnVersion: (version: string) => string
  }
  contextSuggestions: {
    suggestions: string
    title: string; save: (tokens: string) => string
  }
  interruptedByUser: {
    interrupted: string
    reportIssue: string
    whatShouldClaudeDo: string
  }
  keybindingWarnings: {
    title: string
    location: string
    error: string
    warning: string
  }

  cmdUI: {
    apiKey: string; back: string; chooseFetch: string; chooseSearch: string
    copyAction: string; copyCancel: string; copyCancelled: string; copyFull: string
    copyNoMessage: string; copySelect: string; copySkip: string; copyWrite: string
    endpointUrl: string; mcpAllEnabled: string; modeCancelled: string; modeNav: string
    noConfig: string; rlAddFunds: string; rlRequest: string; rlRequestExtra: string
    rlSwitchExtra: string; save: string; selectClose: string; selectMode: string
    timeoutMs: string; webFetch: string; webSearch: string; webTools: string
  }
  cmdSystemUI: {
    autonomyTitle: string; breakCacheTitle: string; cancelledMemory: string; confirmDelete: string
    goalCleared: string; goalComplete: string; goalPaused: string; goalResumed: string
    localMemoryTitle: string; localVaultTitle: string; noActiveGoal: string; noKeepGoal: string
    skillAbout: string; skillDismissed: string; skillStart: string; skillStatus: string; skillStop: string
    yesReplace: string
  }
  grove: {
    acceptOff: string; acceptOffDomain: string; acceptOn: string; dataPrivacy: string
    dataRetention: string; dataRetentionDesc: string; dataRetentionHow: string; dataRetentionHowDesc: string
    falseForDomain: string; gracePeriodBody: string; helpImproveClaude: string
    helpImproveClaudeSetting: string; helpImproveDesc: string; helpImproveLabel: string
    learnMore: string; notNow: string; postGraceBody: string; reviewSettings: string
    selectHow: string; takesEffect: string; title: string; whatsChanging: string
  }
  misc: {
    claudeCodeTitle: string; claudeCodeV: string; extraUsageCredit: string; extraUsageSubtitle: string
    guestPassesCount: string; lastOnboardingVersion: string; mcpHelp: string; noMcpServer: string
    onboardingCompleted: string; onboardingStatus: string; pluginNotInstalled: string
    runModelPick: string; themeLabel: string; uiLang: string; uiLangDesc: string; uiLangHint: string
    voiceMode: string; workspaceTrustCleared: string
  }
  permGeneral: {
    deleteCell: string; deleteCellLabel: string; editFile: string; editNotebook: string
    fileDoesNotExist: string; insertCell: string; insertNewCell: string; monitor: string
    patternNoMatch: string; replaceCell: string; replaceCellContents: string; toolUse: string; no: string; yes: string
  }
  bashToolUse: {
    yes: string
    yesAndTell: string
    yesDontAsk: string
    commandPrefix: string
    describeWhatToAllow: string
    no: string
    tellDifferent: string
    powershellPrefix: string
  }
  bashPermission: {
    checking: string
    title: string
    titleUnsandboxed: string
    autoApproved: string
    matchedRule: (rule: string) => string
    requiresManual: string
    doYouProceed: string
    escToReject: string
    tabToAddFeedback: string
    ctrlDToHide: string
    ctrlEToExplain: string
    ctrlEToHide: string
  }
  webFetchPermission: {
    yes: string
    yesDontAsk: (hostname: string) => string
    noAndTell: string
    title: string
  }
  skillPermission: {
    title: (skill: string) => string
    yes: string
    yesDontAsk: (skill: string, cwd: string) => string
    yesPrefix: (prefix: string, cwd: string) => string
    no: string
  }
  workflowPermission: {
    title: string
    yes: string
    yesDontAsk: (toolName: string) => string
    no: string
    executeWorkflow: (workflow: string) => string
    arguments: (args: string) => string
  }
  mcpServerDialog: {
    title: (count: number) => string
    subtitle: string
    spaceSelect: string
    enterConfirm: string
    rejectAll: string
  }
  filePermission: {
    proceed: string
    symlinkOutside: (target: string) => string
    symlinkTarget: (target: string) => string
    escToReject: string
    tabToAddFeedback: string
  }
  filePermissionOptions: {
    yes: string
    andTellNext: string
    allowClaudeEdits: string
    duringSession: string
    allowAllEditsSession: (shortcut: string) => string
    allowReadingSession: (dir: string) => string
    allowAllEditsIn: (dir: string, shortcut: string) => string
    no: string
    tellDifferent: string
  }
  exitPlanMode: {
    yesAutoAcceptEdits: string
    yesUseAutoMode: string
    yesBypassPermissions: string
    yesAutoAcceptEditsKC: string
    yesManuallyApprove: string
    noUltraplan: string
    noKeepPlanning: string
    tellClaudeChange: string
    shiftTabApprove: string
    noPlanFound: string
  }
  permissionDebug: {
    requiresSandbox: string
    noDecisionReason: string
  }
  shellPermission: {
    similar: string
    allowReadingFrom: string
    allowReadingFromMulti: string
    alwaysAllowAccess: string
    alwaysAllowAccessMulti: string
    dontAskAgainFor: string
    commandsIn: (cwd: string) => string
    alwaysAllowAccessTo: string
    allowAccessTo: string
    and: string
    andCommands: string
    allowAccess: string
    accessAnd: string
    commandsOnly: string
    fromThisProject: string
    andNMore: (n: number) => string
  }
  permRuleList: {
    addNewRule: string; allowDesc: string; askDesc: string; denyDesc: string
    footerDefault: string; footerHeader: string; footerRecent: string; footerSearch: string
    managedSettings: string; permissionDismissed: string; ruleAllowed: string; ruleAsk: string
    ruleDenied: string; ruleDetails: string; contactAdmin: string; escCancel: string; no: string; yes: string
  }
  recentDenials: { empty: string; retry: string }
  sandbox: { host: string; noTellClaude: string; title: string; yes: string }
  settingsStatus: { sessionId: string; sessionName: string; version: string }
  tag: { noKeep: string; removeConfirm: string; yesRemove: string }
  teammateViewHeader: { viewing: string }
  thinkback: { editContent: string; fixErrors: string; playAnimation: string; regenerate: string; relive: string }
  ultrareview: { launching: string }
  workspaceDir: { permissionDesc: string; yesRemember: string; yesSession: string; no: string; placeholder: string; title: string }
  devChannels: { accept: string; body1: string; body2: string; body3: string; channels: string; exit: string; title: string }
  bypassPermissions: { body1: string; body2: string; body3: string; no: string; title: string; yes: string }
  approveApiKey: { recommended: string; useKey: string; no: string; title: string; yes: string }
  autoMode: { enable: string; makeDefault: string; noExit: string; noGoBack: string; title: string; description: string }
  claudeInChrome: { body: string; moreInfo: string; requiresExt: string; permissions: string; title: string }
  claudeMdExternalIncludes: { body: string; externalImports: string; no: string; title: string; warning: string; yes: string }
  help: {
    askDesc: string; forCommands: string; forShortcuts: string; gettingStarted: string
    reviewDesc: string; shortcuts: string; toCommit: string; type: string
  }
  interrupted: { label: string; whatShouldClaudeDo: string }
  chrome: {
    disabled: string; enabled: string; extension: string; installExtension: string; installed: string
    managePermissions: string; notDetected: string; notSupportedWSL: string
    reconnectExtension: string; requiresSubscription: string; status: string; usage: string
  }
  searchExtraTools: { dismiss: string }
  project: { workspaceStep: string }


  logoV2: {
    antLogs: string; apiCalls: string; debugLogs: string; debugMode: string; detach: string
    loggingTo: string; reportIssue: string; sandboxed: string; startupPerf: string; tmuxSession: string
  }
  removeDir: { no: string; title: string; yes: string }
  settingsTab: { config: string; status: string; usage: string }
  preview: {
    questionNoPreview: string
    notes: string
    notesPlaceholder: string
    pressNToAddNotes: string
    chatAboutThis: string
    skipInterview: string
    helpText: string
    tabToSwitchQuestions: string
    ctrlGToEdit: (editorName: string) => string
    escCancel: string
  }
  hooks: {
    disabledTitle: string
    escToClose: string
    allDisabled: string
    disabledBold: string
    byManagedSettings: string
    youHaveCount: (count: number) => string
    hooksNotRunning: (count: number) => string
    whenDisabled: string
    noCommands: string
    noStatusLine: string
    noValidation: string
    reEnableHint: string
  }

}

const en: TranslationDict = {
  welcome: { title: 'Welcome to Claude Code' },
  theme: {
    title: 'Theme',
    letsGetStarted: "Let's get started.",
    chooseStyle: 'Choose the text style that looks best with your terminal',
    helpText: 'To change this later, run /theme',
    dark: 'Dark mode',
    light: 'Light mode',
    darkColorblind: 'Dark mode (colorblind-friendly)',
    lightColorblind: 'Light mode (colorblind-friendly)',
    darkAnsi: 'Dark mode (ANSI colors only)',
    lightAnsi: 'Light mode (ANSI colors only)',
    auto: 'Auto (match terminal)',
    themeSetTo: (t: string) => `Theme set to ${t}.`,
    themePickerDismissed: 'Theme picker dismissed.',
  },
  onboarding: {
    securityTitle: 'Before you start, keep in mind:',
    alwaysReview: 'Always review changes before accepting',
    alwaysReviewDesc: 'Claude can make mistakes — especially when running commands or editing files. You stay in control of every action.',
    onlyUseTrusted: 'Only use Claude Code on projects you trust',
    onlyUseTrustedDesc: 'Untrusted code could contain prompt injection attacks.',
    pressEnter: 'Press Enter to continue',
    useTerminalSetup: "Use Claude Code's terminal setup?",
    terminalSetupDesc: 'For the optimal coding experience, enable the recommended settings for your terminal:',
    terminalSetupOptApple: 'Option+Enter for newlines and visual bell',
    terminalSetupOptShift: 'Shift+Enter for newlines',
    yesRecommended: 'Yes, use recommended settings',
    noLater: 'No, maybe later with /terminal-setup',
    enterConfirm: 'Enter to confirm',
    escSkip: 'Esc to skip',
  },
  trust: {
    title: 'Is this a project you trust? (Your own code, a well-known open source project, or work from your team).',
    guide: 'Security guide',
    yes: 'Yes, I trust this folder',
    no: 'No, exit',
    enterConfirm: 'Enter to confirm',
    escCancel: 'Esc to cancel',
    accessingWorkspace: 'Accessing workspace:',
    onceTrusted: 'Once trusted, Claude Code can read, edit, and run commands in this folder.',
  },
  ide: {
    welcomeFor: (n: string) => `Welcome to Claude Code for ${n}`,
    contextFiles: 'Context files',
    contextLines: 'Context lines',
    quickLaunch: 'Quick launch',
    referenceFiles: 'Reference files',
    reviewChanges: 'Review changes',
    pressEnter: 'Press Enter to continue',
  },
  home: { welcomeBack: 'Welcome back!', welcomeBackUser: (n: string) => `Welcome back ${n}!` },
  feed: {
    tips: 'Tips for getting started',
    recent: 'Recent activity',
    noRecent: 'No recent activity',
    homeDirWarning: "Note: You have launched claude in your home directory. For the best experience, launch it in a project directory instead.",
    opusNotice: 'Opus now defaults to 1M context · 5x more room, same pricing',
    notLoggedIn: 'Not logged in · Run /login',
    authError: 'Authentication error · Try again',
    debugMode: 'Debug mode',
    shareEarn: (n: string) => `Share Claude Code and earn ${n} of extra usage`,
    shareFriends: 'Share Claude Code with friends',
    guestPasses: '3 guest passes',
    whatsNew: "What's new",
    noUpdates: 'No updates available yet',
    checkChangelog: 'Check the Claude Code changelog for updates',
    releaseNotes: '/release-notes for more',
    initClaudeMd: 'Run /init to create a CLAUDE.md file with instructions for Claude',
    antOnlyCommits: 'Anthropic internal commits',
    passesFooter: 'Share Claude Code with friends',
    resumeMore: 'Resume a previous session',
    unableToFetch: 'Unable to fetch recent activity',
  },
  common: { pressAgain: (k: string) => `Press ${k} again to exit`, tryCmd: (c: string) => `Try "${c}"` },
  login: {
    subtitle: 'Claude Code can be used with your Claude subscription or billed based on API usage through your Console account.',
    selectMethod: 'Select login method:',
    anthropic: 'Anthropic Compatible',
    anthropicDesc: 'Configure your own API endpoint',
    openai: 'OpenAI Compatible',
    openaiDesc: 'Ollama, DeepSeek, vLLM, One API, etc.',
    china: 'China LLM Providers',
    chinaDesc: 'DeepSeek, Zhipu GLM, Qwen, MiMo',
    chatgpt: 'ChatGPT account with subscription',
    chatgptDesc: 'Plus, Pro, Business, Edu, or Enterprise',
    gemini: 'Gemini API',
    geminiDesc: 'Google Gemini native REST/SSE',
    anthropicSetup: 'Anthropic Compatible Setup',
    openaiSetup: 'OpenAI Compatible API Setup',
    openaiDesc2: 'Configure an OpenAI Chat Completions compatible endpoint (e.g. Ollama, DeepSeek, vLLM).',
    geminiSetup: 'Gemini API Setup',
    chinaSelect: 'Select China LLM Provider',
    oauthToken: 'Your OAuth token (valid for 1 year):',
    requestCode: 'Requesting sign-in code…',
    openLink: 'Open this link and sign in with your ChatGPT account:',
    waitingChatgpt: 'Waiting for ChatGPT authorization…',
    openingBrowser: 'Opening browser to sign in…',
    creatingKey: 'Creating API key for Claude Code…',
    loggedInAs: 'Logged in as',
    baseUrl: 'Base URL',
    apiKey: 'API Key',
    haiku: 'Haiku',
    sonnet: 'Sonnet',
    opus: 'Opus',
    fieldSwitch: '↑↓/Tab to switch · Enter on last field to save · Esc to go back',
    escBack: 'Esc to go back. Device codes expire after 15 minutes.',
    escBackTimeout: 'Esc to go back.',
    geminiDesc2: 'Configure a Gemini Generate Content compatible endpoint. Base URL is optional and defaults to Google\'s',
    customModel: 'Custom Model',
    apiKeyLabel: 'API Key:',
    modelName: 'Model name:',
    enterContinue: 'Enter to continue · Esc to go back',
    enterConfirm: 'Enter to confirm · Esc to go back',
    escGoBack: 'Esc to go back',
    loginTitle: 'Login',
    pressW: 'Press W to enter workspace API key (saves to settings, no restart needed)',
    pressWReplace: 'Press W to replace workspace API key \u00b7 Press D to remove it',
    envOverride: 'Workspace API key from ANTHROPIC_API_KEY env. Press W to override with a settings-saved key.',
    confirmRemove: 'Press Y to confirm, N to cancel',
    removing: 'Removing\u2026',
    removeKeyDesc: '(settings.json only \u2014 env var is unaffected)',
  },
  authPlane: {
    notLoggedIn: 'not logged in',
    enableVault: 'To enable /vault /agents-platform /memory-stores:',
    pressW: 'Press W to set now (saves to settings.json, no restart needed)',
    step1: '1. Open https://console.anthropic.com/settings/keys',
    step2: '2. Create a key (sk-ant-api03-*)',
    step3: '3. Set ANTHROPIC_API_KEY=<key> and restart',
  },
  workspaceKey: {
    enterKey: 'Enter workspace API key (sk-ant-api03-*):',
    obtainFrom: '  Obtain from: https://console.anthropic.com/settings/keys',
    pasteHint: '[paste key here]',
    saving: '  Saving...',
    enterSave: 'Press Enter to save \u00b7 Esc to cancel',
    escCancel: 'Esc to cancel',
    startTyping: ' \u00b7 start typing your key',
  },
  loginFlow: {
    pasteCodeHere: 'Paste code here if prompted > ',
    preSelectedSub: 'Login method pre-selected: Subscription Plan (Claude Pro/Max)',
    preSelectedApi: 'Login method pre-selected: API Usage Billing (Anthropic Console)',
    invalidCode: 'Invalid code. Please make sure the full code was copied',
    failedExchange: 'Failed to exchange authorization code for access token. Please try again.',
    browserDidntOpen: "Browser didn't open? Use the url below to sign in ",
    copied: '(Copied!)',
    tokenCreated: '\u2713 Long-lived authentication token created successfully!',
    storeTokenSecurely: "Store this token securely. You won't be able to see it again.",
    useToken: 'Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=<token>',
    claudeAccount: 'Claude account with subscription \u00b7 Pro, Max, Team, or Enterprise',
    consoleAccount: 'Anthropic Console account \u00b7 API usage billing',
    thirdParty: '3rd-party platform \u00b7 Amazon Bedrock, Microsoft Foundry, or Vertex AI',
    invalidBaseUrl: 'Invalid base URL: please enter a full URL including protocol (e.g., https://api.example.com)',
    failedSave: 'Failed to save settings. Please try again.',
    chatgptSetup: 'ChatGPT Account Setup',
    geminiModelsRequired: 'Gemini setup requires Haiku, Sonnet, and Opus model names.',
    failedSaveError: (m: string) => `Failed to save: ${m}`,
    directConnection: 'Direct connection, no proxy needed. All providers are OpenAI-compatible.',
    payAsYouGo: 'Pay-as-you-go (API)',
    codingPlan: 'Coding Plan',
    selectAccessMode: (i: string, l: string) => `${i} ${l} \u2014 Select Access Mode`,
    noPlan: 'No plan? Select "Pay-as-you-go"',
    glmFree: ' \u00b7 GLM-4.7-Flash is free forever',
    selectModel: (i: string, l: string) => `${i} ${l} \u2014 Select Model`,
    free: 'Free',
    customModel: '\u270f\ufe0f Custom model',
    customModelDesc: ' \u00b7 enter model name manually',
    enterModelName: 'Please enter a model name',
    enterApiKey: 'Please enter an API key',
    browseModels: (p: string) => `Enter any model ID supported by this provider. Browse models: ${p}`,
    getYourKey: (p: string) => `Get your key: ${p}`,
    useCodingPlan: "Use your Coding Plan credential here",
    keyFormat: (f: string) => `Key format: ${f}`,
    matchingModels: 'Matching models:',
    knownModels: 'Known models:',
    usingThirdParty: 'Using 3rd-party platforms',
    retrying: 'Retrying\u2026',
    loginSuccessful: 'Login successful.',
    oauthError: (m: string) => `OAuth error: ${m}`,
    pressEnterRetry: 'Press Enter to retry.',
    toContinue: 'to continue\u2026',
  },
  permission: {
    enterPlanMode: 'Claude wants to enter plan mode to explore and design an implementation approach.',
    exitPlanMode: 'Claude wants to exit plan mode',
    heresPlan: 'Here is Claude\'s plan:',
    proceed: 'Do you want to proceed?',
    allowConnection: 'Do you want to allow this connection?',
    allowFetch: 'Do you want to allow Claude to fetch this content?',
    skillUse: 'Claude may use instructions, code, or files from this Skill.',
    approveArtifact: (t: string) => `Claude wants to review${t ? `: ${t}` : ' an artifact'}.`,
    showReview: 'Yes, show review',
    yesDontAsk: (s: string, c: string) => `Yes, and don't ask again for ${s} in ${c}`,
    enterPath: 'Enter the path to the directory:',
    confirmDelete: 'Are you sure you want to delete this permission rule?',
    autoReadInfo: 'Claude Code can read files in the workspace, and make edits when auto-accept edits is on.',
    recentDenials: 'Commands recently denied by the auto mode classifier.',
    noAccess: 'Claude Code will no longer have access to files in this directory.',
    pressAgain: (k: string) => `Press ${k} again to exit`,
  },
  cmd: {
    'add-dir': 'Add a new working directory',
    'agents-platform': 'Manage scheduled remote agents (cron-style triggers)',
    agents: 'Manage agent configurations',
    artifacts: 'Manage cloud artifacts',
    assistant: 'Open the Kairos assistant panel',
    attach: 'Attach to a sub Claude CLI instance via named pipe',
    'autofix-pr': 'Auto-fix CI failures on a pull request',
    branch: 'Create a branch of the current conversation at this point',
    'break-cache': 'Manage prompt-cache breaking',
    bridge: 'Connect this terminal for remote-control sessions',
    btw: 'Ask a quick side question without interrupting the main conversation',
    buddy: 'Hatch a coding companion · pet, off',
    chrome: 'Claude in Chrome (Beta) settings',
    'claim-main': 'Claim main role for this machine',
    clear: 'Clear conversation history and free up context',
    color: 'Set the prompt bar color for this session',
    compact: 'Clear conversation history but keep a summary in context',
    config: 'Open config panel',
    context: 'Visualize current context usage as a colored grid',
    copy: "Copy Claude's last response to clipboard",
    daemon: 'Manage background sessions and daemon',
    'debug-tool-call': 'Show the last N tool call pairs from the session log',
    desktop: 'Continue the current session in Claude Desktop',
    detach: 'Detach from a sub CLI (or all connected subs)',
    diff: 'View uncommitted changes and per-turn diffs',
    doctor: 'Diagnose and verify your Claude Code installation and settings',
    effort: 'Set effort level for model usage',
    env: 'Show current environment, runtime, and feature flags',
    exit: 'Exit the REPL',
    export: 'Export the current conversation to a file or clipboard',
    'extra-usage': 'Configure extra usage to keep working when limits are hit',
    feedback: 'Submit feedback about Claude Code',
    files: 'List all files currently in context',
    fork: 'Fork the current session into a new sub-agent',
    goal: 'Set or view a persistent goal that drives auto-continuation across turns',
    heapdump: 'Dump the JS heap to ~/Desktop',
    help: 'Show help and available commands',
    history: 'View session history of a connected sub CLI',
    hooks: 'View hook configurations for tool events',
    ide: 'Manage IDE integrations and show status',
    'install-github-app': 'Set up Claude GitHub Actions for a repository',
    'install-slack-app': 'Install the Claude Slack app',
    issue: 'Create a GitHub issue via gh CLI',
    job: 'Manage template jobs',
    keybindings: 'Open or create your keybindings configuration file',
    lang: 'Set display language (en/zh/auto)',
    'local-memory': 'Manage local memory stores',
    'local-vault': 'Manage local encrypted secrets',
    login: 'Sign in with your Anthropic account',
    logout: 'Sign out from your configured account',
    mcp: 'Manage MCP servers',
    memory: 'Edit Claude memory files',
    'memory-stores': 'Manage remote memory stores',
    mobile: 'Show QR code to download the Claude mobile app',
    mode: 'Switch interaction mode',
    model: 'Set the AI model for Claude Code',
    onboarding: 'Re-run the first-run setup (theme, trust, model, MCP)',
    'output-style': 'Deprecated: use /config to change output style',
    passes: 'Share a free week of Claude Code with friends',
    peers: 'List connected Claude Code peers',
    'perf-issue': 'Capture a performance + token-usage snapshot',
    permissions: 'Manage allow & deny tool permission rules',
    'pipe-status': 'Show current pipe connection status',
    pipes: 'Inspect pipe registry state and toggle the pipe selector',
    plan: 'Enable plan mode or view the current session plan',
    plugin: 'Manage Claude Code plugins',
    poor: 'Toggle poor mode to save tokens',
    'pr-comments': 'Get comments from a GitHub pull request',
    'privacy-settings': 'View and update your privacy settings',
    'rate-limit-options': 'Show options when rate limit is reached',
    recap: 'Generate a one-line session recap now',
    'release-notes': 'View release notes',
    'reload-plugins': 'Activate pending plugin changes in the current session',
    'remote-control': 'Connect this terminal for remote-control sessions',
    'remote-control-server': 'Start a persistent Remote Control server',
    'remote-env': 'Configure the default remote environment for teleport sessions',
    rename: 'Rename the current conversation',
    resume: 'Resume a previous conversation',
    rewind: 'Restore the code and/or conversation to a previous point',
    sandbox: 'Toggle sandbox mode',
    send: 'Send a message to a connected sub CLI',
    session: 'Show remote session URL and QR code',
    share: 'Upload the current session log to GitHub Gist',
    'skill-learning': 'Manage skill learning (observe, analyze, evolve)',
    'skill-search': 'Control automatic skill matching during conversations',
    'skill-store': 'Browse and install remote skills from the skill marketplace',
    skills: 'List available skills',
    status: 'Show Claude Code status including version, model, account, API connectivity, and tool statuses',
    stickers: 'Order Claude Code stickers',
    summary: 'Generate and display a session summary',
    tag: 'Toggle a searchable tag on the current session',
    tasks: 'List and manage background tasks',
    teleport: 'Resume a Claude Code session from claude.ai',
    'terminal-setup': 'Install Shift+Enter key binding for newlines',
    theme: 'Change the theme',
    'think-back': 'Your 2025 Claude Code Year in Review',
    'thinkback-play': 'Play the thinkback animation',
    triggers: 'Manage scheduled remote agent triggers (cloud cron)',
    tui: 'Manage flicker-free TUI mode',
    'ui-lang': 'Set UI display language (en, zh_CN, etc.)',
    upgrade: 'Upgrade to Max for higher rate limits and more Opus',
    usage: 'Show session cost, plan usage, and activity stats',
    vault: 'Manage remote secret vaults and credentials for cloud agents',
    vim: 'Toggle between Vim and Normal editing modes',
    voice: 'Toggle voice mode. Use /voice doubao for Doubao ASR backend',
    'web-setup': 'Setup Claude Code on the web',
    'web-tools': 'Configure web search and web fetch backends',
    workflows: 'Workflow monitoring panel',
  },
  pluginUI: {
    discoverPlugins: 'Discover plugins', installed: 'Installed', marketplaces: 'Marketplaces', errors: 'Errors',
    noPluginsInstalled: 'No plugins or MCP servers installed.', escBack: 'Esc to go back',
    managePlugins: 'Manage plugins', enablePlugin: 'Enable plugin', disablePlugin: 'Disable plugin', uninstall: 'Uninstall',
    pluginCommandUsage: 'Plugin Command Usage', noPluginErrors: 'No plugin errors', reloadToApply: 'Run /reload-plugins to apply changes.',
    fieldOf: (n: number, t: number) => `Field ${n} of ${t}`,
    tabNextField: 'Tab: Next field \u00b7 Enter: Save and continue', enterSave: 'Enter: Save configuration',
    trustWarning: 'Make sure you trust a plugin before installing...',
    configure: (n: string) => `Configure ${n}`, pluginOptions: 'Plugin options', plugin: (n: string) => `Plugin: ${n}`,
    scope: 'Scope', version: 'Version', author: 'Author', status: 'Status', enabled: 'Enabled', disabled: 'Disabled',
    installedComponents: 'Installed components:', commands: 'Commands:', agents: 'Agents:', skills: 'Skills:', hooks: 'Hooks:', mcpServers: 'MCP Servers:',
    builtin: 'Built-in', flagged: 'Flagged', project: 'Project', local: 'Local', user: 'User', enterprise: 'Enterprise', managed: 'Managed',
    typeToSearch: 'type to search', details: 'details', select: 'select',
    pluginDetails: 'Plugin details', noPluginsMatch: (q: string) => `No plugins match "${q}"`,
    noPluginsAvailable: 'No plugins available.', addMarketplaceFirst: 'Add a marketplace first',
    error: 'Error', by: 'By:', willInstall: 'Will install:',
    selectMarketplace: 'Select marketplace', noMarketplaces: 'No marketplaces configured.',
    installPlugins: 'Install Plugins', noSummary: 'Component summary not available for remote plugin',
    toggle: 'toggle', back: 'back',
    installUser: 'Install for you (user scope)', installProject: 'Install for all collaborators on this repository (project scope)',
    installLocal: 'Install for you, in this repo only (local scope)', openHomepage: 'Open homepage', viewOnGitHub: 'View on GitHub',
    addMarketplace: 'Add Marketplace', enterMarketplaceSource: 'Enter marketplace source:',
    pleaseEnterSource: 'Please enter a marketplace source', invalidSourceFormat: 'Invalid marketplace source format. Try: owner/repo, https://..., or ./path',
    addingMarketplace: 'Adding marketplace to configuration\u2026',
    willEnable: 'will enable', willDisable: 'will disable',
    validateUsage: 'Usage: /plugin validate <path>',
    examples: 'Examples:',
    loading: 'Loading\u2026',
    runningValidation: 'Running validation...',
    goBack: 'go back',
    install: 'install',
    from: 'from',
    noNewPlugins: 'No new plugins available to install.',
    allPluginsInstalledInMarketplace: 'All plugins from this marketplace are already installed.',
    gitRequired: 'Git is required to install marketplaces.',
    installGit: 'Please install git and restart Claude Code.',
    policyBlocked: 'Your organization policy does not allow any external marketplaces.',
    contactAdmin: 'Contact your administrator.',
    policyRestricts: 'Your organization restricts which marketplaces can be added.',
    viewAllowedSources: 'Switch to the Marketplaces tab to view allowed sources.',
    loadFailed: 'Failed to load marketplace data.',
    checkNetwork: 'Check your network connection.',
    allPluginsInstalled: 'All available plugins are already installed.',
    checkLater: 'Check for new plugins later or add more marketplaces.',
    noPlugins: 'No plugins available.',
    addMarketplaceHint: 'Add a marketplace first using the Marketplaces tab.',
    noSearchResults: (q: string) => `No plugins match &quot;${q}&quot;`,
    moreAbove: ' more above',
    moreBelow: ' more below',
    installing: 'Installing\u2026',
    componentsWillBeDiscovered: '\u00b7 Components will be discovered at installation',
    pluginTitle: 'Plugin Details',
    marketplaceTitle: 'Plugin Details',
    installPluginsTitle: 'Install Plugins',
    discoverPluginsTitle: 'Discover plugins',
    noPluginsAvailableTitle: 'Discover plugins',
    removeMarketplace: 'Remove marketplace',
    updateMarketplace: 'Update marketplace',
  },
  installGithub: {
    checkingGitHub: 'Checking GitHub CLI installation\u2026',
    existingWorkflow: 'Existing Workflow Found',
    repository: 'Repository:',
    whatToDo: 'What would you like to do?',
    workflowExists: 'A Claude workflow file already exists at',
    updateWorkflow: 'Update workflow file with latest version',
    skipWorkflow: 'Skip workflow update (configure secrets only)',
    exitNoChanges: 'Exit without making changes',
    viewLatestWorkflow: 'View the latest workflow template at: ',
    setupWarnings: 'Setup Warnings',
    warningsDesc: 'We found some potential issues, but you can continue anyway',
    continueAnyway: 'Press Enter to continue anyway, or Ctrl+C to exit and fix issues',
    manualSetup: 'You can also try the manual setup steps if needed: ',
    chooseApiKey: 'Choose an API key',
    createToken: 'Create a new token',
    enterNewKey: 'Enter a new API key',
    navSelect: '↑/↓ navigate · Enter select',
    useExistingKey: 'Use existing key',
  },
  btw: {
    answering: 'Answering...',
  },
  tui: {
    title: 'TUI Mode',
    status: 'Status',
    toggle: 'Toggle',
    on: 'On',
    off: 'Off',
    statusDesc: 'Show marker and environment override state',
    toggleDesc: 'Flip persisted TUI mode for the next session',
    onDesc: 'Enable flicker-free alternate-screen mode',
    offDesc: 'Disable flicker-free alternate-screen mode',
    helpText: '\u2191/\u2193 select \u00b7 Enter run \u00b7 Esc close',
    actions: 'actions',
    dismissed: 'TUI mode panel dismissed',
  },
  breakCache: {
    status: 'Status', statusDesc: 'Show pending marker, always mode, and break count',
    once: 'Once', onceDesc: 'Break prompt cache on the next API call only',
    always: 'Always', alwaysDesc: 'Break prompt cache on every API call',
    off: 'Off', offDesc: 'Disable always mode and clear pending once marker',
    clearOnce: 'Clear Once', clearOnceDesc: 'Cancel the pending one-time cache break',
    actions: 'actions',
  },
  vaultView: {
    noVaults: 'No vaults found. Use /vault create <name> to create one.',
    vaults: (n: number) => `Vaults (${n})`,
    name: 'Name:',
    status: 'Status:',
    created: 'Created:',
    archived: 'archived',
    vaultCreated: 'Vault created',
    vaultArchived: 'Vault archived',
    noCredentials: (v: string) => `No credentials in vault ${v}. Use /vault add-credential ${v} <key> <value> to add one.`,
    credentialsIn: (v: string, n: number) => `Credentials in ${v} (${n})`,
    valueMasked: 'Value: ***mask***',
    credentialAdded: 'Credential added',
    credentialArchived: 'Credential archived',
    id: 'ID:',
  },
  memoryStores: {
    noStores: 'No memory stores found. Use /memory-stores create <name> to create one.',
    stores: (n: number) => `Memory Stores (${n})`,
    store: 'Name:',
    name: 'Name:',
    status: 'Status:',
    created: 'Created:',
    archived: 'archived',
    storeCreated: 'Memory store created',
    storeArchived: 'Memory store archived',
    noMemories: (s: string) => `No memories in store ${s}. Use /memory-stores create-memory ${s} <content> to add one.`,
    memoriesIn: (s: string, n: number) => `Memories in ${s} (${n})`,
    memoryDetail: 'Memory:',
    memoryCreated: 'Memory created',
    memoryUpdated: 'Memory updated',
    memoryDeleted: (id: string, storeId: string) => `Memory ${id} deleted from store ${storeId}.`,
    noVersions: (s: string) => `No memory versions found for store ${s}.`,
    versionsIn: (s: string, n: number) => `Memory Versions in ${s} (${n})`,
    versionRedacted: 'Version redacted',
    namespace: 'Namespace:',
    content: 'Content:',
    updated: 'Updated:',
    id: 'ID:',
    archivedAt: 'Archived at:',
    redacted: 'redacted',
    redactedAt: 'Redacted at:',
  },
  settings: {
    autoCompact: 'Auto-compact', showTips: 'Show tips', cacheWarnings: 'Cache warnings', reduceMotion: 'Reduce motion',
    thinkingMode: 'Thinking mode', promptSuggestions: 'Prompt suggestions', poorMode: 'Poor mode (save tokens)',
    speculativeExecution: 'Speculative execution', rewindCode: 'Rewind code (checkpoints)', verboseOutput: 'Verbose output',
    terminalProgressBar: 'Terminal progress bar', showStatusTerminalTab: 'Show status in terminal tab',
    showTurnDuration: 'Show turn duration', statusLineEnabled: 'Show status line', fullscreenEnabled: 'Fullscreen mode', defaultPermissionMode: 'Default permission mode',
    useAutoMode: 'Use auto mode during plan', respectGitignore: 'Respect .gitignore in file picker',
    copyFullResponse: 'Always copy full response (skip /copy picker)', copyOnSelect: 'Copy on select',
    autoUpdateChannel: 'Auto-update channel', fastMode: 'Fast mode', theme: 'Theme', pushWhenIdle: 'Push when idle',
    pushWhenInputNeeded: 'Push when input needed', pushWhenClaudeDecides: 'Push when Claude decides',
    outputStyle: 'Output style', defaultView: 'What you see by default', aiPreferredLanguage: 'AI response language', uiLanguage: 'UI Language', editorMode: 'Editor mode',
    showPRStatus: 'Show PR status footer', model: 'Model', diffTool: 'Diff tool',
    autoConnectIDE: 'Auto-connect to IDE (external terminal)', autoInstallIDE: 'Auto-install IDE extension',
    claudeInChrome: 'Claude in Chrome enabled by default', teammateModel: 'Default teammate model',
    remoteControl: 'Enable Remote Control for all sessions', externalIncludes: 'External CLAUDE.md includes',
    enableLatest: 'Enable with latest channel', enableStable: 'Enable with stable channel',
    notifications: 'Notifications', localNotifications: 'Local notifications',
    maxApiRetries: 'Max API retries', maxApiRetriesDefault: 'Default', maxApiRetriesOff: 'Off', maxApiRetriesAlways: 'Always', maxApiRetriesCustom: 'Custom',
    maxApiRetriesDefaultDesc: 'Use built-in limit: 15 retries.', maxApiRetriesOffDesc: 'Disable retries (0).', maxApiRetriesAlwaysDesc: 'Retry indefinitely until success.', maxApiRetriesCustomDesc: 'Set a custom max retry count.',
    maxApiRetriesCustomInput: 'Enter custom max retry count:', maxApiRetriesCurrent: 'current',
    maxApiRetriesDefaultWithValue: (n: number) => `Default (${n})`, maxApiRetriesCustomWithValue: (n: number) => `Custom: ${n}`,
    setTo: (key: string, value: string) => `Set ${key} to ${value}`,
    enabled: 'Enabled', disabled: 'Disabled',
    customApiKey: 'custom API key',
    themeChanged: (v: string) => `Set theme to ${v}`,
    notificationsChanged: (v: string) => `Set notifications to ${v}`,
    outputStyleChanged: (v: string) => `Set output style to ${v}`,
    languageChanged: (v: string) => `Set response language to ${v}`,
    editorModeChanged: (v: string) => `Set editor mode to ${v}`,
    diffToolChanged: (v: string) => `Set diff tool to ${v}`,
    autoConnectChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} auto-connect to IDE`,
    autoInstallChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} auto-install IDE extension`,
    autoCompactChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} auto-compact`,
    respectGitignoreChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} respect .gitignore in file picker`,
    copyFullResponseChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} always copy full response`,
    copyOnSelectChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} copy on select`,
    terminalProgressBarChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} terminal progress bar`,
    terminalTabStatusChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} terminal tab status`,
    turnDurationChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} turn duration`,
    remoteControlReset: 'Reset Remote Control to default',
    remoteControlChanged: (v: boolean) => `${v ? 'Enabled' : 'Disabled'} Remote Control for all sessions`,
    autoUpdateChannelChanged: (v: string) => `Set auto-update channel to ${v}`,
    fastModeOff: 'Fast mode: OFF',
  },
  permissionMode: {
    default: 'Default', plan: 'Plan', acceptEdits: 'Accept edits',
    bypassPermissions: 'Bypass', dontAsk: "Don't Ask", auto: 'Auto',
  },
  prompt: {
    waiting: (duration: string) => `waiting ${duration}`,
    goal: (time: string) => `goal (${time})`,
    exitAgain: (key: string) => `Press ${key} again to exit`,
    pasting: 'Pasting text\u2026',
    vimInsert: '-- INSERT --',
    bashMode: '! for bash mode',
    remote: 'remote',
    rssPid: (rss: string, pid: number) => `${rss} \u00b7 pid:${pid}`,
    shortcuts: '? for shortcuts',
    holdToSpeak: (key: string) => `hold ${key} to speak`,
    macOptionClick: 'set macOptionClickForcesSelection in VS Code settings',
    returnToTeamLead: 'return to team lead',
    interrupt: 'interrupt',
    stopAgents: 'stop agents',
    showTasks: 'show tasks',
    showTeammates: 'show teammates',
    hide: 'hide',
    hideTasks: 'hide tasks',
    copy: 'copy',
    nativeSelect: 'native select',
    manage: 'manage',
    viewTasks: 'view tasks',
  },
  schedule: {
    noTriggers: 'No scheduled triggers. Use /schedule create <cron> <prompt> to create one.',
    triggers: (n: number) => `Scheduled Triggers (${n})`,
    schedule: 'Schedule:',
    status: 'Status:',
    prompt: 'Prompt:',
    nextRun: 'Next run:',
    lastRun: 'Last run:',
    created: 'Created:',
    agent: 'Agent:',
    triggerCreated: 'Trigger created',
    triggerUpdated: 'Trigger updated',
    triggerDeleted: (id: string) => `Trigger ${id} deleted.`,
    triggerRan: (id: string, runId: string) => `Trigger ${id} fired.`,
    triggerEnabled: (id: string) => `Trigger ${id} enabled.`,
    triggerDisabled: (id: string) => `Trigger ${id} disabled.`,
    id: 'ID:',
    runId: 'Run ID:',
    enabled: 'enabled',
    disabled: 'disabled',
    statusEnabled: 'Status:',
    statusDisabled: 'Status:',
  },
  localMemory: {
    noStores: 'No memory stores found. Use /local-memory create <store> to create one.',
    storesCount: (n: number) => `Local Memory Stores (${n})`,
    storedEntry: 'Stored entry', in: ' in ',
    notFound: 'Not found:', noEntriesIn: 'No entries in ',
    addEntryHint: (s: string) => `. Use /local-memory store ${s} <key> <value> to add one.`,
    entriesCount: (p: { count: number }) => ` (${p.count} entries)`,
    archivedStore: 'Archived store:', renamedTo: (p: { name: string }) => ` (renamed to ${p.name}.archived)`,
    error: 'Error:', storeCreated: 'Store created:',
    stored: 'Stored:', value: 'Value:',
    archive: 'archive',
    create: 'create',
    entries: 'entries',
  },
  localVault: {
    noSecrets: 'No secrets stored. Use /local-vault set <key> <value> to add one.',
    keysCount: (n: number) => `Local Vault Keys (${n})`,
    secretStored: 'Secret stored:', redacted: '[REDACTED]',
    useReveal: (k: string) => `Use /local-vault get ${k} --reveal to see the full value.`,
    masked: 'Masked:', keyNotFound: 'Key not found:', deleted: 'Deleted:', error: 'Error:',
    secretRevealed: '\u26a0 Secret revealed in terminal \u2014 clear scrollback if this session is shared.',
    delete: 'delete',
  },
  teleportError: {
    title: 'Log in to Claude',
    teleportRequires: 'Teleport requires a Claude.ai account.',
    subscriptionUsed: 'Your Claude Pro/Max subscription will be used by Claude Code.',
    loginWithClaude: 'Login with Claude account',
    exit: 'Exit',
  },
  teleportProgress: {
    teleporting: 'Teleporting session\u2026',
    validating: 'Validating session',
    fetchingLogs: 'Fetching session logs',
    gettingBranch: 'Getting branch info',
    checkingOut: 'Checking out branch',
  },
  teleportStash: {
    title: 'Working Directory Has Changes',
    checkingGit: 'Checking git status\u2026',
    error: 'Error: ',
    pressEscape: 'Press ',
    escape: 'Escape',
    toCancel: ' to cancel',
    willSwitch: 'Teleport will switch git branches. The following changes were found:',
    filesChanged: 'files changed',
    noChanges: 'No changes detected',
    stashPrompt: 'Would you like to stash these changes and continue with teleport?',
    stashing: 'Stashing changes\u2026',
    stashAndContinue: 'Stash changes and continue',
    exit: 'Exit',
    failedGetFiles: 'Failed to get changed files',
    failedStash: 'Failed to stash changes',
  },
  teleportRepoMismatch: {
    title: 'Teleport to Repo',
    noLongerContains: 'no longer contains the correct repository. Select another path.',
    use: 'Use ',
    cancel: 'Cancel',
    openIn: 'Open Claude Code in ',
    validating: 'Validating repository\u2026',
    runFrom: 'Run claude --teleport from a checkout of ',
  },
  idleReturn: {
    title: (formattedIdle: string, formattedTokens: string) => `You've been away ${formattedIdle} and this conversation is ${formattedTokens} tokens.`,
    description: 'If this is a new task, clearing context will save usage and be faster.',
    continue: 'Continue this conversation',
    newConversation: 'Send message as a new conversation',
    dontAsk: "Don't ask me again",
  },
  exportDialog: {
    title: 'Export Conversation',
    subtitle: 'Select export method:',
    copiedToClipboard: 'Conversation copied to clipboard',
    failedExport: (message: string) => `Failed to export conversation: ${message}`,
    cancelled: 'Export cancelled',
    copyToClipboard: 'Copy to clipboard',
    copyDescription: 'Copy the conversation to your system clipboard',
    saveToFile: 'Save to file',
    fileDescription: 'Save the conversation to a file in the current directory',
    enterFilename: 'Enter filename:',
    save: 'save',
    goBack: 'go back',
    cancel: 'cancel',
    exportedTo: (filepath: string) => `Conversation exported to: ${filepath}`,
  },
  outputStyle: {
    title: 'Preferred output style',
    description: 'This changes how Claude Code communicates with you',
    loading: 'Loading output styles\u2026',
  },
  stats: {
    loading: 'Loading your Claude Code stats\u2026',
    failedToLoad: 'Failed to load stats: ',
    noStats: 'No stats available yet. Start using Claude Code!',
    loadingStats: 'Loading stats\u2026',
    overview: 'Overview',
    models: 'Models',
    hint: 'Esc to cancel \u00b7 r to cycle dates \u00b7 ctrl+s to copy',
    favoriteModel: 'Favorite model: ',
    totalTokens: 'Total tokens: ',
    sessions: 'Sessions: ',
    longestSession: 'Longest session: ',
    activeDays: 'Active days: ',
    longestStreak: 'Longest streak: ',
    day: 'day',
    days: 'days',
    mostActiveDay: 'Most active day: ',
    currentStreak: 'Current streak: ',
    shotDistribution: 'Shot distribution',
    tokensPerDay: 'Tokens per Day',
    noModelData: 'No model usage data available',
    statsDialogDismissed: 'Stats dialog dismissed',
    of: 'of',
    toScroll: 'to scroll',
    modelsCount: (n: number) => `${n} models`,
    copying: 'copying\u2026',
    copied: 'copied!',
    copyFailed: 'copy failed',
    avgPerSession: 'Avg/session: ',
    statsFrom: (days: number) => `Stats from the last ${days} days`,
    speculationSaved: 'Speculation saved: ',
    peakHour: 'Peak hour',
    currentStreakLabel: 'Current streak',
    longestStreakLabel: 'Longest streak',
    activeDaysLabel: 'Active days',
  },
  compactSummary: {
    summarized: 'Summarized conversation',
    summarizedMessages: (count: number, direction: string) => {
      if (direction === 'up_to') return `Summarized ${count} messages up to this point`
      return `Summarized ${count} messages from this point`
    },
    context: (ctx: string) => `Context: \u201c${ctx}\u201d`,
    expandHistory: 'expand history',
    conversationSummarized: 'Conversation summarized to free up context',
    viewSummary: 'view summary',
  },
  languagePicker: {
    prompt: 'Enter your preferred response and voice language:',
    placeholder: (ellipsis: string) => `e.g., Japanese, \u65e5\u672c\u8a9e, Espa\u00f1ol${ellipsis}`,
    leaveEmpty: 'Leave empty for default (English)',
    enterLanguage: 'Enter your preferred language:',
  },
  invalidConfig: {
    title: 'Configuration Error',
    description: (filePath: string) => `The configuration file at ${filePath} contains invalid JSON.`,
    chooseOption: 'Choose an option:',
    exitAndFix: 'Exit and fix manually',
    resetWithDefault: 'Reset with default configuration',
    resetDefault: 'Reset to default',
  },
  invalidSettings: {
    title: 'Settings Error',
    skippedDesc: 'Files with errors are skipped entirely, not just the invalid settings.',
    exitAndFix: 'Exit and fix manually',
    continueWithout: 'Continue without these settings',
    filesSkipped: 'Files with errors will be skipped',
  },
  thinkingToggle: {
    title: 'Toggle thinking mode',
    description: 'Enable or disable thinking for this session.',
    enabled: 'Enabled',
    enabledDesc: 'Claude will think before responding',
    disabled: 'Disabled',
    disabledDesc: 'Claude will respond without extended thinking',
    warning: 'Changing thinking mode mid-conversation will increase latency and may reduce quality. For best results, set this at the start of a session.',
    proceed: 'Do you want to proceed?',
    confirm: 'confirm',
    exit: 'exit',
    cancel: 'cancel',
    desc: 'Control whether Claude thinks before responding',
  },
  resumeTask: {
    loading: 'Loading Claude Code sessions\u2026',
    retrying: 'Retrying\u2026',
    fetching: 'Fetching your Claude Code sessions\u2026',
    errorLoading: 'Error loading Claude Code sessions',
    checkInternet: 'Check your internet connection',
    teleportRequires: 'Teleport requires a Claude account',
    loginHint: 'Run /login and select \u201cClaude account with subscription\u201d',
    apiError: 'Sorry, Claude encountered an error',
    otherError: 'Sorry, Claude Code encountered an error',
    noSessions: 'No Claude Code sessions found',
    for: ' for ',
    pressCtrlR: 'Press Ctrl+R to retry',
    pressToCancel: (key: string) => `Press ${key} to cancel`,
    selectSession: 'Select a session to resume',
    sessionTitle: 'Session Title',
    ctrlR: 'Ctrl+R',
    updated: 'Updated',
  },
  workflowMultiselect: {
    title: 'Select GitHub workflows to install',
    subtitle: "We'll create a workflow file in your repository for each one you select.",
    moreExamples: 'More workflow examples (issue triage, CI fixes, etc.) at:',
    mustSelect: 'You must select at least one workflow to continue',
    navigate: 'navigate',
    toggle: 'toggle',
    confirm: 'confirm',
    cancel: 'cancel',
  },
  costThreshold: {
    title: "You've spent $5 on the Anthropic API this session.",
    learnMore: 'Learn more about how to monitor your spending:',
    gotIt: 'Got it, thanks!',
  },
  channelDowngrade: {
    title: 'Switch to Stable Channel',
    description: (version: string) => `The stable channel may have an older version than what you\u2019re currently running (${version}).`,
    howToHandle: 'How would you like to handle this?',
    allowDowngrade: 'Allow possible downgrade to stable version',
    stayOnVersion: (version: string) => `Stay on current version (${version}) until stable catches up`,
  },
  contextSuggestions: {
    suggestions: 'Suggestions',
    save: (tokens: string) => `save ~${tokens}`,
    title: 'Suggestions',
  },
  interruptedByUser: {
    interrupted: 'Interrupted ',
    reportIssue: '\u00b7 [ANT-ONLY] /issue to report a model issue',
    whatShouldClaudeDo: '\u00b7 What should Claude do instead?',
  },
  keybindingWarnings: {
    title: 'Keybinding Configuration Issues',
    location: 'Location: ',
    error: '[Error]',
    warning: '[Warning]',
  },

  cmdUI: {
    apiKey: 'API Key:',
    back: 'back',
    chooseFetch: 'Fetch URL',
    chooseSearch: 'Search web',
    copyAction: 'copy',
    copyCancel: 'cancel',
    copyCancelled: 'Cancelled',
    copyFull: 'Copy full response',
    copyNoMessage: 'No message to copy',
    copySelect: 'Select what to copy:',
    copySkip: 'Skip copying',
    copyWrite: 'write to file',
    endpointUrl: 'Endpoint URL',
    mcpAllEnabled: 'All MCP servers are already enabled',
    modeCancelled: 'Mode selection cancelled',
    modeNav: '↑/↓ navigate · Enter select · Esc cancel',
    noConfig: 'No configuration',
    rlAddFunds: 'Add funds',
    rlRequest: 'Request rate limit increase + extra usage',
    rlRequestExtra: 'Request extra usage',
    rlSwitchExtra: 'Switch to extra usage',
    save: 'save',
    selectClose: 'close',
    selectMode: 'Select a mode:',
    timeoutMs: 'Timeout (ms)',
    webFetch: 'Web Fetch',
    webSearch: 'Web Search',
    webTools: 'Web Tools',
  },
  cmdSystemUI: {
    autonomyTitle: 'Autonomy',
    breakCacheTitle: 'Break Cache',
    cancelledMemory: 'Memory editing cancelled',
    confirmDelete: 'Confirm delete',
    goalCleared: 'Goal cleared',
    goalComplete: 'Goal completed',
    goalPaused: 'Goal paused',
    goalResumed: 'Goal resumed',
    localMemoryTitle: 'Local Memory',
    localVaultTitle: 'Local Vault',
    noActiveGoal: 'No active goal',
    noKeepGoal: 'No, keep current goal',
    skillAbout: 'About',
    skillDismissed: 'Skill panel dismissed',
    skillStart: 'Start learning',
    skillStatus: 'Status',
    skillStop: 'Stop learning',
    yesReplace: 'Yes, replace',
  },
  grove: {
    acceptOff: 'Accept and opt out',
    acceptOffDomain: 'Accept and opt out for this domain',
    acceptOn: 'Accept and opt in',
    dataPrivacy: 'Data Privacy Controls',
    dataRetention: 'Data retention',
    dataRetentionDesc: 'Conversations with Claude Code are retained for up to 30 days for safety monitoring.',
    dataRetentionHow: 'How long data is retained',
    dataRetentionHowDesc: 'Conversations are retained for up to 30 days for safety monitoring, then deleted.',
    falseForDomain: 'This feature is disabled for this domain',
    gracePeriodBody: "We've updated our data privacy controls. You can choose whether to allow Claude to use conversations with Claude Code to help improve our models.",
    helpImproveClaude: 'Help improve Claude',
    helpImproveClaudeSetting: '"Help improve Claude" setting',
    helpImproveDesc: 'When enabled, Anthropic may use conversations with Claude Code to train future models.',
    helpImproveLabel: 'Help improve Claude',
    learnMore: 'Learn more',
    notNow: 'Not now',
    postGraceBody: "We've updated our data privacy controls. You can now choose whether to allow Claude to use conversations with Claude Code to help improve our models.",
    reviewSettings: 'Review your settings at',
    selectHow: "Select how you'd like to proceed:",
    takesEffect: 'This takes effect immediately and can be changed at any time.',
    title: 'Data Privacy Update',
    whatsChanging: "What's changing:",
  },
  misc: {
    claudeCodeTitle: 'Claude Code',
    claudeCodeV: 'Claude Code v',
    extraUsageCredit: 'Extra usage credit',
    extraUsageSubtitle: 'Extra usage available',
    guestPassesCount: 'Guest passes',
    lastOnboardingVersion: 'Last onboarding version:',
    mcpHelp: 'Run /mcp to configure MCP servers',
    noMcpServer: 'No MCP server configured',
    onboardingCompleted: 'Onboarding completed:',
    onboardingStatus: 'Onboarding Status',
    pluginNotInstalled: 'Plugin not installed',
    runModelPick: 'Running model picker',
    themeLabel: 'Theme:',
    uiLang: 'UI Language:',
    uiLangDesc: 'Set UI display language',
    uiLangHint: 'en, zh_CN, etc.',
    voiceMode: 'Voice mode',
    workspaceTrustCleared: 'Workspace trust cleared',
  },
  bashToolUse: {
    yes: 'Yes',
    yesAndTell: 'and tell Claude what to do next',
    yesDontAsk: 'Yes, and don\u2019t ask again for',
    commandPrefix: 'command prefix (e.g., npm run:*)',
    describeWhatToAllow: 'describe what to allow...',
    no: 'No',
    tellDifferent: 'and tell Claude what to do differently',
    powershellPrefix: 'command prefix (e.g., Get-Process:*)',
  },
  bashPermission: {
    checking: 'Attempting to auto-approve\u2026',
    title: 'Bash command',
    titleUnsandboxed: 'Bash command (unsandboxed)',
    autoApproved: 'Auto-approved',
    matchedRule: (rule: string) => ` \u00b7 matched "${rule}"`,
    requiresManual: 'Requires manual approval',
    doYouProceed: 'Do you want to proceed?',
    escToReject: 'Esc to reject',
    tabToAddFeedback: ' \u00b7 Tab to add feedback',
    ctrlDToHide: 'Ctrl-D to hide debug info',
    ctrlEToExplain: ' \u00b7 ctrl+e to explain',
    ctrlEToHide: ' \u00b7 ctrl+e to hide',
  },
  webFetchPermission: {
    yes: 'Yes',
    yesDontAsk: (hostname: string) => `Yes, and don't ask again for ${hostname}`,
    noAndTell: 'No, and tell Claude what to do differently (esc)',
    title: 'Fetch',
  },
  skillPermission: {
    title: (skill: string) => `Use skill "${skill}"?`,
    yes: 'Yes',
    yesDontAsk: (skill: string, cwd: string) => `Yes, and don't ask again for ${skill} in ${cwd}`,
    yesPrefix: (prefix: string, cwd: string) => `Yes, and don't ask again for ${prefix} commands in ${cwd}`,
    no: 'No',
  },
  workflowPermission: {
    title: 'Workflow',
    yes: 'Yes',
    yesDontAsk: (toolName: string) => `Yes, and don't ask again for ${toolName} commands`,
    no: 'No',
    executeWorkflow: (workflow: string) => `Execute workflow: ${workflow}`,
    arguments: (args: string) => `Arguments: ${args}`,
  },
  mcpServerDialog: {
    title: (count: number) => `${count} new MCP servers found in .mcp.json`,
    subtitle: 'Select any you wish to enable.',
    spaceSelect: 'Space',
    enterConfirm: 'Enter',
    rejectAll: 'reject all',
  },
  filePermission: {
    proceed: 'Do you want to proceed?',
    symlinkOutside: (target: string) => `This will modify ${target} (outside working directory) via a symlink`,
    symlinkTarget: (target: string) => `Symlink target: ${target}`,
    escToReject: 'Esc to reject',
    tabToAddFeedback: ' \u00b7 Tab to add feedback',
  },
  filePermissionOptions: {
    yes: 'Yes',
    andTellNext: 'and tell Claude what to do next',
    allowClaudeEdits: 'Yes, allow edits to .claude/ config for this session',
    duringSession: 'Yes, during this session',
    allowAllEditsSession: (shortcut: string) => `Yes, allow all edits during this session (${shortcut})`,
    allowReadingSession: (dir: string) => `Yes, allow reading from ${dir}/ during this session`,
    allowAllEditsIn: (dir: string, shortcut: string) => `Yes, allow all edits in ${dir}/ during this session (${shortcut})`,
    no: 'No',
    tellDifferent: 'and tell Claude what to do differently',
  },
  exitPlanMode: {
    yesAutoAcceptEdits: 'Yes, auto-accept edits',
    yesUseAutoMode: 'Yes, and use auto mode',
    yesBypassPermissions: 'Yes, and bypass permissions',
    yesAutoAcceptEditsKC: 'Yes, auto-accept edits',
    yesManuallyApprove: 'Yes, manually approve edits',
    noUltraplan: 'No, refine with Ultraplan on Claude Code on the web',
    noKeepPlanning: 'No, keep planning',
    tellClaudeChange: 'Tell Claude what to change',
    shiftTabApprove: 'shift+tab to approve with this feedback',
    noPlanFound: 'No plan found. Please write your plan to the plan file first.',
  },
  permissionDebug: {
    requiresSandbox: 'Requires permission to bypass sandbox',
    noDecisionReason: 'No decision reason',
  },
  shellPermission: {
    similar: 'similar',
    and: ' and ',
    andNMore: (n: number) => ` and ${n} more`,
    allowReadingFrom: 'Yes, allow reading from ',
    allowReadingFromMulti: 'Yes, allow reading from ',
    alwaysAllowAccess: 'Yes, and always allow access to ',
    alwaysAllowAccessMulti: 'Yes, and always allow access to ',
    dontAskAgainFor: "Yes, and don't ask again for ",
    commandsIn: (cwd: string) => ` commands in ${cwd}`,
    alwaysAllowAccessTo: 'Yes, and always allow access to ',
    allowAccessTo: 'Yes, and allow access to ',
    andCommands: ' and ',
    commandsOnly: ' commands',
    allowAccess: 'Yes, and allow ',
    accessAnd: ' access and ',
    fromThisProject: ' from this project',
  },
  permGeneral: {
    deleteCell: 'Delete cell',
    deleteCellLabel: 'Delete a notebook cell',
    editFile: 'Edit file',
    editNotebook: 'Edit notebook',
    fileDoesNotExist: 'File does not exist',
    insertCell: 'Insert cell',
    insertNewCell: 'Insert a new notebook cell',
    monitor: 'Monitor',
    patternNoMatch: 'Pattern did not match any files',
    replaceCell: 'Replace cell',
    replaceCellContents: 'Replace notebook cell contents',
    toolUse: 'Tool use',
    no: 'No',
    yes: 'Yes',
  },
  permRuleList: {
    addNewRule: 'Add new rule',
    allowDesc: 'Allow this tool',
    askDesc: 'Ask each time',
    denyDesc: 'Deny this tool',
    footerDefault: 'Default:',
    footerHeader: 'Permission rules',
    footerRecent: 'Recent denials',
    footerSearch: 'Search',
    managedSettings: 'Managed settings',
    permissionDismissed: 'Permission panel dismissed',
    ruleAllowed: 'Rule set to allow',
    ruleAsk: 'Rule set to ask',
    ruleDenied: 'Rule set to deny',
    ruleDetails: 'Rule details',
    contactAdmin: 'Contact your administrator',
    escCancel: 'Esc to cancel',
    no: 'No',
    yes: 'Yes',
  },
  recentDenials: {
    empty: 'No recent denials',
    retry: 'Retry',
  },
  sandbox: {
    host: 'Host',
    noTellClaude: "Running in sandbox — don't tell Claude",
    title: 'Sandbox Mode',
    yes: 'Yes',
  },
  settingsStatus: {
    sessionId: 'Session ID:',
    sessionName: 'Session name:',
    version: 'Version:',
  },
  tag: {
    noKeep: "No, don't add tag",
    removeConfirm: 'Are you sure you want to remove this tag?',
    yesRemove: 'Yes, remove tag',
  },
  teammateViewHeader: {
    viewing: 'Viewing',
  },
  thinkback: {
    editContent: 'Edit content',
    fixErrors: 'Fix errors',
    playAnimation: 'Play animation',
    regenerate: 'Regenerate',
    relive: 'Relive',
  },
  ultrareview: {
    launching: 'Launching...',
  },
  workspaceDir: {
    permissionDesc: 'Claude Code will be able to read files in this directory.',
    yesRemember: 'Yes, and remember for future sessions',
    yesSession: 'Yes, for this session only',
    no: 'No',
    placeholder: 'Enter the path to the directory',
    title: 'Workspace Directory',
  },
  devChannels: {
    accept: 'I understand, enable dev channels',
    body1: 'Dev channels provide access to the latest features.',
    body2: 'These channels may include unstable features or breaking changes.',
    body3: 'By enabling dev channels, you acknowledge potential instability.',
    channels: 'Dev Channels',
    exit: 'Exit',
    title: 'Dev Channels',
  },
  bypassPermissions: {
    body1: 'This action will bypass permission checks for this tool call.',
    body2: 'Use this carefully — it can allow actions without your explicit approval.',
    body3: 'This bypass only applies to the current tool call.',
    no: 'No',
    title: 'Bypass Permissions',
    yes: 'Yes',
  },
  approveApiKey: {
    recommended: 'Recommended',
    useKey: 'Use this API key',
    no: 'No',
    title: 'Approve API Key',
    yes: 'Yes',
  },
  autoMode: {
    enable: 'Enable auto mode',
    makeDefault: 'Make this the default',
    noExit: "No, don't exit",
    noGoBack: 'No, go back',
    title: 'Enable auto mode?',
    description: "Auto mode lets Claude handle permission prompts automatically — Claude checks each tool call for risky actions and prompt injection before executing. Actions Claude identifies as safe are executed, while actions Claude identifies as risky are blocked and Claude may try a different approach. Ideal for long-running tasks. Sessions are slightly more expensive. Claude can make mistakes that allow harmful commands to run, it's recommended to only use in isolated environments. Shift+Tab to change mode.",
  },
  claudeInChrome: {
    body: 'Claude in Chrome allows you to interact with Claude directly from your browser.',
    moreInfo: 'More info',
    requiresExt: 'Requires Chrome extension',
    permissions: 'Permissions',
    title: 'Claude in Chrome',
  },
  claudeMdExternalIncludes: {
    body: 'Include external CLAUDE.md files from other projects or directories.',
    externalImports: 'External imports',
    no: 'No',
    title: 'External CLAUDE.md Includes',
    warning: 'Warning',
    yes: 'Yes',
  },
  help: {
    askDesc: 'Ask Claude a question about how to use Claude Code',
    forCommands: 'For commands, type',
    forShortcuts: 'For keyboard shortcuts, type',
    gettingStarted: 'Getting started',
    reviewDesc: 'Review proposed changes before accepting',
    shortcuts: 'Keyboard shortcuts',
    toCommit: 'To commit changes, type',
    type: 'Type',
  },
  interrupted: {
    label: 'Interrupted',
    whatShouldClaudeDo: 'What should Claude do instead?',
  },
  chrome: {
    extension: 'Extension',
    installExtension: 'Install Chrome extension',
    managePermissions: 'Manage permissions',
    notDetected: 'Not detected',
    notSupportedWSL: 'Not supported on WSL',
    reconnectExtension: 'Reconnect extension',
    requiresSubscription: 'Requires a Claude subscription',
    disabled: 'Disabled',
    enabled: 'Enabled',
    installed: 'Installed',
    status: 'Status',
    usage: 'Usage',
  },
  searchExtraTools: {
    dismiss: 'Dismiss',
  },
  project: {
    workspaceStep: 'Workspace step',
  },

  logoV2: {
    antLogs: 'Ant logs',
    apiCalls: 'API calls',
    debugLogs: 'Debug logs',
    debugMode: 'Debug mode',
    detach: 'Detach',
    loggingTo: 'Logging to',
    reportIssue: 'Report issue',
    sandboxed: 'Sandboxed',
    startupPerf: 'Startup perf',
    tmuxSession: 'tmux session',
  },
  removeDir: {
    no: 'No',
    title: 'Remove Directory',
    yes: 'Yes',
  },
  settingsTab: {
    config: 'Config',
    status: 'Status',
    usage: 'Usage',
  },
  preview: {
    questionNoPreview: 'No preview available',
    notes: 'Notes:',
    notesPlaceholder: 'Add notes on this design\u2026',
    pressNToAddNotes: 'press n to add notes',
    chatAboutThis: 'Chat about this',
    skipInterview: 'Skip interview and plan immediately',
    helpText: 'Enter to select \u00b7 \u2191/\u2193 to navigate \u00b7 n to add notes',
    tabToSwitchQuestions: ' \u00b7 Tab to switch questions',
    ctrlGToEdit: (editorName: string) => ` \u00b7 ctrl+g to edit in ${editorName}`,
    escCancel: ' \u00b7 Esc to cancel',
  },
  hooks: {
    disabledTitle: 'Hook Configuration - Disabled',
    escToClose: 'Esc to close',
    allDisabled: 'All hooks are currently',
    disabledBold: 'disabled',
    byManagedSettings: 'by a managed settings file',
    youHaveCount: (count: number) => `You have ${count} configured`,
    hooksNotRunning: (count: number) => `hook${count === 1 ? '' : 's'} that ${count === 1 ? 'is' : 'are'} not running.`,
    whenDisabled: 'When hooks are disabled:',
    noCommands: '\u00b7 No hook commands will execute',
    noStatusLine: '\u00b7 StatusLine will not be displayed',
    noValidation: '\u00b7 Tool operations will proceed without hook validation',
    reEnableHint: 'To re-enable hooks, remove "disableAllHooks" from settings.json or ask Claude.',
  },

}

export default en