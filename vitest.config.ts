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
          // Disable i18n lazy loading for tests
          i18n: {
            lazy: false,
            langDir: null,
            locales: [
              { code: 'en', iso: 'en-US', name: 'English' },
              { code: 'nl', iso: 'nl-NL', name: 'Nederlands' },
              { code: 'es', iso: 'es-ES', name: 'Español' }
            ],
          },
        },
      },
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '*.config.ts',
        '*.config.js',
        '.nuxt/',
        'dist/',
        '.output/',
        'coverage/',
      ],
    },
  },
})

