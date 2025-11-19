/**
 * API Performance Tests
 * Measures actual response times and caching effectiveness
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch } from 'ofetch'

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  SHOWS_LIST_FIRST: 5000, // First call (cold cache)
  SHOWS_LIST_CACHED: 100, // Cached response
  SHOW_DETAILS_FIRST: 3000, // First call with TMDB
  SHOW_DETAILS_CACHED: 100, // Cached response
  EPISODES_FIRST: 2000,
  EPISODES_CACHED: 100,
  CAST_FIRST: 2000,
  CAST_CACHED: 100,
  SEARCH_FIRST: 3000,
  SEARCH_CACHED: 100,
}

interface PerformanceResult {
  duration: number
  endpoint: string
  cached: boolean
}

/**
 * Measure API call performance
 */
async function measureApiCall(
  url: string,
  options: Record<string, any> = {}
): Promise<PerformanceResult> {
  const startTime = performance.now()

  await $fetch(url, options)

  const endTime = performance.now()
  const duration = endTime - startTime

  return {
    duration,
    endpoint: url,
    cached: false,
  }
}

/**
 * Measure caching effectiveness by calling the same endpoint twice
 */
async function measureCachingEffectiveness(
  url: string,
  options: Record<string, any> = {}
): Promise<{ first: PerformanceResult; second: PerformanceResult; improvement: number }> {
  // First call (should populate cache)
  const first = await measureApiCall(url, options)

  // Small delay to ensure cache is written
  await new Promise((resolve) => setTimeout(resolve, 50))

  // Second call (should hit cache)
  const second = await measureApiCall(url, options)
  second.cached = true

  const improvement = ((first.duration - second.duration) / first.duration) * 100

  return { first, second, improvement }
}

