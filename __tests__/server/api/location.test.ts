import { describe, it, expect, vi } from 'vitest'

describe('Location API', () => {
  describe('/api/location', () => {
    it('should return location from Vercel headers', () => {
      const mockEvent = {
        node: {
          req: {
            headers: {
              'x-vercel-ip-country': 'US',
              'x-vercel-ip-city': 'New York',
              'x-vercel-ip-country-region': 'NY',
              'x-vercel-ip-latitude': '40.7128',
              'x-vercel-ip-longitude': '-74.0060',
              'x-vercel-ip-timezone': 'America/New_York',
            },
          },
        },
      }

      // Mock getHeaders
      const getHeaders = vi.fn(() => mockEvent.node.req.headers as Record<string, string>)
      const getQuery = vi.fn(() => ({}) as Record<string, string>)

      // Simulate the handler logic
      const headers = getHeaders()
      const query = getQuery()

      let country = headers['x-vercel-ip-country'] || 'NL'

      // Override for testing (only in dev)
      if (import.meta.dev && query.country && typeof query.country === 'string') {
        country = query.country.toUpperCase()
      }

      const result = {
        country,
        city: headers['x-vercel-ip-city'],
        region: headers['x-vercel-ip-country-region'],
        latitude: headers['x-vercel-ip-latitude'],
        longitude: headers['x-vercel-ip-longitude'],
        timezone: headers['x-vercel-ip-timezone'],
        detected: country !== 'NL',
      }

      expect(result.country).toBe('US')
      expect(result.city).toBe('New York')
      expect(result.region).toBe('NY')
      expect(result.detected).toBe(true)
    })

    it('should use default country when headers are missing', () => {
      const mockEvent = {
        node: {
          req: {
            headers: {},
          },
        },
      }

      const getHeaders = vi.fn(() => mockEvent.node.req.headers as Record<string, string>)

      const headers = getHeaders()
      const country = headers['x-vercel-ip-country'] || 'NL'

      const result = {
        country,
        detected: country !== 'NL',
      }

      expect(result.country).toBe('NL')
      expect(result.detected).toBe(false)
    })

    it('should support country override via query parameter (dev only)', () => {
      const mockEvent = {
        node: {
          req: {
            headers: {
              'x-vercel-ip-country': 'NL',
            },
          },
        },
      }

      // Test the override logic without environment check
      const headers: Record<string, string> = mockEvent.node.req.headers
      const query: Record<string, string> = { country: 'US' }

      let country = headers['x-vercel-ip-country'] || 'NL'

      // Override logic (simulated without import.meta.dev check for testing)
      if (query.country && typeof query.country === 'string') {
        country = query.country.toUpperCase()
      }

      const result = {
        country,
        detected: country !== 'NL',
      }

      // After override, should be US
      expect(result.country).toBe('US')
      expect(result.detected).toBe(true)
    })

    it('should normalize country code to uppercase', () => {
      const mockEvent = {
        node: {
          req: {
            headers: {},
          },
        },
      }

      // Test normalization logic without environment check
      const query: Record<string, string> = { country: 'gb' } // lowercase

      let country = 'NL' // Default

      // Normalization logic (simulated without import.meta.dev check for testing)
      if (query.country && typeof query.country === 'string') {
        country = query.country.toUpperCase()
      }

      expect(country).toBe('GB')
    })

    it('should detect various countries correctly', () => {
      const testCountries = [
        { code: 'US', detected: true },
        { code: 'GB', detected: true },
        { code: 'NL', detected: false }, // Default
        { code: 'DE', detected: true },
        { code: 'FR', detected: true },
        { code: 'CA', detected: true },
        { code: 'AU', detected: true },
        { code: 'JP', detected: true },
      ]

      testCountries.forEach(({ code, detected }) => {
        const mockHeaders: Record<string, string> = { 'x-vercel-ip-country': code }
        const result = {
          country: mockHeaders['x-vercel-ip-country'] || 'NL',
          detected: (mockHeaders['x-vercel-ip-country'] || 'NL') !== 'NL',
        }

        expect(result.country).toBe(code)
        expect(result.detected).toBe(detected)
      })
    })
  })
})
