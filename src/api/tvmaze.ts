/**
 * TVMaze API Service
 *
 * Provides methods to interact with the TVMaze API
 * Documentation: https://www.tvmaze.com/api
 */

import axios, { type AxiosInstance, AxiosError } from 'axios'
import type { Show, SearchResult, ApiError, Episode, CastMember } from '@/types'
import { apiCache, searchCache, showCache, logger } from '@/utils'

const BASE_URL = 'https://api.tvmaze.com'

class TVMazeAPI {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          status: error.response?.status,
          details: error.response?.data,
        }
        logger.error('[API Error]', apiError)
        return Promise.reject(apiError)
      }
    )
  }

  /**
   * Fetch all TV shows from the show index
   * Note: This returns a paginated list. For production, implement proper pagination.
   */
  async fetchAllShows(): Promise<Show[]> {
    const cacheKey = 'all-shows'

    // Check cache
    const cached = apiCache.get(cacheKey)
    if (cached) {
      logger.debug(`[API Cache] Hit for ${cacheKey}`)
      return cached as Show[]
    }

    try {
      const response = await this.client.get<Show[]>('/shows')
      apiCache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Fetch a single show by ID with optional embed parameters
   * @param id - Show ID
   * @param embed - Optional embed parameters (e.g., 'cast', 'episodes')
   */
  async fetchShowById(id: number, embed?: string[]): Promise<Show> {
    const embedParam = embed ? `-${embed.join('-')}` : ''
    const cacheKey = `show-${id}${embedParam}`

    // Check cache
    const cached = showCache.get(cacheKey)
    if (cached) {
      logger.debug(`[API Cache] Hit for ${cacheKey}`)
      return cached as Show
    }

    const embedQuery = embed ? `?embed[]=${embed.join('&embed[]=')}` : ''

    try {
      const response = await this.client.get<Show>(`/shows/${id}${embedQuery}`)
      showCache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Search for shows by name
   * @param query - Search query
   */
  async searchShows(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return []
    }

    const cacheKey = `search-${query.toLowerCase()}`

    // Check cache
    const cached = searchCache.get(cacheKey)
    if (cached) {
      logger.debug(`[API Cache] Hit for ${cacheKey}`)
      return cached as SearchResult[]
    }

    try {
      const response = await this.client.get<SearchResult[]>('/search/shows', {
        params: { q: query },
      })
      searchCache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Fetch episodes for a show
   * @param showId - Show ID
   */
  async fetchEpisodes(showId: number): Promise<Episode[]> {
    const cacheKey = `episodes-${showId}`

    // Check cache
    const cached = showCache.get(cacheKey)
    if (cached) {
      logger.debug(`[API Cache] Hit for ${cacheKey}`)
      return cached as Episode[]
    }

    try {
      const response = await this.client.get<Episode[]>(`/shows/${showId}/episodes`)
      showCache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Fetch cast for a show
   * @param showId - Show ID
   */
  async fetchCast(showId: number): Promise<CastMember[]> {
    const cacheKey = `cast-${showId}`

    // Check cache
    const cached = showCache.get(cacheKey)
    if (cached) {
      logger.debug(`[API Cache] Hit for ${cacheKey}`)
      return cached as CastMember[]
    }

    try {
      const response = await this.client.get<CastMember[]>(`/shows/${showId}/cast`)
      showCache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    apiCache.clear()
    searchCache.clear()
    showCache.clear()
    logger.debug('[API Cache] All caches cleared')
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      api: apiCache.getStats(),
      search: searchCache.getStats(),
      show: showCache.getStats(),
    }
  }

  /**
   * Prune expired entries from all caches
   */
  pruneCache(): void {
    const apiPruned = apiCache.prune()
    const searchPruned = searchCache.prune()
    const showPruned = showCache.prune()

    logger.debug(`[API Cache] Pruned ${apiPruned + searchPruned + showPruned} expired entries`)
  }

  /**
   * Handle API errors and convert to ApiError type
   */
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status,
        details: error.response?.data,
      }
    }
    return {
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

// Export singleton instance
export const tvMazeAPI = new TVMazeAPI()

// Export class for testing purposes
export { TVMazeAPI }
