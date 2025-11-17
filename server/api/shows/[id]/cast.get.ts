/**
 * Server API route to fetch cast for a show
 * This runs on the server, keeping API calls secure and fast
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Show ID is required'
    })
  }
  
  try {
    const response = await $fetch(`https://api.tvmaze.com/shows/${id}/cast`, {
      headers: {
        'User-Agent': 'BingeList/1.0'
      }
    })
    
    return response
  } catch (error) {
    console.error(`Error fetching cast for show ${id}:`, error)
    throw createError({
      statusCode: 404,
      statusMessage: 'Cast not found'
    })
  }
})

