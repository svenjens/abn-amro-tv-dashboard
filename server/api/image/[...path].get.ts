/**
 * Image proxy endpoint
 * Proxies TVMaze images through our domain for better control and caching
 */
export default defineEventHandler(async (event) => {
  const path = event.context.params?.path

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image path is required',
    })
  }

  try {
    // Construct TVMaze image URL
    const imageUrl = `https://static.tvmaze.com/${path}`

    // Fetch image from TVMaze
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to fetch image from source',
      })
    }

    // Get image content
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Set appropriate headers
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    setHeader(event, 'Access-Control-Allow-Origin', '*')

    // Return image buffer
    return buffer
  } catch (error) {
    console.error('Image proxy error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to proxy image',
    })
  }
})
