/**
 * TMDB API Client
 *
 * Client for The Movie Database (TMDB) API
 * Used to fetch multi-platform streaming availability data
 *
 * API Documentation: https://developers.themoviedb.org/3
 * Free tier: 40 requests per 10 seconds
 */

import axios, { type AxiosInstance } from 'axios'
import type {
  TMDBWatchProvidersResponse,
  TMDBSearchResponse,
  TMDBExternalIds,
  TMDBError,
} from '@/types/tmdb'
import { logger } from '@/utils/logger'
import { Cache } from '@/utils/cache'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Cache for TMDB data (24 hours TTL - streaming data doesn't change often)
const tmdbCache = new Cache<unknown>({
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  persistent: true,
  maxSize: 200,
  namespace: 'tmdb-cache',
})

class TMDBAPIClient {
  private client: AxiosInstance
  private enabled: boolean

  constructor() {
    this.enabled = !!TMDB_API_KEY && TMDB_API_KEY.length > 0
    
    if (!this.enabled) {
      logger.warn('[TMDB] API key not configured. Streaming availability will be limited.')
    }

    this.client = axios.create({
      baseURL: TMDB_BASE_URL,
      params: {
        api_key: TMDB_API_KEY,
      },
      timeout: 10000,
    })
  }

  /**
   * Check if TMDB API is enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Search for a TV show by name
   * Used to match TVMaze shows with TMDB IDs
   */
  async searchTVShow(query: string, year?: number): Promise<TMDBSearchResponse> {
    if (!this.enabled) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 }
    }

    const cacheKey = `search-tv-${query}-${year || 'any'}`
    const cached = tmdbCache.get(cacheKey) as TMDBSearchResponse | null
    if (cached) {
      logger.debug(`[TMDB] Cache hit for search: ${query}`)
      return cached
    }

    try {
      const params: Record<string, string | number> = {
        query,
        include_adult: 'false',
      }
      
      if (year) {
        params.first_air_date_year = year
      }

      const response = await this.client.get<TMDBSearchResponse>('/search/tv', { params })
      
      tmdbCache.set(cacheKey, response.data)
      logger.debug(`[TMDB] Found ${response.data.results.length} results for: ${query}`)
      
      return response.data
    } catch (error) {
      logger.error('[TMDB] Search error:', error)
      return { page: 1, results: [], total_pages: 0, total_results: 0 }
    }
  }

  /**
   * Get external IDs for a TV show (including TVDB/IMDB)
   * Useful for matching with TVMaze data
   */
  async getTVExternalIds(tmdbId: number): Promise<TMDBExternalIds | null> {
    if (!this.enabled) {
      return null
    }

    const cacheKey = `tv-external-ids-${tmdbId}`
    const cached = tmdbCache.get(cacheKey) as TMDBExternalIds | null
    if (cached) {
      return cached
    }

    try {
      const response = await this.client.get<TMDBExternalIds>(`/tv/${tmdbId}/external_ids`)
      tmdbCache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      logger.error(`[TMDB] Error fetching external IDs for ${tmdbId}:`, error)
      return null
    }
  }

  /**
   * Get watch providers (streaming availability) for a TV show
   * Returns data per country/region
   */
  async getTVWatchProviders(tmdbId: number): Promise<TMDBWatchProvidersResponse | null> {
    if (!this.enabled) {
      return null
    }

    const cacheKey = `tv-watch-providers-${tmdbId}`
    const cached = tmdbCache.get(cacheKey) as TMDBWatchProvidersResponse | null
    if (cached) {
      logger.debug(`[TMDB] Cache hit for watch providers: ${tmdbId}`)
      return cached
    }

    try {
      const response = await this.client.get<TMDBWatchProvidersResponse>(
        `/tv/${tmdbId}/watch/providers`
      )
      
      tmdbCache.set(cacheKey, response.data)
      logger.debug(`[TMDB] Fetched watch providers for TMDB ID: ${tmdbId}`)
      
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const tmdbError = error.response.data as TMDBError
        logger.error(`[TMDB] Error ${tmdbError.status_code}: ${tmdbError.status_message}`)
      } else {
        logger.error('[TMDB] Error fetching watch providers:', error)
      }
      return null
    }
  }

  /**
   * Get provider logo URL
   */
  getProviderLogoUrl(logoPath: string, size: 'w45' | 'w92' | 'w154' | 'w185' | 'original' = 'w92'): string {
    return `${TMDB_IMAGE_BASE_URL}/${size}${logoPath}`
  }

  /**
   * Find TMDB ID by searching for show name and matching with year
   * Returns the best match
   */
  async findTMDBId(showName: string, premiered?: string): Promise<number | null> {
    const year = premiered ? new Date(premiered).getFullYear() : undefined
    const searchResults = await this.searchTVShow(showName, year)

    if (!searchResults || searchResults.results.length === 0) {
      // Try without year if no results
      if (year) {
        const retryResults = await this.searchTVShow(showName)
        if (retryResults && retryResults.results.length > 0) {
          return retryResults.results[0]?.id || null
        }
      }
      return null
    }

    // Return the first (most relevant) result
    return searchResults.results[0]?.id || null
  }

  /**
   * Get streaming availability for a show by searching its name
   * Convenience method that combines search + watch providers
   */
  async getStreamingAvailability(
    showName: string,
    premiered?: string,
    country: string = 'NL'
  ): Promise<TMDBWatchProvidersResponse | null> {
    const tmdbId = await this.findTMDBId(showName, premiered)
    
    if (!tmdbId) {
      logger.debug(`[TMDB] No TMDB ID found for: ${showName}`)
      return null
    }

    const providers = await this.getTVWatchProviders(tmdbId)
    
    if (providers && providers.results[country]) {
      logger.debug(`[TMDB] Found streaming options in ${country} for: ${showName}`)
    }

    return providers
  }
}

// Export singleton instance
export const tmdbAPI = new TMDBAPIClient()

