/**
 * Domestic (China) LLM provider presets with URLs, pricing, and model data.
 * All providers are OpenAI-compatible — just swap baseURL + apiKey.
 */

export type ProviderModel = {
  id: string
  label: string
  inputPricePerMTok: number
  outputPricePerMTok: number
  contextWindow: string
  free?: boolean
  tags?: string[]
  deprecated?: string
}

export type CodingPlanTier = {
  id: string
  label: string
  price: string
  credits: string
  description: string
}

export type ProviderPreset = {
  id: string
  label: string
  description: string
  icon: string
  baseURL: string
  apiKeyPage: string
  modelsPage: string
  freeTier: string
  keyFormat: string
  codingPlan?: {
    baseURL: string
    keyFormat: string
    purchasePage: string
    tiers: CodingPlanTier[]
  }
  models: ProviderModel[]
}

export const CHINA_LLM_PROVIDERS: ProviderPreset[] = [
  {
    id: 'deepseek',
    label: 'DeepSeek',
    description: 'Cheapest pricing, best code, 5M free tokens',
    icon: '\u{1F525}',
    baseURL: 'https://api.deepseek.com/v1',
    apiKeyPage: 'https://platform.deepseek.com/api_keys',
    modelsPage: 'https://api-docs.deepseek.com/zh-cn/',
    freeTier: '5M tokens on signup (30 days), min top-up ¥10',
    keyFormat: 'sk-...',
    models: [
      {
        id: 'deepseek-v4-pro',
        label: 'DeepSeek V4 Pro',
        inputPricePerMTok: 3,
        outputPricePerMTok: 6,
        contextWindow: '1M',
        tags: ['Recommended', 'Best code']},
      {
        id: 'deepseek-v4-flash',
        label: 'DeepSeek V4 Flash',
        inputPricePerMTok: 1,
        outputPricePerMTok: 2,
        contextWindow: '1M',
        tags: ['Fast']},
    ]},
  {
    id: 'zhipu',
    label: 'Zhipu GLM',
    description: 'Free models, Coding Plan, strong reasoning',
    icon: '\u{1F9E0}',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyPage: 'https://open.bigmodel.cn/user/apiKeys',
    modelsPage: 'https://docs.bigmodel.cn/cn/guide/start/model-overview',
    freeTier: 'GLM-4.7-Flash / GLM-Z1-Flash free forever',
    keyFormat: '{id}.{secret}',
    codingPlan: {
      baseURL: 'https://open.bigmodel.cn/api/coding/paas/v4',
      keyFormat: '{id}.{secret}',
      purchasePage: 'https://bigmodel.cn/claude-code',
      tiers: [
        {
          id: 'lite',
          label: 'Lite',
          price: '¥72/mo ($30/quarter)',
          credits: '~400 prompts/week',
          description: 'GLM-5.1/5-Turbo/4.7/4.5-Air, MCP tools'},
        {
          id: 'pro',
          label: 'Pro',
          price: '¥216/mo ($90/quarter)',
          credits: '~2000 prompts/week',
          description: 'Lite + GLM-5, 5x quota'},
        {
          id: 'max',
          label: 'Max',
          price: '¥576/mo ($240/quarter)',
          credits: '~8000 prompts/week',
          description: '4x Pro quota for heavy use'},
      ]},
    models: [
      {
        id: 'glm-5.1',
        label: 'GLM-5.1',
        inputPricePerMTok: 10.1,
        outputPricePerMTok: 31.7,
        contextWindow: '203K',
        tags: ['Flagship']},
      {
        id: 'glm-4.7',
        label: 'GLM-4.7',
        inputPricePerMTok: 4.3,
        outputPricePerMTok: 15.8,
        contextWindow: '205K',
        tags: ['Recommended']},
      {
        id: 'glm-4.7-flash',
        label: 'GLM-4.7 Flash',
        inputPricePerMTok: 0,
        outputPricePerMTok: 0,
        contextWindow: '203K',
        free: true,
        tags: ['Free forever']},
    ]},
  {
    id: 'qwen',
    label: 'Tongyi Qianwen',
    description: 'Alibaba Cloud, Coding Plan, 90-day free tier',
    icon: '☁️',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKeyPage: 'https://bailian.console.aliyun.com',
    modelsPage:
      'https://help.aliyun.com/zh/model-studio/getting-started/models',
    freeTier: '90-day free tier for all models after activation',
    keyFormat: 'sk-...',
    codingPlan: {
      baseURL: 'https://coding.dashscope.aliyuncs.com/v1',
      keyFormat: 'sk-sp-...',
      purchasePage: 'https://bailian.console.aliyun.com',
      tiers: [
        {
          id: 'pro',
          label: 'Pro',
          price: '¥200/mo',
          credits: 'Includes Qwen/GLM/Kimi/MiniMax models',
          description: 'Entry tier (Lite discontinued 2026/03)'},
      ]},
    models: [
      {
        id: 'qwen3-max',
        label: 'Qwen3 Max',
        inputPricePerMTok: 2.5,
        outputPricePerMTok: 10,
        contextWindow: '262K',
        tags: ['Flagship']},
      {
        id: 'qwen3.5-plus',
        label: 'Qwen3.5 Plus',
        inputPricePerMTok: 0.8,
        outputPricePerMTok: 4.8,
        contextWindow: '1M',
        tags: ['Recommended', 'Value']},
      {
        id: 'qwen3.5-flash',
        label: 'Qwen3.5 Flash',
        inputPricePerMTok: 0.2,
        outputPricePerMTok: 2,
        contextWindow: '1M',
        tags: ['Fast']},
    ]},
  {
    id: 'mimo',
    label: 'MiMo Xiaomi',
    description: '1M context, 128K output, Token Plan, open source',
    icon: '\u{1F4F1}',
    baseURL: 'https://api.xiaomimimo.com/v1',
    apiKeyPage: 'https://platform.xiaomimimo.com/api-keys',
    modelsPage: 'https://platform.xiaomimimo.com/models',
    freeTier: 'Credits for new users, mimo-v2-flash low cost',
    keyFormat: 'sk-...',
    codingPlan: {
      baseURL: 'https://token-plan-cn.xiaomimimo.com/v1',
      keyFormat: 'tp-...',
      purchasePage: 'https://platform.xiaomimimo.com/token-plan',
      tiers: [
        {
          id: 'lite',
          label: 'Lite',
          price: '¥39/mo ($6/mo)',
          credits: '4.1B Credits/mo',
          description: 'Light use, all MiMo models'},
        {
          id: 'standard',
          label: 'Standard',
          price: '¥99/mo ($16/mo)',
          credits: '11B Credits/mo',
          description: '2.7x Lite, daily coding'},
        {
          id: 'pro',
          label: 'Pro',
          price: '¥329/mo ($50/mo)',
          credits: '38B Credits/mo',
          description: '9x Lite, heavy complex projects'},
        {
          id: 'max',
          label: 'Max',
          price: '¥659/mo ($100/mo)',
          credits: '82B Credits/mo',
          description: '20x Lite, team-level usage'},
      ]},
    models: [
      {
        id: 'mimo-v2.5-pro',
        label: 'MiMo V2.5 Pro',
        inputPricePerMTok: 3,
        outputPricePerMTok: 6,
        contextWindow: '1M',
        tags: ['Recommended', 'Flagship']},
      {
        id: 'mimo-v2.5',
        label: 'MiMo V2.5',
        inputPricePerMTok: 1,
        outputPricePerMTok: 2,
        contextWindow: '1M',
        tags: ['Multimodal']},
      {
        id: 'mimo-v2-flash',
        label: 'MiMo V2 Flash',
        inputPricePerMTok: 0.7,
        outputPricePerMTok: 2.1,
        contextWindow: '256K',
        tags: ['Fast']},
    ]},
  {
    id: 'kimi',
    label: 'Moonshot Kimi',
    description: 'Long context, strong reasoning, kimi-k3 flagship',
    icon: '\u{1F310}',
    baseURL: 'https://api.moonshot.cn/v1',
    apiKeyPage: 'https://platform.moonshot.cn/console',
    modelsPage: 'https://platform.kimi.com/docs',
    freeTier: 'Free credits for new users, cheap kimi-k2.6',
    keyFormat: 'sk-...',
    models: [
      {
        id: 'kimi-k3',
        label: 'Kimi K3',
        inputPricePerMTok: 3.2,
        outputPricePerMTok: 9.6,
        contextWindow: '256K',
        tags: ['Flagship', 'Recommended']},
      {
        id: 'kimi-k2.6',
        label: 'Kimi K2.6',
        inputPricePerMTok: 1.2,
        outputPricePerMTok: 6,
        contextWindow: '256K',
        tags: ['Value']},
      {
        id: 'kimi-k2.5',
        label: 'Kimi K2.5',
        inputPricePerMTok: 1.5,
        outputPricePerMTok: 7,
        contextWindow: '128K',
        tags: ['Stable']},
    ]},
  {
    id: 'siliconflow',
    label: 'SiliconFlow',
    description: 'Aggregator of 100+ models (Qwen/DeepSeek/GLM etc)',
    icon: '\u{1F30A}',
    baseURL: 'https://api.siliconflow.cn/v1',
    apiKeyPage: 'https://cloud.siliconflow.cn/account/ak',
    modelsPage: 'https://siliconflow.cn/models',
    freeTier: 'Free models in playground, user-friendly pricing',
    keyFormat: 'sk-...',
    models: [
      {
        id: 'deepseek-ai/DeepSeek-V3.2',
        label: 'DeepSeek V3.2',
        inputPricePerMTok: 2,
        outputPricePerMTok: 3,
        contextWindow: '128K',
        tags: ['Recommended']},
      {
        id: 'Qwen/Qwen3-235B-A22B',
        label: 'Qwen3 235B',
        inputPricePerMTok: 0.5,
        outputPricePerMTok: 1.2,
        contextWindow: '128K',
        tags: ['Value']},
      {
        id: 'zai-org/GLM-4.7',
        label: 'GLM-4.7',
        inputPricePerMTok: 0.4,
        outputPricePerMTok: 1.2,
        contextWindow: '128K',
        tags: ['GLM']},
      {
        id: 'Pro/deepseek-ai/DeepSeek-R1',
        label: 'DeepSeek R1',
        inputPricePerMTok: 4,
        outputPricePerMTok: 16,
        contextWindow: '64K',
        tags: ['Reasoning']},
    ]},
  {
    id: 'minimax',
    label: 'MiniMax',
    description: 'M-series multimodal, candy-popping price',
    icon: '\u{1F36B}',
    baseURL: 'https://api.minimax.chat/v1',
    apiKeyPage: 'https://platform.minimax.chat/user-center/basic-information/interface-key',
    modelsPage: 'https://platform.minimax.chat/document/Model',
    freeTier: 'Free credits for new users',
    keyFormat: 'sk-...',
    models: [
      {
        id: 'MiniMax-M3',
        label: 'MiniMax M3',
        inputPricePerMTok: 2,
        outputPricePerMTok: 8,
        contextWindow: '1M',
        tags: ['Flagship', 'Recommended']},
      {
        id: 'MiniMax-M2',
        label: 'MiniMax M2',
        inputPricePerMTok: 1,
        outputPricePerMTok: 4,
        contextWindow: '200K',
        tags: ['Value']},
    ]},
  {
    id: 'stepfun',
    label: 'StepFun Infinity',
    description: 'step-3.7-flash multimodal reasoning, Step Plan',
    icon: '\u{1F4A1}',
    baseURL: 'https://api.stepfun.com/v1',
    apiKeyPage: 'https://platform.stepfun.com/console/app/apikeys',
    modelsPage: 'https://platform.stepfun.com/docs',
    freeTier: 'New-user credits, cheap flash-tier models',
    keyFormat: 'sk-...',
    models: [
      {
        id: 'step-3.5-flash',
        label: 'Step 3.5 Flash',
        inputPricePerMTok: 0.4,
        outputPricePerMTok: 0.8,
        contextWindow: '200K',
        tags: ['Recommended', 'Value']},
      {
        id: 'step-3.7-flash',
        label: 'Step 3.7 Flash',
        inputPricePerMTok: 0.5,
        outputPricePerMTok: 1.2,
        contextWindow: '200K',
        tags: ['Multimodal']},
    ]},
  {
    id: 'ark',
    label: 'Volcano Ark (Doubao)',
    description: 'ByteDance Doubao models via Ark API (Beijing)',
    icon: '\u{1F355}',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKeyPage: 'https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey',
    modelsPage: 'https://www.volcengine.com/docs/82379/1330310',
    freeTier: 'Free trial quota on signup',
    keyFormat: 'sk-...',
    models: [
      {
        id: 'doubao-1.5-pro-256k',
        label: 'Doubao 1.5 Pro 256K',
        inputPricePerMTok: 0.8,
        outputPricePerMTok: 2,
        contextWindow: '256K',
        tags: ['Recommended']},
      {
        id: 'doubao-1.5-lite-32k',
        label: 'Doubao 1.5 Lite 32K',
        inputPricePerMTok: 0.3,
        outputPricePerMTok: 0.6,
        contextWindow: '32K',
        tags: ['Fast', 'Cheap']},
    ]},
  {
    id: 'qianfan',
    label: 'Baidu Qianfan ERNIE',
    description: 'ERNIE series with enterprise SLA',
    icon: '\u{1F6B0}',
    baseURL: 'https://qianfan.baidubce.com/v2',
    apiKeyPage: 'https://console.bce.baidu.com/qianfan/ais/console/onlineService',
    modelsPage: 'https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html',
    freeTier: 'Free quota for new users',
    keyFormat: 'bce-v3/...',
    models: [
      {
        id: 'ernie-5.1',
        label: 'ERNIE 5.1',
        inputPricePerMTok: 2,
        outputPricePerMTok: 8,
        contextWindow: '128K',
        tags: ['Flagship', 'Recommended']},
      {
        id: 'ernie-4.0-turbo-8k',
        label: 'ERNIE 4.0 Turbo',
        inputPricePerMTok: 1.2,
        outputPricePerMTok: 3,
        contextWindow: '8K',
        tags: ['Fast']},
    ]},
  {
    id: 'hunyuan',
    label: 'Tencent Hunyuan',
    description: 'hunyuan-turbos-latest, moving to TokenHub',
    icon: '\u{1F9ED}',
    baseURL: 'https://api.hunyuan.cloud.tencent.com/v1',
    apiKeyPage: 'https://console.cloud.tencent.com/hunyuan/chat',
    modelsPage: 'https://cloud.tencent.com/document/product/1729/111007',
    freeTier: 'Free quota for new users',
    keyFormat: 'sk-...',
    models: [
      {
        id: 'hunyuan-turbos-latest',
        label: 'Hunyuan TurboS',
        inputPricePerMTok: 0.5,
        outputPricePerMTok: 2,
        contextWindow: '256K',
        tags: ['Recommended']},
      {
        id: 'hunyuan-latest',
        label: 'Hunyuan',
        inputPricePerMTok: 0.8,
        outputPricePerMTok: 2.4,
        contextWindow: '256K',
        tags: ['Stable']},
    ]},
]

export function findChinaProviderById(id: string): ProviderPreset | undefined {
  return CHINA_LLM_PROVIDERS.find(p => p.id === id)
}

export function resolveChinaProviderBaseURL(
  providerId: string,
  mode: 'api' | 'coding-plan',
): string {
  const provider = findChinaProviderById(providerId)
  if (!provider) return ''
  if (mode === 'coding-plan' && provider.codingPlan) {
    return provider.codingPlan.baseURL
  }
  return provider.baseURL
}
