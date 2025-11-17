/**
 * Server API route to fetch all shows
 * Uses Nitro's built-in caching for better performance
 */

export default cachedEventHandler(
  async (event) => {
    try {
      const response = await $fetch('https://api.tvmaze.com/shows', {
        headers: {
          'User-Agent': 'BingeList/1.0'
        }
      })
      
      return response
    } catch (error) {
      console.error('Error fetching shows:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch shows'
      })
    }
  },
  {
    // Cache for 1 hour (shows list doesn't change often)
    maxAge: 60 * 60, // 1 hour in seconds
    name: 'shows-all',
    getKey: () => 'all-shows',
    // Add stale-while-revalidate for better UX
    swr: true
  }
)

