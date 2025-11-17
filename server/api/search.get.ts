/**
 * Server API route for searching shows
 * Uses shorter cache as search results may change
 */

export default cachedEventHandler(
  async (event) => {
    const query = getQuery(event)
    const searchQuery = query.q as string

    if (!searchQuery) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query is required',
      })
    }

    try {
      const response = await $fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'User-Agent': 'BingeList/1.0',
          },
        }
      )

      return response
    } catch (error) {
      console.error('Error searching shows:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to search shows',
      })
    }
  },
  {
    // Cache for 15 minutes (search results can change more frequently)
    maxAge: 60 * 15, // 15 minutes in seconds
    name: 'search',
    getKey: (event) => {
      const query = getQuery(event)
      const searchQuery = query.q as string
      // Protect against undefined/null values
      return `search-${(searchQuery || '').toLowerCase()}`
    },
    swr: true,
  }
)
