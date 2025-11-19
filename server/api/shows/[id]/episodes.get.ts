/**
 * Server API route to fetch episodes for a show
 * Uses Nitro caching for better performance
 * Sanitizes HTML summaries server-side
 */

import { sanitizeEpisodeSummary } from '~/server/utils/sanitize'
import { logger } from '~/utils/logger'

export default cachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Show ID is required',
      })
    }

    try {
      const episodes = await $fetch<any[]>(`https://api.tvmaze.com/shows/${id}/episodes`, {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })

      // Validate response is an array
      if (!Array.isArray(episodes)) {
        logger.error(
          'Invalid episodes response from TVMaze API',
          {
            module: 'api/shows/[id]/episodes',
            action: 'fetchEpisodes',
            showId: id,
            responseType: typeof episodes,
          },
          episodes
        )
        return []
      }

      // Sanitize episode summaries server-side
      episodes.forEach((episode) => {
        if (episode.summary) {
          episode.summary = sanitizeEpisodeSummary(episode.summary)
        }
      })

      return episodes
    } catch (error) {
      logger.error(
        'Failed to fetch episodes from TVMaze API',
        {
          module: 'api/shows/[id]/episodes',
          action: 'fetchEpisodes',
          showId: id,
        },
        error
      )
      throw createError({
        statusCode: 404,
        statusMessage: 'Episodes not found',
      })
    }
  },
  {
    // Cache for 7 days (episodes rarely change for completed seasons)
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    name: 'show-episodes',
    getKey: (event) => {
      const id = getRouterParam(event, 'id') || 'unknown'
      return `show-${id}-episodes`
    },
    swr: true,
  }
)
