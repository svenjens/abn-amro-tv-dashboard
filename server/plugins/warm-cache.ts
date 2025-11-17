/**
 * Nitro plugin to warm the cache with popular/important shows at server startup
 * This improves initial load times by pre-caching frequently accessed data
 *
 * Strategy:
 * 1. Cache the all shows list (needed for homepage)
 * 2. Cache the first 6 shows from the top 5 genres (most visible on homepage)
 * 3. These are the shows users see first and click most often
 */

/**
 * Retry helper with exponential backoff
 */
async function fetchWithRetry(url: string, maxRetries = 3, baseDelay = 500): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await $fetch(url)
    } catch (err) {
      if (i === maxRetries - 1) throw err
      // Exponential backoff: 500ms, 1000ms, 2000ms
      const delay = baseDelay * Math.pow(2, i)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

export default defineNitroPlugin(async (_nitroApp) => {
  // Skip cache warming during build time (Vercel build has no network access)
  // Only run in actual runtime (after deployment)
  if (import.meta.dev || import.meta.prerender) {
    console.log('[Cache Warming] Skipped - not in production runtime')
    return
  }

  console.log('[Cache Warming] Starting cache warming...')

  try {
    // Pre-fetch all shows list (homepage needs this) with retry logic
    const response = (await fetchWithRetry('/api/shows').catch((err) => {
      console.warn('[Cache Warming] Failed to warm shows list after retries:', err.message)
      return null
    })) as { shows: any[]; showsByGenre: Record<string, any[]> } | null

    if (!response || !response.shows || response.shows.length === 0) {
      console.warn('[Cache Warming] No shows data available')
      return
    }

    const showsByGenre = response.showsByGenre

    // Use pre-sorted genres from server response
    const sortedGenres = Object.entries(showsByGenre).sort((a, b) => b[1].length - a[1].length)

    // Get the first 6 shows from the top 5 genres (these are visible on homepage)
    const showsToCache = new Set()
    const topGenresCount = 5
    const showsPerGenre = 6

    sortedGenres.slice(0, topGenresCount).forEach(([genre, shows]) => {
      console.log(`[Cache Warming] Warming ${genre} genre (${shows.length} shows)`)
      shows.slice(0, showsPerGenre).forEach((show: any) => {
        showsToCache.add(show.id)
      })
    })

    // Also add some universally popular shows
    const alwaysPopular = [
      82, // Game of Thrones
      169, // Breaking Bad
      216, // Rick and Morty
      335, // Sherlock
      67, // Westworld
    ]
    alwaysPopular.forEach((id) => showsToCache.add(id))

    // Warm cache for all selected shows with most common countries
    const countries = ['US', 'GB', 'NL'] // Most common visitor countries
    const warmPromises: Promise<any>[] = []

    showsToCache.forEach((id) => {
      countries.forEach((country) => {
        warmPromises.push(
          fetchWithRetry(`/api/shows/${id}?country=${country}`, 2, 300).catch(() => {
            // Silently fail for individual shows after retries
          })
        )
      })
    })

    await Promise.allSettled(warmPromises)

    console.log(
      `[Cache Warming] Warmed cache for ${showsToCache.size} shows across ${countries.length} countries (${warmPromises.length} total requests)`
    )
  } catch (error) {
    console.error('[Cache Warming] Error during cache warming:', error)
  }
})
