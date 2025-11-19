/**
 * Server API route to fetch cast for a show
 * Uses Vercel KV for global caching (7 days TTL)
 */

import { getCachedCast } from '~/server/utils/tvmaze-cache'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Show ID is required',
    })
  }

  try {
    // Vercel KV handles caching globally (7 days TTL)
    const response = await getCachedCast(parseInt(id))
    return response
  } catch (error) {
    console.error(`Error fetching cast for show ${id}:`, error)
    throw createError({
      statusCode: 404,
      statusMessage: 'Cast not found',
    })
  }
})
