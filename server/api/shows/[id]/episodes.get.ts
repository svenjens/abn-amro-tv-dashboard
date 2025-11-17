/**
 * Server API route to fetch episodes for a show
 * Uses Nitro caching for better performance
 * Sanitizes HTML summaries server-side
 */

import { sanitizeEpisodeSummary } from '~/server/utils/sanitize'

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
        console.error(`Invalid episodes response for show ${id}:`, episodes)
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
      console.error(`Error fetching episodes for show ${id}:`, error)
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
