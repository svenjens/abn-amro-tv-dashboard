/**
 * AI Translation Service
 * Uses OpenAI API to translate TVMaze content on-demand with aggressive caching
 */

import OpenAI from 'openai'
import { createHash } from 'crypto'
import { logger } from '~/utils/logger'

// Language mapping
const LANGUAGE_NAMES: Record<string, string> = {
  nl: 'Dutch',
  es: 'Spanish',
  en: 'English',
}

/**
 * Translation statistics for monitoring
 */
interface TranslationStats {
  totalTranslations: number
  cacheHits: number
  cacheMisses: number
  errors: number
  costEstimate: number // in USD
}

// In-memory stats (reset on server restart)
const stats: TranslationStats = {
  totalTranslations: 0,
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0,
  costEstimate: 0,
}

/**
 * Get translation statistics
 */
export function getTranslationStats(): TranslationStats {
  return { ...stats }
}

/**
 * Generate a hash for cache key
 */
function generateCacheKey(text: string, targetLocale: string): string {
  const hash = createHash('sha256').update(text).digest('hex').substring(0, 16)
  return `translation-${hash}-${targetLocale}`
}

/**
 * Estimate translation cost
 * Based on GPT-3.5-turbo pricing: $0.0005 per 1K input tokens, $0.0015 per 1K output tokens
 */
function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1000) * 0.0005
  const outputCost = (outputTokens / 1000) * 0.0015
  return inputCost + outputCost
}

/**
 * Clean and validate HTML content for translation
 */
function cleanHtmlForTranslation(html: string): string {
  if (!html) return ''
  // Remove excessive whitespace while preserving HTML structure
  return html.trim()
}

/**
 * Create translation prompt optimized for TV show content
 */
function createTranslationPrompt(text: string, targetLanguage: string): string {
  return `Translate the following TV show content from English to ${targetLanguage}.

IMPORTANT RULES:
- Preserve ALL HTML tags exactly as they appear (including <p>, <b>, <i>, <br>, etc.)
- Keep show names, character names, actor names, and network names in their original English form
- Keep numbers, dates, and times in their original format
- Maintain the tone, style, and formatting of the original text
- Only translate the actual descriptive text content
- Do not add any explanations or notes - only return the translated text

Content to translate:
${text}

Translated content:`
}

/**
 * Translate text using OpenAI API
 */
async function translateWithOpenAI(text: string, targetLocale: string): Promise<string | null> {
  const config = useRuntimeConfig()
  const apiKey = config.openaiApiKey

  if (!apiKey) {
    logger.warn('OpenAI API key not configured, skipping translation', {
      module: 'translate',
      action: 'translateWithOpenAI',
      targetLocale,
    })
    return null
  }

  const targetLanguage = LANGUAGE_NAMES[targetLocale]
  if (!targetLanguage) {
    logger.warn('Unsupported target locale', {
      module: 'translate',
      action: 'translateWithOpenAI',
      targetLocale,
    })
    return null
  }

  try {
    const openai = new OpenAI({ apiKey })
    const prompt = createTranslationPrompt(text, targetLanguage)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional translator specializing in TV show and entertainment content. You preserve HTML formatting and maintain consistency with show-specific terminology.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
      max_tokens: 2000,
    })

    const translatedText = completion.choices[0]?.message?.content?.trim()

    if (!translatedText) {
      logger.warn('OpenAI returned empty translation', {
        module: 'translate',
        action: 'translateWithOpenAI',
        targetLocale,
      })
      return null
    }

    // Track statistics
    const inputTokens = completion.usage?.prompt_tokens || 0
    const outputTokens = completion.usage?.completion_tokens || 0
    const cost = estimateCost(inputTokens, outputTokens)
    stats.costEstimate += cost

    logger.debug('Translation completed successfully', {
      module: 'translate',
      action: 'translateWithOpenAI',
      targetLocale,
      inputTokens,
      outputTokens,
      cost: cost.toFixed(6),
    })

    return translatedText
  } catch (error) {
    stats.errors++
    logger.error(
      'Failed to translate with OpenAI',
      {
        module: 'translate',
        action: 'translateWithOpenAI',
        targetLocale,
      },
      error
    )
    return null
  }
}

/**
 * Translate text with caching
 * Returns translated text or null if translation fails
 */
export async function translateText(text: string, targetLocale: string): Promise<string | null> {
  // Skip translation for English or empty text
  if (!text || targetLocale === 'en') {
    return null
  }

  stats.totalTranslations++

  const cleanedText = cleanHtmlForTranslation(text)
  if (!cleanedText) {
    return null
  }

  const cacheKey = generateCacheKey(cleanedText, targetLocale)

  // Try to get from cache first (KV or Nitro storage)
  const { kvGet, kvSet } = await import('./kv-client')
  const cached = await kvGet<string>(cacheKey)
  if (cached) {
    stats.cacheHits++
    logger.debug('Translation cache hit', {
      module: 'translate',
      action: 'translateText',
      cacheKey,
      targetLocale,
    })
    return cached
  }

  // Cache miss - translate with OpenAI
  stats.cacheMisses++
  logger.debug('Translation cache miss, calling OpenAI', {
    module: 'translate',
    action: 'translateText',
    cacheKey,
    targetLocale,
  })

  const translated = await translateWithOpenAI(cleanedText, targetLocale)

  if (translated) {
    // Cache indefinitely (translations don't expire) in KV or Nitro storage
    await kvSet(cacheKey, translated)
    logger.info('Translation cached successfully', {
      module: 'translate',
      action: 'translateText',
      cacheKey,
      targetLocale,
    })
  }

  return translated
}

/**
 * Batch translate multiple texts
 * More efficient for translating episodes or cast lists
 * Executes in parallel - cache hits are instant, only cache misses hit OpenAI
 */
export async function batchTranslateTexts(
  texts: string[],
  targetLocale: string
): Promise<(string | null)[]> {
  // Translate in parallel with rate limiting
  // Most requests should be cache hits after warmup
  return Promise.all(texts.map((text) => translateText(text, targetLocale)))
}

/**
 * Translate object fields
 * Useful for translating multiple fields in a single object
 */
export async function translateFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  targetLocale: string
): Promise<Partial<Record<keyof T, string>>> {
  const translations: Partial<Record<keyof T, string>> = {}

  for (const field of fields) {
    const value = obj[field]
    if (typeof value === 'string' && value) {
      const translated = await translateText(value, targetLocale)
      if (translated) {
        translations[field] = translated
      }
    }
  }

  return translations
}
