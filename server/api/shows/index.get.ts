/**
 * Server API route to fetch all shows
 * This runs on the server, keeping API calls secure and fast
 */

export default defineEventHandler(async (event) => {
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
})

