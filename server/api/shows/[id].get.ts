/**
 * Server API route to fetch a single show by ID
 * Combines TVMaze data with TMDB streaming availability and extra metadata
 * Uses Nitro caching for improved performance
 * Sanitizes HTML content server-side before sending to client
 */

import type { H3Event } from 'h3'
import { sanitizeShowSummary } from '~/server/utils/sanitize'

export default cachedEventHandler(
  async (event: H3Event) => {
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)
    const country = (query.country as string) || 'US'

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Show ID is required',
      })
    }

    try {
      // Fetch show data from TVMaze
      const show: any = await $fetch<any>(`https://api.tvmaze.com/shows/${id}`, {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })

      // Sanitize HTML content server-side
      if (show.summary) {
        show.summary = sanitizeShowSummary(show.summary)
      }

      const config = useRuntimeConfig()
      const tmdbApiKey = config.public.tmdbApiKey

      // Initialize combined response
      const combinedData: any = {
        ...show,
        tmdb: null as any,
        streamingAvailability: [] as any[],
      }

      // If TMDB API key is available, fetch additional data
      if (tmdbApiKey) {
        try {
          // Search for the show on TMDB
          const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${encodeURIComponent(show.name)}`
          const searchResponse = await $fetch<any>(searchUrl)

          if (
            searchResponse.results &&
            Array.isArray(searchResponse.results) &&
            searchResponse.results.length > 0
          ) {
            const tmdbShow = searchResponse.results[0]
            const tmdbId = tmdbShow.id

            // Fetch watch providers for the user's country
            const providersUrl = `https://api.themoviedb.org/3/tv/${tmdbId}/watch/providers?api_key=${tmdbApiKey}`
            const providersResponse = await $fetch<any>(providersUrl)

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
              const providers = []

              // Helper function to transform TMDB provider to our StreamingAvailability format
              const transformProvider = (p: any, type: string) => ({
                service: {
                  id: String(p.provider_id),
                  name: p.provider_name,
                  logo: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : '',
                  type,
                },
                link: countryData.link || `https://www.themoviedb.org/tv/${tmdbId}`,
                availableFrom: undefined,
                availableUntil: undefined,
              })

              // Flatrate (subscription services like Netflix, Disney+)
              if (Array.isArray(countryData.flatrate)) {
                providers.push(
                  ...countryData.flatrate.map((p: any) => transformProvider(p, 'subscription'))
                )
              }

              // Buy options
              if (Array.isArray(countryData.buy)) {
                providers.push(...countryData.buy.map((p: any) => transformProvider(p, 'buy')))
              }

              // Rent options
              if (Array.isArray(countryData.rent)) {
                providers.push(...countryData.rent.map((p: any) => transformProvider(p, 'rent')))
              }

              combinedData.streamingAvailability = providers
            }
          }
        } catch (tmdbError) {
          console.error(`Error fetching TMDB data for show ${id}:`, tmdbError)
          // Continue without TMDB data
        }
      }

      return combinedData
    } catch (error) {
      console.error(`Error fetching show ${id}:`, error)
      throw createError({
        statusCode: 404,
        statusMessage: 'Show not found',
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
      return `show-${id}-${country}`
    },
    swr: true,
    // Vary cache by country for streaming availability
    varies: ['country'],
  }
)
