/**
 * TVMaze API Cache Layer with Vercel KV
 * Provides global caching for TVMaze API responses to minimize API calls
 * and improve performance across all serverless instances
 */

import { logger } from '~/utils/logger'

/**
 * Get KV storage instance
 * Falls back to Nitro's regular cache in development
 */
function getCache() {
  return useStorage('cache')
}

/**
 * Cache TTL configurations (in seconds)
 */
const CACHE_TTL = {
  show: 60 * 60 * 24 * 7, // 7 days - shows rarely change
  episodes: 60 * 60 * 24 * 7, // 7 days - episodes don't change
  cast: 60 * 60 * 24 * 7, // 7 days - cast doesn't change often
  person: 60 * 60 * 24 * 7, // 7 days - person info rarely changes
  search: 60 * 60 * 24, // 24 hours - search results can be fresh
  allShows: 60 * 60 * 24, // 24 hours - show index updates daily
} as const

/**
 * Fetch with global cache
 * Checks Vercel KV first, falls back to API call if not cached
 */
async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number
): Promise<T> {
  const cache = getCache()

  try {
    // Try to get from cache
    const cached = await cache.getItem<T>(cacheKey)
    if (cached !== null) {
      logger.debug('TVMaze cache hit', {
        module: 'tvmaze-cache',
        cacheKey,
      })
      return cached
    }

    // Cache miss - fetch from API
    logger.debug('TVMaze cache miss', {
      module: 'tvmaze-cache',
      cacheKey,
    })

    const data = await fetchFn()

    // Store in cache with TTL
    await cache.setItem(cacheKey, data, {
      ttl,
    })

    return data
  } catch (error) {
    logger.error(
      'TVMaze cache error, falling back to direct fetch',
      {
        module: 'tvmaze-cache',
        cacheKey,
      },
      error
    )
    // On error, just fetch directly
    return await fetchFn()
  }
}

/**
 * Fetch show by ID with caching
 */
export async function getCachedShow(id: number): Promise<unknown> {
  const cacheKey = `tvmaze:show:${id}`

  return fetchWithCache(
    cacheKey,
    async () => {
      const response = await $fetch(`https://api.tvmaze.com/shows/${id}`, {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })
      return response
    },
    CACHE_TTL.show
  )
}

/**
 * Fetch episodes for a show with caching
 */
export async function getCachedEpisodes(showId: number): Promise<unknown[]> {
  const cacheKey = `tvmaze:episodes:${showId}`

  return fetchWithCache(
    cacheKey,
    async () => {
      const response = await $fetch<unknown[]>(
        `https://api.tvmaze.com/shows/${showId}/episodes`,
        {
          headers: {
            'User-Agent': 'BingeList/1.0',
          },
        }
      )
      return response
    },
    CACHE_TTL.episodes
  )
}

/**
 * Fetch cast for a show with caching
 */
export async function getCachedCast(showId: number): Promise<unknown[]> {
  const cacheKey = `tvmaze:cast:${showId}`

  return fetchWithCache(
    cacheKey,
    async () => {
      const response = await $fetch<unknown[]>(
        `https://api.tvmaze.com/shows/${showId}/cast`,
        {
          headers: {
            'User-Agent': 'BingeList/1.0',
          },
        }
      )
      return response
    },
    CACHE_TTL.cast
  )
}

/**
 * Fetch person by ID with caching
 */
export async function getCachedPerson(id: number): Promise<unknown> {
  const cacheKey = `tvmaze:person:${id}`

  return fetchWithCache(
    cacheKey,
    async () => {
      const response = await $fetch(`https://api.tvmaze.com/people/${id}`, {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })
      return response
    },
    CACHE_TTL.person
  )
}

/**
 * Fetch person cast credits with caching
 */
export async function getCachedPersonCredits(
  id: number
): Promise<unknown[]> {
  const cacheKey = `tvmaze:person-credits:${id}`

  return fetchWithCache(
    cacheKey,
    async () => {
      const response = await $fetch<unknown[]>(
        `https://api.tvmaze.com/people/${id}/castcredits?embed[]=show&embed[]=character`,
        {
          headers: {
            'User-Agent': 'BingeList/1.0',
          },
        }
      )
      return response
    },
    CACHE_TTL.person
  )
}

/**
 * Search shows with caching
 * Popular searches (e.g., "Breaking Bad") benefit from caching
 */
export async function getCachedSearch(query: string): Promise<unknown[]> {
  // Normalize query for consistent caching
  const normalizedQuery = query.toLowerCase().trim()
  const cacheKey = `tvmaze:search:${normalizedQuery}`

  return fetchWithCache(
    cacheKey,
    async () => {
      const response = await $fetch<unknown[]>(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'BingeList/1.0',
          },
        }
      )
      return response
    },
    CACHE_TTL.search
  )
}

/**
 * Fetch all shows with caching
 * This is expensive, so we cache it for 24 hours
 */
export async function getCachedAllShows(): Promise<unknown[]> {
  const cacheKey = 'tvmaze:all-shows'

  return fetchWithCache(
    cacheKey,
    async () => {
      const response = await $fetch<unknown[]>('https://api.tvmaze.com/shows', {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })
      return response
    },
    CACHE_TTL.allShows
  )
}

/**
 * Invalidate cache for a specific show
 * Useful for manual cache clearing if needed
 */
export async function invalidateShowCache(showId: number): Promise<void> {
  const cache = getCache()
  await Promise.all([
    cache.removeItem(`tvmaze:show:${showId}`),
    cache.removeItem(`tvmaze:episodes:${showId}`),
    cache.removeItem(`tvmaze:cast:${showId}`),
  ])

  logger.info('Show cache invalidated', {
    module: 'tvmaze-cache',
    showId,
  })
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  message: string
}> {
  return {
    message: 'Cache statistics available in Vercel KV dashboard',
  }
}

