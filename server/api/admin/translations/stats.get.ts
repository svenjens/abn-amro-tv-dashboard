/**
 * Translation Statistics Endpoint
 * Provides metrics about translation usage, cache performance, and cost estimates
 * For monitoring and optimization purposes
 */

import { getTranslationStats } from '~/server/utils/translate'

export default defineEventHandler(async (event) => {
  // Get translation statistics
  const stats = getTranslationStats()

  // Calculate cache hit rate
  const cacheHitRate =
    stats.totalTranslations > 0
      ? ((stats.cacheHits / stats.totalTranslations) * 100).toFixed(2)
      : '0.00'

  return {
    ...stats,
    cacheHitRate: `${cacheHitRate}%`,
    status: 'operational',
    timestamp: new Date().toISOString(),
  }
})

