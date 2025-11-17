/**
 * Composable for detecting user location via Vercel headers
 * This uses the server API route to access geo-location data
 */

export interface UserLocation {
  country: string
  city?: string
  region?: string
  latitude?: string
  longitude?: string
  timezone?: string
  detected: boolean
}

export const useLocation = () => {
  const location = useState<UserLocation>('userLocation', () => ({
    country: 'NL',
    detected: false,
  }))

  const isLoading = useState('locationLoading', () => false)
  const error = useState<string | null>('locationError', () => null)

  /**
   * Fetch user location from server API
   * This should be called on app initialization or when needed
   * @param testCountry - Optional country code for testing (only in dev/preview)
   */
  const fetchLocation = async (testCountry?: string) => {
    // Skip if already loaded (unless testing)
    if (location.value.detected && !testCountry) {
      return location.value
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<UserLocation>('/api/location', {
        query: testCountry ? { country: testCountry } : undefined,
      })
      location.value = data
      return data
    } catch (e) {
      error.value = 'Failed to detect location'
      console.error('Location detection failed:', e)
      // Return default
      return location.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get current country code
   */
  const country = computed(() => location.value.country)

  /**
   * Check if user is in a specific country
   */
  const isInCountry = (countryCode: string) => {
    return location.value.country === countryCode.toUpperCase()
  }

  /**
   * Reset location state (primarily for testing)
   * @internal
   */
  const resetLocation = () => {
    location.value = {
      country: 'NL',
      detected: false,
    }
    isLoading.value = false
    error.value = null
  }

  return {
    location: readonly(location),
    country,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchLocation,
    isInCountry,
    resetLocation,
  }
}
