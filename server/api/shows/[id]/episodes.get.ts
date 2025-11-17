/**
 * Server API route to fetch episodes for a show
 * Uses Nitro caching for better performance
 */

export default cachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
  
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Show ID is required'
      })
    }
  
    try {
      const response = await $fetch(`https://api.tvmaze.com/shows/${id}/episodes`, {
        headers: {
          'User-Agent': 'BingeList/1.0'
        }
      })
    
      return response
    } catch (error) {
      console.error(`Error fetching episodes for show ${id}:`, error)
      throw createError({
        statusCode: 404,
        statusMessage: 'Episodes not found'
      })
    }
  },
  {
    // Cache for 7 days (episodes rarely change for completed seasons)
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    name: 'show-episodes',
    getKey: (event) => {
      const id = getRouterParam(event, 'id')
      return `show-${id}-episodes`
    },
    swr: true
  }
)

