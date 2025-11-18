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

  // Construct TVMaze image URL
  const imageUrl = `https://static.tvmaze.com/${path}`

  try {
    // Fetch image from TVMaze with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'BingeList/3.0 (Image Proxy)',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`Image fetch failed: ${imageUrl} - Status: ${response.status}`)
      // Redirect to original URL instead of throwing error
      return sendRedirect(event, imageUrl, 302)
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
    // Log the actual error for debugging
    if (error instanceof Error) {
      console.error(`Image proxy error for ${imageUrl}:`, error.message)
    } else {
      console.error(`Image proxy error for ${imageUrl}:`, error)
    }

    // Fallback: redirect to original TVMaze URL
    // This way images still load even if proxy fails
    return sendRedirect(event, imageUrl, 302)
  }
})
