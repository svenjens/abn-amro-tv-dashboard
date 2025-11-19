/**
 * Slug utilities for SEO-friendly URLs
 */

/**
 * Convert a show name to a URL-friendly slug
 * Examples:
 * - "Breaking Bad" → "breaking-bad"
 * - "Game of Thrones" → "game-of-thrones"
 * - "The Office (US)" → "the-office-us"
 * - "Marvel's Agents of S.H.I.E.L.D." → "marvels-agents-of-shield"
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Trim hyphens from start and end
}

/**
 * Create a URL with slug and ID for uniqueness
 * Format: {slug}-{id}
 * This ensures uniqueness while keeping URLs readable
 * Can be used for shows, persons, or any other entity
 *
 * Examples:
 * - "Breaking Bad" (id: 169) → "breaking-bad-169"
 * - "Kingdom" (id: 214) → "kingdom-214"
 * - "Aaron Paul" (id: 14327) → "aaron-paul-14327"
 */
export function createSlugWithId(name: string, id: number): string {
  const slug = createSlug(name)
  return `${slug}-${id}`
}

/**
 * @deprecated Use createSlugWithId instead
 * Create a show URL with slug and ID for uniqueness
 */
export function createShowSlug(name: string, id: number): string {
  return createSlugWithId(name, id)
}

/**
 * Extract show ID from a slug
 * Examples:
 * - "breaking-bad-169" → 169
 * - "kingdom-214" → 214
 */
export function extractIdFromSlug(slug: string): number | null {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart || '', 10)
  return isNaN(id) ? null : id
}

/**
 * Validate if a slug matches a show name and ID
 * Used for handling old URLs or mismatched slugs
 */
export function validateSlug(slug: string, expectedName: string, expectedId: number): boolean {
  const expectedSlug = createShowSlug(expectedName, expectedId)
  return slug === expectedSlug
}
