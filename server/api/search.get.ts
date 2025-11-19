/**
 * Server API route for searching shows
 * Uses Vercel KV for global caching (24 hours TTL)
 * Popular searches (e.g., "Breaking Bad") benefit from global cache
 */

import { getCachedSearch } from '~/server/utils/tvmaze-cache'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string

  if (!searchQuery || searchQuery.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query is required',
    })
  }

  // Require at least 2 characters for better search results
  if (searchQuery.trim().length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query must be at least 2 characters',
    })
  }

  try {
    // Vercel KV handles caching globally (24 hours TTL)
    const response = await getCachedSearch(searchQuery)

    // Validate response is an array
    if (!Array.isArray(response)) {
      console.error('Invalid search response:', response)
      return []
    }

    return response
  } catch (error) {
    console.error('Error searching shows:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search shows',
    })
  }
})
