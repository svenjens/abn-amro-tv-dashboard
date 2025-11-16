/**
 * Google Tag Manager / Google Ads Tracking
 * 
 * Provides methods to initialize and track events with Google Ads
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
 * Initialize Google Tag Manager / Google Ads
 */
export function initGoogleAds(adsId: string): void {
  if (!adsId || typeof window === 'undefined') {
    logger.debug('[GTM] Google Ads ID not provided or not in browser environment')
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
    
    // Load the gtag.js script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`
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
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }
  
  try {
    window.gtag('event', eventName, params)
    logger.debug('[GTM] Event tracked', { eventName, params })
  } catch (error) {
    logger.error('[GTM] Failed to track event', error)
  }
}

/**
 * Track page view
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  trackEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath,
  })
}

/**
 * Track conversion
 */
export function trackConversion(conversionId: string, conversionLabel?: string): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }
  
  try {
    window.gtag('event', 'conversion', {
      send_to: conversionLabel ? `${conversionId}/${conversionLabel}` : conversionId,
    })
    logger.debug('[GTM] Conversion tracked', { conversionId, conversionLabel })
  } catch (error) {
    logger.error('[GTM] Failed to track conversion', error)
  }
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
export function trackWatchlistAction(action: 'add' | 'remove', showId: number, showName: string): void {
  trackEvent('watchlist_action', {
    action,
    show_id: showId,
    show_name: showName,
  })
}

/**
 * Track search (custom event)
 */
export function trackSearch(searchTerm: string, resultCount: number): void {
  trackEvent('search', {
    search_term: searchTerm,
    result_count: resultCount,
  })
}

/**
 * Track streaming link click (for affiliate tracking)
 */
export function trackStreamingClick(platform: string, showName: string, isAffiliate: boolean): void {
  trackEvent('streaming_click', {
    platform,
    show_name: showName,
    is_affiliate: isAffiliate,
  })
}

