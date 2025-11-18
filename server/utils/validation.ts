/**
 * Server-side validation schemas using Zod
 * Provides type-safe validation for API route parameters and queries
 */

import { z } from 'zod'

/**
 * Schema for validating show ID parameter
 * Must be a positive integer
 */
export const showIdSchema = z.coerce
  .number()
  .int()
  .positive()
  .describe('Show ID must be a positive integer')

/**
 * Schema for validating country code
 * Must be a 2-letter ISO country code (e.g., "US", "NL", "GB")
 */
export const countryCodeSchema = z
  .string()
  .length(2)
  .regex(/^[A-Z]{2}$/, 'Country code must be 2 uppercase letters')
  .default('US')
  .describe('ISO 3166-1 alpha-2 country code')

/**
 * Schema for show details query parameters
 */
export const showDetailsQuerySchema = z.object({
  country: z
    .string()
    .length(2)
    .regex(/^[A-Z]{2}$/, 'Country code must be 2 uppercase letters')
    .optional()
    .default('US'),
})

/**
 * Schema for search query parameters
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query must not be empty')
    .max(100, 'Search query must be at most 100 characters')
    .describe('Search query string'),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
})

/**
 * Validates show ID from route parameter
 * @param id - The ID to validate
 * @returns Validated show ID or throws validation error
 */
export function validateShowId(id: unknown): number {
  return showIdSchema.parse(id)
}

/**
 * Validates country code from query parameter
 * @param country - The country code to validate
 * @returns Validated country code
 */
export function validateCountryCode(country: unknown): string {
  return countryCodeSchema.parse(country)
}

/**
 * Creates a validation error response
 * @param error - Zod validation error
 * @returns H3 error object
 */
export function createValidationError(error: z.ZodError) {
  const issues = error.issues.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }))

  return {
    statusCode: 400,
    statusMessage: 'Validation Error',
    data: {
      issues,
    },
  }
}
