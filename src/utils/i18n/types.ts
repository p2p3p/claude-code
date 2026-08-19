export type TranslationDict = {
  agentDisplay: {
    builtin: string
    cliArg: string
    created: (name: string) => string
    createdAndOpened: (name: string) => string
    failedToSave: string
    local: string
    managed: string
    plugin: string
    project: string
    user: string
  }
  askUserQuestion: {
    pastedImage: string
  }
  agentsPlatform: {
    agentDeleted: (n: string) => string
    agentTriggered: (n: string) => string
    id: string
    nextRun: string
    noAgentsFound: string
    prompt: string
    runId: string
    schedule: string
    scheduledAgents: (n: number) => string
    status: string
  }
  approveApiKey: {
    no: string
    recommended: string
    title: string
    useKey: string
    yes: string
  }
  artifacts: {
    expires: string
    navHint: string
    noArtifacts: string
  }
  autoMode: {
    description: string
    enable: string
    makeDefault: string
    noExit: string
    noGoBack: string
    title: string
  }
  autoRunIssue: {
    pressEscAnyTime: string
    reason: (reason: string) => string
    reasonBad: string
    reasonGood: string
    reasonUnknown: string
    runningFeedback: string
  }
  autoupdater: {
    affectsYourVersion: string
    autoUpdating: string
    checkingForUpdates: string
    knownIssue: (msg: string) => string
    updateAvailableRun: (cmd: string) => string
    updateFailedDoctor: string
    updateFailedStatus: string
    updateInstalledRestartToApply: string
    updateInstalledRestartToUpdate: string
    yourPackageManagerCommand: string
  }
  backgroundAgentSelector: {
    hintSelect: string
    hintManage: string
    hintManageRunning: string
    hintManageDone: string
    main: string
    tokens: string
  }
  bashPermission: {
    autoApproved: string
    checking: string
    ctrlDToHide: string
    ctrlEToExplain: string
    ctrlEToHide: string
    doYouProceed: string
    escToReject: string
    matchedRule: (rule: string) => string
    requiresManual: string
    tabToAddFeedback: string
    title: string
    titleUnsandboxed: string
  }
  bashToolUse: {
    commandPrefix: string
    describeWhatToAllow: string
    no: string
    powershellPrefix: string
    tellDifferent: string
    yes: string
    yesAndTell: string
    yesDontAsk: string
  }
  breakCache: {
    actions: string
    always: string; alwaysDesc: string; off: string; offDesc: string
    alwaysEnabledDesc: string
    alwaysEnabledTitle: string
    clearOnce: string; clearOnceDesc: string; actions: string
    cacheScheduledDesc: string
    cacheScheduledTitle: string
    disabledCleared: string
    flagWritten: (p: string) => string
    forEveryCall: string
    howItWorksLine1: string
    howItWorksLine2: string
    lastBreakAt: (t: string) => string
    lastBreakNever: string
    markerCleared: (p: string) => string
    markerWritten: (p: string) => string
    noMarkerSet: string
    off: string
    once: string
    onceMarkerActive: string
    onceMarkerNotSet: string
    status: string; statusDesc: string; once: string; onceDesc: string
    statusTitle: string
    statsTitle: string
    timestamp: (t: string) => string
    toCancel: string
    toDisable: string
    totalBreaks: (n: number) => string
    totalBreaksSession: (n: number) => string
    unknownScope: (s: string) => string
    wasNotActive: string
  }
  bridgeUI: {
    hideQr: string
    showQr: string
    toggleSpawnMode: string
  }
  btw: {
    answering: string
    dismissHint: string
  }
  bypassPermissions: {
    body1: string
    body2: string
    body3: string
    no: string
    title: string
    yes: string
  }
  channelDowngrade: {
    allowDowngrade: string
    description: (version: string) => string
    howToHandle: string
    stayOnVersion: (version: string) => string
    title: string
  }
  chrome: {
    disabled: string; enabled: string; extension: string; installExtension: string; installed: string
    enabled: string
    extension: string
    installExtension: string
    installed: string
    managePermissions: string; notDetected: string; notSupportedWSL: string
    notDetected: string
    notSupportedWSL: string
    reconnectExtension: string; requiresSubscription: string; status: string; usage: string
    requiresSubscription: string
    status: string
    usage: string
    reconnectHint: string
    sitePermissions: string
    learnMore: string
  }
  claudeInChrome: {
    body: string
    moreInfo: string
    permissions: string
    requiresExt: string
    title: string
    userFacingName: (displayName: string) => string,
    notConnected: (extUrl: string, bugUrl: string) => string,
    authError: string}
  chromeTool: {
    navigationCompleted: string
    tabCreated: string
    tabsRead: string
    inputCompleted: string
    actionCompleted: string
    windowResized: string
    searchCompleted: string
    gifActionCompleted: string
    consoleMessagesRetrieved: string
    networkRequestsRetrieved: string
    shortcutsRetrieved: string
    shortcutExecuted: string
    scriptExecuted: string
    pageRead: string
    imageUploaded: string
    pageTextRetrieved: string
    planUpdated: string
  }
  claudeMdExternalIncludes: {
    body: string
    externalImports: string
    no: string
    title: string
    warning: string
    yes: string
  }
  cmd: {
    advisor: string
    agents: string
    artifacts: string
    assistant: string
    attach: string
    autonomy: string
    batch: string
    branch: string
    bridge: string
    brief: string
    btw: string
    buddy: string
    chrome: string
    clear: string
    color: string
    commit: string
    compact: string
    config: string
    context: string
    coordinator: string
    copy: string
    daemon: string
    debug: string
    descAddDir: string
    descAdvisor: string
    descAgents: string
    descAgentsPlatform: string
    descAssistant: string
    descAttach: string
    descAutofixPr: string
    descAutonomy: string
    descBranch: string
    descBridge: string
    descBrief: string
    descBtw: string
    descBuddy: string
    descChrome: string
    descClaimMain: string
    descClear: string
    descColor: string
    descCommit: string
    descCompact: string
    descConfig: string
    descContext: string
    descContextGrid: string
    descCoordinator: string
    descCopy: string
    descDaemon: string
    descDesktop: string
    descDetach: string
    descDiff: string
    descDoctor: string
    descEffort: string
    descEnv: string
    descExit: string
    descExport: string
    descExtraUsage: string
    descFeedback: string
    descFiles: string
    descForceSnip: string
    descFork: string
    descForkedFromMain: string
    descGoal: string
    descHeapdump: string
    descHelp: string
    descHistory: string
    descHooks: string
    descIde: string
    descInsights: string
    descInstall: string
    descInstallGithubApp: string
    descInstallSlackApp: string
    descIssue: string
    descJob: string
    descKeybindings: string
    descLang: string
    descLogout: string
    descMcp: string
    descMemory: string
    descMemoryStores: string
    descMobile: string
    descMode: string
    descMonitor: string
    descOnboarding: string
    descOutputStyle: string
    descPeers: string
    descPermissions: string
    descPipeStatus: string
    descPipes: string
    descPlan: string
    descPlugin: string
    descPoor: string
    descPrComments: string
    descPrivacySettings: string
    descProactive: string
    descProvider: string
    descRateLimitOptions: string
    descRecap: string
    descReleaseNotes: string
    descReloadPlugins: string
    descRemoteControlServer: string
    descRemoteEnv: string
    descRemoteSetup: string
    descRename: string
    descResume: string
    descRewind: string
    descSchedule: string
    descSend: string
    descSession: string
    descShare: string
    descSkillLearning: string
    descSkillSearch: string
    descSkillStore: string
    descSkills: string
    descStatus: string
    descStatusline: string
    descStickers: string
    descSubscribePr: string
    descSummary: string
    descTag: string
    descTasks: string
    descTeleport: string
    descTerminalSetupApple: string
    descTheme: string
    descThinkback: string
    descThinkbackPlay: string
    descTui: string
    descUpgrade: string
    descUsage: string
    descVault: string
    descVersion: string
    descVim: string
    descVoice: string
    descWebTools: string
    desktop: string
    detach: string
    diff: string
    doctor: string
    dream: string
    effort: string
    env: string
    exit: string
    export: string
    fast: string
    feedback: string
    files: string
    fork: string
    goal: string
    heapdump: string
    help: string
    history: string
    hooks: string
    ide: string
    init: string
    insights: string
    interview: string
    issue: string
    job: string
    keybindings: string
    lang: string
    login: string
    logout: string
    loop: string
    mcp: string
    memory: string
    mobile: string
    mode: string
    model: string
    monitor: string
    onboarding: string
    passes: string
    peers: string
    permissions: string
    pipes: string
    plan: string
    plugin: string
    poor: string
    proactive: string
    provider: string
    recap: string
    remember: string
    rename: string
    resume: string
    review: string
    rewind: string
    sandbox: string
    send: string
    session: string
    share: string
    simplify: string
    skillify: string
    skills: string
    status: string
    statusline: string
    stickers: string
    stuck: string
    summary: string
    tag: string
    tasks: string
    'teach-me': string
    teleport: string
    theme: string
    triggers: string
    tui: string
    ultracode: string
    ultraplan: string
    ultrareview: string
    upgrade: string
    usage: string
    vault: string
    verify: string
    version: string
    vim: string
    voice: string
    workflows: string
  }
  cmdSystemUI: {
    autonomyTitle: string; breakCacheTitle: string; cancelledMemory: string; confirmDelete: string
    breakCacheTitle: string
    cancelledMemory: string
    confirmDelete: string
    goalCleared: string; goalComplete: string; goalPaused: string; goalResumed: string
    goalComplete: string
    goalPaused: string
    goalResumed: string
    localMemoryTitle: string; localVaultTitle: string; noActiveGoal: string; noKeepGoal: string
    localVaultTitle: string
    noActiveGoal: string
    noKeepGoal: string
    skillAbout: string; skillDismissed: string; skillStart: string; skillStatus: string; skillStop: string
    skillDismissed: string
    skillStart: string
    skillStatus: string
    skillStop: string
    panelDismissed: (title: string) => string
    goalObjective: string; goalStatus: string; goalTime: string; goalTokens: string
    yesReplace: string
    changeEditor: string
  }
  cmdUI: {
    apiKey: string; back: string; chooseFetch: string; chooseSearch: string
    back: string
    chooseFetch: string
    chooseSearch: string
    copyAction: string; addAction: string; copyCancel: string; copyCancelled: string; copyFull: string
    copyCancel: string
    copyCancelled: string
    copyFull: string
    copyNoMessage: string; copySelect: string; copySkip: string; copyWrite: string
    copySelect: string
    copySkip: string
    copyWrite: string
    endpointUrl: string; mcpAllEnabled: string; modeCancelled: string; modeNav: string
    mcpAllEnabled: string
    modeCancelled: string
    modeNav: string
    noConfig: string; rlAddFunds: string; rlRequest: string; rlRequestExtra: string
    rlAddFunds: string
    rlRequest: string
    rlRequestExtra: string
    rlSwitchExtra: string; save: string; selectClose: string; selectMode: string
    save: string
    selectClose: string
    selectMode: string
    timeoutMs: string; webFetch: string; webSearch: string; webTools: string
    webFetch: string
    webSearch: string
    webTools: string
  }
  common: {
  }
  compactSummary: {
    context: (ctx: string) => string
    conversationSummarized: string
    contextLabel: string
    expandHistory: string
    languageInstruction: string
    proactiveResume: string
    recentPreserved: string
    resumeDirectly: string
    sessionContinued: string
    summarized: string
    summarizedMessages: (count: number, direction: string) => string
    summarizedWithHint: (shortcut: string) => string
    transcriptPath: (path: string) => string
    viewSummary: string
  }
  computerUse: {
    accessibilityStatus: (granted: boolean) => string
    allowForSession: (count: number) => string
    alreadyGranted: string
    appListTitle: string
    denyAndTell: string
    escKey: string
    grantPermissionsHint: string
    needsMacPermissions: string
    notInstalled: string
    openAccessibility: string
    openScreenRecording: string
    screenRecordingStatus: (granted: boolean) => string
    sentinelFilesystem: string
    sentinelShell: string
    sentinelSystemSettings: string
    tryAgain: string
    willHide: (count: number) => string
    userFacingName: (toolName: string) => string,
    lockHeld: (holder: string) => string}
  shadowedRule: {
    denyShadowed: (toolName: string, shadowingSource: string, shadowedSource: string) => string,
    askShadowed: (toolName: string, shadowingSource: string, shadowedSource: string) => string}
  config: {
    autoUpdatesDevDisabled: string
    autoUpdatesEnvControlled: string
    disabledWithReason: (reason: string) => string
    dialogDismissed: string
    enableAutoUpdates: string
    fastModeLabel: (model: string) => string
    notifAuto: string
    notifDisabled: string
    notifITerm2: (osc: string) => string
    notifITerm2WithBell: string
    notifTerminalBell: (esc: string) => string
    notifKitty: (osc: string) => string
    notifGhostty: (osc: string) => string
    teammateDefaultModelLeader: string
    teammateMode: string
    teammateModeOverridden: (override: string) => string
    thinkingModeWarning: string
    unsetEnvVarToReEnable: (envVar: string) => string
    useCustomApiKey: string
  }
  configSetting: {
    agentPushNotifEnabled: string
    alwaysThinkingEnabled: string
    autoCompactEnabled: string
    autoDreamEnabled: string
    autoMemoryEnabled: string
    classifierPermissionsEnabled: string
    editorMode: string
    fileCheckpointingEnabled: string
    inputNeededNotifEnabled: string
    language: string
    model: string
    permissionsDefaultMode: string
    preferredNotifChannel: string
    remoteControlAtStartup: string
    showTurnDuration: string
    taskCompleteNotifEnabled: string
    teammateMode: string
    terminalProgressBarEnabled: string
    theme: string
    todoFeatureEnabled: string
    verbose: string
    voiceEnabled: string
  }
  configTool: {
    errorPrefix: (e) => string
    invalidSettingPath: string
    invalidValue: (v, opts) => string
    microphoneDenied: (g) => string
    noRecordingTool: string
    requiresTrueFalse: (s) => string
    runCommand: (cmd) => string
    unknownSetting: (s) => string
    voiceNotAvailable: string
    voiceNotAvailableEnv: string
    voiceRequiresLogin: string
  }
  contextSuggestions: {
    save: (tokens: string) => string
    suggestions: string
    title: string; save: (tokens: string) => string
  }
  costThreshold: {
    gotIt: string
    learnMore: string
    title: string
  }
  desc: {
    back: string
    cancel: string
    change: string
    clear: string
    close: string
    details: string
    disableExternalIncludes: string
    exit: string
    expandHistory: string
    goBack: string
    navigate: string
    next: string
    openInEditor: string
    prev: string
    remove: string
    retry: string
    save: string
    search: string
    select: string
    stash: string
    submit: string
    toggle: string
    viewSummary: string
    applyChanges: 'string',
    install: 'string',
    update: 'string',
    searchHistory: string
  }
  devChannels: {
    accept: string
    body1: string
    body2: string
    body3: string
    channels: string
    exit: string
    title: string
  }
  doctorContextWarnings: {
    agentTokensDetail: (name: string, tokens: string) => string
    largeAgentDescriptions: (totalTokens: string, threshold: string) => string
    largeClaudeMdFileSingle: (chars: string, maxChars: string) => string
    largeClaudeMdFiles: (count: number, maxChars: string) => string
    largeMcpTools: (toolTokens: string, threshold: string) => string
    largeMcpToolsEstimated: (toolTokens: string, threshold: string) => string
    mcpToolsDetail: (name: string, count: number, tokens: string) => string
    mcpToolsDetectedEstimated: (count: number) => string
    moreCustomAgents: (count: number) => string
    moreServers: (count: number) => string
    unreachableRuleDetail: (ruleValue: string, reason: string) => string
    unreachableRuleFix: (fix: string) => string
    unreachableRules: (count: number) => string
  }
  doctorDiagnostic: {
    considerNativeInstall: string
    insufficientPermsAutoUpdates: string
    insufficientPermsFix: string
    leftoverNpmGlobal: (path: string) => string
    leftoverNpmLocal: (path: string) => string
    localInstallAliasFix: (existingAlias: string) => string
    localInstallCreateAlias: string
    localInstallNotAccessible: string
    localInstallNotUsed: string
    nativeNotInPath: string
    nativeNotInPathFix: (displayPath: string) => string
    nativeNotInPathWindows: (path: string) => string
    nativeNotInPathWindowsFix: string
    orphanedNpmGlobal: (path: string) => string
    rmCmd: (path: string) => string
    rmdirCmd: (path: string) => string
    runClaudeInstall: string
    runCmd: (cmd: string) => string
    runningFromLocalInstall: (method: string) => string
    runningNativeInstallMethodMismatch: (method: string) => string
    sandboxGlobFix: (count: number, patternList: string) => string
    sandboxGlobNotSupported: string
    strictPluginOnlyCustomizationFix: (surfaces: string) => string
    strictPluginOnlyCustomizationFix2: (surfaces: string) => string
    strictPluginOnlyCustomizationIssue: (count: number, values: string) => string
    wslBashNoGitBash: string
  }
  entrypoint: {
    configError: (f, m) => string
    daemonWorkerError: string
    useClaudeDaemon: (m) => string
    useClaudeJob: (c, r) => string
  }
  exitPlanMode: {
    implementPlan: string
    noKeepPlanning: string
    noPlanFound: string
    noUltraplan: string
    shiftTabApprove: string
    tellClaudeChange: string
    transcriptHint: (path: string) => string
    teamHint: (toolName: string) => string
    feedbackSuffix: (feedback: string) => string
    ultraplanRefining: string
    yesAutoAcceptEdits: string
    yesAutoAcceptEditsKC: string
    yesBypassPermissions: string
    yesManuallyApprove: string
    yesUseAutoMode: string
  }
  exportDialog: {
    cancel: string
    cancelled: string
    copiedToClipboard: string
    copyDescription: string
    copyToClipboard: string
    enterFilename: string
    exportedTo: (filepath: string) => string
    failedExport: (message: string) => string
    fileDescription: string
    goBack: string
    save: string
    saveToFile: string
    subtitle: string
    title: string
  }
  filesApi: {
    invalidFilePath: (path: string) => string
    retriesExhausted: (lastError: string, maxRetries: string) => string
    fileNotFound: (fileId: string) => string
    authFailed: string
    accessDenied: (fileId: string) => string
    fileTooLarge: (maxSize: string, actual: string) => string
    uploadNoFileId: string
    uploadAccessDenied: string
    uploadTooLarge: string
    uploadCanceled: string
    listAccessDenied: string
  }
  feed: {
    antOnlyCommits: string
    authError: string
    checkChangelog: string
    debugMode: string
    guestPasses: string
    homeDirWarning: string
    initClaudeMd: string
    noRecent: string
    noUpdates: string
    notLoggedIn: string
    opusNotice: string
    passesFooter: string
    recent: string
    releaseNotes: string
    resumeMore: string
    shareEarn: (n: string) => string
    shareFriends: string
    tips: string
    unableToFetch: string
    whatsNew: string
    nowUsingExtraUsage: string
    apiKeyHelperSlow: string
    tokenUsage: (n: string) => string
  }
  feedback: {
    cancel: string
    cancelled: string
    continue: string
    currentSession: string
    describeIssue: string
    editRetry: string
    envInfo: string
    errorNotAvailable: string
    errorSubmitted: string
    errorTryLater: string
    feedbackDesc: string
    feedbackId: string
    gitRepo: string
    hasLocalChanges: string
    notSynced: string
    pressEnterBrowser: string
    pressEnterConfirm: string
    reportWillInclude: string
    submit: string
    submitFeedback: string
    submitted: string
    submittingReport: string
    thankYou: string
    usageNotice: string
  }
  filePermission: {
    escToReject: string
    proceed: string
    symlinkOutside: (target: string) => string
    symlinkTarget: (target: string) => string
    tabToAddFeedback: string
  }
  filePermissionOptions: {
    allowAllEditsIn: (dir: string, shortcut: string) => string
    allowAllEditsSession: (shortcut: string) => string
    allowClaudeEdits: string
    allowReadingSession: (dir: string) => string
    andTellNext: string
    duringSession: string
    no: string
    tellDifferent: string
    yes: string
  }
  grove: {
    acceptOff: string; acceptOffDomain: string; acceptOn: string; dataPrivacy: string
    acceptOffDomain: string
    acceptOn: string
    dataPrivacy: string
    dataRetention: string; dataRetentionDesc: string; dataRetentionHow: string; dataRetentionHowDesc: string
    dataRetentionDesc: string
    dataRetentionHow: string
    dataRetentionHowDesc: string
    falseForDomain: string; gracePeriodBody: string; helpImproveClaude: string
    gracePeriodBody: string
    helpImproveClaude: string
    helpImproveClaudeSetting: string; helpImproveDesc: string; helpImproveLabel: string
    helpImproveDesc: string
    helpImproveLabel: string
    learnMore: string; notNow: string; postGraceBody: string; reviewSettings: string
    notNow: string
    postGraceBody: string
    reviewSettings: string
    selectHow: string; takesEffect: string; title: string; whatsChanging: string
    takesEffect: string
    title: string
    whatsChanging: string
  }
  help: {
    askDesc: string; forCommands: string; forShortcuts: string; gettingStarted: string
    forCommands: string
    forShortcuts: string
    gettingStarted: string
    reviewDesc: string; shortcuts: string; toCommit: string; type: string
    shortcuts: string
    toCommit: string
    type: string
  }
  home: {
    welcomeBackUser: (username: string) => string}
  modelDescriptions: {
    opus1m: (suffix: string) => string,
    opus: (suffix: string) => string,
    sonnet: string,
    opusPlan: string,
    contextUpgradeTip: (name: string, multiplier: number) => string}
  mcpErrors: {
    reconnectError: (serverName: string, errorMessage: string) => string}
  cron: {
    everyDay: (time: string) => string,
    everyDayName: (dayName: string, time: string) => string,
    weekdays: (time: string) => string}
  snapshot: {
    newerSnapshot: (scope: string, agentType: string) => string,
    mergePrompt: (scope: string, agentType: string) => string}
  agentFile: {
    builtin: string,
    plugin: (name: string) => string,
    cliArgument: string}
  permissionReason: {
    classifier: (classifier: string, toolName: string, reason: string) => string,
    hookBlocked: (hookName: string, reason: string) => string,
    hookApproval: (hookName: string, toolName: string) => string,
    rule: (ruleString: string, sourceString: string, toolName: string) => string,
    multiOperations: (toolName: string, parts: string, require: string, list: string) => string,
    multiOperationsShort: (toolName: string) => string,
    toolApproval: (permissionPromptToolName: string, toolName: string) => string,
    sandboxOverride: string,
    modeApproval: (modeTitle: string, toolName: string) => string,
    notGrantedYet: (toolName: string) => string}
  hook: {
    'skillImprovement.updated': (skillName: string) => string
  }
  hooks: {
    allDisabled: string
    byManagedSettings: string
    disabledBold: string
    disabledTitle: string
    escToClose: string
    hooksNotRunning: (count: number) => string
    noCommands: string
    noStatusLine: string
    noValidation: string
    reEnableHint: string
    whenDisabled: string
    youHaveCount: (count: number) => string
  }
  ide: {
    contextFiles: string
    contextLines: string
    pressEnter: string
    quickLaunch: string
    referenceFiles: string
    reviewChanges: string
    welcomeFor: (n: string) => string
  }
  idleReturn: {
    continue: string
    description: string
    dontAsk: string
    newConversation: string
    title: (formattedIdle: string, formattedTokens: string) => string
  }
  installGithub: {
    apiKeyExists: string
    apiKeySaved: (n: string) => string
    browserDidntOpen: string
    checkingGitHub: string
    chooseApiKey: string
    continueAnyway: string
    createNewSecret: string
    createToken: string
    createWorkflow: string
    creatingBranch: string
    creatingLongLivedToken: string
    creatingWorkflowFile: string
    creatingWorkflowFiles: string
    enterContinue: string
    enterDiffRepo: string
    enterNewKey: string
    enterRepo: string
    enterRepoName: string
    enterSecretName: string
    errorPrefix: string
    existingWorkflow: string
    exitNoChanges: string
    gettingRepoInfo: string
    grantAccess: string
    havingTrouble: string
    howToFix: string
    ifNotOpen: string
    installForRepo: string
    manualSetup: string; chooseApiKey: string; createToken: string; enterNewKey: string; navSelect: string; useExistingKey: string
    manualSetupInstructions: string
    navSelect: string
    nextSteps: string
    oauthErrorPrefix: string
    openingBrowser: string
    openingBrowserSignIn: string
    openingPrPage: string
    pasteCodeHere: string
    pressAnyKey: string
    pressAnyKeyReturn: string
    pressEnterInstalled: string
    pressEnterRetry: string
    processingAuth: string
    reasonPrefix: string
    repoPlaceholder: string
    repository: string
    retrying: string
    secretNamePlaceholder: string
    selectRepo: string
    settingUpSecret: (n: string) => string
    setupApiKeySecret: string
    setupWarnings: string
    skipWorkflow: string
    startingAuth: string
    stepApiKeyReady: string
    stepInstallApp: string
    stepMergePr: string
    stepPrPage: string
    stepWorkflowUnchanged: string
    success: string
    toSelect: string
    tokenCreated: string
    updateWorkflow: string
    useCurrentRepo: string
    useExistingKey: string
    usingExistingSecret: string
    usingExistingSecretSuccess: string
    usingToken: string
    viewLatestWorkflow: string
    warningsDesc: string
    whatToDo: string
    workflowCreated: string
    workflowExists: string
    wouldYouLike: string
    missingScopesError: (scopes: string) => string
    missingScopesReason: string
    missingScopesDesc: (scopes: string, scopeWord: string) => string
    toFixThisRun: string
    addPermissions: string
    cancelledByUser: string
    setupComplete: string
    setupFailed: (error: string, url: string) => string
    installationFailed: (url: string) => string
    placeholder: string
    ghCliNotFound: string
    ghCliNotFoundDesc: string
    installGhCli: string
    brewInstallGh: string
    wingetInstallGh: string
    linuxInstallGh: string
    ghCliNotAuthenticated: string
    ghCliNotAuthenticatedDesc: string
    runGhAuthLogin: string
    followPromptsAuth: string
    envAuthAlternative: string
    workflowConflictReason: string
    workflowConflictDesc: string
    workflowConflictFile: string
    youCanEither: string
    deleteExistingFileRun: string
    updateExistingFileManual: string
    setupActionsFailed: string
    setupActionsFailedReason: string
    invalidGhUrlTitle: string
    invalidGhUrlDesc: string
    repoUrlFormatInstruction: string
    exampleRepo: string
    repoFormatWarningTitle: string
    repoFormatWarningDesc: string
    repoNotFoundTitle: string
    repoNotFoundDesc: (repo: string) => string
    checkRepoName: (repo: string) => string
    ensureRepoAccess: string
    ghTokenRepoScope: string
    addRepoScopeRefresh: string
    adminPermsRequiredTitle: string
    adminPermsRequiredDesc: (repo: string) => string
    repoAdminsCanInstall: string
    askRepoAdmin: string
    manualSetupAlternative: string
    apiKeyRequired: string
  }
  mcpValidation: {
    schemaNotAdhered: string
    missingEnvVars: (vars: string) => string
    missingEnvVarsSuggestion: (vars: string) => string
    windowsNpxWrapper: string
    windowsNpxWrapperSuggestion: string
    fileNotFound: (filePath: string) => string
    fileNotFoundSuggestion: string
    failedToRead: (error: string) => string
    failedToReadSuggestion: string
    invalidJson: string
    invalidJsonSuggestion: string
  }
  interrupted: {
    label: string
    whatShouldClaudeDo: string
    antOnlyReportIssue: string
  }
  interruptedByUser: {
    interrupted: string
    reportIssue: string
    whatShouldClaudeDo: string
  }
  invalidConfig: {
    chooseOption: string
    description: (filePath: string) => string
    exitAndFix: string
    resetDefault: string
    resetWithDefault: string; resetDefault: string
    title: string
  }
  invalidSettings: {
    continueWithout: string; filesSkipped: string
    exitAndFix: string
    filesSkipped: string
    skippedDesc: string
    title: string
  }
  keybindingWarnings: {
    error: string
    location: string
    title: string
    warning: string
    foundErrors: (n: number) => string
    foundWarnings: (n: number) => string
    foundErrorsAndWarnings: (e: number, w: number) => string
    doctorForDetails: string
  }
  languagePicker: {
    enterLanguage: string
    leaveEmpty: string; enterLanguage: string
    placeholder: (ellipsis: string) => string
    prompt: string
  }
  launchCmd: {
    invalidArgs: (reason: string) => string,
    failed: (name: string, msg: string) => string},
  localMemory: {
    addEntryHint: (s: string) => string
    archive: string
    archivedStore: string; renamedTo: (p: { name: string }) => string; error: string; storeCreated: string
    create: string
    entries: string
    entriesCount: (p: { count: number }) => string
    error: string
    noStores: string; storesCount: (n: number) => string; storedEntry: string; in: string
    notFound: string; noEntriesIn: string; addEntryHint: (s: string) => string; entriesCount: (p: { count: number }) => string
    stored: string; value: string; archive: string; create: string; entries: string
    storedEntry: string
    storesCount: (n: number) => string
    about: 'string',
    aboutDesc: 'string',
    archiveDesc: 'string',
    archiveKeysHint: 'string',
    createDesc: 'string',
    entriesDesc: 'string',
    fetch: 'string',
    fetchDesc: 'string',
    invalidKey: 'string',
    invalidStoreName: 'string',
    keyName: 'string',
    keyPlaceholder: 'string',
    keyRequired: 'string',
    list: 'string',
    listDesc: 'string',
    navHint: 'string',
    nextBackHint: 'string',
    noStoresFound: 'string',
    overwriteKeysHint: 'string',
    storeDesc: 'string',
    storeListHeader: 'string',
    storeName: 'string',
    storeNameRequired: 'string',
    storePlaceholder: 'string',
    usage: 'string',
    valuePlaceholder: 'string',
    store: 'string'}
  localVault: {
    delete: string
    keysCount: (n: number) => string
    masked: string
    noSecrets: string; keysCount: (n: number) => string; secretStored: string; redacted: string
    secretRevealed: string; delete: string
    secretStored: string
    useReveal: (k: string) => string; masked: string; keyNotFound: string; deleted: string; error: string
    about: 'string',
    aboutDesc: 'string',
    deleteDesc: 'string',
    deleteKeysHint: 'string',
    deleting: 'string',
    get: 'string',
    getDesc: 'string',
    invalidKey: 'string',
    keyListHeader: 'string',
    keyName: 'string',
    keyPlaceholder: 'string',
    keyRequired: 'string',
    list: 'string',
    listDesc: 'string',
    navHint: 'string',
    nextBackHint: 'string',
    noSecretsStored: 'string',
    overwriteKeysHint: 'string',
    secretValue: 'string',
    set: 'string',
    setDesc: 'string',
    storing: 'string',
    usage: 'string',
    valuePlaceholder: 'string',
    valueRequired: 'string',
    working: 'string'}
  loginCmd: {
    switchAccounts: string,
    signIn: string},
  logSelector: {
    searching: string
    searchingWithClaude: string
    typeToSearch: string
    resumeSession: string
    shortcutSave: string
    shortcutSearch: string
    shortcutSkip: string
    shortcutSelect: string
    shortcutShowAllProjects: string
    shortcutShowCurrentDir: string
    shortcutToggleBranch: string
    shortcutShowAllWorktrees: string
    shortcutShowCurrentWorktree: string
    shortcutPreview: string
    shortcutRename: string
    shortcutDelete: string
    otherSessions: (n: number) => string
    sidechain: string
  }
  login: {
    anthropic: string
    anthropicDesc: string
    anthropicSetup: string
    apiKey: string
    apiKeyLabel: string
    baseUrl: string
    chatgpt: string
    chatgptDesc: string
    china: string
    chinaDesc: string
    chinaSelect: string
    confirmRemove: string
    creatingKey: string
    customModel: string
    enterConfirm: string
    enterContinue: string
    envOverride: string
    escBack: string
    escBackTimeout: string
    escCancel: string
    escGoBack: string
    fieldSwitch: string
    gemini: string
    geminiDesc: string
    geminiDesc2: string
    geminiSetup: string
    haiku: string
    loggedInAs: string
    loginTitle: string
    modelName: string
    oauthToken: string
    openLink: string
    openai: string
    openaiDesc: string
    openaiDesc2: string
    openaiSetup: string
    openingBrowser: string
    opus: string
    pressW: string
    pressWReplace: string
    removeKeyDesc: string
    removeKeyTitle: string
    removing: string
    requestCode: string
    selectEscHint: string
    selectMethod: string
    sonnet: string
    subtitle: string
    waitingChatgpt: string
  }
  keyGroup: {
    accountTitle: string
    addAccount: string
    addKey: string
    addPlatform: string
    addTitle: (layer: string) => string
    apiKeyPlural: string
    done: string
    editTitle: string
    enterApiKey: string
    enterBaseUrl: string
    keyGroupManage: string
    modelManage: string
    unsetModel: string
    enterKeysHint: string
    fieldSwitch: string
    invalidBaseUrl: string
    keyLabel: string
    keysCount: (n: number) => string
    keysCountShort: (n: number) => string
    keysEditTitle: (layer: string) => string
    keysInputHint: string
    keysListHint: string
    layerSelectDesc: string
    layerSelectHint: string
    layerSelectTitle: string
    manageDesc: string
    manageHint: string
    model: (m: string) => string
    noKeys: string
    rotationNotice: string
    noPlatforms: string
    saveFailed: (m: string) => string
    confirmToSave: string
    activateFailed: (url: string) => string
    enterModelHint: string
    fetchModelsFailed: (status: number) => string
    fetchModelsNetworkError: string
    fetchModelsFailedDetail: (msg: string) => string
    fetchingModels: string
    manualInput: string
    addCustomModelHint: string
    addCustomModelTitle: string
    manualInputHint: string
    modelLabel: string
    modelPickerHint: string
    noModelsFound: string
    refreshHint: string
    selectModelTitle: string
  }
  loginFlow: {
    providerLabel_deepseek: string,
    providerLabel_zhipu: string,
    providerLabel_qwen: string,
    providerLabel_mimo: string,
    providerLabel_kimi: string,
    providerLabel_siliconflow: string,
    providerLabel_minimax: string,
    providerLabel_stepfun: string,
    providerLabel_ark: string,
    providerLabel_qianfan: string,
    providerLabel_hunyuan: string,

    providerDesc_deepseek: string
    providerFreeTier_deepseek: string
    providerDesc_zhipu: string
    providerFreeTier_zhipu: string
    providerDesc_qwen: string
    providerFreeTier_qwen: string
    providerDesc_mimo: string
    providerFreeTier_mimo: string
    providerDesc_kimi: string
    providerFreeTier_kimi: string
    providerDesc_siliconflow: string
    providerFreeTier_siliconflow: string
    providerDesc_minimax: string
    providerFreeTier_minimax: string
    providerDesc_stepfun: string
    providerFreeTier_stepfun: string
    providerDesc_ark: string
    providerFreeTier_ark: string
    providerDesc_qianfan: string
    providerFreeTier_qianfan: string
    providerDesc_hunyuan: string
    providerFreeTier_hunyuan: string
    modeDesc_api: string
    modeDesc_codingPlan: string

    browseModels: (p: string) => string
    browserDidntOpen: string
    chatgptSetup: string
    claudeAccount: string; claudeAccountDesc: string; consoleAccount: string; consoleAccountDesc: string; thirdParty: string; thirdPartyDesc: string
    codingPlan: string
    copied: string
    customModel: string
    customModelDesc: string
    directConnection: string
    docLink: (name: string) => string
    enterApiKey: string
    enterModelName: string; enterApiKey: string; browseModels: (p: string) => string
    failedExchange: string
    failedSave: string
    failedSaveError: (m: string) => string; directConnection: string; payAsYouGo: string; codingPlan: string
    free: string
    geminiModelsRequired: string
    getYourKey: (p: string) => string; useCodingPlan: string; keyFormat: (f: string) => string
    glmFree: string
    goBackLogin: (enter: string) => string
    invalidBaseUrl: string; failedSave: string; chatgptSetup: string; geminiModelsRequired: string
    invalidCode: string; failedExchange: string; browserDidntOpen: string; copied: string
    keyFormat: (f: string) => string
    knownModels: string
    loginSuccessful: string; oauthError: (m: string) => string; pressEnterRetry: string; toContinue: string
    matchingModels: string; knownModels: string; usingThirdParty: string; retrying: string
    noPlan: string
    oauthError: (m: string) => string
    pasteCodeHere: string; preSelectedSub: string; preSelectedApi: string
    payAsYouGo: string
    preSelectedApi: string
    preSelectedSub: string
    pressEnterRetry: string
    retrying: string
    selectAccessMode: (i: string, l: string) => string; noPlan: string; glmFree: string
    selectModel: (i: string, l: string) => string; free: string; customModel: string; customModelDesc: string
    storeTokenSecurely: string
    toContinue: string
    tokenCreated: string; storeTokenSecurely: string; useToken: string
    useCodingPlan: string
    useToken: string
    usingThirdParty: string
  }
  logoV2: {
    antLogs: string; apiCalls: string; debugLogs: string; debugMode: string; detach: string
    apiCalls: string
    debugLogs: string
    debugMode: string
    detach: string
    loggingTo: string; reportIssue: string; sandboxed: string; startupPerf: string; tmuxSession: string
    reportIssue: string
    sandboxed: string
    startupPerf: string
    tmuxSession: string
  }
  main: {
    addDir: string
    advisor: string
    afk: string
    agent: string
    agentColor: string
    agentId: string
    agentName: string
    agentTeams: string
    agentType: string
    agents: string
    agentsCmd: string
    allowDangerouslySkipPermissions: string
    allowedTools: string
    appendSystemPrompt: string
    appendSystemPromptFile: string
    assistant: string
    assistantCmd: string
    authCmd: string
    authLogin: string
    authLoginClaudeai: string
    authLoginConsole: string
    authLoginEmail: string
    authLoginSso: string
    authLogout: string
    authStatus: string
    authStatusJson: string
    authStatusText: string
    autoModeCmd: string
    autoModeConfig: string
    autoModeCritique: string
    autoModeCritiqueModel: string
    autoModeDefaults: string
    autonomyCmd: string
    autonomyFlow: string
    autonomyFlowCancel: string
    autonomyFlowResume: string
    autonomyFlows: string
    autonomyRuns: string
    autonomyStatus: string
    autonomyStatusDeep: string
    bare: string
    betas: string
    brief: string
    channels: string
    chrome: string
    completionCmd: string
    completionOutput: string
    continue: string
    coworkOption: string
    dangerouslySkipPermissions: string
    debug: string
    debugFile: string
    debugToStderr: string
    deepLinkLastFetch: string
    deepLinkOrigin: string
    deepLinkRepo: string
    delegatePermissions: string
    description: string
    disableSlashCommands: string
    disallowedTools: string
    doctorCmd: string
    effort: string
    enableAuthStatus: string
    enableAutoMode: string
    errorArg: string
    errorCmd: string
    exportCmd: string
    exportExamples: string
    exportOutputArg: string
    exportSourceArg: string
    fallbackModel: string
    file: string
    forkSession: string
    fromPr: string
    hardFail: string
    helpOption: string
    ide: string
    includeHookEvents: string
    includePartialMessages: string
    init: string
    initOnly: string
    inputFormat: string
    installCmd: string
    installForce: string
    jsonSchema: string
    loadDevChannels: string
    logArg: string
    logCmd: string
    maintenance: string
    marketplaceAdd: string
    marketplaceAddScope: string
    marketplaceAddSparse: string
    marketplaceCmd: string
    marketplaceList: string
    marketplaceRemove: string
    marketplaceUpdate: string
    maxBudgetUsd: string
    maxThinkingTokens: string
    maxTurns: string
    mcpAddFromDesktop: string
    mcpAddJson: string
    mcpClientSecret: string
    mcpCmd: string
    mcpConfig: string
    mcpDebug: string
    mcpGet: string
    mcpList: string
    mcpRemove: string
    mcpRemoveScope: string
    mcpResetProjectChoices: string
    mcpScope: string
    mcpServe: string
    mcpServeDebug: string
    messagingSocketPath: string
    model: string
    name: string
    noChrome: string
    noSessionPersistence: string
    openCmd: string
    openOutputFormat: string
    openPrint: string
    outputFormat: string
    parentSessionId: string
    permissionMode: string
    permissionPromptTool: string
    planModeRequired: string
    pluginCmd: string
    pluginDir: string
    pluginDisable: string
    pluginDisableAll: string
    pluginEnable: string
    pluginEnableScope: (s) => string
    pluginInstall: string
    pluginInstallScope: string
    pluginKeepData: string
    pluginList: string
    pluginListAvailable: string
    pluginListJson: string
    pluginUninstall: string
    pluginUninstallScope: string
    pluginUpdate: string
    pluginUpdateScope: (s) => string
    pluginValidate: string
    prefill: string
    print: string
    proactive: string
    promptArg: string
    rc: string
    remote: string
    remoteControl: string
    remoteControlCmd: string
    replayUserMessages: string
    resume: string
    resumeSessionAt: string
    rewindFiles: string
    rollbackCmd: string
    rollbackDryRun: string
    rollbackList: string
    rollbackSafe: string
    sdkUrl: string
    serverAuthToken: string
    serverHost: string
    serverIdleTimeout: string
    serverMaxSessions: string
    serverPort: string
    serverStart: string
    serverUnix: string
    serverWorkspace: string
    sessionId: string
    settingSources: string
    settings: string
    setupToken: string
    skipPermissionsClassifiers: string
    sshCmd: string
    sshDangerouslySkipPermissions: string
    sshLocal: string
    sshPermissionMode: string
    sshRemoteBin: string
    strictMcpConfig: string
    systemPrompt: string
    systemPromptFile: string
    taskBudget: string
    taskCmd: string
    taskCreate: string
    taskCreateDesc: string
    taskDir: string
    taskGet: string
    taskList: string
    taskListId: string
    taskListJson: string
    taskListPending: string
    taskUpdate: string
    taskUpdateClearOwner: string
    taskUpdateDesc: string
    taskUpdateOwner: string
    taskUpdateStatus: (s) => string
    taskUpdateSubject: string
    tasks: string
    teamName: string
    teammateMode: string
    teleport: string
    thinking: string
    tmux: string
    tools: string
    upCmd: string
    updateCmd: string
    verbose: string
    workload: string
    worktree: string
  }
  marketplaceNotif: {
    configSaveFailed: string
    installFailed: string
    installed: string
  }
  mcpAgentServer: {
    agentOnly: string
    authenticate: string
    back: string
    browserNotOpen: string
    reauthenticate: string
    returnAfterAuth: string
    type: string
  }
  mcpDesktopImport: {
    alreadyExists: string
    collisionNote: string
    noServersImported: string
    selectPrompt: string
    title: string
  }
  mcpListPanel: {
    alwaysAvailable: string
    scopeDynamic: string
    scopeEnterprise: string
    scopeLocal: string
    scopeProject: string
    scopeUser: string
    title: string
  }
  mcpServerDialog: {
    enterConfirm: string
    rejectAll: string
    spaceSelect: string
    subtitle: string
    title: (count: number) => string
  }
  memoryStores: {
    active: string
    archived: string
    archivedAt: string
    archivedAtLabel: string
    content: string
    created: string
    id: string
    memoriesIn: (s: string, n: number) => string
    memoryCreated: string
    memoryDeleted: (id: string, storeId: string) => string
    memoryDetail: string
    memoryUpdated: string
    name: string
    namespace: string
    noMemories: (s: string) => string
    noStores: string
    noStoresFound: string
    noVersions: (s: string) => string
    ns: string
    redacted: string
    redactedAt: string
    status: string
    store: string
    storeArchived: string
    storeCreated: string
    storeDetail: string
    storeLabel: string
    stores: (n: number) => string
    storesCount: (n: number) => string
    updated: string
    versionRedacted: string
    versionsIn: (s: string, n: number) => string
  }
  messages: {
    hidePrevious: (shortcut: string, count: string) => string
    showPrevious: (shortcut: string, count: string) => string
    newMessages: (count: number) => string
    jumpToBottom: string
  }
  misc: {
    claudeCodeTitle: string; claudeCodeV: string; extraUsageCredit: string; extraUsageSubtitle: string
    claudeCodeV: string
    extraUsageCredit: string
    extraUsageSubtitle: string
    guestPassesCount: string; lastOnboardingVersion: string; mcpHelp: string; noMcpServer: string
    lastOnboardingVersion: string
    mcpHelp: string
    noMcpServer: string
    onboardingCompleted: string; onboardingStatus: string; pluginNotInstalled: string
    onboardingStatus: string
    pluginNotInstalled: string
    runModelPick: string; themeLabel: string; uiLang: string; uiLangDesc: string; uiLangHint: string
    themeLabel: string
    uiLang: string
    uiLangDesc: string
    uiLangHint: string
    voiceMode: string; workspaceTrustCleared: string
    workspaceTrustCleared: string
  }
  notif: {
    'cancelRequest.noAgentsRunning': string
    'cancelRequest.pressAgain': (shortcut: string) => string
    'chrome.enabled': string
    'chrome.extensionNotDetected': string
    'chrome.requiresSubscription': string
    'clipboardImage.imageInClipboard': (shortcut: string) => string
    'fastMode.disabledByOrg': string
    'fastMode.limitReset': string
    'fastMode.nowAvailable': string
    'fastMode.overloaded': (resetIn: string) => string
    'fastMode.rateLimit': (resetIn: string) => string
    'ideStatus.disconnected': (ideName: string) => string
    'ideStatus.hint': string
    'ideStatus.installFailed': string
    'ideStatus.pluginNotConnected': string
    'lsp.lspFailed': (displayName: string) => string
    'lsp.slashPluginDetails': string
    'managePlugins.flagged': string
    'managePlugins.reloadPending': string
    'mcpConnect.failedClaudeAi': (count: number) => string
    'mcpConnect.failedLocal': (count: number) => string
    'mcpConnect.needsAuthClaudeAi': (count: number) => string
    'mcpConnect.needsAuthLocal': (count: number) => string
    'mcpConnect.slashMcp': string
    'modelMigration.opus47': string
    'modelMigration.opus47Legacy': string
    'modelMigration.sonnet46': string
    'pipeRouter.failedToSend': (targets: string) => string
    'pipeRouter.routed': (targets: string) => string
    'pipeRouter.unavailable': string
    'pluginAutoupdate.reloadHint': string
    'pluginAutoupdate.updated': (count: number, displayNames: string) => string
    'pluginInstall.failedToInstall': (count: number) => string
    'pluginInstall.slashPluginDetails': string
    'settingsErrors.foundIssues': (count: number) => string
    'switchSub.loginToActivate': string
    'switchSub.useExistingPlan': (subscriptionType: string) => string
    'teammate.agentsShutDown': (count: number) => string
    'teammate.agentsSpawned': (count: number) => string
    'textInput.escAgainToClear': string
  }
  onboarding: {
    alwaysReview: string
    alwaysReviewDesc: string
    enterConfirm: string
    escSkip: string
    noLater: string
    onlyUseTrusted: string
    onlyUseTrustedDesc: string
    pressEnter: string
    securityTitle: string
    terminalSetupDesc: string
    terminalSetupOptApple: string
    terminalSetupOptShift: string
    useTerminalSetup: string
    yesRecommended: string
  }
  outputStyle: {
    description: string
    loading: string
    title: string
  }
  permGeneral: {
    deleteCell: string; deleteCellLabel: string; editFile: string; editNotebook: string
    deleteCellLabel: string
    editFile: string
    editNotebook: string
    fileDoesNotExist: string; insertCell: string; insertNewCell: string; monitor: string
    insertCell: string
    insertNewCell: string
    monitor: string
    no: string
    patternNoMatch: string; replaceCell: string; replaceCellContents: string; toolUse: string; no: string; yes: string
    replaceCell: string
    replaceCellContents: string
    toolUse: string
    yes: string
  }
  permRuleList: {
    addNewRule: string; allowDesc: string; askDesc: string; denyDesc: string
    allowDesc: string
    askDesc: string
    contactAdmin: string
    denyDesc: string
    escCancel: string
    footerDefault: string; footerHeader: string; footerRecent: string; footerSearch: string
    footerHeader: string
    footerRecent: string
    footerSearch: string
    managedSettings: string; permissionDismissed: string; ruleAllowed: string; ruleAsk: string
    no: string
    permissionDismissed: string
    ruleAllowed: string
    ruleAsk: string
    ruleDenied: string; ruleDetails: string; contactAdmin: string; escCancel: string; no: string; yes: string
    ruleDetails: string
    yes: string
  }
  permission: {
    allowConnection: string
    allowFetch: string
    approveArtifact: (t: string) => string; showReview: string
    autoReadInfo: string
    confirmDelete: string
    enterPath: string
    enterPlanMode: string
    exitPlanMode: string
    heresPlan: string
    noAccess: string
    pressAgain: (k: string) => string
    proceed: string
    recentDenials: string
    reviewArtifact: string
    needsAttention: string
    needsPermission: (toolName: string) => string
    showReview: string
    skillUse: string
    yesDontAsk: (s: string, c: string) => string
  }
  permissionDebug: {
    noDecisionReason: string
    requiresSandbox: string
  }
  permissionMode: {
    bypassPermissions: string
    default: string; plan: string; acceptEdits: string; bypassPermissions: string; dontAsk: string; auto: string
  }
  permissions: {
    actionLabel: string
    alsoRequested: string
    behavior: string
    directories: string
    escToCancel: string
    explanationUnavailable: string
    feedbackPlaceholderAccept: string
    feedbackPlaceholderReject: string
    highRisk: string
    loadingExplanation: string
    lowRisk: string
    medRisk: string
    message: string
    mode: string
    none: string
    reason: string
    requestSentToLeader: (teamName: string) => string
    rules: string
    suggestion: string
    suggestions: string
    tabToAmend: string
    toolLabel: string
    unreachableRules: (count: number) => string
    waitingForApproval: string
  }
  pluginUI: {
    addMarketplace: string; enterMarketplaceSource: string; pleaseEnterSource: string; invalidSourceFormat: string
    addMarketplaceHint: string
    addingMarketplace: string; willEnable: string; willDisable: string; validateUsage: string; examples: string
    allPluginsInstalled: string
    allPluginsInstalledInMarketplace: string
    builtin: string; flagged: string; project: string; local: string; user: string; enterprise: string; managed: string
    checkLater: string
    checkNetwork: string
    componentsWillBeDiscovered: string
    configure: (n: string) => string
    contactAdmin: string
    discoverPlugins: string; installed: string; marketplaces: string; errors: string
    discoverPluginsTitle: string
    enablePlugin: string; disablePlugin: string; uninstall: string
    error: string; by: string; willInstall: string; selectMarketplace: string; noMarketplaces: string
    examples: string
    fieldOf: (n: number, t: number) => string; tabNextField: string; enterSave: string
    from: string
    gitRequired: string
    goBack: string
    install: string
    installGit: string
    installLocal: string
    installPlugins: string; noSummary: string; toggle: string; back: string
    installPluginsTitle: string
    installUser: string; installProject: string; installLocal: string; openHomepage: string; viewOnGitHub: string
    installedComponents: string; commands: string; agents: string; skills: string; hooks: string; mcpServers: string
    installing: string
    loadFailed: string
    loading: string
    managePlugins: string
    marketplaceTitle: string
    moreAbove: string
    moreBelow: string
    noNewPlugins: string
    noPlugins: string
    noPluginsAvailable: string
    noPluginsAvailableTitle: string; removeMarketplace: string; updateMarketplace: string
    noPluginsInstalled: string; escBack: string; managePlugins: string
    noPluginsMatch: (q: string) => string; noPluginsAvailable: string; addMarketplaceFirst: string
    noSearchResults: (q: string) => string
    pleaseEnterSource: string
    pluginCommandUsage: string; noPluginErrors: string; reloadToApply: string
    pluginDetails: string
    pluginTitle: string
    policyBlocked: string
    policyRestricts: string
    removeMarketplace: string
    runningValidation: string
    scope: string; version: string; author: string; status: string; enabled: string; disabled: string
    selectMarketplace: string
    tabNextField: string
    toggle: string
    trustWarning: string; configure: (n: string) => string; pluginOptions: string; plugin: (n: string) => string
    typeToSearch: string; details: string; select: string; pluginDetails: string
    updateMarketplace: string
    validateUsage: string
    viewAllowedSources: string
    willEnable: string
    failedLoadMarketplaces: 'string',
    failedLoadPlugins: 'string',
    failedUpdateSetting: 'string',
    addMarketplaceCmd: 'string',
    addMarketplaceCommand: 'string',
    addMarketplaceDirect: 'string',
    alreadyInstalledSuffix: 'string',
    autoUpdateEnabled: 'string',
    communityManaged: 'string',
    configured: 'string',
    disableAutoUpdate: 'string',
    disableCmd: 'string',
    enableAutoUpdate: 'string',
    enableCmd: 'string',
    enterToApply: 'string',
    escGoBack: 'string',
    fromSpecificMarketplace: 'string',
    installFromMarketplace: 'string',
    installSpecificPlugin: 'string',
    installationSection: 'string',
    listMarketplacesCmd: 'string',
    loadingMarketplaces: 'string',
    mainPluginMenu: 'string',
    manageCmd: 'string',
    manageMarketplaces: 'string',
    managementSection: 'string',
    marketplaceMenuCmd: 'string',
    marketplacesSection: 'string',
    orFromCli: 'string',
    otherSection: 'string',
    pendingChanges: 'string',
    pleaseWait: 'string',
    pluginsAlias: 'string',
    pressYOrN: 'string',
    processingChanges: 'string',
    removeLabel: 'string',
    removeMarketplaceCmd: 'string',
    removeSpecificMarketplace: 'string',
    restartToRetry: 'string',
    showHelpCmd: 'string',
    showingAvailableMarketplaces: 'string',
    showingAvailablePlugins: 'string',
    uninstallCmd: 'string',
    updateLabel: 'string',
    updateMarketplaceCmd: 'string',
    updateMarketplacesCmd: 'string',
    updatingMarketplace: 'string',
    validateDescription: 'string',
    validateDirectoryHint: 'string',
    validateDirectoryHint2: 'string',
    validateManifestCmd: 'string',
    validationFailed: 'string',
    validationPassed: 'string',
    validationPassedWarnings: 'string',
    validationSection: 'string',
    exampleGithub: string; exampleSsh: string; exampleHttps: string; exampleLocal: string
    addedMarketplace: (name: string) => string
    addError: (msg: string) => string
    updateNow: string; viewRepository: string; backToPluginList: string
  }

  pluginOperations: {
    notFoundInLocation: (plugin: string, location: string) => string
    marketplaceRef: (name: string) => string
    anyConfiguredMarketplace: string
    localSourceNoLocation: (plugin: string) => string
    settingsWriteFailed: (msg: string) => string
    blockedByPolicyInstall: (plugin: string) => string
    dependencyBlockedByPolicy: (plugin: string, dep: string) => string
    dependencyBlockedInstall: (plugin: string, dep: string) => string
    installedRunReload: (name: string, depNote: string) => string
    failedToInstall: (msg: string) => string
    installedSuccess: (pluginId: string, scope: string, depNote: string) => string
    notFoundInInstalledPlugins: (plugin: string) => string
    enabledProjectScopeHint: (plugin: string) => string
    installedOtherScope: (plugin: string, other: string, scope: string) => string
    notInstalledInScope: (plugin: string, scope: string) => string
    uninstalledSuccess: (name: string, scope: string, depNote: string) => string
    failedToEnableBuiltin: (msg: string) => string
    failedToDisableBuiltin: (msg: string) => string
    enabledBuiltinSuccess: (name: string) => string
    disabledBuiltinSuccess: (name: string) => string
    notFoundInSettings: (plugin: string) => string
    notFoundAnyEditableScope: (plugin: string) => string
    blockedByPolicyEnable: (plugin: string) => string
    installedAtScopeElsewhere: (plugin: string, found: string, scope: string) => string
    alreadyInState: (plugin: string, state: string, scopeNote: string) => string
    enabledState: string
    disabledState: string
    atScopeNote: (scope: string) => string
    failedToEnable: (msg: string) => string
    failedToDisable: (msg: string) => string
    enabledSuccess: (name: string, scope: string, depNote: string) => string
    disabledSuccess: (name: string, scope: string, depNote: string) => string
    noEnabledPlugins: string
    disabledSomeFailedSingular: (m: number) => string
    disabledSomeFailedPlural: (n: number, m: number) => string
    disabledCountSingular: () => string
    disabledCountPlural: (n: number) => string
    pluginNotFound: (name: string) => string
    pluginNotInstalled: (name: string) => string
    pluginNotInstalledAtScope: (name: string, scopeDesc: string) => string
    marketplaceDirNotFound: (loc: string) => string
    pluginSourceNotFound: (path: string) => string
    alreadyLatest: (name: string, version: string) => string
    updatedFromTo: (name: string, oldVer: string, newVer: string, scopeDesc: string) => string
    unknownVersion: string
  }

  pluginResolutionErrors: {
    cycle: (chain: string) => string
    crossMarketplace: (dep: string, requiredBy: string, where: string, hint: string) => string
    marketplaceRef: (name: string) => string
    differentMarketplace: string
    marketHint: (name: string) => string
    notFoundInMarketplace: (dep: string, requiredBy: string, mkt: string) => string
    notFoundAnyMarketplace: (dep: string, requiredBy: string) => string
  }
  preview: {
    chatAboutThis: string
    ctrlGToEdit: (editorName: string) => string
    escCancel: string
    helpText: string
    notes: string
    notesPlaceholder: string
    pressNToAddNotes: string
    questionNoPreview: string
    skipInterview: string
    tabToSwitchQuestions: string
  }
  privacySettings: {
    fallback: string,
    unableToRetrieve: string,
    helpImproveSet: string,
    dialogDismissed: string},
  processUserInput: {
    imageSource: (sourcePath: string) => string
    outputTruncated: (maxChars: number) => string
    remoteControlUnavailable: (command: string) => string
    stoppedByHook: string
    stoppedByHookReason: (reason: string) => string
  }
  proactiveCmd: {
    disabled: string,
    enabled: string,
    systemReminder: string},
  project: {
    workspaceStep: string
  }
  prompt: {
    bashMode: string
    copy: string
    exitAgain: (key: string) => string
    goal: (time: string) => string
    hide: string
    hideTasks: string
    holdToSpeak: (key: string) => string
    interrupt: string
    macOptionClick: string
    manage: string
    nativeSelect: string
    pasting: string
    remote: string
    returnToTeamLead: string
    rssPid: (rss: string, pid: number) => string
    shortcuts: string
    showTasks: string
    showTeammates: string
    stopAgents: string
    viewTasks: string
    vimInsert: string
    waiting: (duration: string) => string; goal: (time: string) => string; exitAgain: (key: string) => string; pasting: string; vimInsert: string; bashMode: string; remote: string; rssPid: (rss: string, pid: number) => string; shortcuts: string; holdToSpeak: (key: string) => string; macOptionClick: string; returnToTeamLead: string; interrupt: string; copy: string; nativeSelect: string; manage: string; viewTasks: string; stopAgents: string; showTasks: string; showTeammates: string; hide: string; hideTasks: string; agentsToManage: string; largeAgentDescriptions: (tokens: string, threshold: string) => string; ultrathinkEffortHigh: string; ultraplanLaunch: string; ultrareview: string; directMessageSent: (name: string) => string; externalEditorFailed: (err: string) => string; modelSetTo: (model: string) => string; billedAsExtraUsage: string; fastModeOff: string; thinkingOn: string; thinkingOff: string
  }
  rateLimitMessages: {
    closeToExtraUsageLimit: string
    outOfExtraUsage: (reset: string) => string
    resetsIn: (time: string) => string
    hitLimit: (limit: string, reset: string) => string
    hitLimitAnt: (limit: string, reset: string) => string
    usedPctOf: (pct: number, limit: string) => string
    approaching: (limit: string) => string
    limit: string
    limitWeekly: string
    limitSonnet: string
    limitOpus: string
    limitSession: string
    limitUsage: string
    limitExtraUsage: string
    limitExtraUsageApproaching: string
    yourLimitResets: (limit: string, time: string) => string
    nowUsingExtraUsage: (reset: string) => string
    startedUsingExtraUsage: string
    upgradeContinue: string
    extraUsageRequest: string
  }
  recentDenials: {
    empty: string
    retry: string
  }
  remoteEnv: {
    noEnvironments: string
    setupHint: string
    title: string
  }
  removeDir: {
    no: string
    title: string
    yes: string
  }
  resumeTask: {
    apiError: string
    checkInternet: string
    ctrlR: string
    errorLoading: string
    fetching: string
    for: string
    loading: string
    loginHint: string
    noSessions: string
    otherError: string
    pressCtrlR: string
    pressToCancel: (key: string) => string
    retrying: string
    selectSession: string
    sessionTitle: string
    teleportRequires: string
    updated: string
  }
  sandbox: {
    host: string
    noTellClaude: string
    title: string
    yes: string
  }
  schedule: {
    agent: string
    created: string
    disabled: string
    enabled: string
    id: string
    lastRun: string
    nextRun: string
    noTriggers: string
    prompt: string
    runId: string
    schedule: string
    status: string
    statusDisabled: string
    statusEnabled: string
    triggerCreated: string
    triggerDeleted: (id: string) => string
    triggerDisabled: (id: string) => string
    triggerEnabled: (id: string) => string
    triggerRan: (id: string, runId: string) => string
    triggerUpdated: string
    triggers: (n: number) => string
  }
  scheduleView: {
    agent: string
    agentLabel: string
    created: string
    disabled: string
    enabled: string
    id: string
    lastRun: string
    nextRun: string
    noTriggersFound: string
    prompt: string
    runId: string
    schedule: string
    scheduledTriggers: (n: number) => string
    status: string
    triggerCreated: string
    triggerDeleted: (n: string) => string
    triggerDetail: string
    triggerDisabled: (n: string) => string
    triggerEnabled: (n: string) => string
    triggerFired: (n: string) => string
    triggerUpdated: string
  }
  searchExtraTools: {
    dismiss: string
  }
  sessionPreview: {
    loading: string
    messageCount: (n: number) => string
  }
  sessionStart: {
    configIssue: string
    fixPlugins: string
    networkIssue: string
    permissionsIssue: string
  }
  shortcutHint: {
    downToSelect: string
    leftToCollapse: string
    rightToExpand: string
    pToExpand: string
    toExpand: string
    expand: string
    collapse: string
    select: string
    confirm: string
    save: string
    background: string
    resume: string
    cycle: string
    switch: string
    return: string
    tabs: string
    cancel: string
    navigate: string
    toggle: string
    complete: string
    add: string
    copy: string
    edit: string
    continue: string
    editInYourEditor: string
    enterText: string
    back: string
    toggleSelection: string
    unset: string
  }
  settings: {
    autoCompact: string; showTips: string; cacheWarnings: string; reduceMotion: string; thinkingMode: string
    autoCompactChanged: (v: boolean) => string; respectGitignoreChanged: (v: boolean) => string; copyFullResponseChanged: (v: boolean) => string
    autoConnectChanged: (v: boolean) => string
    autoConnectIDE: string
    autoInstallChanged: (v: boolean) => string
    autoUpdateChannel: string
    autoUpdateChannelChanged: (v: string) => string
    claudeInChrome: string; teammateModel: string; remoteControl: string; externalIncludes: string
    copyFullResponse: string
    copyFullResponseChanged: (v: boolean) => string
    copyOnSelect: string; autoUpdateChannel: string; fastMode: string; fastModeOff: string; theme: string; pushWhenIdle: string; pushWhenInputNeeded: string
    copyOnSelectChanged: (v: boolean) => string; terminalProgressBarChanged: (v: boolean) => string; terminalTabStatusChanged: (v: boolean) => string
    customApiKey: string
    defaultPermissionMode: string; useAutoMode: string; respectGitignore: string; copyFullResponse: string
    diffToolChanged: (v: string) => string
    editorModeChanged: (v: string) => string; diffToolChanged: (v: string) => string; autoConnectChanged: (v: boolean) => string; autoInstallChanged: (v: boolean) => string
    enableLatest: string; enableStable: string; notifications: string; localNotifications: string
    enabled: string
    fastModeOff: string
    maxApiRetries: string; maxApiRetriesDefault: string; maxApiRetriesOff: string; maxApiRetriesAlways: string; maxApiRetriesCustom: string
    maxApiRetriesCustomInput: string; maxApiRetriesCurrent: string
    maxApiRetriesDefaultDesc: string; maxApiRetriesOffDesc: string; maxApiRetriesAlwaysDesc: string; maxApiRetriesCustomDesc: string
    maxApiRetriesDefaultWithValue: (n: number) => string; maxApiRetriesCustomWithValue: (n: number) => string
    notifications: string
    notificationsChanged: (v: string) => string
    outputStyle: string
    outputStyleChanged: (v: string) => string
    promptSuggestions: string; poorMode: string; speculativeExecution: string; rewindCode: string
    pushWhenClaudeDecides: string; outputStyle: string; defaultView: string; editorMode: string
    pushWhenInputNeeded: string
    remoteControl: string
    remoteControlChanged: (v: boolean) => string
    remoteControlReset: string
    respectGitignoreChanged: (v: boolean) => string
    setTo: (key: string, value: string) => string; enabled: string; disabled: string; customApiKey: string
    showPRStatus: string; model: string; diffTool: string; autoConnectIDE: string; autoInstallIDE: string
    showTurnDuration: string
    speculativeExecution: string
    terminalProgressBar: string
    terminalProgressBarChanged: (v: boolean) => string
    terminalTabStatusChanged: (v: boolean) => string
    themeChanged: (v: string) => string; notificationsChanged: (v: string) => string; outputStyleChanged: (v: string) => string
    thinkingMode: string
    turnDurationChanged: (v: boolean) => string; remoteControlReset: string; remoteControlChanged: (v: boolean) => string
    typeToFilter: string
    useAutoMode: string
    verboseOutput: string; terminalProgressBar: string; showStatusTerminalTab: string; showTurnDuration: string; statusLineEnabled: string; fullscreenEnabled: string
  }
  settingsStatus: {
    sessionId: string
    sessionName: string
    version: string
  }
  settingsTab: {
    config: string
    status: string
    statusDialogDismissed: string
    usage: string
  }
  shellPermission: {
    accessAnd: string
    allowAccess: string
    allowAccessTo: string
    allowReadingFrom: string
    allowReadingFromMulti: string
    alwaysAllowAccess: string
    alwaysAllowAccessMulti: string
    alwaysAllowAccessTo: string
    and: string
    andCommands: string
    andNMore: (n: number) => string
    commandsIn: (cwd: string) => string
    commandsOnly: string
    dontAskAgainFor: string
    fromThisProject: string
    similar: string
  }
  skillLearning: {
    aboutDesc: string
    actionsCount: (n: number) => string
    startDesc: string
    statusDesc: string
    stopDesc: string
  }
  skillPermission: {
    no: string
    title: (skill: string) => string
    yes: string
    yesDontAsk: (skill: string, cwd: string) => string
    yesPrefix: (prefix: string, cwd: string) => string
  }
  skillSearch: {
    aboutDesc: string
    actionsCount: (n: number) => string
    startDesc: string
    statusDesc: string
    stopDesc: string
  }
  skillStore: {
    active: string
    allowedTools: string
    created: string
    deprecated: string
    loadWith: (n: string) => string
    name: string
    noSkillsFound: string
    noVersions: (n: string) => string
    owner: string
    path: string
    skillCreated: (n: string) => string
    skillDeleted: (n: string) => string
    skillDetail: string
    skillInstalled: (n: string) => string
    skillsCount: (n: number) => string
    status: string
    versionDetail: (n: string, m: string) => string
    versionsFor: (n: string, m: number) => string
    id: 'string'}
  spinner: {
    btwTip: string
    clearTip: string
    disconnected: string
    idle: string
    inBackground: (count: number) => string
    next: (subject: string) => string
    reconnecting: string
    reconnectingDots: string
    teammatesRunning: string
    tip: (tip: string) => string
    workedFor: (duration: string) => string
    working: string
  }
  stats: {
    activeDays: string
    activeDaysLabel: string
    avgPerSession: string
    copied: string
    copyFailed: string
    copying: string
    currentStreak: string
    currentStreakLabel: string
    day: string
    days: string
    failedToLoad: string
    favoriteModel: string
    hint: string
    loading: string
    loadingStats: string
    longestSession: string
    longestStreak: string
    longestStreakLabel: string
    models: string
    modelsCount: (n: number) => string
    mostActiveDay: string
    noModelData: string
    noStats: string
    of: string
    overview: string
    peakHour: string
    sessions: string
    shotDistribution: string
    speculationSaved: string
    statsDialogDismissed: string
    statsFrom: (days: number) => string
    toScroll: string
    tokensPerDay: string
    totalTokens: string
  }
  status: {
    additionalCaCerts: string
    anthropicBaseUrl: string
    apiKey: string
    apiProvider: string
    authToken: string
    awsAuthSkipped: string
    awsRegion: string
    bashSandbox: string
    bedrockBaseUrl: string
    default: string
    defaultRegion: string
    disabled: string
    email: string
    enabled: string
    enterpriseManagedDropins: string
    enterpriseManagedFile: string
    enterpriseManagedFileDropins: string
    enterpriseManagedHkcu: string
    enterpriseManagedHklm: string
    enterpriseManagedPlist: string
    enterpriseManagedRemote: string
    foundryAuthSkipped: string
    foundryBaseUrl: string
    foundryResource: string
    gcpAuthSkipped: string
    gcpProject: string
    geminiBaseUrl: string
    grokBaseUrl: string
    ide: string
    ideConnected: (ideName: string) => string
    ideConnectedVersion: (ideName: string, pluginOrExtension: string, installedVersion: string) => string
    ideConnectedVersionMismatch: (ideName: string, pluginOrExtension: string, installedVersion: string, serverVersion: string) => string
    ideErrorInstalling: (ideName: string, pluginOrExtension: string, error: string) => string
    ideInstalled: (ideName: string, pluginOrExtension: string) => string
    ideNotConnected: (ideName: string) => string
    ideRestartHint: string
    invalidSettingsFiles: (fileList: string) => string
    largeMemoryFile: (displayPath: string, chars: string, maxChars: string) => string
    loginMethod: string
    mcpConnected: (count: number) => string
    mcpFailed: (count: number) => string
    mcpNeedAuth: (count: number) => string
    mcpPending: (count: number) => string
    mcpServers: string
    mtlsClientCert: string
    mtlsClientKey: string
    noWritePermAutoUpdates: string
    openaiBaseUrl: string
    organization: string
    providerBedrock: string
    providerFoundry: string
    providerGemini: string
    providerGrok: string
    providerOpenai: string
    providerVertex: string
    proxy: string
    settingSources: string
    slashMcp: string
    subscriptionAccount: (subscription: string) => string
    vertexBaseUrl: string
  }
  systemprompt: {
    languageName: (code: string) => string
    languageSection: (name: string) => string
    languageChanged: (prevName: string, currName: string) => string
  }
  tag: {
    noKeep: string
    removeConfirm: string
    yesRemove: string
  }
  tagCmd: {
    noActiveSession: string
    emptyTag: string
    tagged: (tag: string) => string
    removed: (tag: string) => string
    kept: (tag: string) => string
    help: string
  }
  tagTabs: {
    all: string
    resume: string
    resumeAll: string
    tabToCycle: string
  }
  taskDetail: {
    activeAgents: (n: number) => string
    activeShells: (n: number) => string
    agent: string
    agentCount: (n: number) => string
    agentsCount: (n: number) => string
    agentsStatus: (n: number, verb: string) => string
    answerInBrowser: (q: string) => string
    asyncAgent: string
    awaitingApproval: string
    back: string
    backgroundTasks: string
    close: string
    command: string
    completed: string
    dedupe: string
    deduping: string
    descriptionLabel: string
    dismiss: string
    doneLabel: string
    earlierTurns: (n: number) => string
    error: string
    errorLabel: string
    exitCode: (code: number) => string
    failed: string
    fileCount: (n: number) => string
    filesTouched: (n: number) => string
    find: string
    finding: string
    foreground: string
    foundLabel: string
    goBack: string
    idle: string
    loadingOutput: string
    mcpMonitorTitle: string
    memoryConsolidation: string
    monitorDetailTitle: string
    noOutput: string
    noTasksRunning: string
    noTextOutput: string
    ofSize: (size: string) => string
    openInWeb: string
    output: string
    phaseNeedsInput: string
    phasePlanReady: string
    progress: string
    prompt: string
    recentMessages: string
    refutedCount: (n: number) => string
    refutedLabel: string
    remoteSessionTitle: string
    resourceLabel: string
    reviewDone: string
    reviewFindings: (n: number) => string
    reviewInWeb: string
    reviewPlanInWeb: string
    reviewRefuted: (n: number) => string
    reviewSettingUp: string
    reviewingSessions: (n: number) => string
    running: string
    runtime: string
    script: string
    sectionAgents: string
    sectionLocalAgents: string
    sectionMonitors: string
    sectionRemoteAgents: string
    sectionShells: string
    sectionWorkflows: string
    select: string
    serverLabel: string
    sessionCount: (n: number) => string
    sessionUrl: string
    setup: string
    shellDetailTitle: string
    shiftToView: string
    showingLastOf: (last: number, total: number) => string
    showingLines: (n: number) => string
    start: string
    starting: string
    status: string
    stop: string
    stopAllAgents: string
    stopUltraplan: string
    stopUltraplanDesc: string
    stopUltrareview: string
    stopUltrareviewDesc: string
    stopped: string
    stoppedLabel: string
    stopping: string
    teamLabel: (name: string) => string
    teleport: string
    teleportFailed: (err: string) => string
    teleporting: string
    terminateSession: string
    title: string
    tokens: string
    tool: string
    toolCalls: (n: number) => string
    tools: string
    ultraplan: string
    ultrareview: string
    unreadSuffix: string
    verbDone: string
    verbWaiting: string
    verbWorking: string
    verifiedLabel: string
    verify: string
    view: string
    workflowFailed: string
    workflowHint: string
    working: string
  }
  teammateViewHeader: {
    viewing: string
  }
  teleport: {
    backgroundTask: string
    dirtyGitDir: string
    noCommits: string
    noRepoNotGitDir: string
    noRepoServerSide: string
    remoteTask: string
    requiresAuth: string
  }
  teleportError: {
    exit: string
    loginWithClaude: string
    subscriptionUsed: string
    teleportRequires: string
    title: string
  }
  teleportProgress: {
    checkingOut: string
    fetchingLogs: string
    gettingBranch: string
    teleporting: string
    validating: string
  }
  teleportRepoMismatch: {
    cancel: string
    noLongerContains: string
    openIn: string
    runFrom: string
    title: string
    use: string
    validating: string
  }
  teleportStash: {
    checkingGit: string
    error: string
    escape: string
    exit: string
    failedGetFiles: string
    failedStash: string
    filesChanged: string
    noChanges: string
    pressEscape: string
    stashAndContinue: string
    stashPrompt: string
    stashing: string
    title: string
    toCancel: string
    willSwitch: string
  }
  terminal: {
    moreLines: (count: number) => string
    moreLinesCompact: (count: number) => string
  }
  theme: {
    auto: string
    chooseStyle: string
    dark: string
    darkAnsi: string
    darkColorblind: string
    helpText: string
    letsGetStarted: string
    light: string
    lightAnsi: string
    lightColorblind: string
    themePickerDismissed: string
    themeSetTo: (t: string) => string
    title: string
  }
  thinkback: {
    editContentDesc: string
    fixErrorsDesc: string
    playAnimationDesc: string
    regenerateDescDesc: string
    relive: string
  }
  thinkingToggle: {
    cancel: string; desc: string
    confirm: string
    desc: string
    description: string
    disabled: string
    disabledDesc: string
    enabled: string
    enabledDesc: string
    exit: string
    hint: (shortcut: string) => string
    proceed: string
    title: string
    warning: string
  }
  tips: {
    agentFlag: string
    colorWhenMultiClauding: string
    colortermTruecolor: string
    continue: string
    customAgents: string
    customCommands: string
    defaultPermissionModeConfig: string
    desktopApp: string
    desktopShortcut: string
    doubleEsc: string
    doubleEscCodeRestore: string
    dragAndDropImages: string
    effortHighNudgeA: string
    effortHighNudgeB: string
    enterToSteerInRealtime: string
    feedbackCommand: string
    frontendDesignPlugin: string
    gitWorktrees: string
    guestPassesNoReward: string
    guestPassesWithReward: (amount: string) => string
    ideUpsellExternalTerminal: string
    imagePaste: (shortcut: string) => string
    importantClaudemd: string
    installGithubApp: string
    installSlackApp: string
    loopCommandNudgeA: string
    loopCommandNudgeB: string
    memoryCommand: string
    mobileApp: string
    newUserWarmup: string
    opusplanModeReminder: (shortcut: string) => string
    overageCredit: (amount: string) => string
    pasteImagesMac: string
    permissions: string
    planModeForComplexTasks: (shortcut: string) => string
    powershellToolEnv: string
    promptQueue: string
    renameConversation: string
    shiftEnterApple: string
    shiftEnterOther: string
    shiftEnterSetupApple: string
    shiftEnterSetupOther: string
    shiftTab: (shortcut: string) => string
    skillify: string
    statusLine: string
    subagentFanoutNudgeA: string
    subagentFanoutNudgeB: string
    terminalSetupApple: string
    terminalSetupOther: string
    themeCommand: string
    todoList: string
    vercelPlugin: string
    vscodeCommandInstall: (terminal: string) => string
    webApp: string
  }
  toolUI: {
    artifact: {
      uploadFailed: (error: string) => string
      uploaded: string
      expires: string
    },
    bash: {
      runInBackground: string
      running: string
      waiting: string
      imageDetected: string
      runningInBackground: string
      noOutput: string
      done: string
      runningDesc: (desc: string) => string
      blockedSleepPattern: (sleepPattern: string) => string
      commandAborted: string
      backgroundAuto: (params: { seconds: number; taskId: string; outputPath: string }) => string
      backgroundManual: (params: { taskId: string; outputPath: string }) => string
      backgroundRunning: (params: { taskId: string; outputPath: string }) => string
      killedForSize: (size: string) => string
      timedOut: (duration: string) => string
      commandAbortedBeforeExec: string
      monitorStreamEnded: (description: string) => string
      monitorScriptFailed: (params: { description: string; exitCode?: string }) => string
      monitorStopped: (description: string) => string
      bgCompleted: (params: { description: string; exitCode?: string }) => string
      bgFailed: (params: { description: string; exitCode?: string }) => string
      bgStopped: (description: string) => string
      stalledPrompt: (description: string) => string
      stalledHelp: string
      collapsedCompleted: (count: number) => string
      summaryPrefix: string
    },
    brief: {
      claude: string
      image: string
      file: string
    },
    config: {
      getting: (setting: string) => string
      settingTo: (setting: string, value: string) => string
      failed: (error: string) => string
      setTo: (setting: string, value: string) => string
      rejected: string
    },
    enterPlanMode: {
      entered: string
      description: string
      declined: string
    },
    enterWorktree: {
      creating: string
      switched: string
      onBranch: string
    },
    exitPlanMode: {
      exited: string
      submittedForApproval: string
      planFile: (path: string) => string
      waitingApproval: string
      approved: string
      savedToEdit: (path: string) => string
      noPlanFound: string
    },
    exitWorktree: {
      exiting: string
      kept: string
      removed: string
      onBranch: (branch: string) => string
      returnedTo: (cwd: string) => string
    },
    fileEdit: {
      nameUpdate: string
      nameUpdatedPlan: string
      nameCreate: string
      fileNotFound: string
      errorEditing: string
      planPreview: string
    },
    fileRead: {
      nameRead: string
      nameReadingPlan: string
      nameReadAgentOutput: string
      pages: (p: string) => string
      lines: (start: number, end: number) => string
      fromLine: (start: number) => string
      readImage: (size: string) => string
      noCells: string
      readCells: (count: number) => string
      readPdf: (size: string) => string
      readPages: (count: number) => string
      readLines: (count: number) => string
      unchanged: string
      fileNotFound: string
      errorReading: string
    },
    fileWrite: {
      nameWrite: string
      nameUpdatedPlan: string
      noContent: string
      wroteLines: (count: number, path: string) => string
      plusLines: (count: number) => string
      noChanges: string
      errorWriting: string
      planPreview: string
    },
    glob: {
      nameSearch: string
      pattern: (p: string) => string
      patternPath: (p: string, path: string) => string
      fileNotFound: string
      errorSearching: string
    },
    grep: {
      pattern: (p: string) => string
      patternPath: (p: string, path: string) => string
      foundLines: (count: number) => string
      foundMatches: (count: number, files: number) => string
      foundFiles: (count: number) => string
      across: (count: number) => string
      fileNotFound: string
      errorSearching: string
    },
    taskStop: {
      stopped: string
    },
    teamCreate: {
      create: (name: string) => string
    },
    teamDelete: {
      cleanup: string
    },
    remoteTrigger: {
      lines: (count: number) => string
    },
    listMcpResources: {
      fromServer: (server: string) => string
      all: string
      noResources: string
    },
    readMcpResource: {
      name: string
      read: (uri: string, server: string) => string
      noContent: string
    },
    cron: {
      scheduled: string
      cancelled: string
      noJobs: string
    },
    sendMessage: {
      approve: (to: string) => string
      reject: (to: string) => string
    },
    lsp: {
      name: string
      definition: string
      definitions: string
      reference: string
      references: string
      symbol: string
      symbols: string
      hoverInfo: string
      hoverAvailable: string
      implementation: string
      implementations: string
      callItem: string
      callItems: string
      caller: string
      callers: string
      callee: string
      callees: string
      result: string
      results: string
      found: string
      across: string
      acrossSuffix: string
      operationFailed: string
    },
    localMemoryRecall: {
      full: string
      error: (error: string) => string
      noStores: string
      stores: (stores: string) => string
      noEntries: (store: string) => string
      entries: (store: string, entries: string) => string
    },
    mcp: {
      running: string
      processing: (progress: number) => string
      sentMessage: string
      largeResponse: (tokens: string) => string
      image: string
      noContent: string
    },
    notebookEdit: {
      errorEditing: string
      updatedCell: string
    },
    powerShell: {
      running: string
      waiting: string
      imageDetected: string
      runningInBackground: string
      interrupted: string
      noOutput: string
    },
    skill: {
      initializing: string
      done: string
      loaded: string
      toolsAllowed: (count: number) => string
      moreToolUses: (count: number) => string
    },
    vaultHttpFetch: {
      error: (error: string) => string
    },
    webFetch: {
      fetching: string
      received: string
      receivedMeta: (code: string, codeText: string) => string
    },
    webSearch: {
      searching: (query: string) => string
      foundResults: (count: number, query: string) => string
      didSearch: (count: number, time: string) => string
      onlyAllowing: (domains: string) => string
      blockingDomains: (domains: string) => string
    },
    agent: {
      initializing: string
      prompt: string
      response: string
      remoteAgentLaunched: string
      backgroundedAgent: string
      toolUses: (count: number) => string
      tokens: (count: number) => string
      done: (summary: string) => string
      antOnlyApiCalls: (path: string) => string
      toolUseLabel: (count: number) => string
      inProgressPrefix: string
      expand: string
      manage: string
      moreToolUses: (count: number) => string
      backgroundAgentsLaunchedLabel: string
      agentsFinishedLabel: (type: string) => string
      runningAgentsPrefix: string
      runningAgentsLabel: (type: string) => string
      agent: string
    }},
  trust: {
    accessingWorkspace: string
    enterConfirm: string
    escCancel: string
    guide: string
    no: string
    onceTrusted: string
    title: string
    yes: string
  }
  tui: {
    actions: string
    absent: string
    navHint: string
    changesNextSession: string
    disabled: string
    disabledTitle: string
    dismissed: string
    enabled: string
    enabledTitle: string
    envForcedOff: (v: string) => string
    envForcedOn: (v: string) => string
    envNotSet: string
    envVarLabel: (v: string) => string
    flickerFreeDesc: string
    helpText: string; actions: string
    makePermanent: string
    markerFile: (s: string, p: string) => string
    markerRemoved: (p: string) => string
    markerWritten: (p: string) => string
    modeLabel: (m: string) => string
    off: string
    offDesc: string
    on: string
    onDesc: string
    present: string
    standardModeDesc: string
    status: string
    statusDesc: string
    statusTitle: string
    title: string
    toggle: string
    toggleDesc: string
    toDisable: string
    toReenable: string
    unknownSubcommand: (s: string) => string
    wasNotActive: string
  }
  ultrareview: {
    cancelOption: string
    launching: string
    overageMessage: string
    proceedBilling: string
  }
  usage: {
    currentSession: string
    currentWeekAll: string
    currentWeekSonnet: string
    error: string
    loading: string
    onlyAvailableForSubscriptions: string
  }
  vaultView: {
    active: string
    archived: string
    archivedAt: string
    archivedAtLabel: string
    created: string
    credentialAdded: string
    credentialArchived: string
    credentialsIn: (v: string, n: number) => string
    id: string
    name: string
    noCredentials: (v: string) => string
    noVaults: string
    noVaultsFound: string
    status: string
    valueMask: string
    valueMasked: string
    vaultArchived: string
    vaultCreated: string
    vaultDetail: string
    vaultLabel: string
    vaults: (n: number) => string
    vaultsCount: (n: number) => string
  }
  voice: {
    audioRecordingNotAvailable: string
    connectionFailed: string
    failedToStartCapture: string
    moduleNotLoaded: string
    noAudioDetected: string
    noSpeechDetected: string
    recordingFailedNoTool: string
    requiresAccount: string
    streamError: (error: string) => string
  }
  webFetchPermission: {
    noAndTell: string
    title: string
    yes: string
    yesDontAsk: (hostname: string) => string
  }
  weixin: {
    accountCleared: string
    alreadyConnected: string
    baseUrl: (u) => string
    connectedSince: (d) => string
    connectedSuccess: string
    disconnectHint: string
    invalidPairingCode: string
    loginFailed: (m) => string
    pairedSuccess: (id) => string
    restartHint: string
    scanQr: (url) => string
    serveUnavailable: string
    sessionEnablement: string
    startingLogin: string
    usage: string
    userId: (id) => string
  }
  welcome: {
  }
  workflowMultiselect: {
    cancel: string
    confirm: string
    moreExamples: string
    mustSelect: string
    navigate: string
    subtitle: string
    title: string
    toggle: string
    workflowClaude: string
    workflowReview: string
  }
  workflowPermission: {
    arguments: (args: string) => string
    executeWorkflow: (workflow: string) => string
    no: string
    title: string
    yes: string
    yesDontAsk: (toolName: string) => string
  }
  workspaceDir: {
    no: string
    permissionDesc: string
    placeholder: string
    title: string
    yesRemember: string
    yesSession: string
  }
  // round 2 conversion
  'assistantsessionchooser': {
    selectAssistantSession: string
    multipleSessionsFoundSelectOneToAttach: string
    navHint: string
  },
  'install': {
    checkingInstallationStatus: string
    cleaningUpOldNpmInstallations: string
    settingUpLauncherAndShellIntegration: string
    version: string
    location: string
    nextRun: string
    installationFailed: string
    tryRunningWithForceToOverrideChecks: string
  },
  'assistant': {
    noActiveAssistantSessionsFound: string
    startAssistantDaemon: string
    cancel: string
    inProcessTeam: string
  },
  'autofixprogress': {
    track: string
  },
  'bridge': {
    disconnectThisSession: string
    continue: string
  },
  'fast': {
    escToCancel: string
    fastMode: string
  },
  'commandsIde': {
    connectToAnIDEForIntegratedDevelopmentFeatures: string
    noteOnlyOneClaudeCodeInstanceCanBeConnectedToVSCodeAtATime: string
  },
  'authplanesummary': {
    anthropicAuthStatus: string
  },
  'logout': {
    successfullyLoggedOut: string
  },
  'manageplugins': {
    components: string
    thisHasTheSameEffectAsUninstallingWithoutAffectingOtherContributors: string
    deleteItAlongWithThePlugin: string
    remove: string
    errorPrefix: string
    toDelete: string
    toKeep: string
    toCancel: string
    typeToSearch: string
  },
  'unifiedinstalledcell': {
    plugin: string
    plugin2: string
    plugin3: string
  },
  'rateLimitOptions': {
    whatDoYouWantToDo: string
    upgradePlan: string
    stopAndWait: string
  },
  'remoteSetup': {
    connectClaudeOnTheWebToGitHub: string
    claudeOnTheWebRequiresConnectingToYourGitHubAccountToCloneAndPushCodeOnYourBehalf: string
    yourLocalCredentialsAreUsedToAuthenticateWithGitHub: string
    defaultTrustedNetwork: string
    continue: string
    cancel: string
    loginFailed: (codeUrl: string) => string
    invalidToken: string
    serverError: (status: string) => string
    networkError: string
  },
  'remotecontrolserver': {
    continue: string
  },
  'commandsThinkback': {
    editContent: string,
    editContentDesc: string,
    fixErrors: string,
    fixErrorsDesc: string,
    generateDesc: string,
    generateYour2025ClaudeCodeThinkBackTakesAFewMinutesToRun: string,
    playAnimation: string,
    playAnimationDesc: string,
    regenerate: string,
    regenerateDesc: string,
    relive: string,
    tryRunningPluginToManuallyInstallTheThinkBackPlugin: string},
  'webTools': {
    tabSwitchTab: string
    search: string
    tavilySearch: string
    anthropicWebSearch: string
    bingScrape: string
    braveSearch: string
    exaSearch: string
    tavilyExtract: string
    httpFetch: string
    fetch: string
    bsaPlaceholder: string
    exaPlaceholder: string
  },
  'bridgedialog': {
    remoteControl: string
  },
  'builtinstatusline': {
    session: string
    weekly: string
    cache: string
    skipTrustBlocked: string
  },
  'channeldowngradedialog': {
    switchToStableChannel: string
  },
  'consoleoauthflow': {
    documentation: string
    enter: string
    enter2: string
  },
  'contextvisualization': {
    contextUsage: string
    mCPTools: string
    loaded: string
    available: string
    loaded2: string
    available2: string
    customAgents: string
    memoryFiles: string
    skills: string
    toolCalls: string
    toolResults: string
    attachments: string
    assistantMessagesNonTool: string
    userMessagesNonToolResult: string
    tokens: string
    estimatedUsageByCategory: string
    freeSpace: string
    autocompactBuffer: string
    loadedOnDemand: string
    someLoadedOnDemand: string
    na: string
    antOnlySystemTools: string
    antOnlySystemPromptSections: string
    antOnlyMessageBreakdown: string
    antOnlyTopTools: string
    antOnlyTopAttachments: string
    callResults: (calls: string, results: string) => string
    collapseSpanSummarized: (count: number, spanWord: string, msgs: number) => string
    collapseStaged: (count: number) => string
    collapseNothingStaged: (count: number, spawnWord: string) => string
    collapseWaitingForFirstTrigger: string
    collapseErrors: string
    collapseSpawnsFailed: string
    collapseLastError: (error: string) => string
  },
  'effortcallout': {
    mediumRecommended: string
    medium: string
    high: string
    low: string
    xhigh: string
    max: string
  },
  'globalsearchdialog': {
    globalSearch: string
    openInEditor: string
  },
  'historysearchdialog': {
    searchPrompts: string
    use: string
    filterHistory: string
    moreLines: (n: number) => string
  },
  'ideautoconnectdialog': {
    doYouWishToEnableAutoConnectToIDE: string
    doYouWishToDisableAutoConnectToIDE: string
  },
  'invalidconfigdialog': {
    configurationError: string
    chooseAnOption: string
  },
  'invalidsettingsdialog': {
    settingsError: string
  },
  teamMem: {
    recalling: string
    recallingLower: string
    recalled: string
    recalledLower: string
    searching: string
    searchingLower: string
    searched: string
    searchedLower: string
    writing: string
    writingLower: string
    wrote: string
    wroteLower: string
    team: string
  },
  'logselector': {
    renameSession: string
    searchFailed: string
    enterNewSessionName: string
    claudeFoundResults: string
    noMatchingSessions: string
    currentWorktree: string
  },
  'mcpserverdialogcopy': {
    mCPDocumentation: string
  },
  'messageselector': {
    nothingToRewindToYet: string
    noCodeChanges: string
    theCodeWillBeUnchanged: string
    theCodeHasNotChangedNothingWillBeRestored: string
  },
  'quickopendialog': {
    quickOpen: string
    mention: string
    insertPath: string
    openInEditor: string
    loading: string
  },
  'remotecallout': {
    remoteControl: string
    youCanDisconnectRemoteAccessAnytimeByRunningRemoteControlAgain: string
  },
  settingSourceDisplay: {
    user: string
    project: string
    local: string
    flag: string
    managed: string
    plugin: string
    builtin: string
    sourceNameUser: string
    sourceNameProject: string
    sourceNameProjectGitignored: string
    sourceNameCliFlag: string
    sourceNameManaged: string
    userSettings: string
    sharedProjectSettings: string
    projectLocalSettings: string
    cliArgs: string
    enterpriseManaged: string
    cliArg: string
    commandConfiguration: string
    currentSession: string
    userSettingsCap: string
    sharedProjectSettingsCap: string
    projectLocalSettingsCap: string
    cliArgsCap: string
    enterpriseManagedCap: string
    cliArgCap: string
    commandConfigurationCap: string
    currentSessionCap: string
  },
  'resumetask': {
    checkYourInternetConnection: string
    teleportRequiresAClaudeAccount: string
    sorryClaudeEncounteredAnError: string
    sorryClaudeCodeEncounteredAnError: string
    updated: string
    sessionTitle: string
    errorLoading: string
    noSessions: string
    forRepo: (repo: string) => string
    selectSession: string
    loginHint: string
  },
  'searchextratoolshint': {
    toolRecommendation: string
  },
  'componentsStats': {
    shotDistribution: string
    noModelUsageDataAvailable: string
    tokensPerDay: string
    activeDays: 'string',
    currentStreak: 'string',
    day: 'string',
    days: 'string',
    dialogDismissed: string
    failedToLoad: 'string',
    favoriteModel: 'string',
    favoriteColon: string
    hint: 'string',
    inColon: string
    last7Days: string
    last30Days: string
    allTime: string
    loading: 'string',
    loadingStats: 'string',
    longestSession: 'string',
    longestStreak: 'string',
    peakHour: string
    speculationSaved: string
    shotBucket1: string
    shotBucket2_5: string
    shotBucket6_10: string
    shotBucket11: string
    avgPerSession: string
    statsFromLastDays: (days: number) => string
    totalColon: string
    outColon: string
    models: 'string',
    mostActiveDay: 'string',
    noStats: 'string',
    overview: 'string',
    sessions: 'string',
    totalTokens: 'string',
    scrollHint: string},
  'thinkingtoggle': {
    doYouWantToProceed: string
  },
  'workflowmultiselectdialog': {
    selectGitHubWorkflowsToInstall: string
    weLlCreateAWorkflowFileInYourRepositoryForEachOneYouSelect: string
    youMustSelectAtLeastOneWorkflowToContinue: string
  },
  'worktreeexitdialog': {
    exitingWorktreeSession: string
  },
  'pluginhintmenu': {
    pluginRecommendation: string
    plugin: string
    marketplace: string
    wouldYouLikeToInstallIt: string
    yesInstallPrefix: string
    noAndDontShowAgain: string
    commandSuggestsInstallingPrefix: string
    commandSuggestsInstallingSuffix: string
  },
  'desktopupsellstartup': {
    tryClaudeCodeDesktop: string
    sameClaudeCodeWithVisualDiffsLiveAppPreviewParallelSessionsAndMore: string
  },
  'effortpanel': {
    faster: string
    smarter: string
    title: string
    sublabelUltracode: string
    envOverride: (value: string) => string
  },
  'feedbacksurvey': {
    thanksForTheFeedback: string
    useIssueToReportModelBehaviorIssues: string
  },
  'transcriptshareprompt': {
    canAnthropicLookAtYourSessionTranscriptToHelpUsImproveClaudeCode: string
    yes: string
    no: string
    dontAskAgain: string
  },
  'helpv2': {
    browseDefaultCommands: string
    browseCustomCommands: string
    noCustomCommandsFound: string
    browseAntOnlyCommands: string
    forMoreHelp: string
    toCancel: (shortcut: string) => string
  },
  'logov2': {
    debugModeEnabled: string
  },
  'lsprecommendationmenu': {
    lSPPluginRecommendation: string
    lSPProvidesCodeIntelligenceLikeGoToDefinitionAndErrorChecking: string
    plugin: string
    triggeredBy: string
    wouldYouLikeToInstallThisLSPPlugin: string
  },
  'managedsettingssecuritydialog': {
    managedSettingsRequireApproval: string
    settingsRequiringApproval: string
  },
  'passes': {
    escToCancel: string
    guestPassesAreNotCurrentlyAvailable: string
    escToCancel2: string
  },
  'promptinput': {
    optionAsMeta: string
  },
  'promptinputfooter': {
    noOtherPipesFoundStartAnotherInstance: string
  },
  'statusComponent': {
    systemDiagnostics: string
  },
  statusSession: {
    renameToAddName: string
  },
  'settingsUsage': {
    unlimited: string
    currentSession: 'string',
    currentWeekAll: 'string',
    currentWeekSonnet: 'string',
    error: 'string',
    failedToLoad: (responseBody?: string) => string,
    loading: 'string',
    onlyAvailableForSubscriptions: 'string',
    sessionStats: string,
    sessionTokens: (input: string, output: string, cacheRead: string, cacheWrite: string) => string,
    sessionWebSearch: (count: string) => string},
  'diffdetailview': {
    noDiffContent: string
  },
  'diffdialog': {
    enterView: string
    sourceNav: string
    upDownSelect: string
    close: (shortcut: string) => string
    back: string
    uncommittedChanges: string
    gitDiffHead: string
    current: string
    turn: (index: number) => string
    dismissed: string
  },
  'difffilelist': {
    noChangedFiles: string
  },
  'capabilitiessection': {
    capabilities: string
  },
  'mcpagentservermenu': {
    uRL: string
    command: string
    usedBy: string
    status: string
    auth: string
    thisServerConnectsOnlyWhenRunningTheAgent: string
  },
  'mcplistpanel': {
    agentMCPs: string
  },
  'mcpremoteservermenu': {
    ifYourBrowserDoesnAposTOpenAutomaticallyCopyThisURLManually: string
    returnHereAfterAuthenticatingInYourBrowserPressEscToGoBack: string
    ifYourBrowserDoesnAposTOpenAutomaticallyCopyThisURLManually2: string
    enter: string
    findTheMCPServerInTheBrowserAndClickQuotDisconnectQuot: string
    ifYourBrowserDidnAposTOpenAutomaticallyCopyThisURLManually: string
    enter2: string
    enter3: string
    thisMayTakeAFewMoments: string
    status: string
    auth: string
    uRL: string
    configLocation: string
    tools: string
  },
  'mcpstdioservermenu': {
    thisMayTakeAFewMoments: string
    status: string
    command: string
    args: string
    configLocation: string
    tools: string
    reconnectingToPrefix: string
    restartingProcess: string
  },
  'mcptooldetailview': {
    toolName: string
    fullName: string
    description: string
    parameters: string
    readOnly: string
    destructive: string
    openWorld: string
    required: string
    failedToLoadDescription: string
  },
  'mcptoollistview': {
    noToolsAvailable: string
  },
  'mcpparsingwarnings': {
    location: string
    mCPConfigDiagnostics: string
  },
  'submitquestionsview': {
    reviewYourAnswers: string
    readyToSubmitYourAnswers: string
  },
  'bashpermissionrequest': {
    ctrlDToHideDebugInfo: string
  },
  'enterplanmodepermissionrequest': {
    enterPlanMode: string
    inPlanModeClaudeWill: string
    noCodeChangesWillBeMadeUntilYouApproveThePlan: string
  },
  'exitplanmodepermissionrequest': {
    wouldYouLikeToProceed: string
    exitPlanMode: string
    readyToCode: string
    requestedPermissions: string
    claudeHasWrittenUpAPlanAndIsReadyToExecuteWouldYouLikeToProceed: string
  },
  'powershellpermissionrequest': {
    powerShellCommand: string
    ctrlDToHideDebugInfo: string
  },
  'reviewartifactpermissionrequest': {
    reviewArtifact: string
  },
  'permissionruledescription': {
    anyBashCommand: string
  },
  'permissionrulelist': {
    permissions: string
    recentlyDenied: string
    allow: string
    workspace: string
  },
  'skillsmenu': {
    skills: string
    noSkillsFound: string
    skills2: string
  },
  'teamstatus': {
    enterToView: string
  },
  'teamsdialog': {
    noTeammates: string
    tasks: string
    prompt: string
  },
  'ultraplanchoicedialog': {
    ultraplanApproved: string
    howShouldThePlanBeImplemented: string
  },
  'ultraplanlaunchdialog': {
    runUltraplanInTheCloud: string
  },
  'agentdetail': {
    allTools: string
    description: string
    tools: string
    model: string
    permissionMode: string
    memory: string
    hooks: string
    skills: string
    color: string
    systemPrompt: string
  },
  'agentslist': {
    createNewAgent: string
    noAgentsFound: string
    noAgentsFoundCreateSpecializedSubagentsThatClaudeCanDelegateTo: string
    eachSubagentHasItsOwnContextWindowCustomSystemPromptAndSpecificTools: string
    builtInAgents: string
  },
  'agentsmenu': {
    deleteAgent: string
  },
  'colorpicker': {
    automaticColor: string
    preview: string
  },
  'modelselector': {
    modelDeterminesTheAgentAposSReasoningCapabilitiesAndSpeed: string
  },
  wizard: {
    defaultTitle: string
  }
  'createagentwizard': {
    createNewAgent: string
  },
  'colorstep': {
    chooseBackgroundColor: string
  },
  'confirmstep': {
    memory: string
    confirmAndSave: string
    location: string
    tools: string
    model: string
    description: string
    systemPrompt: string
    warnings: string
    errors: string
    enter: string
    name: string
  },
  'descriptionstep': {
    descriptionTellClaudeWhenToUseThisAgent: string
    whenShouldClaudeUseThisAgent: string
  },
  'locationstep': {
    chooseLocation: string
  },
  'memorystep': {
    configureAgentMemory: string
  },
  'methodstep': {
    creationMethod: string
  },
  'modelstep': {
    selectModel: string
  },
  'promptstep': {
    systemPrompt: string
    enterTheSystemPromptForYourAgent: string
    beComprehensiveForBestResults: string
    youAreAHelpfulCodeReviewerWho: string
  },
  'toolsstep': {
    selectTools: string
  },
  'typestep': {
    agentTypeIdentifier: string
    enterAUniqueIdentifierForYourAgent: string
  },
  'selecteventmode': {
    hooks: string
    learnMore: string
    subtitle: (n: number) => string
    hooksRestrictedByPolicy: string
    managedSettingsOnly: string
    readOnly: string
  },
  'selecthookmode': {
    escToGoBack: string
    noHooksConfiguredForThisEvent: string
    toAddHooksEditSettingsJsonDirectlyOrAskClaude: string
  },
  'selectmatchermode': {
    escToGoBack: string
    noHooksConfiguredForThisEvent: string
    toAddHooksEditSettingsJsonDirectlyOrAskClaude: string
  },
  'viewhookmode': {
    escToGoBack: string
    hookDetails: string
    toModifyOrRemoveThisHookEditSettingsJsonDirectlyOrAskClaudeToHelp: string
  },
  'advisormessage': {
    advising: string
  },
  'assistanttextmessage': {
    weAreExperiencingHighDemandForOpus4: string
  },
  'attachmentmessage': {
    taskAssigned: string
    discoveredTools: string
  },
  'hookprogressmessage': {
    running: string
  },
  'planapprovalmessage': {
    planApprovalRequestFrom: (from: string) => string
    youCanNowProceedWithImplementationYourPlanModeRestrictionsHaveBeenLifted: string
    pleaseReviseYourPlanBasedOnTheFeedbackAndCallExitPlanModeAgain: string
    planApprovedBy: (senderName: string) => string
    planRejectedBy: (senderName: string) => string
    planApprovalRequestSummary: (from: string) => string
    planApprovedSummary: string
    planRejectedSummary: (feedback?: string) => string
    agentIdle: string
    completedStatus: string
    taskCompletedSummary: (taskId: string, status: string) => string
    lastDmSummary: (summary: string) => string
  },
  'shutdownmessage': {
    teammateIsContinuingToWorkYouMayRequestShutdownAgainLater: string
  },
  'systemtextmessage': {
    allBackgroundAgentsStopped: string
    allowed: string
    workedVerb: string
  },
  hookPanel: {
    ran: (count: number, label: string) => string
    hookSingular: string
    hookPlural: string
    stop: string
    hookError: (hookLabel: string) => string
  },
  'rejectedplanmessage': {
    userRejectedClaudeAposSPlan: string
  },
  'rejectedtoolusemessage': {
    toolUseRejected: string
  },
  'usertoolsuccessmessage': {
    allowedByAutoModeClassifier: string
  },
  'sandboxconfigtab': {
    sandboxIsNotEnabled: string
  },
  'sandboxdoctorsection': {
    sandbox: string
  },
  'sandboxoverridestab': {
    sandboxIsNotEnabledEnableSandboxToConfigureOverrideSettings: string
    configureOverrides: string
  },
  'sandboxsettings': {
    overrides: string
    config: string
    dependencies: string
    dependencies2: string
    sandbox: string
    cannotBlockUnixDomainSocketsSeeDependenciesTab: string
    configureMode: string
  },
  'usereplbridge': {
    remoteControlFailed: string
  },
  'repl': {
    howWellDidClaudeUseItsMemoryOptional: string
  },
  'remoteagenttask': {
    remoteReviewCompleted: string
  },
  'preflightchecks': {
    checkingConnectivity: string
    unableToConnectToAnthropicServices: string
  },
  'it2setupprompt': {
    thisEnablesTeammatesToAppearAsSplitPanesWithinYourCurrentWindow: string
    thisMayTakeAMoment: string
    installationFailed: string
    teammatesWillNowAppearAsSplitPanes: string
    verificationFailed: string
    makeSure: string
    escToCancel: string
  },
  'workflowspanel': {
    pressYToConfirmOrNEscToCancel: string
  },
  'autonomy': {
    autoMode: string,
    autoModeDesc: string,
    cron: string,
    cronDesc: string,
    flowsSummary: string,
    flowsSummaryDesc: string,
    fullDeepStatus: string,
    fullDeepStatusDesc: string,
    navHint: string,
    overview: string,
    overviewDesc: string,
    pipes: string,
    pipesDesc: string,
    recentFlows: string,
    recentFlowsDesc: string,
    recentRuns: string,
    recentRunsDesc: string,
    remoteControl: string,
    remoteControlDesc: string,
    remoteTrigger: string,
    remoteTriggerDesc: string,
    resumeWaitingFlow: string,
    runsSummary: string,
    runsSummaryDesc: string,
    runtime: string,
    runtimeDesc: string,
    teams: string,
    teamsDesc: string,
    workflowRuns: string,
    workflowRunsDesc: string},

  advisorMessages: {
    advisorAlreadyUnset: string,
    advisorDisabledWas: (prev: string) => string,
    advisorInactive: (current: string, baseModel: string) => string,
    advisorNotSet: string,
    advisorSet: (model: string) => string,
    advisorSetWarning: (model: string, baseModel: string) => string,
    advisorStatus: (current: string) => string,
    cannotUseAsAdvisor: (arg: string, resolvedModel: string) => string,
    invalidAdvisorModel: (error: string) => string,
    unknownModel: (arg: string, resolvedModel: string) => string},
  attachCmd: {
    alreadyAttached: (target: string) => string,
    attachRejected: (target: string, reason: string) => string,
    attachTimedOut: (target: string) => string,
    attachedAsMaster: (target: string, slaveCount: number) => string,
    controlledByMaster: string,
    failedToConnect: (target: string, tcpSuffix: string, reason: string) => string,
    tcpEndpoint: (host: string, port: number) => string,
    unknownReason: string,
    usage: string},
  branchCmd: {
    branchedConversationResume: (titleInfo: string, sessionId: string) => string,
    branchedConversationSuccess: (titleInfo: string, resumeHint: string) => string,
    branchedConversationTitle: string,
    failedToBranch: (message: string) => string,
    noConversationToBranch: string,
    noMessagesToBranch: string,
    toResumeOriginal: (sessionId: string) => string},
  claimMain: {
    allSubsBound: string,
    alreadyMain: string,
    machineId: (id: string) => string,
    mainClaimed: string,
    pipeName: (name: string) => string,
    pipeServerNotStarted: string,
    previousMain: (id: string) => string,
    usePipesVerify: string},
  commitPushPr: {
    progressMessage: string},
  contextCmd: {
    autocompactBuffer: string,
    breakdownAssistantMessages: (tokens: string) => string,
    breakdownAttachments: (tokens: string) => string,
    breakdownToolCalls: (tokens: string) => string,
    breakdownToolResults: (tokens: string) => string,
    breakdownUserMessages: (tokens: string) => string,
    categoryTableHeader: string,
    collapseErrors: string,
    collapseIdle: string,
    consecutiveEmptyRuns: string,
    contextStrategy: string,
    customAgentsHeader: string,
    customAgentsSection: string,
    estimatedUsageSection: string,
    freeSpace: string,
    last: string,
    mcpToolsHeader: string,
    mcpToolsSection: string,
    memoryFilesHeader: string,
    memoryFilesSection: string,
    messageBreakdownHeader: string,
    messageBreakdownSection: string,
    modelLabel: string,
    skillsHeader: string,
    skillsSection: string,
    sourceBuiltin: string,
    sourceFlag: string,
    sourceLocal: string,
    sourcePlugin: string,
    sourcePolicy: string,
    sourceProject: string,
    sourceUser: string,
    spanStaged: (count: number) => string,
    spansSummarized: (count: number, messages: number) => string,
    spawnsFailed: string,
    spawnsNothingStaged: (count: number) => string,
    systemPromptSectionsHeader: string,
    systemPromptSectionsSection: string,
    systemToolsHeader: string,
    systemToolsSection: string,
    title: string,
    tokensLabel: string,
    topAttachmentsHeader: string,
    topAttachmentsSection: string,
    topToolsHeader: string,
    topToolsSection: string,
    waitingForFirstTrigger: string},
  costCmd: {
    antOnlyCost: (cost: string) => string,
    usingOverage: string,
    usingSubscription: string},
  debugToolCall: {
    input: string,
    lastToolCallsTitle: (count: number, total: number) => string,
    logFileNotFound: (path: string) => string,
    noPairsFound: (path: string) => string,
    noToolCallsYet: string,
    output: string,
    title: string,
    toolCallsAppearAfter: string},
  detachCmd: {
    controlledByMaster: string,
    detachedAll: (count: number, names: string) => string,
    detachedFromTarget: (target: string) => string,
    notAttachedToAny: string,
    notAttachedToTarget: (target: string) => string},
  envCmd: {
    envVarsTitle: string,
    na: string,
    noEnvVars: string,
    runtimeBun: (v: string) => string,
    runtimeCwd: (c: string) => string,
    runtimeNode: (v: string) => string,
    runtimePid: (n: string) => string,
    runtimePlatform: (p: string, arch: string) => string,
    runtimeSession: (id: string) => string,
    runtimeTitle: string,
    secretsNote: string},
  extraUsage: {
    alreadySubmitted: string,
    contactAdmin: string,
    failedOpenBrowser: (url: string) => string,
    requestSentEnable: string,
    requestSentIncrease: string,
    unlimitedExtraUsage: string},
  filesCmd: {
    filesInContext: (fileList: string) => string,
    noFilesInContext: string},
  forceSnip: {
    noMessagesToSnip: string,
    snipBoundary: string,
    snippedCount: (n: number) => string},
  historyCmd: {
    noSessionHistory: (targetName: string) => string,
    noSubSessions: string,
    notAttached: (targetName: string) => string,
    notInMasterMode: string,
    sessionHistoryHeader: (targetName: string, count: number, total: number) => string,
    typeDone: string,
    typeError: string,
    typePrompt: string,
    typePromptAck: string,
    typeStream: string,
    typeToolResult: string,
    typeToolStart: string,
    usageWithSessions: (names: string) => string},
  initCmd: {
    descNew: string,
    descOld: string,
    progressMessage: string},
  installCmd: {
    completedSuccessfully: string,
    failed: string,
    installingNativeBuild: (v: string) => string,
    lockFailed: string,
    setupNotes: string,
    successfullyInstalled: string,
    toGetStarted: string},
  issueCmd: {
    assigneeRequiresValue: string,
    couldNotReadSessionLog: string,
    createdViaIssue: string,
    errorPrefix: (msg: string) => string,
    failedToCreate: string,
    fileGitHubIssue: string,
    fullBodySaved: (path: string) => string,
    ghAvailable: string,
    ghNoDiscussions: string,
    installGh: string,
    installGhNoBrowser: string,
    issueAssignees: (assignees: string) => string,
    issueCreated: string,
    issueError: (msg: string) => string,
    issueLabels: (labels: string) => string,
    issueTitle: (title: string) => string,
    issueUrl: (url: string) => string,
    issuesDisabled: (owner: string, repo: string) => string,
    issuesDisabledHint: string,
    labelRequiresValue: string,
    makeSureLoggedIn: string,
    newIssueUrl: (url: string) => string,
    noConversationContent: string,
    noGitHubRemote: string,
    noRemoteDetected: string,
    noRemoteDetectedDir: string,
    noSessionLogFound: string,
    openInBrowser: (url: string) => string,
    recentErrorsHeader: string,
    repoInfo: (owner: string, repo: string) => string,
    runFromDirWithRemote: string,
    sessionContextHeader: string,
    truncatedBody: string,
    unknownFlag: (flag: string) => string,
    usageExample: string,
    usageExample1: string,
    usageExample2: string,
    usageLine: string},
  keybindingsCmd: {
    createdNew: (path: string) => string,
    notEnabled: string,
    openFailed: (opened: boolean, path: string, error: string) => string,
    openedExisting: (path: string) => string},
  peersCmd: {
    cwdLine: (cwd: string) => string,
    hoursMinutesAgo: (hours: number, minutes: number) => string,
    interactive: string,
    messageHint: string,
    minutesAgo: (minutes: number) => string,
    noPeers: string,
    notStarted: string,
    peerLine: (status: string, pid: number, label: string, cwd: string, age: string) => string,
    peersCount: (count: number) => string,
    reachable: string,
    secondsAgo: (seconds: number) => string,
    sessionLine: (sessionId: string) => string,
    socketLine: (socket: string) => string,
    startedLine: (age: string) => string,
    unreachable: string,
    yourSocket: (socket: string) => string},
  perfIssue: {
    addDescription: string,
    arrayBuffers: (v: string) => string,
    bun: (v: string) => string,
    cacheCreation: (v: string) => string,
    cacheHitRate: (rate: string) => string,
    cacheRead: (v: string) => string,
    costEstimateSection: string,
    cpuSection: string,
    cpuSystem: (v: string) => string,
    cpuUser: (v: string) => string,
    detectedModel: (m: string) => string,
    estimatedCost: (c: string) => string,
    external: (v: string) => string,
    failedToWrite: (msg: string) => string,
    footerLine1: string,
    footerLine2: string,
    heapTotal: (v: string) => string,
    heapUsed: (v: string) => string,
    inputTokens: (v: string) => string,
    logNotFound: (path: string) => string,
    memorySection: string,
    noTimingData: string,
    noToolCalls: string,
    node: (v: string) => string,
    notesSection: string,
    outputTokens: (v: string) => string,
    pid: (pid: string) => string,
    placeholderLine: string,
    platform: (p: string, a: string) => string,
    rss: (v: string) => string,
    session: (id: string) => string,
    snapshotWritten: (path: string, format: string) => string,
    timestamp: (ts: string) => string,
    title: string,
    tokenUsageSection: string,
    toolAvgExecutionSection: string,
    toolCallCountsSection: string,
    totalLogEntries: (v: string) => string,
    totalTokens: (v: string) => string,
    turns: (v: string) => string,
    unknownCost: string,
    unknownModel: string,
    uptime: (u: string) => string,
    wallClockSeconds: (v: string) => string},
  cacheWarning: {
    main: (hitRate: number, threshold: number) => string,
    trend: (icon: string, percent: number) => string,
    label: (rate: number) => string,
    belowThreshold: (threshold: number) => string},
  selectionCopy: {
    native: (n: number) => string,
    tmux: (n: number) => string,
    osc52: (n: number) => string},
  copyCmd: {
    copiedToClipboard: (n: number, lines: number) => string,
    copiedToClipboardAndFile: (n: number, lines: number, path: string) => string},
  pipeStatus: {
    cmdDetach: string,
    cmdHistory: string,
    cmdSend: string,
    commandsHeading: string,
    connected: string,
    connectedLine: (time: string) => string,
    controlledMode: (role: string, attachedBy: string) => string,
    disconnected: string,
    historyLine: (count: number) => string,
    mainMode: string,
    masterHeader: (count: number) => string,
    masterNoSubs: string,
    statusLine: (status: string, connected: string) => string},
  pipesCmd: {
    alive: string,
    cmdAll: string,
    cmdClaimMain: string,
    cmdDeselect: string,
    cmdNone: string,
    cmdSelect: string,
    cmdSend: string,
    commandsHeading: string,
    connected: string,
    controlledBy: (attachedBy: string) => string,
    deselected: (pipeName: string) => string,
    deselectedAll: string,
    host: (hostname: string) => string,
    ip: (ip: string) => string,
    lanPeerEntry: (checkbox: string, role: string, pipeName: string, hostname: string, ip: string, endpoint: string) => string,
    lanPeersHeading: string,
    lanPeersNone: string,
    machineId: (id: string) => string,
    mainEntry: (pipeName: string, hostname: string, ip: string, alive: string, suffix: string) => string,
    mainMachine: (id: string, suffix: string) => string,
    noOtherPipes: string,
    notStarted: string,
    role: (role: string) => string,
    selected: (pipeName: string) => string,
    selectedAll: (count: number) => string,
    selectedList: (list: string) => string,
    selectedNone: string,
    stale: string,
    subEntry: (checkbox: string, subIndex: number, pipeName: string, hostname: string, ip: string, alive: string, attached: string, suffix: string) => string,
    thisMachine: string,
    usageDeselect: string,
    usageSelect: string,
    you: string,
    yourPipe: (name: string) => string},
  poorCmd: {
    disabledDetails: string,
    off: string,
    on: string,
    restoredDetails: string,
    statusMsg: (status: string, details: string) => string},
  prComments: {
    progressMessage: string},
  providerCmd: {
    cleared: string,
    currentProvider: (p: string) => string,
    invalid: (arg: string, valid: string) => string,
    set: (p: string) => string,
    setEnv: (p: string) => string,
    switchedGeminiMissing: string,
    switchedGrokMissing: string,
    switchedOpenaiMissing: (missing: string) => string},
  recapCmd: {
    cancelled: string,
    failed: string,
    nothingToRecap: string},
  releaseNotes: {
    changelogLink: (url: string) => string,
    versionHeader: (version: string) => string},
  reloadPlugins: {
    agent: (n: number) => string,
    errorNoun: (n: number) => string,
    errorsDuringLoad: (countWithNoun: string) => string,
    hook: (n: number) => string,
    plugin: (n: number) => string,
    pluginLspServer: (n: number) => string,
    pluginMcpServer: (n: number) => string,
    reloaded: (list: string) => string,
    skill: (n: number) => string},
  pluginErrors: {
    pathNotFound: (component: string, path: string) => string,
    gitAuthFailed: (authType: string, url: string) => string,
    gitTimeout: (operation: string, url: string) => string,
    networkError: (url: string, details?: string) => string,
    manifestParseError: (path: string, e: string) => string,
    manifestValidationError: (path: string, errors: string) => string,
    pluginNotFound: (id: string, marketplace: string) => string,
    marketplaceNotFound: (marketplace: string) => string,
    marketplaceLoadFailed: (marketplace: string, reason: string) => string,
    mcpConfigInvalid: (serverName: string, error: string) => string,
    mcpServerSuppressedDuplicate: (serverName: string, dup: string) => string,
    hookLoadFailed: (hookPath: string, reason: string) => string,
    componentLoadFailed: (component: string, path: string, reason: string) => string,
    mcpbDownloadFailed: (url: string, reason: string) => string,
    mcpbExtractFailed: (mcpbPath: string, reason: string) => string,
    mcpbInvalidManifest: (mcpbPath: string, error: string) => string,
    marketplaceBlockedByPolicy: (marketplace: string, reason: string) => string,
    dependencyUnsatisfied: (dep: string, reason: string) => string,
    lspConfigInvalid: (serverName: string, error: string) => string,
    lspServerStartFailed: (serverName: string, reason: string) => string,
    lspServerCrashed: (serverName: string, detail: string) => string,
    lspRequestTimeout: (serverName: string, method: string, ms: number) => string,
    lspRequestFailed: (serverName: string, method: string, error: string) => string,
    pluginCacheMiss: (plugin: string, installPath: string) => string,
    mcpServerSuppressedDuplicatePlugin: (serverName: string, plugin: string) => string,
    mcpServerSuppressedDuplicateConfig: (serverName: string, dup: string) => string,
    hookLoadError: (reason: string) => string,
    componentLoadError: (component: string, path: string, reason: string) => string,
    lspCrashedSignal: (plugin: string, serverName: string, signal: string) => string,
    lspCrashedExitCode: (plugin: string, serverName: string, code: string) => string,
    blockedByBlocklist: (marketplace: string) => string,
    notInAllowedList: (marketplace: string) => string,
    depNotEnabled: (dep: string) => string,
    depNotInstalled: (dep: string) => string,
    localPluginCannotUpdate: (source: string) => string,

    guidance: {
      pathNotFound: string,
      gitAuthFailedSsh: string,
      gitAuthFailedHttps: string,
      gitTimeout: string,
      manifestParseError: string,
      manifestValidationError: string,
      pluginNotFound: (marketplace: string) => string,
      marketplaceNotFoundAvailable: (list: string) => string,
      marketplaceNotFound: string,
      mcpConfigInvalid: string,
      mcpServerSuppressedDuplicatePlugin: (plugin: string) => string,
      mcpServerSuppressedDuplicateConfig: (dup: string) => string,
      hookLoadFailed: string,
      componentLoadFailed: (component: string) => string,
      mcpbDownloadFailed: string,
      mcpbExtractFailed: string,
      mcpbInvalidManifest: string,
      blockedByBlocklist: string,
      allowedSources: (list: string) => string,
      contactAdmin: string,
      depNotEnabled: (dep: string) => string,
      depNotInstalled: (dep: string) => string,
      lspConfigInvalid: string,
      lspServerCheckLogs: string,
      pluginCacheMiss: string}},
  shareCmd: {
    contentSummaryOnly: string,
    errorLabel: (msg: string) => string,
    expectedPath: (p: string) => string,
    failedPrepare: (msg: string) => string,
    failedShare: string,
    installGhCli: string,
    installGhCliHint: string,
    logFile: (p: string) => string,
    logNotWrittenYet: string,
    makeSureLoggedIn: string,
    method: (m: string) => string,
    noConversationContent: string,
    orUseFallback: string,
    privacyNote: string,
    privacyNote1: string,
    privacyNote2: string,
    runGhCommand: (p: string) => string,
    secretsMasked: string,
    session: (id: string) => string,
    sessionLogNotFound: string,
    sessionShared: string,
    shareSessionLog: string,
    thenRun: string,
    urlLabel: (url: string) => string,
    usage: string,
    unexpectedGistOutput: (url: string) => string,
    unexpected0x0Output: (output: string) => string,
    visibility: (v: string) => string},
  statuslineCmd: {
    createAgent: (toolName: string, prompt: string) => string,
    defaultPrompt: string,
    progressMessage: string},
  subscribePr: {
    alreadySubscribed: (ref: string, since: string) => string,
    listLine: (ref: string, since: string) => string,
    listTitle: string,
    noRepoDetected: string,
    noSubscriptions: string,
    notFound: (ref: string) => string,
    subscribed: (ref: string) => string,
    unrecognised: (ref: string) => string,
    unsubscribed: (ref: string) => string},
  summaryCmd: {
    empty: string,
    failedGenerate: (err: string) => string,
    noMessages: string,
    unknownError: string,
    updated: (content: string) => string},
  thinkbackPlay: {
    notInstalled: string,
    pathNotFound: string},
  vimCmd: {
    editorModeSet: (mode: string) => string,
    normalHint: string,
    vimHint: string},
  voiceCmd: {
    disabled: string,
    enabled: (provider: string, key: string) => string,
    guidanceLinux: string,
    guidanceMac: string,
    guidanceWindows: string,
    installHintCmd: (cmd: string) => string,
    installSoX: string,
    langNoteCode: (code: string) => string,
    langNoteFallback: (lang: string) => string,
    micDenied: (guidance: string) => string,
    noAudioTool: string,
    notAvailable: string,
    notAvailableEnv: string,
    requiresLogin: string,
    switchedAnthropic: (key: string) => string,
    switchedDoubao: (key: string) => string,
    updateFailed: string},

  bridgeKick: {
    calledReconnect: string,
    description: string,
    fatalPoll: (status: number, errorType: string) => string,
    firedClose: (code: number) => string,
    heartbeatFatal: (status: number) => string,
    needNumericCode: (usage: string) => string,
    needStatusCode: (usage: string) => string,
    noDebugHandle: string,
    reconnectSession: string,
    registerFatal: string,
    registerTransient: (n: number) => string,
    transientPoll: string,
    usage: string},
  heapdumpCmd: {
    failed: (error: string) => string,
    success: (heapPath: string, diagPath: string) => string},
  installSlackApp: {
    failedToOpen: (url: string) => string,
    opening: string},
  sendCmd: {
    connectionClosed: (name: string) => string,
    failedToSend: (name: string, err: string) => string,
    notAttached: (name: string) => string,
    notMasterMode: string,
    sent: (name: string, msg: string) => string,
    usage: string},
  stickersCmd: {
    failedToOpen: (url: string) => string,
    opening: string},

  hooksEvent: {
    configChangeDescription: string,
    configChangeSummary: string,
    cwdChangedDescription: string,
    cwdChangedSummary: string,
    elicitationDescription: string,
    elicitationResultDescription: string,
    elicitationResultSummary: string,
    elicitationSummary: string,
    fileChangedDescription: string,
    fileChangedSummary: string,
    instructionsLoadedDescription: string,
    instructionsLoadedSummary: string,
    notificationDescription: string,
    notificationSummary: string,
    permissionDeniedDescription: string,
    permissionDeniedSummary: string,
    permissionRequestDescription: string,
    permissionRequestSummary: string,
    postCompactDescription: string,
    postCompactSummary: string,
    postToolUseDescription: string,
    postToolUseFailureDescription: string,
    postToolUseFailureSummary: string,
    postToolUseSummary: string,
    preCompactDescription: string,
    preCompactSummary: string,
    preToolUseDescription: string,
    preToolUseSummary: string,
    sessionEndDescription: string,
    sessionEndSummary: string,
    sessionStartDescription: string,
    sessionStartSummary: string,
    setupDescription: string,
    setupSummary: string,
    stopDescription: string,
    stopFailureDescription: string,
    stopFailureSummary: string,
    stopSummary: string,
    subagentStartDescription: string,
    subagentStartSummary: string,
    subagentStopDescription: string,
    subagentStopSummary: string,
    taskCompletedDescription: string,
    taskCompletedSummary: string,
    taskCreatedDescription: string,
    taskCreatedSummary: string,
    teammateIdleDescription: string,
    teammateIdleSummary: string,
    userPromptSubmitDescription: string,
    userPromptSubmitSummary: string,
    worktreeCreateDescription: string,
    worktreeCreateSummary: string,
    worktreeRemoveDescription: string,
    worktreeRemoveSummary: string},
  xaaIdp: {
    manageIdp: string,
    setupIdp: string,
    showIdpConfig: string,
    clearIdp: string},
  mcpAddCmd: {
    addMcpServer: string},
  modes: {
    defaultMode: string,
    gentleMode: string,
    sharpMode: string,
    workhorseMode: string,
    tokenSaverMode: string,
    superAiMode: string},
  modelPicker: {
    currentModel: string,
    fastModeOnPrefix: string,
    fastModeOnSuffix: string,
    useFastMode: string},
  modelSelector: {
    currentModelCustom: string},
  remoteCallout: {
    labelEnable: string,
    descOpenConnection: string,
    labelNeverMind: string,
    descEnableLater: string},
  sessionRunner: {
    sessionCompleted: string},
  localMainSession: {
    backgroundSession: string},
  torchCmd: {
    internalDevDebug: string},
  ultraplanChoice: {
    labelImplementHere: string,
    descInjectPlan: string,
    labelStartNewSession: string,
    descClearConversation: string,
    labelCancel: string,
    descDontImplement: string},
  ultraplanCmd: {
    refineLocalPlan: string},
  insightsCmd: {
    generateReport: string,
    morning: string,
    afternoon: string,
    evening: string,
    night: string},
    pluginHintMenu: {
    no: string},
  desktopUpsell: {
    openInDesktop: string,
    notNow: string,
    dontAskAgain: string},
  ideAutoConnect: {
    yes: string,
    no: string},
  lspRecommendation: {
    noNotNow: string,
    disableAll: string},
  managedSettingsSecurity: {
    yesTrust: string,
    noExit: string},
  messageSelector: {
    restoreCodeConversation: string,
    restoreConversation: string,
    restoreCode: string,
    addContextPlaceholder: string,
    summarizeFromHere: string,
    summarizeUpToHere: string,
    neverMind: string,
    summarizing: string,
    restoreBeforeFileHistory: string,
    restoreBeforeNoFileHistory: string,
    rewindingWarning: string,
    rewind: string,
    errorPrefix: string,
    confirmRestorePrefix: string,
    confirmRestoreConversationMiddle: string,
    confirmRestoreSuffix: string,
    noCodeRestore: string,
    pressAgainToExit: (key: string) => string,
    enterContinuePrefix: string,
    escExit: string,
    conversationWillBeForked: string,
    conversationWillBeSummarized: string,
    conversationWillBeSummarizedUpTo: string,
    conversationWillBeUnchanged: string,
    codeWillBeRestoredPrefix: string,
    codeWillBeRestoredSuffix: (fileLabel: string) => string,
    currentLabel: string,
    noPrompt: string,
    emptyMessage: string,
    skillLabel: string,
    messageNotFound: string,
    failedToRestoreConversation: (error: string) => string,
    failedToSummarize: (error: string) => string,
    failedToRestoreConversationAndCode: (convErr: string, codeErr: string) => string,
    failedToRestoreCode: (error: string) => string,
    fileLabelAnd: (f1: string, f2: string) => string,
    fileLabelAndOthers: (f1: string, n: string) => string},
  worktreeExit: {
    keepWorktreeAndTmux: string,
    keepWorktreeKillTmux: string,
    removeWorktreeAndTmux: string,
    keepWorktree: string,
    removeWorktree: string,
    keepingWorktree: string,
    removingWorktree: string},
  agentEditor: {
    openInEditor: string,
    editTools: string,
    editModel: string,
    editColor: string},
  agentsMenu: {
    viewAgent: string,
    editAgent: string,
    deleteAgent: string,
    back: string,
    yesDelete: string,
    noCancel: string,
    enterOrEscToGoBack: string,
    areYouSureDelete: string,
    source: string,
    arrowsToNavigate: string,
    editAgentTitle: string},
  snapshotUpdate: {
    mergeSnapshot: string,
    keepCurrent: string,
    replaceWithSnapshot: string,
    title: string},
  toolSelector: {
    continue: string,
    mcpServers: string,
    individualTools: string},
  agentLocationStep: {
    project: string,
    personal: string},
  agentMemoryStep: {
    userScopeRecommended: string,
    none: string,
    projectScope: string,
    localScope: string,
    projectScopeRecommended: string,
    userScope: string},
  agentMethodStep: {
    generateWithClaude: string,
    manualConfig: string},
  mcpRemoteServerMenu: {
    enable: string,
    viewTools: string,
    clearAuth: string,
    authenticate: string,
    reauthenticate: string,
    reconnect: string,
    disable: string,
    back: string},
  mcpStdioServerMenu: {
    enable: string,
    disable: string,
    viewTools: string,
    reconnect: string,
    back: string},
  memoryFileSelector: {
    openAutoMemoryFolder: string,
    openTeamMemoryFolder: string,
    autoDreamOn: string,
    dreamToRun: string,
    autoMemory: string,
    atImported: string,
    dynamicallyLoaded: string,
    userMemory: string,
    projectMemory: string,
    newLabel: string},
  memoryCmd: {
    openedFileAt: (path: string, hint: string) => string,
    errorOpeningFile: (msg: string) => string},
  questionView: {
    other: string},
  submitQuestionsView: {
    submitAnswers: string,
    cancel: string},
  enterPlanModePermission: {
    yesEnterPlanMode: string,
    noStartNow: string,
    exploreCodebase: string,
    identifyPatterns: string,
    designStrategy: string,
    presentPlan: string},
  reviewArtifactPermission: {
    yesShowReview: string,
    noSkip: string},
  addPermissionRules: {
    projectLocal: string,
    project: string,
    user: string},
  ultraplanLaunch: {
    runUltraplan: string,
    notNow: string},
  it2SetupPrompt: {
    installNow: string,
    useTmuxInstead: string,
    opensTeammatesTmux: string,
    cancel: string,
    skipTeammate: string,
    tryAgain: string,
    retryInstallation: string,
    fallsBackTmux: string,
    verifyConnection: string},
  permissionExplainer: {
    provideExplanation: string,
    whatCommandDoes: string,
    whatCouldGoWrong: string},
  ultracodeSkill: {
    scan: string,
    scanDetail: string,
    fix: string,
    fixDetail: string,
    reviewDescription: string,
    reviewPhase: string,
    verifyPhase: string},
  globalSearch: {
    matches: string,
    searching: string,
    noMatches: string,
    typeToSearch: string,
    loading: string},
  historySearch: {
    loading: string,
    noMatchingPrompts: string,
    noHistory: string},
  quickOpen: {
    loadingPreview: string,
    typeToSearchFiles: string},
  remoteEnvironment: {
    loadingEnvironments: string,
    updating: string},
  diffDialog: {
    loadingDiff: string,
    noFileChanges: string,
    tooManyFiles: string,
    workingTreeClean: string},
  elicitationDialog: {
    waitingForConfirmation: string,
    needsYourInput: string,
    fieldRequired: string,
    continueWithoutWaiting: string},
  managePlugins: {
    processing: string},
  remoteSetup2: {
    checkingLoginStatus: string,
    connectingGithub: string},
  resume2: {
    loadingConversations: string},
  resumeCmd: {
    noConversations: string,
    noConversations2: string,
    failedToLoad: string,
    failedToResume: string,
    differentDirectory: string,
    toResumeRun: string,
    copiedToClipboard: string,
    resumeCancelled: string,
    resumingConversation: string,
    failedToResumeError: (msg: string) => string,
    sessionNotFound: (arg: string) => string,
    multipleMatches: (count: number, arg: string) => string},
  desktopHandoff: {
    error: string,
    pressAnyKeyContinue: string,
    downloadNow: string,
    unknownError: string,
    startingDownload: (url: string) => string,
    desktopAppRequired: (url: string) => string,
    notInstalled: string,
    versionTooOld: (version: string, required: string) => string,
    failedToOpen: string,
    sessionTransferred: string,
    checking: string,
    flushing: string,
    opening: string,
    success: string},
  effortPanel: {
    adjustHint: string,
    ultracodeHint: string,
    effortUnchanged: string},
  effortCmd: {
    failedToSet: (message: string) => string,
    notAppliedOverride: (envRaw: string, effortValue: string) => string,
    overrideNote: (envRaw: string, effortValue: string) => string,
    setLevel: (effortValue: string, suffix: string, description: string) => string,
    autoLevel: (level: string) => string,
    currentLevel: (effectiveValue: string, description: string) => string,
    clearedOverride: (envRaw: string) => string,
    setToAuto: string},
  bridgeDialog: {
    disconnectHint: string},
  fallbackToolUseError: {
    toSeeAll: string},
  ideAutoConnectDialog: {
    youCanAlsoConfigure: string},
  passesLoading: {
    loadingGuestPass: string},
  passesCmd: {
    descShareEarn: string,
    descShare: string},
  settingsUsage2: {
    extraUsageNotEnabled: string},
  showInIde: {
    saveFileToContinue: string},
  teammateSpinner: {
    enterToView: string,
    enterToCollapse: string,
    selectHint: string},
  diffDetail: {
    untracked: string,
    truncated: string},
  mcpReconnect: {
    reconnectingTo: string,
    establishingConnection: string},
  permissionRuleInput: {
    enterToSubmitEscToCancel: string},
  shellProgress: {
    running: string},
  skillsMenu: {
    createSkillsIn: string,
    typeToFilterSkills: string,
    nSkills: (n: number) => string,
    noSkillsMatching: (q: string) => string,
    tokens: string,
    invokeSkill: string},
  assistantToolUse: {
    waitingForPermission: string},
  sandboxDoctor: {
    runSandbox: string},
  sandboxCmd: {
    wsl1NotSupported: string,
    unsupportedPlatform: string,
    disabledForPlatform: (platform: string) => string,
    lockedByPolicy: string,
    excludeMissingPattern: string,
    excludedPattern: (pattern: string, path: string) => string,
    unknownSubcommand: (sub: string) => string},
  voiceIndicator: {
    listening: string,
    keepHolding: string,
    voiceProcessing: string},
  promptInputFooter: {
    enterToView: string,
    arrowKeysHint: string},
  breakCachePanel: {
    selectRunClose: string},
  fastCmd: {
    tabToToggle: string,
    on: (icon: string, modelUpdated: string, pricing: string) => string,
    off: string,
    unavailable: (reason: string) => string,
    description: (model: string) => string},
  forkCmd: {
    notEnabled: string,
    notAvailable: string,
    usage: string,
    noAssistant: string,
    started: string,
    failed: (message: string) => string},
  goalCmd: {
    labelGoal: string,
    labelStatus: string,
    labelTime: string,
    labelTokens: string,
    labelContinuation: string,
    maxTurnsHint: (turns: number) => string,
    maxTurnsResume: (turns: number) => string,
    continueReset: (turns: number) => string,
    notMaxTurns: string,
    objectiveTooLong: (length: number, limit: number) => string},
  triggersCmd: {
    failedToList: (msg: string) => string,
    triggerFetched: (id: string) => string,
    failedToGet: (id: string, msg: string) => string,
    invalidCron: (cron: string) => string,
    triggerCreatedId: (id: string) => string,
    failedToCreate: (msg: string) => string,
    unknownField: (field: string) => string,
    triggerUpdated: (id: string) => string,
    failedToUpdate: (id: string, msg: string) => string,
    triggerDeleted: (id: string) => string,
    failedToDelete: (id: string, msg: string) => string,
    triggerFired: (id: string, runId: string) => string,
    failedToRun: (id: string, msg: string) => string,
    triggerEnabled: (id: string) => string,
    failedToEnable: (id: string, msg: string) => string,
    triggerDisabled: (id: string) => string,
    failedToDisable: (id: string, msg: string) => string,
    usage: string},
  modelCmd: {
    description: (model: string) => string},
  addDir: {
    emptyPath: string,
    pathNotFound: (path: string) => string,
    notADirectory: (dir: string, parent: string) => string,
    alreadyInWorkingDirectory: (dir: string, workingDir: string) => string,
    success: (path: string) => string},
  addDirCmd: {
    addedSaved: (path: string) => string,
    addedFailedSave: (path: string, error: string) => string,
    addedSession: (path: string) => string,
    manageHint: string,
    didNotAdd: string,
    didNotAddPath: (path: string) => string},
  bridgeCmd2: {
    enterToSelectEscToContinue: string},
  assistantCmd2: {
    enterToSelectEscToCancel: string},
  teleportResume: {
    resumingSession: string,
    loadingTitle: string,
    failedToResume: string,
    pressEscToCancel: string},
  teleportCmd: {
    bridgeError: string,
    sessionPickerRow: (idx: string, title: string, status: string, created: string, id: string) => string,
    availableSessionsHeader: string,
    runTeleportHint: string,
    untitled: string,
    unknown: string,
    permissionDenied: string,
    endpointNotFound: string,
    authError: (msg: string) => string,
    fetchFailed: (msg: string) => string,
    noActiveSessions: string,
    invalidSessionId: (id: string) => string,
    cannotTeleport: (msg: string) => string,
    sessionFetched: (id: string) => string,
    resumeNoCallback: (id: string) => string,
    logNotFound: (id: string) => string,
    teleportFailed: (msg: string) => string},
  agentDetail: {
    none: string,
    tellsWhenToUse: string,
    nSkills: string},
  highlightedThinking: {
    you: string},

  autofix: {
    checksFailing: (failed: number, total: number) => string,
    checksPassing: (total: number) => string,
    checksPending: (pending: number, total: number) => string,
    ciFailing: (owner: string, repo: string, prNumber: number, detail: string) => string,
    ciGreen: (owner: string, repo: string, prNumber: number) => string,
    noChecks: string,
    prClosed: (owner: string, repo: string, prNumber: number) => string,
    prMerged: (owner: string, repo: string, prNumber: number) => string},
  bridgeMain: {
    environmentDeregistered: string,
    environmentOffline: string,
    healthcheckReceived: string,
    processExitedWithError: string,
    resumeSession: string,
    sessionStart: (sessionId: string) => string,
    sessionTimedOut: (duration: string) => string,
    shuttingDownSessions: (n: number) => string,
    spawnModeSameDir: string,
    spawnModeWorktree: string},
  bridgeStatus: {
    activeFooter: (url: string) => string,
    failedFooter: string,
    idleFooter: (url: string) => string},
  cli: {
    activeSessions: (n: number) => string,
    addingMarketplace: string,
    agentMemoryLabel: (memory: string) => string,
    agentShadowedBy: (source: string) => string,
    analyzingAutoModeRules: string,
    analyzingAutoModeRules_short: (n: string) => string,
    apiKeyEnvVar: string,
    authConsoleAndClaudeAiConflict: string,
    autonomyCancellationRequested: (flowId: string) => string,
    autonomyDeepSectionNotFound: (sectionId: string) => string,
    autonomyFlowAlreadyTerminal: (flowId: string, status: string) => string,
    autonomyFlowCancelled: (flowId: string, removedCount: number) => string,
    autonomyFlowNotFound: string,
    autonomyFlowNotWaiting: string,
    autonomyFlowPrepared: (flowId: string) => string,
    autonomyFlowQueued: (flowId: string) => string,
    autonomyRunId: (runId: string) => string,
    availableTemplates: string,
    bgAttachHint: (sessionName: string) => string,
    bgDetachedError: string,
    bgEngine: string,
    bgInstallTmux: string,
    bgInstallTmuxDarwin: string,
    bgInstallTmuxLinux: string,
    bgKillHint: (sessionName: string) => string,
    bgLog: string,
    bgSessionStarted: (sessionName: string) => string,
    bgStatusHint: string,
    cannotUseAllWithPlugin: string,
    cannotUseScopeWithAll: string,
    checkingMcpHealth: string,
    completionCacheRegenerated: (shell: string) => string,
    configuredMarketplaces: string,
    coworkOnlyUserScope: string,
    createdTask: (id: string, subject: string) => string,
    exportedFile: (source: string, outputFile: string) => string,
    exportedSession: (sessionId: string, outputFile: string) => string,
    failedToAnalyzeRules: (msg: string) => string,
    failedToAppendReply: (id: string) => string,
    failedToLogout: string,
    failedToReadLog: (logPath: string) => string,
    ifBrowserDidNotOpen: (url: string) => string,
    installedPlugins: string,
    invalidMarketplaceScope: (scope: string) => string,
    invalidMarketplaceSource: string,
    invalidPluginScope: (scope: string, valid: string) => string,
    invalidPluginScope2: (scope: string, valid: string) => string,
    jobArgs: string,
    jobArgsNone: string,
    jobCreated: string,
    jobCreatedMsg: (id: string) => string,
    jobDirectory: string,
    jobInput: string,
    jobLabel: (id: string) => string,
    jobListDesc: string,
    jobNewDesc: string,
    jobNotFound: (id: string) => string,
    jobReplyDesc: string,
    jobStatusDesc: string,
    jobStatusLabel: string,
    jobStatusUsage: string,
    jobTemplate: string,
    jobUpdated: string,
    killingSession: (sessionId: string, pid: number) => string,
    lastSessions: (count: number) => string,
    logSessionNotFound: (logId: string | number) => string,
    loginFailed: (msg: string) => string,
    loginSuccessful: string,
    marketplaceAlreadyOnDisk: (name: string, scope: string) => string,
    marketplaceSourceDirectory: (path: string) => string,
    marketplaceSourceFile: (path: string) => string,
    marketplaceSourceGit: (url: string) => string,
    marketplaceSourceGithub: (repo: string) => string,
    marketplaceSourceUrl: (url: string) => string,
    marketplaceSuccessfullyAdded: (name: string, scope: string) => string,
    marketplaceSuccessfullyRemoved: (name: string) => string,
    marketplaceSuccessfullyUpdated: (name: string) => string,
    marketplaceSuccessfullyUpdatedCount: (n: number) => string,
    mcpAddedToScope: (transportType: string, name: string, scope: string) => string,
    mcpArgs: string,
    mcpCallbackPort: (port: number) => string,
    mcpClientIdConfigured: string,
    mcpClientSecretConfigured: string,
    mcpCommand: string,
    mcpDirNotExist: (dir: string) => string,
    mcpEnvironment: string,
    mcpExistsInMultipleScopes: (name: string) => string,
    mcpFailedToStart: (msg: string) => string,
    mcpFileModified: (path: string) => string,
    mcpHeaders: string,
    mcpNoDesktopConfig: string,
    mcpOAuth: string,
    mcpProjectChoicesReset: string,
    mcpRemoveHint: (name: string, scope: string) => string,
    mcpRemoveSpecificScope: string,
    mcpRemovedFromScope: (name: string, scope: string) => string,
    mcpRemovedFromScopeQuoted: (name: string, scope: string) => string,
    mcpScope: string,
    mcpServerNotFound: (name: string) => string,
    mcpServerNotFoundNoQuotes: (name: string) => string,
    mcpStatus: string,
    mcpType: string,
    mcpUrl: string,
    multipleBackgroundSessions: string,
    multipleSessionsActive: string,
    noActiveSessions: string,
    noActiveSessionsToKill: string,
    noAgentsFound: string,
    noBackgroundSessions: string,
    noCritiqueGenerated: string,
    noCustomAutoModeRules: string,
    noLogPathForSession: (sessionId: string) => string,
    noMarketplacesConfigured: string,
    noMcpServersConfigured: string,
    noPluginsInstalled: string,
    noRecentSessions: string,
    noTasksFound: string,
    noTemplatesFound: string,
    notLoggedIn: string,
    oauthScopesRequired: string,
    openingBrowser: string,
    pluginDisabled: string,
    pluginEnabled: string,
    pluginError: string,
    pluginFailedTo: (action: string, msg: string) => string,
    pluginFailedToLoad: string,
    pluginFoundErrors: (n: number) => string,
    pluginFoundWarnings: (n: number) => string,
    pluginLoaded: string,
    pluginLoadedWithErrors: string,
    pluginScope: string,
    pluginSessionOnly: string,
    pluginStatus: string,
    pluginUnexpectedError: (msg: string) => string,
    pluginValidating: (fileType: string, filePath: string) => string,
    pluginValidationFailed: string,
    pluginValidationPassed: string,
    pluginValidationPassedWithWarnings: string,
    pluginVersion: string,
    replyAddedToJob: (id: string) => string,
    sessionAlreadyExited: string,
    sessionBridge: string,
    sessionCwd: string,
    sessionEngine: string,
    sessionExitedGracePeriod: string,
    sessionForceKilled: string,
    sessionId: string,
    sessionKind: string,
    sessionLog: string,
    sessionName: string,
    sessionNotFound: (target: string) => string,
    sessionPid: string,
    sessionStarted: string,
    sessionStatus: string,
    sessionStopped: string,
    sessionTmux: string,
    sessionWaitingFor: string,
    setupTokenExplanation: string,
    setupTokenStartingMessage: string,
    setupTokenWarning: string,
    sourceNotFound: (source: string) => string,
    sparseOnlyForGithubGit: (source: string) => string,
    specifyPluginOrAll: string,
    specifySessionToKill: string,
    successfullyLoggedOut: string,
    taskEntry: (status: string, id: string, subject: string) => string,
    taskNotFound: (id: string) => string,
    taskOwner: (owner: string) => string,
    templateJobCommands: string,
    templateNotFound: (name: string) => string,
    templatePath: string,
    templatesFound: (n: number) => string,
    templatesPlacementHint: string,
    tmuxNotAvailable: string,
    totalActiveAgents: (n: number) => string,
    unableToCreateApiKey: string,
    unknownTemplateCommand: (cmd: string) => string,
    updatedTask: (id: string, status: string, subject: string) => string,
    updatingMarketplace: (name: string) => string,
    updatingMarketplaces: (n: number) => string,
    usageNewJob: string,
    usageReply: string},
  clickableImageRef: {
    image: (n: number) => string},
  cmdMgmt: {
    langCurrent: (langName: string) => string,
    langInvalid: (arg: string) => string,
    langSet: (langName: string) => string,
    langPanelTitle: string,
    langPanelHint: string,
    langPanelDismissed: string,
    outputStyleDeprecated: string,
    tsAlacrittyBackupError: string,
    tsAlacrittyFoundExisting: string,
    tsAlacrittyInstalled: string,
    tsAlacrittyRestart: string,
    tsBackupError: (editor: string) => string,
    tsCannotRun: (terminal: string) => string,
    tsCannotRunDesc: string,
    tsFoundExisting: (editor: string) => string,
    tsIdeLabel: string,
    tsInstalled: (editor: string) => string,
    tsNativeSupport: (terminal: string) => string,
    tsNoteBackslash: string,
    tsNoteNative: string,
    tsOtherLabel: string,
    tsRemoteCannotInstall: (editor: string) => string,
    tsRemoteInstructionTitle: string,
    tsRemoteMustInstallLocal: (editor: string) => string,
    tsRemoteStep1: (editor: string) => string,
    tsRemoteStep2: string,
    tsRemoteStep3: string,
    tsSetupTitle: string,
    tsStepExitTmux: string,
    tsStepReturn: string,
    tsStepRunSetup: string,
    tsTerminalAppConfigured: string,
    tsTerminalAppOptionAsMeta: string,
    tsTerminalAppOptionEnter: string,
    tsTerminalAppRestart: string,
    tsTerminalAppVisualBell: string,
    tsZedBackupError: string,
    tsZedFoundExisting: string,
    tsZedInstalled: string},
  colorCmd: {
    cannotSetColor: string,
    invalidColor: (colorArg: string, colorList: string) => string,
    setColor: (colorArg: string) => string,
    panelTitle: string,
    panelCurrent: (name: string) => string,
    panelDismissed: string,
    defaultColor: string,
    panelHint: string},
  compactCmd: {
    noMessages: string,
    canceled: string,
    notEnoughMessages: string,
    incompleteResponse: string,
    errorDuring: (error: unknown) => string,
    contextLine: (pre: string, post: string) => string,
    expandHint: (shortcut: string) => string,
    prefix: string,
    errorCompactingConversation: string,
    toolUseNotAllowedDuringCompaction: string},
  componentsMessages: {
    anotherSession: string,
    autoApprovedMatched: (rule: string) => string,
    conversationCompacted: (shortcut: string) => string,
    githubActivity: string,
    githubLabel: string,
    image: string,
    imageWithId: (id: number) => string,
    inRepo: (repo: string) => string,
    memoryGoodToKnow: string,
    memoryGotIt: string,
    memoryNoted: string,
    planToImplement: string,
    thinking: string},
  componentsUi: {
    issueBannerActions: string,
    issueBannerQuestion: string,
    promptInputPlaceholderMessageAgent: (name: string) => string,
    promptInputPlaceholderPressUp: string,
    mentionSendMessage: string,
    mentionSendMessageWithStatus: (status: string) => string,
    queuedCommandsMoreTasks: (count: number) => string,
    stashNoticeLabel: string},
  coordinatorCmd: {
    disabled: string,
    enabled: string,
    modeEntered: string,
    modeExited: string},
  coordinatorStatus: {
    main: string,
    tokens: (n: string) => string,
    queued: (n: number) => string,
    xToStop: string,
    xToClear: string},
  devBar: {
    slowSync: string},
  directConnect: {
    failedToConnect: (url: string) => string,
    serverDisconnected: string},
  daemonCmd: {
    attachNotAvailable: string,
    done: string},
  exitCmd: {
    goodbye1: string,
    goodbye2: string,
    goodbye3: string,
    goodbye4: string},
  exitFlow: {
    bye: string,
    catchYouLater: string,
    goodbye: string,
    seeYa: string},
  exportCmd: {
    exportedTo: (path: string) => string,
    failedToExport: (msg: string) => string},
  extraUsageCmd: {
    startingMessage: string},
  mcpError: {
    sessionExpired: (serverName: string) => string,
    timeout: (serverName: string, timeoutMs: number) => string},
  memoryUsage: {
    high: (size: string) => string},
  movedToPlugin: {
    movedToPluginPrompt: (pluginName: string, pluginCommand: string) => string},
  permissionHooks: {
    deniedByHook: string,
    deniedViaChannel: (server: string) => string,
    requiresPermission: (tool: string) => string,
    userAborted: string,
    userDeniedPermission: string},
  pluginInstallNotify: {
    installFailed: (name: string) => string,
    installed: (name: string) => string},
  prBadge: {
    pr: string},
  questionNavBar: {
    questionPrefix: (n: number) => string,
    submit: string},
  rcs: {
    acpAgent: string,
    acpLabel: string,
    addToken: string,
    agent: string,
    all: string,
    apiToken: string,
    approve: string,
    authToken: string,
    backToDashboard: string,
    cameraScanner: string,
    cancel: string,
    claudeCode: string,
    connect: string,
    connected: string,
    connecting: string,
    connectingToAcp: string,
    connectionFailed: string,
    copied: string,
    copy: string,
    copyToken: string,
    create: string,
    creating: string,
    dashboard: string,
    deleteToken: string,
    disconnect: string,
    disconnected: string,
    earlier: string,
    editLabel: string,
    emptyChatDesc: string,
    emptyChatTitle: string,
    environment: string,
    error: string,
    errorLabel: string,
    errorPrefix: (m: string) => string,
    exitPlanMode: string,
    failedToCreateSession: string,
    forRemoteAccess: string,
    history: string,
    historySessions: string,
    identity: string,
    identityAndQr: string,
    justNow: string,
    labelOptional: string,
    loading: string,
    loadingApp: string,
    loadingDots: string,
    loadingThreads: string,
    manageApiTokens: string,
    mySession: string,
    newSession: string,
    newSessionTitle: string,
    newThread: string,
    newThreadTitle: string,
    no: string,
    noActiveEnvironments: string,
    noActiveTasks: string,
    noBranch: string,
    noKeepPlanning: string,
    noKeepPlanningDesc: string,
    noPastThreads: string,
    noQrCodeFound: string,
    noSessions: string,
    noSessionsList: string,
    noThreadsMatch: string,
    noToken: string,
    noTokensSaved: string,
    noneOption: string,
    optional: string,
    orPointCameraAtQrCode: string,
    other: string,
    pastWeek: string,
    pathToProject: string,
    permissionModeAcceptEdits: string,
    permissionModeAcceptEditsDesc: string,
    permissionModeAuto: string,
    permissionModeAutoDesc: string,
    permissionModeBypass: string,
    permissionModeBypassDesc: string,
    permissionModeDefault: string,
    permissionModeDefaultDesc: string,
    permissionModeDontAsk: string,
    permissionModeDontAskDesc: string,
    permissionModePlan: string,
    permissionModePlanDesc: string,
    permissionRequest: string,
    proxyServerUrl: string,
    question: string,
    questions: string,
    rcDash: string,
    readyToCode: string,
    reject: string,
    relativeDays: (n: number) => string,
    relativeHours: (n: number) => string,
    relativeMinutes: (n: number) => string,
    remoteControl: string,
    resultLabel: string,
    scanOnAnotherDevice: string,
    scanQrCode: string,
    scanWithCamera: string,
    searchThreads: string,
    selectFromAlbum: string,
    send: string,
    sendMessagePlaceholder: string,
    server: string,
    sessionHistoryNotSupported: string,
    sessionInterrupted: string,
    sessionIsClosed: string,
    sessionList: string,
    sessionListNotSupported: string,
    sessionStatusMsg: (s: string) => string,
    sessions: string,
    skip: string,
    spinnerVerbs: string,
    statusComplete: string,
    statusError: string,
    statusRunning: string,
    stop: string,
    stopCamera: string,
    stopScanning: string,
    submit: string,
    submitAll: string,
    tasks: string,
    tellClaudeWhatToChange: string,
    thinking: string,
    thisWeek: string,
    titleOptional: string,
    today: string,
    toggleTokenVisibility: string,
    tokenManager: string,
    tokenManagerTitle: string,
    tool: string,
    toolCallCountSingular: (n: number) => string,
    toolCallCountPlural: (n: number) => string,
    toolCallNotFound: string,
    typeMessage: string,
    unknown: string,
    unknownError: string,
    unnamed: string,
    uploadQrImage: string,
    waitingForSession: string,
    workingDirectory: string,
    yes: string,
    yesAutoAccept: string,
    yesAutoAcceptDesc: string,
    yesManualApprove: string,
    yesManualApproveDesc: string,
    yesterday: string,
    you: string,
    yourUuid: string},
  rcsCmd: {
    started: string,
    failedToStart: (msg: string) => string,
    stopped: string,
    restarted: string,
    failedToRestart: (err: string) => string},
  upgradeCmd: {
    alreadyMax: string,
    startingMessage: string,
    failedToOpenBrowser: string},
  sentryErrorBoundary: {
    boundary: (n: string) => string,
    reactRenderingError: string},
  services: {
    acpModeAcceptEditsDescription: string,
    acpModeAcceptEditsName: string,
    acpModeAutoDescription: string,
    acpModeAutoName: string,
    acpModeBypassDescription: string,
    acpModeBypassName: string,
    acpModeDefaultDescription: string,
    acpModeDefaultName: string,
    acpModeDontAskDescription: string,
    acpModeDontAskName: string,
    acpModePlanDescription: string,
    acpModePlanName: string,
    mcpConfDescClaudeai: string,
    mcpConfDescDynamic: string,
    mcpScopeClaudeai: string,
    mcpScopeDynamic: string,
    mcpScopeEnterprise: string,
    mcpScopeLocal: string,
    mcpScopeProject: string,
    mcpScopeUser: string,
    sessionMemoryTruncated: (path: string) => string,
    skipConfirmation: string,
    snipNudge: string},
  shell: {
    elapsed: (e: string) => string,
    elapsedAndTimeout: (e: string, t: string) => string,
    timeout: (t: string) => string},
  workflowError: {
    aborted: string},
  agentProgress: {
    done: string,
    initializing: string,
    runningInBackground: string,
    tokens: (n: number) => string},
  diagnosticsDisplay: {
    foundIssues: (total: number, fileCount: number) => string},
  sandboxViolation: {
    blocked: (count: number) => string,
    showingLast: ({ shown, total }: { shown: number; total: number }) => string},
  sandboxPromptFooterHint: {
    blocked: ({ count, shortcut }: { count: number; shortcut: string }) => string}}
