/**
 * Vercel Analytics plugin for tracking page views and user interactions
 * Only runs on client-side in production
 */

import { inject } from '@vercel/analytics'

export default defineNuxtPlugin(() => {
  // Only inject analytics in production
  if (import.meta.env.PROD) {
    inject()
  }
})
