/**
 * Global middleware for detecting user location server-side
 * This runs on every page load and populates the location state
 */
export default defineNuxtRouteMiddleware(async () => {
  // Only run on server and if not already loaded
  if (import.meta.server) {
    const { fetchLocation } = useLocation()
    
    try {
      await fetchLocation()
    } catch (error) {
      console.error('[Location Middleware] Failed to fetch location:', error)
      // Continue anyway with default location
    }
  }
})

