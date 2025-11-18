// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt().append({
  rules: {
    // Nuxt/Vue specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off', // We use v-html with sanitized content
    'vue/no-use-v-if-with-v-for': 'off', // Sometimes necessary for conditional rendering
    'vue/html-self-closing': 'off', // Allow self-closing on void elements for consistency

    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'off', // Allow any in server API files with external data
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-useless-constructor': 'off', // Allow for test mocks
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
      },
    ],

    // General rules
    'no-console': 'off', // We use console in server-side code
    'prefer-const': 'warn',
    'no-unused-vars': 'off', // Use TypeScript version instead
    'import/no-duplicates': 'error',
    '@typescript-eslint/no-dynamic-delete': 'off', // Allow for test cleanup
  },
})
