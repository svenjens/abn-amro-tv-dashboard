/**
 * Server API route to fetch all shows
 * Uses Nitro's built-in caching for better performance
 * Returns shows grouped by genre and sorted by rating
 */

import type { Show, TVMazeShow } from '~/types'
import { isTVMazeShowArray } from '~/types'
import { logger } from '~/utils/logger'
import { groupShowsByGenre } from '~/server/utils/shows'

export default cachedEventHandler(
  async (_event) => {
    try {
      const response = await $fetch<unknown>('https://api.tvmaze.com/shows', {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })

      // Validate response is an array of valid TVMaze shows
      if (!isTVMazeShowArray(response)) {
        logger.error(
          'Invalid shows response from TVMaze API',
          {
            module: 'api/shows',
            action: 'fetchAllShows',
            responseType: typeof response,
            isArray: Array.isArray(response),
          },
          response
        )
        throw createError({
          statusCode: 500,
          statusMessage: 'Invalid shows data received from API',
        })
      }

      // Type-safe: we know response is TVMazeShow[] now
      const shows: TVMazeShow[] = response

      // Group and sort shows by genre on the server
      // Cast to Show[] since TVMazeShow is compatible with Show
      const groupedShows = groupShowsByGenre(shows as unknown as Show[])

      // Return both the raw shows array and the grouped/sorted data
      return {
        shows,
        showsByGenre: groupedShows,
      }
    } catch (error) {
      logger.error(
        'Failed to fetch shows from TVMaze API',
        { module: 'api/shows', action: 'fetchAllShows' },
        error
      )
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch shows',
      })
    }
  },
  {
    // Cache for 1 hour (shows list doesn't change often)
    maxAge: 60 * 60, // 1 hour in seconds
    name: 'shows-all',
    getKey: () => 'all-shows',
    // Add stale-while-revalidate for better UX
    swr: true,
  }
)
