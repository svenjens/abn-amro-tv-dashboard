/**
 * Google Tag Manager / Google Ads Tracking
 *
 * Provides methods to initialize and track events with Google Ads
 * Respects user privacy with DNT (Do Not Track) support
 */

import { logger } from './logger'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/**
 * Check if tracking is allowed (respects Do Not Track)
 * Checks multiple browser implementations for maximum compatibility
 */
function isTrackingAllowed(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // Check Do Not Track preference across different browser implementations
  // @ts-expect-error - msDoNotTrack is IE-specific
  const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack

  // DNT can be '1', 'yes', or true depending on browser
  if (dnt === '1' || dnt === 'yes' || dnt === true) {
    return false
  }

  return true
}

/**
 * Validate Google Ads ID format (AW-XXXXXXXXXX)
 */
function validateAdsId(adsId: string): boolean {
  const adsIdPattern = /^AW-\d+$/
  return adsIdPattern.test(adsId)
}

/**
 * Initialize Google Tag Manager / Google Ads
 */
export function initGoogleAds(adsId: string): void {
  if (!adsId || typeof window === 'undefined') {
    logger.debug('[GTM] Google Ads ID not provided or not in browser environment')
    return
  }

  // Validate Google Ads ID format
  if (!validateAdsId(adsId)) {
    logger.error('[GTM] Invalid or missing Google Ads ID')
    return
  }

  // Check if tracking is allowed
  if (!isTrackingAllowed()) {
    logger.debug('[GTM] Tracking disabled due to Do Not Track preference')
    return
  }

  try {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []

    // Define gtag function
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }

    // Initialize with current date
    window.gtag('js', new Date())

    // Configure with Ads ID
    window.gtag('config', adsId)

    // Load the gtag.js script with validated/sanitized adsId
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`
    document.head.appendChild(script)

    logger.debug('[GTM] Google Ads initialized', { adsId })
  } catch (error) {
    logger.error('[GTM] Failed to initialize Google Ads', error)
  }
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  // Respect Do Not Track preference
  if (!isTrackingAllowed()) {
    return
  }

  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  try {
    window.gtag('event', eventName, params)
    logger.debug('[GTM] Event tracked', { eventName, params })
  } catch (error) {
    logger.error('[GTM] Failed to track event', { eventName, params }, error)
  }
}

/**
 * Track page view
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  // Respect Do Not Track preference
  if (!isTrackingAllowed()) {
    return
  }

  trackEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath,
  })
}

/**
 * Track conversion
 */
export function trackConversion(conversionId: string, conversionLabel?: string): void {
  // Respect Do Not Track preference
  if (!isTrackingAllowed()) {
    return
  }

  trackEvent('conversion', {
    send_to: conversionLabel ? `${conversionId}/${conversionLabel}` : conversionId,
  })
}

/**
 * Track show view (custom event for TV show dashboard)
 */
export function trackShowView(showId: number, showName: string): void {
  trackEvent('view_show', {
    show_id: showId,
    show_name: showName,
  })
}

/**
 * Track watchlist action (custom event)
 */
export function trackWatchlistAction(
  action: 'add' | 'remove',
  showId: number,
  showName: string
): void {
  trackEvent('watchlist_action', {
    action,
    show_id: showId,
    show_name: showName,
  })
}

/**
 * Sanitize search term to prevent PII leakage
 * Truncates long queries and removes potential email patterns
 */
function sanitizeSearchTerm(searchTerm: string): string {
  if (!searchTerm) return ''

  // Truncate to max 100 characters to prevent long personal info
  let sanitized = searchTerm.slice(0, 100)

  // Remove potential email addresses (basic pattern)
  sanitized = sanitized.replace(/\S+@\S+\.\S+/g, '[email]')

  // Remove potential phone numbers (basic patterns)
  sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]')

  return sanitized.trim()
}

/**
 * Track search (custom event)
 * Note: Search terms are sanitized to prevent accidental PII tracking
 */
export function trackSearch(searchTerm: string, resultCount: number): void {
  trackEvent('search', {
    search_term: sanitizeSearchTerm(searchTerm),
    result_count: resultCount,
  })
}

/**
 * Track streaming link click (for affiliate tracking)
 * Note: For external links, tracking may not complete before navigation.
 * Consider using gtag transport: 'beacon' option in production for critical tracking.
 */
export function trackStreamingClick(
  platform: string,
  showName: string,
  isAffiliate: boolean
): void {
  trackEvent('streaming_click', {
    platform,
    show_name: showName,
    is_affiliate: isAffiliate,
  })
}
