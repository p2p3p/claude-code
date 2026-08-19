import OpenAI from 'openai'
import { getProxyFetchOptions } from 'src/utils/proxy.js'

let cachedClient: OpenAI | null = null

export function getGrokClient(options?: {
  maxRetries?: number
  fetchOverride?: typeof fetch
  source?: string
}): OpenAI {
  if (cachedClient) return cachedClient

  const apiKey = process.env.API_KEY || ''
  const baseURL = process.env.BASE_URL || ''

  const client = new OpenAI({
    apiKey,
    baseURL,
    maxRetries: options?.maxRetries ?? 0,
    timeout: parseInt(process.env.API_TIMEOUT_MS || String(600 * 1000), 10),
    dangerouslyAllowBrowser: true,
    fetchOptions: getProxyFetchOptions({ forAnthropicAPI: false }),
    ...(options?.fetchOverride && { fetch: options.fetchOverride })})

  if (!options?.fetchOverride) {
    cachedClient = client
  }

  return client
}

export function clearGrokClientCache(): void {
  cachedClient = null
}
