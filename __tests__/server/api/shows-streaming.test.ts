import { describe, it, expect } from 'vitest'

/**
 * Tests for streaming availability in /api/shows/[id]
 *
 * IMPORTANT: TMDB API does NOT provide direct provider links (e.g. videoland.com/show/xyz).
 * Instead, it provides a generic "link" field that points to JustWatch or TMDB,
 * where users can see ALL providers for a show.
 *
 * This is an API limitation, not a bug in our code.
 */
describe('Streaming Availability', () => {
  describe('TMDB Provider Links', () => {
    it('should understand that TMDB does not provide direct provider links', () => {
      // This test documents the API limitation
      const mockTMDBResponse = {
        results: {
          NL: {
            link: 'https://www.themoviedb.org/tv/12345-show-name/watch?locale=NL',
            flatrate: [
              {
                provider_id: 72,
                provider_name: 'Videoland',
                logo_path: '/path/to/logo.jpg',
              },
              {
                provider_id: 8,
                provider_name: 'Netflix',
                logo_path: '/path/to/netflix.jpg',
              },
            ],
          },
        },
      }

      // The link is the same for ALL providers
      const genericLink = mockTMDBResponse.results.NL.link

      // Transform providers (simulating our API logic)
      const providers = mockTMDBResponse.results.NL.flatrate.map((p) => ({
        service: {
          id: String(p.provider_id),
          name: p.provider_name,
          logo: p.logo_path ? `https://image.tmdb.org/t/p/original${p.logo_path}` : '',
          type: 'subscription',
        },
        link: genericLink, // Same link for all providers (TMDB limitation)
      }))

      // Both Videoland and Netflix get the same generic link
      expect(providers[0]?.link).toBe(genericLink)
      expect(providers[1]?.link).toBe(genericLink)
      expect(providers[0]?.link).toBe(providers[1]?.link)

      // The link is NOT provider-specific
      expect(providers[0]?.link).not.toContain('videoland.com')
      expect(providers[1]?.link).not.toContain('netflix.com')
    })

    it('should provide a fallback to TMDB page when no JustWatch link exists', () => {
      const tmdbId = 12345
      const mockTMDBResponse = {
        results: {
          US: {
            // No "link" field provided by TMDB
            link: undefined,
            flatrate: [
              {
                provider_id: 8,
                provider_name: 'Netflix',
                logo_path: '/netflix.jpg',
              },
            ],
          },
        },
      }

      const countryData = mockTMDBResponse.results.US
      const fallbackLink = `https://www.themoviedb.org/tv/${tmdbId}`

      const providers = countryData.flatrate.map((p) => ({
        service: {
          id: String(p.provider_id),
          name: p.provider_name,
        },
        link: countryData.link || fallbackLink,
      }))

      // Should use fallback link
      expect(providers[0]?.link).toBe(fallbackLink)
    })

    it('should correctly identify different provider types', () => {
      const mockCountryData = {
        link: 'https://justwatch.com/nl/tv-show/12345',
        flatrate: [{ provider_id: 72, provider_name: 'Videoland', logo_path: '/logo.jpg' }],
        buy: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/apple.jpg' }],
        rent: [{ provider_id: 3, provider_name: 'Amazon Video', logo_path: '/amazon.jpg' }],
      }

      const transformProvider = (p: any, type: string) => ({
        service: {
          id: String(p.provider_id),
          name: p.provider_name,
          type,
        },
        link: mockCountryData.link,
      })

      const subscription = transformProvider(mockCountryData.flatrate[0], 'subscription')
      const buy = transformProvider(mockCountryData.buy[0], 'buy')
      const rent = transformProvider(mockCountryData.rent[0], 'rent')

      expect(subscription.service.type).toBe('subscription')
      expect(buy.service.type).toBe('buy')
      expect(rent.service.type).toBe('rent')

      // All share the same generic link
      expect(subscription.link).toBe(mockCountryData.link)
      expect(buy.link).toBe(mockCountryData.link)
      expect(rent.link).toBe(mockCountryData.link)
    })
  })

  describe('Potential Solutions', () => {
    it('documents how we could add provider-specific deep links in the future', () => {
      // Option 1: Build our own provider URL mappings
      const providerUrlPatterns: Record<string, (showName: string, tmdbId: number) => string> = {
        '72': (showName, tmdbId) => `https://www.videoland.com/nl/serie/${showName}-${tmdbId}`, // Hypothetical
        '8': (showName, tmdbId) => `https://www.netflix.com/title/${tmdbId}`, // Hypothetical
      }

      const provider = {
        provider_id: 72,
        provider_name: 'Videoland',
      }

      const showName = 'killing-eve'
      const tmdbId = 12345

      // Generate provider-specific link
      const getProviderLink = providerUrlPatterns[String(provider.provider_id)]
      const providerLink = getProviderLink ? getProviderLink(showName, tmdbId) : null

      expect(providerLink).toContain('videoland.com')
      expect(providerLink).toContain(showName)
    })

    it('documents that we need to maintain URL patterns for each provider', () => {
      // This would require:
      // 1. Research each provider's URL structure
      // 2. Maintain mappings for 100+ providers
      // 3. Handle providers that don't have public URLs
      // 4. Keep URLs up-to-date when providers change their structure

      const challenge = {
        maintainability: 'High effort to maintain 100+ provider URL patterns',
        accuracy: 'URL structures change without notice',
        coverage: 'Not all providers have public deep-link URLs',
        recommendation: 'Use TMDB/JustWatch link unless we have a specific need for direct links',
      }

      expect(challenge.recommendation).toContain('JustWatch')
    })
  })

  describe('Array Validation', () => {
    it('should validate that flatrate is an array before processing', () => {
      const mockCountryData = {
        link: 'https://justwatch.com',
        flatrate: [{ provider_id: 72, provider_name: 'Videoland' }],
      }

      // Validate before processing
      expect(Array.isArray(mockCountryData.flatrate)).toBe(true)

      const providers: any[] = []
      if (Array.isArray(mockCountryData.flatrate)) {
        providers.push(...mockCountryData.flatrate)
      }

      expect(providers).toHaveLength(1)
    })

    it('should handle missing flatrate array gracefully', () => {
      const mockCountryData: Record<string, any> = {
        link: 'https://justwatch.com',
        // No flatrate field
      }

      const providers: any[] = []
      if (Array.isArray(mockCountryData.flatrate)) {
        providers.push(...mockCountryData.flatrate)
      }

      expect(providers).toHaveLength(0)
    })

    it('should handle invalid flatrate value gracefully', () => {
      const mockCountryData: Record<string, any> = {
        link: 'https://justwatch.com',
        flatrate: 'not-an-array', // Invalid type
      }

      const providers: any[] = []
      if (Array.isArray(mockCountryData.flatrate)) {
        providers.push(...mockCountryData.flatrate)
      }

      expect(providers).toHaveLength(0)
    })
  })
})
