import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  showIdSchema,
  countryCodeSchema,
  showDetailsQuerySchema,
  searchQuerySchema,
  validateShowId,
  validateCountryCode,
  createValidationError,
} from '~/server/utils/validation'

describe('server/utils/validation', () => {
  describe('showIdSchema', () => {
    it('should accept positive integers', () => {
      expect(showIdSchema.parse(1)).toBe(1)
      expect(showIdSchema.parse(123)).toBe(123)
      expect(showIdSchema.parse(9999)).toBe(9999)
    })

    it('should coerce string numbers to integers', () => {
      expect(showIdSchema.parse('1')).toBe(1)
      expect(showIdSchema.parse('123')).toBe(123)
    })

    it('should reject negative numbers', () => {
      expect(() => showIdSchema.parse(-1)).toThrow()
      expect(() => showIdSchema.parse(-123)).toThrow()
    })

    it('should reject zero', () => {
      expect(() => showIdSchema.parse(0)).toThrow()
    })

    it('should reject non-numeric strings', () => {
      expect(() => showIdSchema.parse('abc')).toThrow()
      expect(() => showIdSchema.parse('12abc')).toThrow()
    })

    it('should reject floats', () => {
      expect(() => showIdSchema.parse(1.5)).toThrow()
    })
  })

  describe('countryCodeSchema', () => {
    it('should accept valid 2-letter country codes', () => {
      expect(countryCodeSchema.parse('US')).toBe('US')
      expect(countryCodeSchema.parse('NL')).toBe('NL')
      expect(countryCodeSchema.parse('GB')).toBe('GB')
    })

    it('should default to US when no value provided', () => {
      expect(countryCodeSchema.parse(undefined)).toBe('US')
    })

    it('should reject lowercase country codes', () => {
      expect(() => countryCodeSchema.parse('us')).toThrow()
      expect(() => countryCodeSchema.parse('nl')).toThrow()
    })

    it('should reject mixed case country codes', () => {
      expect(() => countryCodeSchema.parse('Us')).toThrow()
      expect(() => countryCodeSchema.parse('uS')).toThrow()
    })

    it('should reject codes longer than 2 characters', () => {
      expect(() => countryCodeSchema.parse('USA')).toThrow()
      expect(() => countryCodeSchema.parse('NLD')).toThrow()
    })

    it('should reject codes shorter than 2 characters', () => {
      expect(() => countryCodeSchema.parse('U')).toThrow()
      expect(() => countryCodeSchema.parse('N')).toThrow()
    })

    it('should reject numeric codes', () => {
      expect(() => countryCodeSchema.parse('12')).toThrow()
    })

    it('should reject codes with special characters', () => {
      expect(() => countryCodeSchema.parse('U$')).toThrow()
      expect(() => countryCodeSchema.parse('N-')).toThrow()
    })
  })

  describe('showDetailsQuerySchema', () => {
    it('should accept valid country parameter', () => {
      const result = showDetailsQuerySchema.parse({ country: 'US' })
      expect(result.country).toBe('US')
    })

    it('should handle empty object with default country', () => {
      const result = showDetailsQuerySchema.parse({})
      expect(result).toHaveProperty('country')
      expect(result.country).toBe('US') // Default value
    })

    it('should reject invalid country codes', () => {
      expect(() => showDetailsQuerySchema.parse({ country: 'usa' })).toThrow()
    })
  })

  describe('searchQuerySchema', () => {
    it('should accept valid search query', () => {
      const result = searchQuerySchema.parse({ q: 'Breaking Bad' })
      expect(result.q).toBe('Breaking Bad')
    })

    it('should accept query with limit', () => {
      const result = searchQuerySchema.parse({ q: 'Friends', limit: 20 })
      expect(result.q).toBe('Friends')
      expect(result.limit).toBe(20)
    })

    it('should default limit to 10', () => {
      const result = searchQuerySchema.parse({ q: 'Test' })
      expect(result.limit).toBe(10)
    })

    it('should coerce string limit to number', () => {
      const result = searchQuerySchema.parse({ q: 'Test', limit: '25' })
      expect(result.limit).toBe(25)
    })

    it('should reject empty query string', () => {
      expect(() => searchQuerySchema.parse({ q: '' })).toThrow()
    })

    it('should reject query string longer than 100 characters', () => {
      const longQuery = 'a'.repeat(101)
      expect(() => searchQuerySchema.parse({ q: longQuery })).toThrow()
    })

    it('should reject limit greater than 100', () => {
      expect(() => searchQuerySchema.parse({ q: 'Test', limit: 101 })).toThrow()
    })

    it('should reject negative limit', () => {
      expect(() => searchQuerySchema.parse({ q: 'Test', limit: -1 })).toThrow()
    })

    it('should reject zero limit', () => {
      expect(() => searchQuerySchema.parse({ q: 'Test', limit: 0 })).toThrow()
    })

    it('should reject float limit', () => {
      expect(() => searchQuerySchema.parse({ q: 'Test', limit: 10.5 })).toThrow()
    })

    it('should accept query at max length (100 chars)', () => {
      const maxQuery = 'a'.repeat(100)
      const result = searchQuerySchema.parse({ q: maxQuery })
      expect(result.q).toBe(maxQuery)
    })

    it('should accept limit at max value (100)', () => {
      const result = searchQuerySchema.parse({ q: 'Test', limit: 100 })
      expect(result.limit).toBe(100)
    })
  })

  describe('validateShowId', () => {
    it('should validate and return valid show ID', () => {
      expect(validateShowId(123)).toBe(123)
      expect(validateShowId('456')).toBe(456)
    })

    it('should throw for invalid show ID', () => {
      expect(() => validateShowId(-1)).toThrow()
      expect(() => validateShowId('abc')).toThrow()
      expect(() => validateShowId(0)).toThrow()
    })
  })

  describe('validateCountryCode', () => {
    it('should validate and return valid country code', () => {
      expect(validateCountryCode('US')).toBe('US')
      expect(validateCountryCode('NL')).toBe('NL')
    })

    it('should throw for invalid country code', () => {
      expect(() => validateCountryCode('us')).toThrow()
      expect(() => validateCountryCode('USA')).toThrow()
      expect(() => validateCountryCode('12')).toThrow()
    })

    it('should return default US for undefined', () => {
      expect(validateCountryCode(undefined)).toBe('US')
    })
  })

  describe('createValidationError', () => {
    it('should create validation error object with correct structure', () => {
      const mockZodError = {
        issues: [
          { path: ['field'], message: 'Invalid value' },
          { path: ['nested', 'field'], message: 'Required' },
        ],
      } as z.ZodError

      const validationError = createValidationError(mockZodError)

      expect(validationError.statusCode).toBe(400)
      expect(validationError.statusMessage).toBe('Validation Error')
      expect(validationError.data).toBeDefined()
      expect(Array.isArray(validationError.data.issues)).toBe(true)
      expect(validationError.data.issues.length).toBe(2)
      expect(validationError.data.issues[0]).toHaveProperty('path')
      expect(validationError.data.issues[0]).toHaveProperty('message')
    })

    it('should verify Zod validation throws for invalid data', () => {
      expect(() => searchQuerySchema.parse({ q: '' })).toThrow()
      expect(() => showIdSchema.parse('abc')).toThrow()
      expect(() => countryCodeSchema.parse('US1')).toThrow()
    })

    it('should handle deeply nested object schemas', () => {
      const nestedSchema = z.object({
        data: z.object({
          user: z.object({
            email: z.string().email(),
          }),
        }),
      })

      expect(() => nestedSchema.parse({ data: { user: { email: 'invalid' } } })).toThrow()
    })
  })
})
