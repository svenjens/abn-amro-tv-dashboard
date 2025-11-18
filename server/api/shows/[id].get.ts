/**
 * Server API route to fetch a single show by ID
 * Combines TVMaze data with TMDB streaming availability and extra metadata
 * Uses Nitro caching for improved performance
 * Sanitizes HTML content server-side before sending to client
 */

import type { H3Event } from 'h3'
import type { TVMazeShow, ShowDetailsResponse, Show, StreamingAvailability } from '~/types'
import { isTVMazeShow } from '~/types'
import { sanitizeShowSummary } from '~/server/utils/sanitize'
import { TMDB_PROVIDER_MAP, STREAMING_PLATFORMS } from '~/types/streaming'
import { logger } from '~/utils/logger'
import {
  validateShowId,
  validateCountryCode,
  createValidationError,
} from '~/server/utils/validation'
import { ZodError } from 'zod'

// TMDB API response types
interface TMDBSearchResponse {
  results: Array<{
    id: number
    poster_path: string | null
    backdrop_path: string | null
    overview: string
    vote_average: number
    vote_count: number
    popularity: number
  }>
}

interface TMDBProvider {
  provider_id: number
  provider_name: string
  logo_path: string | null
}

interface TMDBProvidersResponse {
  results: {
    [countryCode: string]: {
      link?: string
      flatrate?: TMDBProvider[]
      buy?: TMDBProvider[]
      rent?: TMDBProvider[]
    }
  }
}

export default cachedEventHandler(
  async (event: H3Event) => {
    // Validate route parameters with Zod
    const rawId = getRouterParam(event, 'id')
    const query = getQuery(event)

    try {
      // Validate show ID
      if (!rawId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Show ID is required',
        })
      }

      const id = validateShowId(rawId)

      // Validate country code if provided
      const country = query.country ? validateCountryCode(query.country) : 'US'

      // Fetch show data from TVMaze
      const response = await $fetch<unknown>(`https://api.tvmaze.com/shows/${id}`, {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })

      // Validate response is a valid TVMaze show
      if (!isTVMazeShow(response)) {
        logger.error(
          'Invalid show response from TVMaze API',
          {
            module: 'api/shows/[id]',
            action: 'fetchShowById',
            showId: id,
            responseType: typeof response,
          },
          response
        )
        throw createError({
          statusCode: 500,
          statusMessage: 'Invalid show data received from API',
        })
      }

      // Type-safe: we know response is TVMazeShow now
      const show: TVMazeShow = response

      // Sanitize HTML content server-side
      if (show.summary) {
        show.summary = sanitizeShowSummary(show.summary)
      }

      const config = useRuntimeConfig()
      const tmdbApiKey = config.public.tmdbApiKey

      // Initialize combined response with proper typing
      // Use type assertion since TVMazeShow is structurally compatible with Show
      const combinedData: ShowDetailsResponse = {
        ...(show as unknown as Show),
        tmdb: null,
        streamingAvailability: [],
      }

      // If TMDB API key is available, fetch additional data
      if (tmdbApiKey) {
        try {
          // Search for the show on TMDB
          const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${encodeURIComponent(show.name)}`
          const searchResponse = await $fetch<TMDBSearchResponse>(searchUrl)

          if (
            searchResponse.results &&
            Array.isArray(searchResponse.results) &&
            searchResponse.results.length > 0
          ) {
            const tmdbShow = searchResponse.results[0]
            if (!tmdbShow) return combinedData

            const tmdbId = tmdbShow.id

            // Fetch watch providers for the user's country
            const providersUrl = `https://api.themoviedb.org/3/tv/${tmdbId}/watch/providers?api_key=${tmdbApiKey}`
            const providersResponse = await $fetch<TMDBProvidersResponse>(providersUrl)

            // Add TMDB data to combined response
            combinedData.tmdb = {
              id: tmdbId,
              posterPath: tmdbShow.poster_path,
              backdropPath: tmdbShow.backdrop_path,
              overview: tmdbShow.overview,
              voteAverage: tmdbShow.vote_average,
              voteCount: tmdbShow.vote_count,
              popularity: tmdbShow.popularity,
            }

            // Extract streaming providers for user's country
            const countryData = providersResponse.results?.[country]
            if (countryData) {
              const providers: StreamingAvailability[] = []

              // Helper function to transform TMDB provider to our StreamingAvailability format
              const transformProvider = (p: TMDBProvider, type: string): StreamingAvailability => {
                const tmdbProviderId = String(p.provider_id)
                // Map TMDB provider ID to our internal service ID
                const serviceId = TMDB_PROVIDER_MAP[tmdbProviderId] || tmdbProviderId
                const platform = STREAMING_PLATFORMS[serviceId]

                // Use our platform's homepage or fallback to TMDB/JustWatch link
                const link =
                  platform?.homePage ||
                  countryData.link ||
                  `https://www.themoviedb.org/tv/${tmdbId}`

                return {
                  service: {
                    id: serviceId, // Use our internal service ID
                    name: platform?.name || p.provider_name,
                    logo:
                      platform?.logo ||
                      (p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : ''),
                    link,
                    country,
                    type: type as StreamingAvailability['service']['type'],
                  },
                  link,
                  availableFrom: undefined,
                  availableUntil: undefined,
                }
              }

              // Flatrate (subscription services like Netflix, Disney+)
              if (Array.isArray(countryData.flatrate)) {
                providers.push(
                  ...countryData.flatrate.map((p) => transformProvider(p, 'subscription'))
                )
              }

              // Buy options
              if (Array.isArray(countryData.buy)) {
                providers.push(...countryData.buy.map((p) => transformProvider(p, 'buy')))
              }

              // Rent options
              if (Array.isArray(countryData.rent)) {
                providers.push(...countryData.rent.map((p) => transformProvider(p, 'rent')))
              }

              combinedData.streamingAvailability = providers
            }
          }
        } catch (tmdbError) {
          logger.warn('Failed to fetch TMDB data for show', {
            module: 'api/shows/[id]',
            action: 'fetchTMDBData',
            showId: id,
            showName: show.name,
            country,
            error: tmdbError instanceof Error ? tmdbError.message : String(tmdbError),
          })
          // Continue without TMDB data - not critical
        }
      }

      return combinedData
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        throw createError(createValidationError(error))
      }

      // Preserve existing H3/Nitro errors (from createError)
      if (error && typeof (error as any).statusCode === 'number') {
        throw error
      }

      logger.error(
        'Failed to fetch show details',
        {
          module: 'api/shows/[id]',
          action: 'fetchShowById',
          showId: rawId,
          country: query.country ? String(query.country) : 'US',
        },
        error
      )
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch show details',
      })
    }
  },
  {
    // Cache for 24 hours (show data rarely changes)
    maxAge: 60 * 60 * 24, // 24 hours in seconds
    name: 'show-details',
    getKey: (event) => {
      const id = getRouterParam(event, 'id') || 'unknown'
      const query = getQuery(event)
      const country = (query.country as string) || 'US'
      return `show-v2-${id}-${country}` // v2: includes TMDB_PROVIDER_MAP
    },
    swr: true,
    // Vary cache by country for streaming availability
    varies: ['country'],
  }
)
