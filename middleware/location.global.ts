/**
 * Global middleware for detecting user location server-side
 * This runs on every page load and populates the location state
 *
 * Supports test_country query parameter for testing:
 * - Add ?test_country=US to test US streaming options
 * - Only works in dev/preview environments
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on server and if not already loaded
  if (import.meta.server) {
    const { fetchLocation } = useLocation()

    try {
      // Pass test country from query for testing
      const testCountry = to.query.test_country as string | undefined
      await fetchLocation(testCountry)
    } catch (error) {
      console.error('[Location Middleware] Failed to fetch location:', error)
      // Continue anyway with default location
    }
  }
})
