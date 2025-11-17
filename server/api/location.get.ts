/**
 * Server API route for detecting user location via Vercel headers
 * This runs server-side and has access to Vercel's geo-location headers
 *
 * Testing with VPN:
 * - In production: Uses Vercel's x-vercel-ip-country header (based on IP)
 * - For testing: Add ?country=US to override (only in dev/preview)
 */
export default defineEventHandler((event) => {
  const headers = getHeaders(event)
  const query = getQuery(event)

  // Allow country override for testing (only in non-production)
  // Usage: /api/location?country=US
  let country = headers['x-vercel-ip-country'] || 'NL'

  // Override for testing (not in production)
  if (import.meta.dev && query.country && typeof query.country === 'string') {
    country = query.country.toUpperCase()
    console.log(`[Location API] Test override: country=${country}`)
  }

  const city = headers['x-vercel-ip-city']
  const region = headers['x-vercel-ip-country-region']
  const latitude = headers['x-vercel-ip-latitude']
  const longitude = headers['x-vercel-ip-longitude']
  const timezone = headers['x-vercel-ip-timezone']

  return {
    country,
    city,
    region,
    latitude,
    longitude,
    timezone,
    detected: country !== 'NL', // True if we detected a non-default country
    // Add debug info in dev
    ...(import.meta.dev
      ? {
          debug: {
            originalCountry: headers['x-vercel-ip-country'] || 'NL',
            overridden: !!query.country,
          },
        }
      : {}),
  }
})
