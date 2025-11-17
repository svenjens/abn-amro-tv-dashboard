/**
 * Server API route for searching shows
 * This remains server-side for consistency and to hide API details
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string
  
  if (!searchQuery) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query is required'
    })
  }
  
  try {
    const response = await $fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`, {
      headers: {
        'User-Agent': 'BingeList/1.0'
      }
    })
    
    return response
  } catch (error) {
    console.error('Error searching shows:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search shows'
    })
  }
})

