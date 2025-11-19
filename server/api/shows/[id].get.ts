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
import { translateText } from '~/server/utils/translate'
import { getLocaleFromRequest, needsTranslation } from '~/server/utils/language'

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

/**
 * Fetch show data from TVMaze API with caching
 */
async function fetchShowFromTVMaze(id: number): Promise<TVMazeShow> {
  // Use cached version for better performance
  const { getCachedShow } = await import('~/server/utils/tvmaze-cache')
  const response = await getCachedShow(id)

  // Validate response is a valid TVMaze show
  if (!isTVMazeShow(response)) {
    logger.error(
      'Invalid show response from TVMaze API',
      {
        module: 'api/shows/[id]',
        action: 'fetchShowFromTVMaze',
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

  return response
}

/**
 * Search for show on TMDB by name
 */
async function searchTMDBShow(
  showName: string,
  apiKey: string
): Promise<TMDBSearchResponse['results'][0] | null> {
  const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(showName)}`
  const searchResponse = await $fetch<TMDBSearchResponse>(searchUrl)

  if (
    searchResponse.results &&
    Array.isArray(searchResponse.results) &&
    searchResponse.results.length > 0
  ) {
    return searchResponse.results[0] || null
  }

  return null
}

/**
 * Fetch watch providers from TMDB
 */
async function fetchTMDBProviders(tmdbId: number, apiKey: string): Promise<TMDBProvidersResponse> {
  const providersUrl = `https://api.themoviedb.org/3/tv/${tmdbId}/watch/providers?api_key=${apiKey}`
  return await $fetch<TMDBProvidersResponse>(providersUrl)
}

/**
 * Transform TMDB provider to our StreamingAvailability format
 */
function transformProvider(
  provider: TMDBProvider,
  type: string,
  country: string,
  tmdbId: number,
  countryLink: string | undefined,
  showName: string
): StreamingAvailability {
  const tmdbProviderId = String(provider.provider_id)
  // Map TMDB provider ID to our internal service ID
  const serviceId = TMDB_PROVIDER_MAP[tmdbProviderId]
  const platform = serviceId ? STREAMING_PLATFORMS[serviceId] : undefined

  // Log unknown providers for future mapping
  if (!serviceId) {
    logger.info('Unknown TMDB provider encountered', {
      module: 'api/shows/[id]',
      action: 'transformProvider',
      tmdbProviderId,
      providerName: provider.provider_name,
      country,
      showName,
    })
  }

  // For unmapped providers, create a unique ID from the provider name
  const finalServiceId = serviceId || `tmdb-${tmdbProviderId}`

  // Use our platform's homepage or fallback to TMDB/JustWatch link
  const link = platform?.homePage || countryLink || `https://www.themoviedb.org/tv/${tmdbId}`

  return {
    service: {
      id: finalServiceId,
      name: platform?.name || provider.provider_name,
      logo:
        platform?.logo ||
        (provider.logo_path ? `https://image.tmdb.org/t/p/original${provider.logo_path}` : ''),
      link,
      country,
      type: type as StreamingAvailability['service']['type'],
    },
    link,
    availableFrom: undefined,
    availableUntil: undefined,
  }
}

/**
 * Extract streaming providers for a specific country
 */
function extractStreamingProviders(
  countryData: NonNullable<TMDBProvidersResponse['results'][string]>,
  country: string,
  tmdbId: number,
  showName: string
): StreamingAvailability[] {
  const providers: StreamingAvailability[] = []

  // Flatrate (subscription services like Netflix, Disney+)
  if (Array.isArray(countryData.flatrate)) {
    providers.push(
      ...countryData.flatrate.map((p) =>
        transformProvider(p, 'subscription', country, tmdbId, countryData.link, showName)
      )
    )
  }

  // Buy options
  if (Array.isArray(countryData.buy)) {
    providers.push(
      ...countryData.buy.map((p) =>
        transformProvider(p, 'buy', country, tmdbId, countryData.link, showName)
      )
    )
  }

  // Rent options
  if (Array.isArray(countryData.rent)) {
    providers.push(
      ...countryData.rent.map((p) =>
        transformProvider(p, 'rent', country, tmdbId, countryData.link, showName)
      )
    )
  }

  return providers
}

/**
 * Enrich show data with TMDB information
 */
async function enrichWithTMDBData(
  show: TVMazeShow,
  country: string,
  apiKey: string
): Promise<{ tmdb: ShowDetailsResponse['tmdb']; streamingAvailability: StreamingAvailability[] }> {
  try {
    // Search for the show on TMDB
    const tmdbShow = await searchTMDBShow(show.name, apiKey)
    if (!tmdbShow) {
      return { tmdb: null, streamingAvailability: [] }
    }

    const tmdbId = tmdbShow.id

    // Fetch watch providers for the user's country
    const providersResponse = await fetchTMDBProviders(tmdbId, apiKey)

    // Build TMDB data
    const tmdbData = {
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
    const streamingAvailability = countryData
      ? extractStreamingProviders(countryData, country, tmdbId, show.name)
      : []

    return { tmdb: tmdbData, streamingAvailability }
  } catch (tmdbError) {
    logger.warn('Failed to fetch TMDB data for show', {
      module: 'api/shows/[id]',
      action: 'enrichWithTMDBData',
      showName: show.name,
      country,
      error: tmdbError instanceof Error ? tmdbError.message : String(tmdbError),
    })
    // Continue without TMDB data - not critical
    return { tmdb: null, streamingAvailability: [] }
  }
}

export default defineEventHandler(async (event: H3Event) => {
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

    // Get locale from request for translation
    const locale = getLocaleFromRequest(event)

    // Allow skipping translation for faster initial load (progressive enhancement)
    const skipTranslation = query.skipTranslation === 'true'
    // Allow skipping TMDB data for faster initial load (streaming availability)
    const skipTMDB = query.skipTMDB === 'true'

    // Fetch show data from TVMaze
    const show = await fetchShowFromTVMaze(id)

    // Sanitize HTML content server-side
    if (show.summary) {
      show.summary = sanitizeShowSummary(show.summary)
    }

    // Initialize combined response with proper typing
    // Use type assertion since TVMazeShow is structurally compatible with Show
    const combinedData: ShowDetailsResponse = {
      ...(show as unknown as Show),
      tmdb: null,
      streamingAvailability: [],
    }

    // Translate TVMaze summary if locale is not English (unless skipped for fast load)
    // Replace the summary field directly with translated version
    if (show.summary && needsTranslation(locale) && !skipTranslation) {
      const translatedSummary = await translateText(show.summary, locale)
      if (translatedSummary) {
        combinedData.summary = sanitizeShowSummary(translatedSummary)
      }
    }

    // If TMDB API key is available AND not skipped, fetch additional data
    const config = useRuntimeConfig()
    const tmdbApiKey = config.public.tmdbApiKey

    if (tmdbApiKey && !skipTMDB) {
      const tmdbData = await enrichWithTMDBData(show, country, tmdbApiKey)
      combinedData.tmdb = tmdbData.tmdb
      combinedData.streamingAvailability = tmdbData.streamingAvailability

      // Translate TMDB overview if available and locale is not English (unless skipped for fast load)
      // Replace the overview field directly with translated version
      if (tmdbData.tmdb?.overview && needsTranslation(locale) && !skipTranslation) {
        const translatedOverview = await translateText(tmdbData.tmdb.overview, locale)
        if (translatedOverview && combinedData.tmdb) {
          combinedData.tmdb.overview = sanitizeShowSummary(translatedOverview)
        }
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
})
