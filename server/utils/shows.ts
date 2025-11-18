/**
 * Server-side show utilities
 * These utilities can be used in both server API routes and shared with client
 */

/**
 * Minimal show interface needed for grouping by genre
 */
interface GroupableShow {
  genres?: string[]
  rating?: {
    average?: number | null
  }
}

/**
 * Group shows by genre and sort by rating (optimized server version)
 * This function works for both client and server
 * Generic type allows it to work with Show, TVMazeShow, or any compatible type
 *
 * @param shows - Array of shows (must have genres and rating)
 * @returns Object with genres as keys and sorted show arrays as values
 * @example
 * const grouped = groupShowsByGenre(allShows)
 * const dramaShows = grouped['Drama'] // All drama shows, sorted by rating
 */
export function groupShowsByGenre<T extends GroupableShow>(shows: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {}

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
