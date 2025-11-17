/**
 * Nitro plugin to warm the cache at server startup
 * Pre-caches the shows list for search and homepage functionality
 *
 * Simplified to avoid rate limiting issues with TVMaze API
 * Individual shows are cached on-demand via normal user requests
 */

export default defineNitroPlugin(async (_nitroApp) => {
  // Skip cache warming during build time (Vercel build has no network access)
  // Only run in actual runtime (after deployment)
  if (import.meta.dev || import.meta.prerender) {
    console.log('[Cache Warming] Skipped - not in production runtime')
    return
  }

  console.log('[Cache Warming] Starting cache warming...')
  const startTime = Date.now()

  try {
    // Only warm the shows list (used for search and homepage)
    // This is the most critical endpoint to pre-cache
    const response = await $fetch('/api/shows').catch((err) => {
      console.warn('[Cache Warming] Failed to warm shows list:', err.message)
      return null
    })

    if (!response || !response.shows || response.shows.length === 0) {
      console.warn('[Cache Warming] No shows data available')
      return
    }

    const duration = Date.now() - startTime
    console.log(`[Cache Warming] ✓ Completed in ${duration}ms`)
    console.log(`[Cache Warming] ✓ Cached ${response.shows.length} shows`)
    console.log(
      `[Cache Warming] ✓ Cached ${Object.keys(response.showsByGenre || {}).length} genres`
    )
  } catch (error) {
    console.error('[Cache Warming] Error during cache warming:', error)
  }
})
