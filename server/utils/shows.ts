/**
 * Server-side show utilities
 * These utilities can be used in both server API routes and shared with client
 */

import type { Show, ShowsByGenre } from '~/types'

/**
 * Group shows by genre and sort by rating (optimized server version)
 * This function works for both client and server
 *
 * @param shows - Array of shows
 * @returns Object with genres as keys and sorted show arrays as values
 * @example
 * const grouped = groupShowsByGenre(allShows)
 * const dramaShows = grouped['Drama'] // All drama shows, sorted by rating
 */
export function groupShowsByGenre(shows: Show[]): ShowsByGenre {
  const grouped: ShowsByGenre = {}

  // Group shows by genre
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
    const genreShows = grouped[genre]
    if (genreShows) {
      genreShows.sort((a, b) => {
        const ratingA = a.rating?.average || 0
        const ratingB = b.rating?.average || 0
        return ratingB - ratingA
      })
    }
  })

  return grouped
}