describe('API Performance Tests', () => {
  const baseUrl = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'

  // Note: These tests require a running server
  // Run with: npm run dev (in another terminal)
  const serverAvailable = process.env.TEST_PERFORMANCE === 'true'

  beforeAll(() => {
    if (!serverAvailable) {
      console.log('⚠️  Performance tests skipped. Run with TEST_PERFORMANCE=true to enable.')
    }
  })

  describe('Shows List API', () => {
    it.skipIf(!serverAvailable)(
      'should return all shows within acceptable time',
      async () => {
        const result = await measureApiCall(`${baseUrl}/api/shows`)

        console.log(`📊 Shows list (first call): ${result.duration.toFixed(2)}ms`)

        expect(result.duration).toBeLessThan(THRESHOLDS.SHOWS_LIST_FIRST)
      },
      10000
    )

    it.skipIf(!serverAvailable)(
      'should demonstrate caching effectiveness',
      async () => {
        const { first, second, improvement } = await measureCachingEffectiveness(
          `${baseUrl}/api/shows`
        )

        console.log(`📊 Shows list caching:
  First call:  ${first.duration.toFixed(2)}ms
  Second call: ${second.duration.toFixed(2)}ms
  Improvement: ${improvement.toFixed(1)}%`)

        expect(second.duration).toBeLessThan(THRESHOLDS.SHOWS_LIST_CACHED)
        expect(improvement).toBeGreaterThan(50) // At least 50% faster
      },
      15000
    )
  })

  describe('Show Details API', () => {
    const TEST_SHOW_ID = 1 // "Under the Dome"

    it.skipIf(!serverAvailable)(
      'should return show details with TMDB data within acceptable time',
      async () => {
        const result = await measureApiCall(`${baseUrl}/api/shows/${TEST_SHOW_ID}?country=US`)

        console.log(`📊 Show details (first call): ${result.duration.toFixed(2)}ms`)

        expect(result.duration).toBeLessThan(THRESHOLDS.SHOW_DETAILS_FIRST)
      },
      10000
    )

    it.skipIf(!serverAvailable)(
      'should demonstrate caching effectiveness',
      async () => {
        const { first, second, improvement } = await measureCachingEffectiveness(
          `${baseUrl}/api/shows/${TEST_SHOW_ID}?country=US`
        )

        console.log(`📊 Show details caching:
  First call:  ${first.duration.toFixed(2)}ms
  Second call: ${second.duration.toFixed(2)}ms
  Improvement: ${improvement.toFixed(1)}%`)

        expect(second.duration).toBeLessThan(THRESHOLDS.SHOW_DETAILS_CACHED)
        expect(improvement).toBeGreaterThan(90) // Cache should be very fast
      },
      10000
    )
  })

  describe('Episodes API', () => {
    const TEST_SHOW_ID = 1

    it.skipIf(!serverAvailable)(
      'should return episodes within acceptable time',
      async () => {
        const result = await measureApiCall(`${baseUrl}/api/shows/${TEST_SHOW_ID}/episodes`)

        console.log(`📊 Episodes (first call): ${result.duration.toFixed(2)}ms`)

        expect(result.duration).toBeLessThan(THRESHOLDS.EPISODES_FIRST)
      },
      10000
    )

    it.skipIf(!serverAvailable)(
      'should demonstrate caching effectiveness',
      async () => {
        const { first, second, improvement } = await measureCachingEffectiveness(
          `${baseUrl}/api/shows/${TEST_SHOW_ID}/episodes`
        )

        console.log(`📊 Episodes caching:
  First call:  ${first.duration.toFixed(2)}ms
  Second call: ${second.duration.toFixed(2)}ms
  Improvement: ${improvement.toFixed(1)}%`)

        expect(second.duration).toBeLessThan(THRESHOLDS.EPISODES_CACHED)
        expect(improvement).toBeGreaterThan(90)
      },
      10000
    )
  })

  describe('Cast API', () => {
    const TEST_SHOW_ID = 1

    it.skipIf(!serverAvailable)(
      'should return cast within acceptable time',
      async () => {
        const result = await measureApiCall(`${baseUrl}/api/shows/${TEST_SHOW_ID}/cast`)

        console.log(`📊 Cast (first call): ${result.duration.toFixed(2)}ms`)

        expect(result.duration).toBeLessThan(THRESHOLDS.CAST_FIRST)
      },
      10000
    )

    it.skipIf(!serverAvailable)(
      'should demonstrate caching effectiveness',
      async () => {
        const { first, second, improvement } = await measureCachingEffectiveness(
          `${baseUrl}/api/shows/${TEST_SHOW_ID}/cast`
        )

        console.log(`📊 Cast caching:
  First call:  ${first.duration.toFixed(2)}ms
  Second call: ${second.duration.toFixed(2)}ms
  Improvement: ${improvement.toFixed(1)}%`)

        expect(second.duration).toBeLessThan(THRESHOLDS.CAST_CACHED)
        expect(improvement).toBeGreaterThan(90)
      },
      10000
    )
  })

  describe('Search API', () => {
    const TEST_QUERY = 'breaking bad'

    it.skipIf(!serverAvailable)(
      'should return search results within acceptable time',
      async () => {
        const result = await measureApiCall(`${baseUrl}/api/search?q=${TEST_QUERY}`)

        console.log(`📊 Search (first call): ${result.duration.toFixed(2)}ms`)

        expect(result.duration).toBeLessThan(THRESHOLDS.SEARCH_FIRST)
      },
      10000
    )

    it.skipIf(!serverAvailable)(
      'should demonstrate caching effectiveness',
      async () => {
        const { first, second, improvement } = await measureCachingEffectiveness(
          `${baseUrl}/api/search?q=${TEST_QUERY}`
        )

        console.log(`📊 Search caching:
  First call:  ${first.duration.toFixed(2)}ms
  Second call: ${second.duration.toFixed(2)}ms
  Improvement: ${improvement.toFixed(1)}%`)

        expect(second.duration).toBeLessThan(THRESHOLDS.SEARCH_CACHED)
        expect(improvement).toBeGreaterThan(80)
      },
      10000
    )
  })

  describe('Concurrent Requests', () => {
    it.skipIf(!serverAvailable)(
      'should handle multiple concurrent requests efficiently',
      async () => {
        const startTime = performance.now()

        // Make 5 concurrent requests
        const promises = Array.from({ length: 5 }, (_, i) =>
          $fetch(`${baseUrl}/api/shows/${i + 1}`)
        )

        await Promise.all(promises)

        const endTime = performance.now()
        const totalDuration = endTime - startTime

        console.log(`📊 5 concurrent requests: ${totalDuration.toFixed(2)}ms`)

        // Should be significantly faster than 5 sequential requests
        // With caching and parallel processing, should be under 5 seconds
        expect(totalDuration).toBeLessThan(5000)
      },
      15000
    )
  })
})
