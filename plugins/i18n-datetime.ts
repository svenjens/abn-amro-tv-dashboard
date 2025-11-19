/**
 * Nuxt plugin to configure i18n datetime formats
 * This is necessary because datetimeFormats in nuxt.config.ts or i18n.config.ts
 * don't work properly in Nuxt 4 with @nuxtjs/i18n
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as any

  // Guard: ensure i18n is ready
  if (!i18n || typeof i18n.setDateTimeFormat !== 'function') {
    // Fail silently if i18n is not ready for some reason
    return
  }

  // Add datetime formats for all locales
  i18n.setDateTimeFormat('en', {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  })

  i18n.setDateTimeFormat('nl', {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  })

  i18n.setDateTimeFormat('es', {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  })
})
