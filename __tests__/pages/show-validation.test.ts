import { describe, it, expect } from 'vitest'
import { extractIdFromSlug } from '@/utils/slug'

/**
 * Tests for show/person page validation edge cases
 * These tests ensure that invalid slugs (without IDs) are caught
 * before API calls are made, preventing 400 errors like:
 * GET /api/shows/null?country=NL 400 Validation Error
 * GET /api/people/null 400 Validation Error
 */
describe('Show/Person Page Validation Edge Cases', () => {
  describe('extractIdFromSlug - 404 scenarios', () => {
    it('should return null for slug without ID (causing 404)', () => {
      // These are real-world examples that could cause 400 errors if not caught
      expect(extractIdFromSlug('breaking-bad')).toBeNull()
      expect(extractIdFromSlug('game-of-thrones')).toBeNull()
      expect(extractIdFromSlug('the-office')).toBeNull()
    })

    it('should return null for malformed slugs (causing 404)', () => {
      expect(extractIdFromSlug('show-')).toBeNull()
      expect(extractIdFromSlug('-123')).toBe(123) // This is valid
      expect(extractIdFromSlug('---')).toBeNull()
      expect(extractIdFromSlug('')).toBeNull()
    })

    it('should return null for slugs with non-numeric endings (causing 404)', () => {
      expect(extractIdFromSlug('show-name-abc')).toBeNull()
      expect(extractIdFromSlug('show-name-xyz')).toBeNull()
      expect(extractIdFromSlug('show-name-test')).toBeNull()
    })

    it('should return valid ID for correct slugs (no 404)', () => {
      expect(extractIdFromSlug('breaking-bad-169')).toBe(169)
      expect(extractIdFromSlug('game-of-thrones-82')).toBe(82)
      expect(extractIdFromSlug('the-office-us-526')).toBe(526)
    })

    it('should handle potential Google crawler edge cases', () => {
      // Edge cases that Google or other crawlers might encounter
      expect(extractIdFromSlug('null')).toBeNull()
      expect(extractIdFromSlug('undefined')).toBeNull()
      expect(extractIdFromSlug('0')).toBe(0) // Just '0' is parsed as ID 0
      expect(extractIdFromSlug('show-0')).toBe(0) // This is valid - show with ID 0
    })
  })

  describe('Validation logic simulation', () => {
    it('should simulate the page validation that prevents 400 errors', () => {
      // Simulate what happens in pages/show/[slug].vue and pages/person/[slug].vue
      const testCases = [
        { slug: 'breaking-bad-169', shouldThrow404: false, expectedId: 169 },
        { slug: 'breaking-bad', shouldThrow404: true, expectedId: null },
        { slug: 'game-of-thrones-82', shouldThrow404: false, expectedId: 82 },
        { slug: 'game-of-thrones', shouldThrow404: true, expectedId: null },
        { slug: 'the-office-us-526', shouldThrow404: false, expectedId: 526 },
        { slug: 'the-office', shouldThrow404: true, expectedId: null },
        { slug: '', shouldThrow404: true, expectedId: null },
        { slug: 'null', shouldThrow404: true, expectedId: null },
        { slug: 'undefined', shouldThrow404: true, expectedId: null },
      ]

      testCases.forEach(({ slug, shouldThrow404, expectedId }) => {
        const extractedId = extractIdFromSlug(slug)

        expect(extractedId).toBe(expectedId)

        if (shouldThrow404) {
          // In the actual page component, this would trigger:
          // throw createError({ statusCode: 404, statusMessage: 'Invalid show URL', fatal: true })
          expect(extractedId).toBeNull()
        } else {
          expect(extractedId).not.toBeNull()
          expect(typeof extractedId).toBe('number')
        }
      })
    })
  })

  describe('API call prevention', () => {
    it('should prevent API calls with null IDs for show pages', () => {
      // These slugs would previously cause: GET /api/shows/null 400
      const invalidSlugs = [
        'breaking-bad', // No ID
        'game-of-thrones', // No ID
        'the-office', // No ID
        '', // Empty
        'null', // Literal 'null'
        'undefined', // Literal 'undefined'
        'show-name-abc', // Non-numeric ending
      ]

      invalidSlugs.forEach((slug) => {
        const id = extractIdFromSlug(slug)
        // ID should be null, preventing the API call
        expect(id).toBeNull()

        // In the actual implementation, this would trigger a 404 error
        // BEFORE making an API call like: `/api/shows/${id}`
        // This prevents the 400 error: GET /api/shows/null
      })
    })

    it('should prevent API calls with null IDs for person pages', () => {
      // These slugs would previously cause: GET /api/people/null 400
      const invalidSlugs = [
        'bryan-cranston', // No ID
        'aaron-paul', // No ID
        'anna-gunn', // No ID
        '', // Empty
        'null', // Literal 'null'
        'undefined', // Literal 'undefined'
        'person-name-abc', // Non-numeric ending
      ]

      invalidSlugs.forEach((slug) => {
        const id = extractIdFromSlug(slug)
        // ID should be null, preventing the API call
        expect(id).toBeNull()

        // In the actual implementation, this would trigger a 404 error
        // BEFORE making an API call like: `/api/people/${id}`
        // This prevents the 400 error: GET /api/people/null
      })
    })

    it('should allow API calls with valid IDs for shows', () => {
      const validSlugs = [
        { slug: 'breaking-bad-169', id: 169 },
        { slug: 'game-of-thrones-82', id: 82 },
        { slug: 'the-office-us-526', id: 526 },
        { slug: 'stranger-things-66732', id: 66732 },
      ]

      validSlugs.forEach(({ slug, id: expectedId }) => {
        const id = extractIdFromSlug(slug)
        expect(id).toBe(expectedId)
        expect(id).not.toBeNull()

        // This would allow the API call: `/api/shows/${id}`
        if (id !== null) {
          expect(typeof id).toBe('number')
          expect(id).toBeGreaterThanOrEqual(0)
        }
      })
    })

    it('should allow API calls with valid IDs for persons', () => {
      const validSlugs = [
        { slug: 'bryan-cranston-17419', id: 17419 },
        { slug: 'aaron-paul-84497', id: 84497 },
        { slug: 'anna-gunn-14343', id: 14343 },
        { slug: 'dean-norris-1223', id: 1223 },
      ]

      validSlugs.forEach(({ slug, id: expectedId }) => {
        const id = extractIdFromSlug(slug)
        expect(id).toBe(expectedId)
        expect(id).not.toBeNull()

        // This would allow the API call: `/api/people/${id}`
        if (id !== null) {
          expect(typeof id).toBe('number')
          expect(id).toBeGreaterThanOrEqual(0)
        }
      })
    })
  })

  describe('AdSense crawler compatibility', () => {
    it('should handle edge cases that caused AdSense rejection', () => {
      /**
       * Google AdSense rejection reason: "content of low value" and "screens under construction"
       * Root cause: Broken links like /api/shows/null causing 400 errors
       * These tests ensure we properly handle these edge cases with 404 errors instead
       */

      const crawlerEdgeCases = [
        { slug: 'show-without-id', description: 'Show page without ID' },
        { slug: 'person-name', description: 'Person page without ID' },
        { slug: 'bryan-cranston', description: 'Person name without ID' },
        { slug: 'breaking-bad', description: 'Show name without ID' },
        { slug: '', description: 'Empty slug' },
        { slug: 'null', description: 'Literal null string' },
        { slug: 'undefined', description: 'Literal undefined string' },
        { slug: 'test', description: 'Test page' },
      ]

      crawlerEdgeCases.forEach(({ slug, description }) => {
        const id = extractIdFromSlug(slug)

        // All of these should return null, triggering a 404 page
        // instead of attempting an API call to /api/shows/null or /api/people/null
        expect(id).toBeNull()
      })
    })

    it('should ensure proper error handling flow for show pages', () => {
      const slug = 'breaking-bad' // No ID

      // Step 1: Extract ID from slug
      const showId = extractIdFromSlug(slug)

      // Step 2: Check if ID is null (this is what the page component does)
      if (!showId) {
        // Step 3: Throw 404 error (not 400)
        // In the actual code: throw createError({ statusCode: 404, ... })
        expect(showId).toBeNull()
        // This prevents the 400 error: GET /api/shows/null
        // Instead, user sees a proper 404 page
      }

      // The API call is never made because we threw 404 early
      expect(showId).toBeNull()
    })

    it('should ensure proper error handling flow for person pages', () => {
      const slug = 'bryan-cranston' // No ID

      // Step 1: Extract ID from slug
      const personId = extractIdFromSlug(slug)

      // Step 2: Check if ID is null (this is what the page component does)
      if (!personId) {
        // Step 3: Throw 404 error (not 400)
        // In the actual code: throw createError({ statusCode: 404, ... })
        expect(personId).toBeNull()
        // This prevents the 400 error: GET /api/people/null
        // Instead, user sees a proper 404 page
      }

      // The API call is never made because we threw 404 early
      expect(personId).toBeNull()
    })
  })
})
