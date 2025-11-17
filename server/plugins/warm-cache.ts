/**
 * Nitro plugin to warm the cache with popular/important shows at server startup
 * This improves initial load times by pre-caching frequently accessed data
 * 
 * Strategy:
 * 1. Cache the all shows list (needed for homepage)
 * 2. Cache the first 6 shows from the top 5 genres (most visible on homepage)
 * 3. These are the shows users see first and click most often
 */

export default defineNitroPlugin(async (nitroApp) => {
  // Only warm cache in production builds
  if (import.meta.dev) {
    console.log('[Cache Warming] Skipped in development mode')
    return
  }

  console.log('[Cache Warming] Starting cache warming...')

  try {
    // Pre-fetch all shows list (homepage needs this)
    const allShows = await $fetch('/api/shows').catch((err) => {
      console.warn('[Cache Warming] Failed to warm shows list:', err.message)
      return []
    })

    if (!allShows || allShows.length === 0) {
      console.warn('[Cache Warming] No shows data available')
      return
    }

    // Group shows by genre and sort genres by show count
    const genreMap = new Map()
    allShows.forEach((show: any) => {
      if (show.genres && show.genres.length > 0) {
        show.genres.forEach((genre: string) => {
          if (!genreMap.has(genre)) {
            genreMap.set(genre, [])
          }
          genreMap.get(genre).push(show)
        })
      }
    })

    // Sort genres by number of shows (same as homepage logic)
    const sortedGenres = Array.from(genreMap.entries())
      .sort((a, b) => b[1].length - a[1].length)

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
    alwaysPopular.forEach(id => showsToCache.add(id))

    // Warm cache for all selected shows with most common countries
    const countries = ['US', 'GB', 'NL'] // Most common visitor countries
    const warmPromises: Promise<any>[] = []

    showsToCache.forEach((id) => {
      countries.forEach((country) => {
        warmPromises.push(
          $fetch(`/api/shows/${id}?country=${country}`).catch(() => {
            // Silently fail for individual shows
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

