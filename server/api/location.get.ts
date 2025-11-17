/**
 * Server API route for detecting user location via Vercel headers
 * This runs server-side and has access to Vercel's geo-location headers
 */
export default defineEventHandler((event) => {
  const headers = getHeaders(event)

  // Vercel automatically adds these headers with geo-location data
  const country = headers['x-vercel-ip-country'] || 'NL'
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
  }
})
