/**
 * Vercel Speed Insights plugin for tracking Core Web Vitals
 * Only runs on client-side in production
 */

import { injectSpeedInsights } from '@vercel/speed-insights'

export default defineNuxtPlugin(() => {
  // Only inject speed insights in production
  if (import.meta.env.PROD) {
    injectSpeedInsights()
  }
})
