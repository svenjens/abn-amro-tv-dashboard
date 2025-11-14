/**
 * Vue I18n configuration
 * Provides internationalization support for the application
 */

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import nl from './locales/nl.json'

export type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'nl'>({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    nl,
  },
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    },
    nl: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      },
    },
  },
})

/**
 * Get initial locale from localStorage or browser settings
 */
function getInitialLocale(): 'en' | 'nl' {
  // Try localStorage first
  const stored = localStorage.getItem('locale')
  if (stored === 'en' || stored === 'nl') {
    return stored
  }

  // Fall back to browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('nl')) {
    return 'nl'
  }

  return 'en'
}

/**
 * Save locale preference to localStorage
 */
export function saveLocale(locale: 'en' | 'nl') {
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}

export default i18n
