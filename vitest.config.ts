import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('.', import.meta.url)),
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
        overrides: {
          // Disable color-mode module for tests
          modules: [
            '@nuxt/eslint',
            '@nuxtjs/tailwindcss',
            '@nuxtjs/i18n',
            '@pinia/nuxt',
            '@vueuse/nuxt',
            '@vueuse/motion/nuxt',
            '@nuxt/icon',
            '@nuxt/image',
            '@nuxt/scripts',
            // '@nuxtjs/color-mode', // Disabled for tests
            '@nuxtjs/robots',
            '@nuxtjs/sitemap',
            '@nuxtjs/fontaine',
            'nuxt-security',
          ],
          // Disable i18n lazy loading for tests
          i18n: {
            locales: [
              { code: 'en', iso: 'en-US', name: 'English' },
              { code: 'nl', iso: 'nl-NL', name: 'Nederlands' },
              { code: 'es', iso: 'es-ES', name: 'Español' },
            ],
          },
        },
      },
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '*.config.ts',
        '*.config.js',
        '.nuxt/',
        'dist/',
        '.output/',
        'coverage/',
        '**/virtual:**', // Exclude virtual modules from coverage
        '**/.nuxt/**', // Exclude Nuxt build artifacts
      ],
    },
  },
})
