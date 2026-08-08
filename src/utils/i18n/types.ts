export type TranslationDict = {
  agentDisplay: {
    builtin: string
    cliArg: string
    local: string
    managed: string
    plugin: string
    project: string
    user: string
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
  authPlane: {
    enableVault: string
    notLoggedIn: string
    pressW: string
    step1: string
    step2: string
    step3: string
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
  btw: {
    answering: string
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
  }
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
    yesReplace: string
  }
  cmdUI: {
    apiKey: string; back: string; chooseFetch: string; chooseSearch: string
    back: string
    chooseFetch: string
    chooseSearch: string
    copyAction: string; copyCancel: string; copyCancelled: string; copyFull: string
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
    expandHistory: string
    languageInstruction: string
    proactiveResume: string
    recentPreserved: string
    resumeDirectly: string
    sessionContinued: string
    summarized: string
    summarizedMessages: (count: number, direction: string) => string
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
    noKeepPlanning: string
    noPlanFound: string
    noUltraplan: string
    shiftTabApprove: string
    tellClaudeChange: string
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
  }
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
  }
  interrupted: {
    label: string
    whatShouldClaudeDo: string
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
  }
  languagePicker: {
    enterLanguage: string
    leaveEmpty: string; enterLanguage: string
    placeholder: (ellipsis: string) => string
    prompt: string
  }
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
    store: 'string',
  }
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
    working: 'string',
  }
  logSelector: {
    searching: string
    searchingWithClaude: string
    typeToSearch: string
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
    removing: string
    requestCode: string
    selectMethod: string
    sonnet: string
    subtitle: string
    waitingChatgpt: string
  }
  loginFlow: {
    browseModels: (p: string) => string
    browserDidntOpen: string
    chatgptSetup: string
    claudeAccount: string; consoleAccount: string; thirdParty: string
    codingPlan: string
    consoleAccount: string
    copied: string
    customModel: string
    customModelDesc: string
    directConnection: string
    enterApiKey: string
    enterModelName: string; enterApiKey: string; browseModels: (p: string) => string
    failedExchange: string
    failedSave: string
    failedSaveError: (m: string) => string; directConnection: string; payAsYouGo: string; codingPlan: string
    free: string
    geminiModelsRequired: string
    getYourKey: (p: string) => string; useCodingPlan: string; keyFormat: (f: string) => string
    glmFree: string
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
    thirdParty: string
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
  processUserInput: {
    imageSource: (sourcePath: string) => string
    outputTruncated: (maxChars: number) => string
    remoteControlUnavailable: (command: string) => string
    stoppedByHook: string
    stoppedByHookReason: (reason: string) => string
  }
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
    waiting: (duration: string) => string; goal: (time: string) => string; exitAgain: (key: string) => string; pasting: string; vimInsert: string; bashMode: string; remote: string; rssPid: (rss: string, pid: number) => string; shortcuts: string; holdToSpeak: (key: string) => string; macOptionClick: string; returnToTeamLead: string; interrupt: string; copy: string; nativeSelect: string; manage: string; viewTasks: string; stopAgents: string; showTasks: string; showTeammates: string; hide: string; hideTasks: string
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
    languageChanged: (v: string) => string
    maxApiRetries: string; maxApiRetriesDefault: string; maxApiRetriesOff: string; maxApiRetriesAlways: string; maxApiRetriesCustom: string
    maxApiRetriesCustomInput: string; maxApiRetriesCurrent: string
    maxApiRetriesDefaultDesc: string; maxApiRetriesOffDesc: string; maxApiRetriesAlwaysDesc: string; maxApiRetriesCustomDesc: string
    maxApiRetriesDefaultWithValue: (n: number) => string; maxApiRetriesCustomWithValue: (n: number) => string
    notifications: string
    notificationsChanged: (v: string) => string
    outputStyle: string
    outputStyleChanged: (v: string) => string
    promptSuggestions: string; poorMode: string; speculativeExecution: string; rewindCode: string
    pushWhenClaudeDecides: string; outputStyle: string; defaultView: string; preferredLanguage: string; editorMode: string
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
    themeChanged: (v: string) => string; notificationsChanged: (v: string) => string; outputStyleChanged: (v: string) => string; languageChanged: (v: string) => string
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
    id: 'string',
  }
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
  tag: {
    noKeep: string
    removeConfirm: string
    yesRemove: string
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
    },
  },
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
  workspaceKey: {
    enterKey: string
    enterSave: string
    escCancel: string
    obtainFrom: string
    pasteHint: string
    saving: string
    startTyping: string
  }
  // round 2 conversion
  'assistantsessionchooser': {
    selectAssistantSession: string
    multipleSessionsFoundSelectOneToAttach: string
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
  },
  'unifiedinstalledcell': {
    plugin: string
    plugin2: string
    plugin3: string
  },
  'rateLimitOptions': {
    whatDoYouWantToDo: string
  },
  'remoteSetup': {
    connectClaudeOnTheWebToGitHub: string
    claudeOnTheWebRequiresConnectingToYourGitHubAccountToCloneAndPushCodeOnYourBehalf: string
    yourLocalCredentialsAreUsedToAuthenticateWithGitHub: string
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
    tryRunningPluginToManuallyInstallTheThinkBackPlugin: string,
  },
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
  },
  'bridgedialog': {
    remoteControl: string
  },
  'builtinstatusline': {
    session: string
    weekly: string
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
  },
  'effortcallout': {
    mediumRecommended: string
  },
  'globalsearchdialog': {
    globalSearch: string
    openInEditor: string
  },
  'historysearchdialog': {
    searchPrompts: string
    use: string
    filterHistory: string
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
  'logselector': {
    renameSession: string
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
  },
  'remotecallout': {
    remoteControl: string
    youCanDisconnectRemoteAccessAnytimeByRunningRemoteControlAgain: string
  },
  'resumetask': {
    checkYourInternetConnection: string
    teleportRequiresAClaudeAccount: string
    sorryClaudeEncounteredAnError: string
    sorryClaudeCodeEncounteredAnError: string
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
    failedToLoad: 'string',
    favoriteModel: 'string',
    hint: 'string',
    loading: 'string',
    loadingStats: 'string',
    longestSession: 'string',
    longestStreak: 'string',
    models: 'string',
    mostActiveDay: 'string',
    noStats: 'string',
    overview: 'string',
    sessions: 'string',
    totalTokens: 'string',
  },
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
  },
  'feedbacksurvey': {
    thanksForTheFeedback: string
    useIssueToReportModelBehaviorIssues: string
  },
  'transcriptshareprompt': {
    canAnthropicLookAtYourSessionTranscriptToHelpUsImproveClaudeCode: string
  },
  'helpv2': {
    browseDefaultCommands: string
    browseCustomCommands: string
    noCustomCommandsFound: string
    browseAntOnlyCommands: string
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
  'config': {
    enableAutoUpdates: string
  },
  'statusComponent': {
    systemDiagnostics: string
  },
  'settingsUsage': {
    unlimited: string
    currentSession: 'string',
    currentWeekAll: 'string',
    currentWeekSonnet: 'string',
    error: 'string',
    loading: 'string',
    onlyAvailableForSubscriptions: 'string',
  },
  'diffdetailview': {
    noDiffContent: string
  },
  'diffdialog': {
    enterView: string
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
    youCanNowProceedWithImplementationYourPlanModeRestrictionsHaveBeenLifted: string
    pleaseReviseYourPlanBasedOnTheFeedbackAndCallExitPlanModeAgain: string
  },
  'shutdownmessage': {
    teammateIsContinuingToWorkYouMayRequestShutdownAgainLater: string
  },
  'systemtextmessage': {
    allBackgroundAgentsStopped: string
    allowed: string
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
    workflowRunsDesc: string,
  },

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
    unknownModel: (arg: string, resolvedModel: string) => string,
  },
  attachCmd: {
    alreadyAttached: (target: string) => string,
    attachRejected: (target: string, reason: string) => string,
    attachTimedOut: (target: string) => string,
    attachedAsMaster: (target: string, slaveCount: number) => string,
    controlledByMaster: string,
    failedToConnect: (target: string, tcpSuffix: string, reason: string) => string,
    tcpEndpoint: (host: string, port: number) => string,
    unknownReason: string,
    usage: string,
  },
  branchCmd: {
    branchedConversationResume: (titleInfo: string, sessionId: string) => string,
    branchedConversationSuccess: (titleInfo: string, resumeHint: string) => string,
    branchedConversationTitle: string,
    failedToBranch: (message: string) => string,
    noConversationToBranch: string,
    noMessagesToBranch: string,
    toResumeOriginal: (sessionId: string) => string,
  },
  claimMain: {
    allSubsBound: string,
    alreadyMain: string,
    machineId: (id: string) => string,
    mainClaimed: string,
    pipeName: (name: string) => string,
    pipeServerNotStarted: string,
    previousMain: (id: string) => string,
    usePipesVerify: string,
  },
  commitPushPr: {
    progressMessage: string,
  },
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
    waitingForFirstTrigger: string,
  },
  costCmd: {
    antOnlyCost: (cost: string) => string,
    usingOverage: string,
    usingSubscription: string,
  },
  debugToolCall: {
    input: string,
    lastToolCallsTitle: (count: number, total: number) => string,
    logFileNotFound: (path: string) => string,
    noPairsFound: (path: string) => string,
    noToolCallsYet: string,
    output: string,
    title: string,
    toolCallsAppearAfter: string,
  },
  detachCmd: {
    controlledByMaster: string,
    detachedAll: (count: number, names: string) => string,
    detachedFromTarget: (target: string) => string,
    notAttachedToAny: string,
    notAttachedToTarget: (target: string) => string,
  },
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
    secretsNote: string,
  },
  extraUsage: {
    alreadySubmitted: string,
    contactAdmin: string,
    failedOpenBrowser: (url: string) => string,
    requestSentEnable: string,
    requestSentIncrease: string,
    unlimitedExtraUsage: string,
  },
  filesCmd: {
    filesInContext: (fileList: string) => string,
    noFilesInContext: string,
  },
  forceSnip: {
    noMessagesToSnip: string,
    snipBoundary: string,
    snippedCount: (n: number) => string,
  },
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
    usageWithSessions: (names: string) => string,
  },
  initCmd: {
    descNew: string,
    descOld: string,
    progressMessage: string,
  },
  installCmd: {
    completedSuccessfully: string,
    failed: string,
    installingNativeBuild: (v: string) => string,
    lockFailed: string,
    setupNotes: string,
    successfullyInstalled: string,
    toGetStarted: string,
  },
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
    usageLine: string,
  },
  keybindingsCmd: {
    createdNew: (path: string) => string,
    notEnabled: string,
    openFailed: (opened: boolean, path: string, error: string) => string,
    openedExisting: (path: string) => string,
  },
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
    yourSocket: (socket: string) => string,
  },
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
    wallClockSeconds: (v: string) => string,
  },
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
    statusLine: (status: string, connected: string) => string,
  },
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
    yourPipe: (name: string) => string,
  },
  poorCmd: {
    disabledDetails: string,
    off: string,
    on: string,
    restoredDetails: string,
    statusMsg: (status: string, details: string) => string,
  },
  prComments: {
    progressMessage: string,
  },
  providerCmd: {
    cleared: string,
    currentProvider: (p: string) => string,
    invalid: (arg: string, valid: string) => string,
    set: (p: string) => string,
    setEnv: (p: string) => string,
    switchedGeminiMissing: string,
    switchedGrokMissing: string,
    switchedOpenaiMissing: (missing: string) => string,
  },
  recapCmd: {
    cancelled: string,
    failed: string,
    nothingToRecap: string,
  },
  releaseNotes: {
    changelogLink: (url: string) => string,
    versionHeader: (version: string) => string,
  },
  reloadPlugins: {
    agent: string,
    errorNoun: string,
    errorsDuringLoad: (countWithNoun: string) => string,
    hook: string,
    plugin: string,
    pluginLspServer: string,
    pluginMcpServer: string,
    reloaded: (list: string) => string,
    skill: string,
  },
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
    visibility: (v: string) => string,
  },
  skillLearning: {
    dryRun: (filtered: number, total: number) => string,
    evolveFound: (count: number) => string,
    evolveGenerated: (count: number, list: string) => string,
    evolveResult: (type: string, path: string) => string,
    exportFilters: (filters: string) => string,
    exported: (count: number, output: string) => string,
    globalEligible: (count: number) => string,
    imported: (filtered: number, total: number) => string,
    ingested: (observations: number, saved: number) => string,
    instinctAlreadyGlobal: (id: string) => string,
    instinctsCount: (n: number) => string,
    knownProjectsHeader: string,
    noActiveWrite: string,
    noGapFound: (key: string) => string,
    noInstinctFound: (id: string) => string,
    noKnownProjects: string,
    none: string,
    observationsCount: (n: number) => string,
    pendingGaps: (count: number) => string,
    projectLine: (name: string, id: string, instincts: number, obs: number, lastSeen: string) => string,
    promoteCandidatesHeader: (projectName: string, projectId: string) => string,
    promoteUsage: string,
    promotedGap: (key: string, status: string, draft: string) => string,
    promotedInstinct: (id: string) => string,
    pruned: (count: number) => string,
    sessionTooShort: (count: number, min: number) => string,
    statusHeader: (projectName: string, projectId: string) => string,
    usageDefault: string,
    usageImport: string,
    usageIngest: string,
    usagePromote: string,
    usagePromoteGap: string,
    usagePromoteInstinct: string,
  },
  statuslineCmd: {
    createAgent: (toolName: string, prompt: string) => string,
    defaultPrompt: string,
    progressMessage: string,
  },
  subscribePr: {
    alreadySubscribed: (ref: string, since: string) => string,
    listLine: (ref: string, since: string) => string,
    listTitle: string,
    noRepoDetected: string,
    noSubscriptions: string,
    notFound: (ref: string) => string,
    subscribed: (ref: string) => string,
    unrecognised: (ref: string) => string,
    unsubscribed: (ref: string) => string,
  },
  summaryCmd: {
    empty: string,
    failedGenerate: (err: string) => string,
    noMessages: string,
    unknownError: string,
    updated: (content: string) => string,
  },
  thinkbackPlay: {
    notInstalled: string,
    pathNotFound: string,
  },
  vimCmd: {
    editorModeSet: (mode: string) => string,
    normalHint: string,
    vimHint: string,
  },
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
    updateFailed: string,
  },

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
    unknownModel: (arg: string, resolvedModel: string) => string,
  },
  attachCmd: {
    alreadyAttached: (target: string) => string,
    attachRejected: (target: string, reason: string) => string,
    attachTimedOut: (target: string) => string,
    attachedAsMaster: (target: string, slaveCount: number) => string,
    controlledByMaster: string,
    failedToConnect: (target: string, tcpSuffix: string, reason: string) => string,
    tcpEndpoint: (host: string, port: number) => string,
    unknownReason: string,
    usage: string,
  },
  branchCmd: {
    branchedConversationResume: (titleInfo: string, sessionId: string) => string,
    branchedConversationSuccess: (titleInfo: string, resumeHint: string) => string,
    branchedConversationTitle: string,
    failedToBranch: (message: string) => string,
    noConversationToBranch: string,
    noMessagesToBranch: string,
    toResumeOriginal: (sessionId: string) => string,
  },
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
    usage: string,
  },
  claimMain: {
    allSubsBound: string,
    alreadyMain: string,
    machineId: (id: string) => string,
    mainClaimed: string,
    pipeName: (name: string) => string,
    pipeServerNotStarted: string,
    previousMain: (id: string) => string,
    usePipesVerify: string,
  },
  commitPushPr: {
    progressMessage: string,
  },
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
    waitingForFirstTrigger: string,
  },
  costCmd: {
    antOnlyCost: (cost: string) => string,
    usingOverage: string,
    usingSubscription: string,
  },
  debugToolCall: {
    input: string,
    lastToolCallsTitle: (count: number, total: number) => string,
    logFileNotFound: (path: string) => string,
    noPairsFound: (path: string) => string,
    noToolCallsYet: string,
    output: string,
    title: string,
    toolCallsAppearAfter: string,
  },
  detachCmd: {
    controlledByMaster: string,
    detachedAll: (count: number, names: string) => string,
    detachedFromTarget: (target: string) => string,
    notAttachedToAny: string,
    notAttachedToTarget: (target: string) => string,
  },
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
    secretsNote: string,
  },
  extraUsage: {
    alreadySubmitted: string,
    contactAdmin: string,
    failedOpenBrowser: (url: string) => string,
    requestSentEnable: string,
    requestSentIncrease: string,
    unlimitedExtraUsage: string,
  },
  filesCmd: {
    filesInContext: (fileList: string) => string,
    noFilesInContext: string,
  },
  forceSnip: {
    noMessagesToSnip: string,
    snipBoundary: string,
    snippedCount: (n: number) => string,
  },
  heapdumpCmd: {
    failed: (error: string) => string,
    success: (heapPath: string, diagPath: string) => string,
  },
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
    usageWithSessions: (names: string) => string,
  },
  initCmd: {
    descNew: string,
    descOld: string,
    progressMessage: string,
  },
  installCmd: {
    completedSuccessfully: string,
    failed: string,
    installingNativeBuild: (v: string) => string,
    lockFailed: string,
    setupNotes: string,
    successfullyInstalled: string,
    toGetStarted: string,
  },
  installSlackApp: {
    failedToOpen: (url: string) => string,
    opening: string,
  },
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
    usageLine: string,
  },
  keybindingsCmd: {
    createdNew: (path: string) => string,
    notEnabled: string,
    openFailed: (opened: boolean, path: string, error: string) => string,
    openedExisting: (path: string) => string,
  },
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
    yourSocket: (socket: string) => string,
  },
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
    wallClockSeconds: (v: string) => string,
  },
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
    statusLine: (status: string, connected: string) => string,
  },
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
    yourPipe: (name: string) => string,
  },
  poorCmd: {
    disabledDetails: string,
    off: string,
    on: string,
    restoredDetails: string,
    statusMsg: (status: string, details: string) => string,
  },
  prComments: {
    progressMessage: string,
  },
  providerCmd: {
    cleared: string,
    currentProvider: (p: string) => string,
    invalid: (arg: string, valid: string) => string,
    set: (p: string) => string,
    setEnv: (p: string) => string,
    switchedGeminiMissing: string,
    switchedGrokMissing: string,
    switchedOpenaiMissing: (missing: string) => string,
  },
  recapCmd: {
    cancelled: string,
    failed: string,
    nothingToRecap: string,
  },
  releaseNotes: {
    changelogLink: (url: string) => string,
    versionHeader: (version: string) => string,
  },
  reloadPlugins: {
    agent: string,
    errorNoun: string,
    errorsDuringLoad: (countWithNoun: string) => string,
    hook: string,
    plugin: string,
    pluginLspServer: string,
    pluginMcpServer: string,
    reloaded: (list: string) => string,
    skill: string,
  },
  sendCmd: {
    connectionClosed: (name: string) => string,
    failedToSend: (name: string, err: string) => string,
    notAttached: (name: string) => string,
    notMasterMode: string,
    sent: (name: string, msg: string) => string,
    usage: string,
  },
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
    visibility: (v: string) => string,
  },
  skillLearning: {
    dryRun: (filtered: number, total: number) => string,
    evolveFound: (count: number) => string,
    evolveGenerated: (count: number, list: string) => string,
    evolveResult: (type: string, path: string) => string,
    exportFilters: (filters: string) => string,
    exported: (count: number, output: string) => string,
    globalEligible: (count: number) => string,
    imported: (filtered: number, total: number) => string,
    ingested: (observations: number, saved: number) => string,
    instinctAlreadyGlobal: (id: string) => string,
    instinctsCount: (n: number) => string,
    knownProjectsHeader: string,
    noActiveWrite: string,
    noGapFound: (key: string) => string,
    noInstinctFound: (id: string) => string,
    noKnownProjects: string,
    none: string,
    observationsCount: (n: number) => string,
    pendingGaps: (count: number) => string,
    projectLine: (name: string, id: string, instincts: number, obs: number, lastSeen: string) => string,
    promoteCandidatesHeader: (projectName: string, projectId: string) => string,
    promoteUsage: string,
    promotedGap: (key: string, status: string, draft: string) => string,
    promotedInstinct: (id: string) => string,
    pruned: (count: number) => string,
    sessionTooShort: (count: number, min: number) => string,
    statusHeader: (projectName: string, projectId: string) => string,
    usageDefault: string,
    usageImport: string,
    usageIngest: string,
    usagePromote: string,
    usagePromoteGap: string,
    usagePromoteInstinct: string,
  },
  statuslineCmd: {
    createAgent: (toolName: string, prompt: string) => string,
    defaultPrompt: string,
    progressMessage: string,
  },
  stickersCmd: {
    failedToOpen: (url: string) => string,
    opening: string,
  },
  subscribePr: {
    alreadySubscribed: (ref: string, since: string) => string,
    listLine: (ref: string, since: string) => string,
    listTitle: string,
    noRepoDetected: string,
    noSubscriptions: string,
    notFound: (ref: string) => string,
    subscribed: (ref: string) => string,
    unrecognised: (ref: string) => string,
    unsubscribed: (ref: string) => string,
  },
  summaryCmd: {
    empty: string,
    failedGenerate: (err: string) => string,
    noMessages: string,
    unknownError: string,
    updated: (content: string) => string,
  },
  thinkbackPlay: {
    notInstalled: string,
    pathNotFound: string,
  },
  vimCmd: {
    editorModeSet: (mode: string) => string,
    normalHint: string,
    vimHint: string,
  },
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
    updateFailed: string,
  },

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
    unknownModel: (arg: string, resolvedModel: string) => string,
  },
  attachCmd: {
    alreadyAttached: (target: string) => string,
    attachRejected: (target: string, reason: string) => string,
    attachTimedOut: (target: string) => string,
    attachedAsMaster: (target: string, slaveCount: number) => string,
    controlledByMaster: string,
    failedToConnect: (target: string, tcpSuffix: string, reason: string) => string,
    tcpEndpoint: (host: string, port: number) => string,
    unknownReason: string,
    usage: string,
  },
  branchCmd: {
    branchedConversationResume: (titleInfo: string, sessionId: string) => string,
    branchedConversationSuccess: (titleInfo: string, resumeHint: string) => string,
    branchedConversationTitle: string,
    failedToBranch: (message: string) => string,
    noConversationToBranch: string,
    noMessagesToBranch: string,
    toResumeOriginal: (sessionId: string) => string,
  },
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
    usage: string,
  },
  claimMain: {
    allSubsBound: string,
    alreadyMain: string,
    machineId: (id: string) => string,
    mainClaimed: string,
    pipeName: (name: string) => string,
    pipeServerNotStarted: string,
    previousMain: (id: string) => string,
    usePipesVerify: string,
  },
  commitPushPr: {
    progressMessage: string,
  },
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
    waitingForFirstTrigger: string,
  },
  costCmd: {
    antOnlyCost: (cost: string) => string,
    usingOverage: string,
    usingSubscription: string,
  },
  debugToolCall: {
    input: string,
    lastToolCallsTitle: (count: number, total: number) => string,
    logFileNotFound: (path: string) => string,
    noPairsFound: (path: string) => string,
    noToolCallsYet: string,
    output: string,
    title: string,
    toolCallsAppearAfter: string,
  },
  detachCmd: {
    controlledByMaster: string,
    detachedAll: (count: number, names: string) => string,
    detachedFromTarget: (target: string) => string,
    notAttachedToAny: string,
    notAttachedToTarget: (target: string) => string,
  },
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
    secretsNote: string,
  },
  extraUsage: {
    alreadySubmitted: string,
    contactAdmin: string,
    failedOpenBrowser: (url: string) => string,
    requestSentEnable: string,
    requestSentIncrease: string,
    unlimitedExtraUsage: string,
  },
  filesCmd: {
    filesInContext: (fileList: string) => string,
    noFilesInContext: string,
  },
  forceSnip: {
    noMessagesToSnip: string,
    snipBoundary: string,
    snippedCount: (n: number) => string,
  },
  heapdumpCmd: {
    failed: (error: string) => string,
    success: (heapPath: string, diagPath: string) => string,
  },
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
    usageWithSessions: (names: string) => string,
  },
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
    worktreeRemoveSummary: string,
  },
  initCmd: {
    descNew: string,
    descOld: string,
    progressMessage: string,
  },
  installCmd: {
    completedSuccessfully: string,
    failed: string,
    installingNativeBuild: (v: string) => string,
    lockFailed: string,
    setupNotes: string,
    successfullyInstalled: string,
    toGetStarted: string,
  },
  installSlackApp: {
    failedToOpen: (url: string) => string,
    opening: string,
  },
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
    usageLine: string,
  },
  keybindingsCmd: {
    createdNew: (path: string) => string,
    notEnabled: string,
    openFailed: (opened: boolean, path: string, error: string) => string,
    openedExisting: (path: string) => string,
  },
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
    yourSocket: (socket: string) => string,
  },
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
    wallClockSeconds: (v: string) => string,
  },
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
    statusLine: (status: string, connected: string) => string,
  },
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
    yourPipe: (name: string) => string,
  },
  poorCmd: {
    disabledDetails: string,
    off: string,
    on: string,
    restoredDetails: string,
    statusMsg: (status: string, details: string) => string,
  },
  prComments: {
    progressMessage: string,
  },
  providerCmd: {
    cleared: string,
    currentProvider: (p: string) => string,
    invalid: (arg: string, valid: string) => string,
    set: (p: string) => string,
    setEnv: (p: string) => string,
    switchedGeminiMissing: string,
    switchedGrokMissing: string,
    switchedOpenaiMissing: (missing: string) => string,
  },
  recapCmd: {
    cancelled: string,
    failed: string,
    nothingToRecap: string,
  },
  releaseNotes: {
    changelogLink: (url: string) => string,
    versionHeader: (version: string) => string,
  },
  reloadPlugins: {
    agent: string,
    errorNoun: string,
    errorsDuringLoad: (countWithNoun: string) => string,
    hook: string,
    plugin: string,
    pluginLspServer: string,
    pluginMcpServer: string,
    reloaded: (list: string) => string,
    skill: string,
  },
  sendCmd: {
    connectionClosed: (name: string) => string,
    failedToSend: (name: string, err: string) => string,
    notAttached: (name: string) => string,
    notMasterMode: string,
    sent: (name: string, msg: string) => string,
    usage: string,
  },
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
    visibility: (v: string) => string,
  },
  skillLearning: {
    dryRun: (filtered: number, total: number) => string,
    evolveFound: (count: number) => string,
    evolveGenerated: (count: number, list: string) => string,
    evolveResult: (type: string, path: string) => string,
    exportFilters: (filters: string) => string,
    exported: (count: number, output: string) => string,
    globalEligible: (count: number) => string,
    imported: (filtered: number, total: number) => string,
    ingested: (observations: number, saved: number) => string,
    instinctAlreadyGlobal: (id: string) => string,
    instinctsCount: (n: number) => string,
    knownProjectsHeader: string,
    noActiveWrite: string,
    noGapFound: (key: string) => string,
    noInstinctFound: (id: string) => string,
    noKnownProjects: string,
    none: string,
    observationsCount: (n: number) => string,
    pendingGaps: (count: number) => string,
    projectLine: (name: string, id: string, instincts: number, obs: number, lastSeen: string) => string,
    promoteCandidatesHeader: (projectName: string, projectId: string) => string,
    promoteUsage: string,
    promotedGap: (key: string, status: string, draft: string) => string,
    promotedInstinct: (id: string) => string,
    pruned: (count: number) => string,
    sessionTooShort: (count: number, min: number) => string,
    statusHeader: (projectName: string, projectId: string) => string,
    usageDefault: string,
    usageImport: string,
    usageIngest: string,
    usagePromote: string,
    usagePromoteGap: string,
    usagePromoteInstinct: string,
  },
  statuslineCmd: {
    createAgent: (toolName: string, prompt: string) => string,
    defaultPrompt: string,
    progressMessage: string,
  },
  stickersCmd: {
    failedToOpen: (url: string) => string,
    opening: string,
  },
  subscribePr: {
    alreadySubscribed: (ref: string, since: string) => string,
    listLine: (ref: string, since: string) => string,
    listTitle: string,
    noRepoDetected: string,
    noSubscriptions: string,
    notFound: (ref: string) => string,
    subscribed: (ref: string) => string,
    unrecognised: (ref: string) => string,
    unsubscribed: (ref: string) => string,
  },
  summaryCmd: {
    empty: string,
    failedGenerate: (err: string) => string,
    noMessages: string,
    unknownError: string,
    updated: (content: string) => string,
  },
  thinkbackPlay: {
    notInstalled: string,
    pathNotFound: string,
  },
  vimCmd: {
    editorModeSet: (mode: string) => string,
    normalHint: string,
    vimHint: string,
  },
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
    updateFailed: string,
  },
  xaaIdp: {
    manageIdp: string,
    setupIdp: string,
    showIdpConfig: string,
    clearIdp: string,
  },
  mcpAddCmd: {
    addMcpServer: string,
  },
  modes: {
    defaultMode: string,
    gentleMode: string,
    sharpMode: string,
    workhorseMode: string,
    tokenSaverMode: string,
    superAiMode: string,
  },
  modelPicker: {
    currentModel: string,
    fastModeOnPrefix: string,
    fastModeOnSuffix: string,
    useFastMode: string,
  },
  modelSelector: {
    currentModelCustom: string,
  },
  remoteCallout: {
    labelEnable: string,
    descOpenConnection: string,
    labelNeverMind: string,
    descEnableLater: string,
  },
  sessionRunner: {
    sessionCompleted: string,
  },
  localMainSession: {
    backgroundSession: string,
  },
  torchCmd: {
    internalDevDebug: string,
  },
  ultraplanChoice: {
    labelImplementHere: string,
    descInjectPlan: string,
    labelStartNewSession: string,
    descClearConversation: string,
    labelCancel: string,
    descDontImplement: string,
  },
  ultraplanCmd: {
    refineLocalPlan: string,
  },
  remoteSetup: {
    defaultTrustedNetwork: string,
    continue: string,
    cancel: string,
  },
  insightsCmd: {
    generateReport: string,
    morning: string,
    afternoon: string,
    evening: string,
    night: string,
  },
  rateLimitOptions: {
    upgradePlan: string,
    stopAndWait: string,
  },
  webTools: {
    bsaPlaceholder: string,
    exaPlaceholder: string,
  },
  assistant: {
    inProcessTeam: string,
  },
  pluginHintMenu: {
    no: string,
  },
  desktopUpsell: {
    openInDesktop: string,
    notNow: string,
    dontAskAgain: string,
  },
  ideAutoConnect: {
    yes: string,
    no: string,
  },
  lspRecommendation: {
    noNotNow: string,
    disableAll: string,
  },
  managedSettingsSecurity: {
    yesTrust: string,
    noExit: string,
  },
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
    fileLabelAndOthers: (f1: string, n: string) => string,
  },
  settingsStatus: {
    cwd: string,
    model: string,
  },
  worktreeExit: {
    keepWorktreeAndTmux: string,
    keepWorktreeKillTmux: string,
    removeWorktreeAndTmux: string,
    keepWorktree: string,
    removeWorktree: string,
    keepingWorktree: string,
    removingWorktree: string,
  },
  agentEditor: {
    openInEditor: string,
    editTools: string,
    editModel: string,
    editColor: string,
  },
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
    editAgentTitle: string,
  },
  snapshotUpdate: {
    mergeSnapshot: string,
    keepCurrent: string,
    replaceWithSnapshot: string,
    title: string,
  },
  toolSelector: {
    continue: string,
    mcpServers: string,
    individualTools: string,
  },
  agentLocationStep: {
    project: string,
    personal: string,
  },
  agentMemoryStep: {
    userScopeRecommended: string,
    none: string,
    projectScope: string,
    localScope: string,
    projectScopeRecommended: string,
    userScope: string,
  },
  agentMethodStep: {
    generateWithClaude: string,
    manualConfig: string,
  },
  mcpRemoteServerMenu: {
    enable: string,
    viewTools: string,
    clearAuth: string,
    authenticate: string,
    reauthenticate: string,
    reconnect: string,
    disable: string,
    back: string,
  },
  mcpStdioServerMenu: {
    enable: string,
    disable: string,
    viewTools: string,
    reconnect: string,
    back: string,
  },
  memoryFileSelector: {
    openAutoMemoryFolder: string,
    openTeamMemoryFolder: string,
    autoDreamOn: string,
    dreamToRun: string,
  },
  questionView: {
    other: string,
  },
  submitQuestionsView: {
    submitAnswers: string,
    cancel: string,
  },
  enterPlanModePermission: {
    yesEnterPlanMode: string,
    noStartNow: string,
    exploreCodebase: string,
    identifyPatterns: string,
    designStrategy: string,
    presentPlan: string,
  },
  reviewArtifactPermission: {
    yesShowReview: string,
    noSkip: string,
  },
  addPermissionRules: {
    projectLocal: string,
    project: string,
    user: string,
  },
  ultraplanLaunch: {
    runUltraplan: string,
    notNow: string,
  },
  it2SetupPrompt: {
    installNow: string,
    useTmuxInstead: string,
    opensTeammatesTmux: string,
    cancel: string,
    skipTeammate: string,
    tryAgain: string,
    retryInstallation: string,
    fallsBackTmux: string,
    verifyConnection: string,
  },
  permissionExplainer: {
    provideExplanation: string,
    whatCommandDoes: string,
    whatCouldGoWrong: string,
  },
  ultracodeSkill: {
    scan: string,
    scanDetail: string,
    fix: string,
    fixDetail: string,
    reviewDescription: string,
    reviewPhase: string,
    verifyPhase: string,
  },
  globalSearch: {
    matches: string,
    searching: string,
    noMatches: string,
    typeToSearch: string,
    loading: string,
  },
  historySearch: {
    loading: string,
    noMatchingPrompts: string,
    noHistory: string,
  },
  quickOpen: {
    loadingPreview: string,
    typeToSearchFiles: string,
  },
  remoteEnvironment: {
    loadingEnvironments: string,
    updating: string,
  },
  diffDialog: {
    loadingDiff: string,
    noFileChanges: string,
    tooManyFiles: string,
    workingTreeClean: string,
  },
  elicitationDialog: {
    waitingForConfirmation: string,
  },
  managePlugins: {
    processing: string,
  },
  remoteSetup2: {
    checkingLoginStatus: string,
    connectingGithub: string,
  },
  resume2: {
    loadingConversations: string,
  },
  thinkback: {
    loadingThinkbackSkill: string,
  },
  desktopHandoff: {
    error: string,
    pressAnyKeyContinue: string,
    downloadNow: string,
  },
  effortPanel: {
    adjustHint: string,
  },
  bridgeDialog: {
    disconnectHint: string,
  },
  fallbackToolUseError: {
    toSeeAll: string,
  },
  ideAutoConnectDialog: {
    youCanAlsoConfigure: string,
  },
  passesLoading: {
    loadingGuestPass: string,
  },
  settingsUsage2: {
    extraUsageNotEnabled: string,
  },
  showInIde: {
    saveFileToContinue: string,
  },
  teammateSpinner: {
    enterToView: string,
    enterToCollapse: string,
  },
  diffDetail: {
    untracked: string,
    truncated: string,
  },
  mcpReconnect: {
    reconnectingTo: string,
    establishingConnection: string,
  },
  permissionRuleInput: {
    enterToSubmitEscToCancel: string,
  },
  shellProgress: {
    running: string,
  },
  skillsMenu: {
    createSkillsIn: string,
    typeToFilterSkills: string,
  },
  assistantToolUse: {
    waitingForPermission: string,
  },
  sandboxDoctor: {
    runSandbox: string,
  },
  voiceIndicator: {
    listening: string,
    keepHolding: string,
    voiceProcessing: string,
  },
  promptInputFooter: {
    enterToView: string,
    arrowKeysHint: string,
  },
  breakCachePanel: {
    selectRunClose: string,
  },
  fastCmd: {
    tabToToggle: string,
  },
  bridgeCmd2: {
    enterToSelectEscToContinue: string,
  },
  assistantCmd2: {
    enterToSelectEscToCancel: string,
  },
  teleportResume: {
    resumingSession: string,
    loadingTitle: string,
    failedToResume: string,
    pressEscToCancel: string,
  },
  agentDetail: {
    none: string,
    tellsWhenToUse: string,
    nSkills: string,
  },
  highlightedThinking: {
    you: string,
  },
}
