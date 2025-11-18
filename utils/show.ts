/**
 * Utility functions for working with TV shows
 */

import type { Show, ShowsByGenre } from '@/types'

/**
 * Group shows by genre and sort by rating
 * @param shows - Array of shows
 * @returns Object with genres as keys and sorted show arrays as values
 */
export function groupShowsByGenre(shows: Show[]): ShowsByGenre {
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

/**
 * Get sorted list of all genres
 * @param showsByGenre - Shows grouped by genre
 * @returns Array of genre names sorted alphabetically
 */
export function getSortedGenres(showsByGenre: ShowsByGenre): string[] {
  return Object.keys(showsByGenre).sort()
}

/**
 * Strip HTML tags from a string
 * @param html - HTML string
 * @returns Plain text string
 */
export function stripHtml(html: string | null): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Format rating for display
 * @param rating - Rating value (0-10 scale)
 * @returns Formatted rating string
 */
export function formatRating(rating: number | null): string {
  if (rating === null || rating === undefined) {
    return 'N/A'
  }
  return rating.toFixed(1)
}

/**
 * Get show image URL (no fallback)
 * @param show - Show object
 * @param size - Image size ('medium' or 'original')
 * @returns Image URL or null if not available
 */
export function getShowImage(show: Show, size: 'medium' | 'original' = 'medium'): string | null {
  return show.image?.[size] ?? null
}

/**
 * Truncate text to a specific length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Format schedule for display
 * @param schedule - Show schedule
 * @returns Formatted schedule string
 */
export function formatSchedule(schedule: Show['schedule']): string {
  if (!schedule.days || schedule.days.length === 0) {
    return 'Schedule not available'
  }

  const days = schedule.days.join(', ')
  const time = schedule.time || 'Time TBA'
  return `${days} at ${time}`
}
