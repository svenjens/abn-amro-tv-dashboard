/**
 * Server API route to fetch cast for a show
 * Uses Nitro caching for better performance
 */

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
      const response = await $fetch(`https://api.tvmaze.com/shows/${id}/cast`, {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })

      return response
    } catch (error) {
      logger.error(
        'Failed to fetch cast from TVMaze API',
        {
          module: 'api/shows/[id]/cast',
          action: 'fetchCast',
          showId: id,
        },
        error
      )
      throw createError({
        statusCode: 404,
        statusMessage: 'Cast not found',
      })
    }
  },
  {
    // Cache for 7 days (cast rarely changes)
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    name: 'show-cast',
    getKey: (event) => {
      const id = getRouterParam(event, 'id') || 'unknown'
      return `show-${id}-cast`
    },
    swr: true,
  }
)
