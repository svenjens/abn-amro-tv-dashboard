/**
 * Language and Locale Utilities
 * Maps i18n locales to language codes and provides locale validation
 */

import { z } from 'zod'
import type { H3Event } from 'h3'

/**
 * Supported locales in the application
 */
export const SUPPORTED_LOCALES = ['en', 'nl', 'es'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Language name mapping for display and translation services
 */
export const LOCALE_TO_LANGUAGE: Record<SupportedLocale, string> = {
  en: 'English',
  nl: 'Dutch',
  es: 'Spanish',
}

/**
 * TMDB language codes (if needed for TMDB API calls)
 */
export const LOCALE_TO_TMDB_LANGUAGE: Record<SupportedLocale, string> = {
  en: 'en-US',
  nl: 'nl-NL',
  es: 'es-ES',
}

/**
 * ISO language codes
 */
export const LOCALE_TO_ISO: Record<SupportedLocale, string> = {
  en: 'en-US',
  nl: 'nl-NL',
  es: 'es-ES',
}

/**
 * Zod schema for locale validation
 */
const localeSchema = z.enum(SUPPORTED_LOCALES)

/**
 * Validate and normalize a locale string
 * @param locale - Locale string to validate
 * @returns Validated locale or 'en' as fallback
 */
export function validateLocale(locale: unknown): SupportedLocale {
  const result = localeSchema.safeParse(locale)
  if (result.success) {
    return result.data
  }
  return 'en' // Default fallback
}

/**
 * Extract locale from H3 event
 * Checks query parameter first, then falls back to cookie or header
 * @param event - H3 event object
 * @returns Validated locale
 */
export function getLocaleFromRequest(event: H3Event): SupportedLocale {
  const query = getQuery(event)
  
  // 1. Check query parameter
  if (query.locale) {
    const locale = validateLocale(query.locale)
    if (locale !== 'en') {
      return locale
    }
  }

  // 2. Check i18n cookie (set by Nuxt i18n module)
  const cookies = parseCookies(event)
  if (cookies.i18n_redirected) {
    const locale = validateLocale(cookies.i18n_redirected)
    if (locale !== 'en') {
      return locale
    }
  }

  // 3. Check accept-language header
  const acceptLanguage = getHeader(event, 'accept-language')
  if (acceptLanguage) {
    // Extract first language code (e.g., "nl-NL,nl;q=0.9,en-US;q=0.8" -> "nl")
    const primaryLanguage = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
    if (primaryLanguage) {
      const locale = validateLocale(primaryLanguage)
      if (locale !== 'en') {
        return locale
      }
    }
  }

  // 4. Default to English
  return 'en'
}

/**
 * Check if translation is needed for the given locale
 * @param locale - Locale to check
 * @returns true if locale is not English
 */
export function needsTranslation(locale: SupportedLocale): boolean {
  return locale !== 'en'
}

/**
 * Get language name for display
 * @param locale - Locale code
 * @returns Human-readable language name
 */
export function getLanguageName(locale: SupportedLocale): string {
  return LOCALE_TO_LANGUAGE[locale] || 'English'
}

/**
 * Get all supported locales with their display names
 * @returns Array of locale objects with code and name
 */
export function getSupportedLocales(): Array<{ code: SupportedLocale; name: string }> {
  return SUPPORTED_LOCALES.map((code) => ({
    code,
    name: LOCALE_TO_LANGUAGE[code],
  }))
}

