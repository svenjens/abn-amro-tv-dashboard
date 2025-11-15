/**
 * PWA utilities for service worker registration and install prompt
 */

import { logger } from './logger'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null

/**
 * Register service worker for PWA support
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Only register in production
  if (import.meta.env.DEV) {
    logger.debug('[PWA] Service worker disabled in development mode')
    return null
  }

  // Check if service worker is supported
  if (!('serviceWorker' in navigator)) {
    logger.warn('[PWA] Service workers are not supported in this browser')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    logger.debug('[PWA] Service worker registered successfully')

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        logger.debug('[PWA] New service worker available')
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            logger.debug('[PWA] New content available, reload to update')
            // Could show a toast notification here
            if (
              confirm('A new version of TV Show Dashboard is available! Would you like to update?')
            ) {
              newWorker.postMessage({ type: 'SKIP_WAITING' })
              window.location.reload()
            }
          }
        })
      }
    })

    return registration
  } catch (error) {
    logger.error('[PWA] Service worker registration failed:', error)
    return null
  }
}

/**
 * Initialize PWA install prompt
 *
 * Note: beforeinstallprompt.preventDefault() is deprecated but still functional.
 * It prevents the browser's default install banner and allows us to show a custom prompt.
 * The new recommended approach is to use the prompt() method within a user gesture.
 */
export function initInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    // Note: preventDefault() is deprecated but still functional and widely used
    e.preventDefault()
    // Store the event for later use
    deferredPrompt = e as BeforeInstallPromptEvent
    logger.debug('[PWA] Install prompt available')

    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('pwa-install-available'))
  })

  window.addEventListener('appinstalled', () => {
    logger.debug('[PWA] App installed successfully')
    deferredPrompt = null
    window.dispatchEvent(new CustomEvent('pwa-installed'))
  })
}

/**
 * Show PWA install prompt
 */
export async function showInstallPrompt(): Promise<'accepted' | 'dismissed' | null> {
  if (!deferredPrompt) {
    logger.warn('[PWA] Install prompt not available')
    return null
  }

  try {
    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice
    logger.debug('[PWA] User response to install prompt:', outcome)

    // Clear the deferred prompt
    deferredPrompt = null

    return outcome
  } catch (error) {
    logger.error('[PWA] Failed to show install prompt:', error)
    return null
  }
}

/**
 * Check if app is currently installed as PWA
 */
export function isPWA(): boolean {
  // Check for iOS standalone mode
  interface NavigatorStandalone {
    standalone?: boolean
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as NavigatorStandalone).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

/**
 * Check if install prompt is available
 */
export function isInstallAvailable(): boolean {
  return deferredPrompt !== null
}

/**
 * Clear all service worker caches
 */
export async function clearPWACache(): Promise<void> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
    logger.debug('[PWA] Cache clear requested')
  }
}
