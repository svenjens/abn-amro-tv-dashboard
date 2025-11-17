/**
 * Server API route to fetch all shows
 * Uses Nitro's built-in caching for better performance
 * Returns shows grouped by genre and sorted by rating
 */

import type { Show, ShowsByGenre } from '~/types'

/**
 * Group shows by genre and sort by rating (server-side version)
 * @param shows - Array of shows
 * @returns Object with genres as keys and sorted show arrays as values
 */
function groupShowsByGenreAndSort(shows: Show[]): ShowsByGenre {
  const grouped: ShowsByGenre = {}

  shows.forEach((show) => {
    // Skip shows without genres
    if (!show.genres || show.genres.length === 0) {
      return
    }

    // Add show to each of its genres
    show.genres.forEach((genre) => {
      if (!grouped[genre]) {
        grouped[genre] = []
      }
      grouped[genre].push(show)
    })
  })

  // Sort shows within each genre by rating (highest first)
  Object.keys(grouped).forEach((genre) => {
    const shows = grouped[genre]
    if (shows) {
      shows.sort((a, b) => {
        const ratingA = a.rating?.average || 0
        const ratingB = b.rating?.average || 0
        return ratingB - ratingA
      })
    }
  })

  return grouped
}

export default cachedEventHandler(
  async (_event) => {
    try {
      const shows = await $fetch<Show[]>('https://api.tvmaze.com/shows', {
        headers: {
          'User-Agent': 'BingeList/1.0',
        },
      })

      // Validate response is an array
      if (!Array.isArray(shows)) {
        console.error('Invalid shows response:', shows)
        throw createError({
          statusCode: 500,
          statusMessage: 'Invalid shows data received from API',
        })
      }

      // Group and sort shows by genre on the server
      const groupedShows = groupShowsByGenreAndSort(shows)

      // Return both the raw shows array and the grouped/sorted data
      return {
        shows,
        showsByGenre: groupedShows,
      }
    } catch (error) {
      console.error('Error fetching shows:', error)
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
