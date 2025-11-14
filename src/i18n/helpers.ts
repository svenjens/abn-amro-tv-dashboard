/**
 * Helper functions for i18n
 */

import i18n from './index'

/**
 * Get current locale value
 */
export function getCurrentLocale(): string {
  const i18nGlobal = i18n.global as {
    locale: { value: string } | string
  }
  const locale = i18nGlobal.locale
  // Handle both ref and direct string
  return typeof locale === 'object' && 'value' in locale ? String(locale.value) : String(locale)
}

/**
 * Set current locale
 */
export function setCurrentLocale(newLocale: 'en' | 'nl'): void {
  const i18nGlobal = i18n.global as {
    locale: { value: string } | string
  }
  const locale = i18nGlobal.locale
  if (typeof locale === 'object' && 'value' in locale) {
    locale.value = newLocale
  }
}
