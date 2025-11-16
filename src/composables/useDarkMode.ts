import { ref } from 'vue'
import { logger } from '@/utils'

/**
 * Dark Mode Composable
 *
 * Provides dark mode functionality with:
 * - System preference detection
 * - localStorage persistence
 * - Manual toggle
 * - Reactive state
 */

const STORAGE_KEY = 'tv-dashboard-theme'

export type Theme = 'light' | 'dark' | 'system'

// Global state (shared across all components)
const isDark = ref(false)
const theme = ref<Theme>('system')

/**
 * Get system preference for dark mode
 */
function getSystemPreference(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Apply dark mode to document
 */
function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/**
 * Update isDark based on current theme setting
 */
function updateIsDark() {
  if (theme.value === 'system') {
    isDark.value = getSystemPreference()
  } else {
    isDark.value = theme.value === 'dark'
  }
  applyTheme(isDark.value)
}

/**
 * Load theme from localStorage
 */
function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
      return stored as Theme
    }
  } catch (error) {
    logger.error('[DarkMode] Failed to load theme:', error)
  }
  return 'system'
}

/**
 * Save theme to localStorage
 */
function saveTheme(newTheme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, newTheme)
  } catch (error) {
    logger.error('[DarkMode] Failed to save theme:', error)
  }
}

/**
 * Dark mode composable
 */
export function useDarkMode() {
  /**
   * Set theme (light, dark, or system)
   */
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    saveTheme(newTheme)
    updateIsDark()
  }

  /**
   * Toggle between light and dark
   * (Switches away from system preference)
   */
  function toggle() {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  /**
   * Initialize dark mode on mount
   */
  function init() {
    // Load saved theme
    theme.value = loadTheme()
    updateIsDark()

    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme.value === 'system') {
        isDark.value = e.matches
        applyTheme(isDark.value)
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Cleanup function (if needed)
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }

  return {
    isDark,
    theme,
    setTheme,
    toggle,
    init,
  }
}

/**
 * Initialize dark mode early (before Vue app mounts)
 * This prevents flash of wrong theme
 */
export function initDarkModeEarly() {
  const stored = loadTheme()
  const shouldBeDark = stored === 'dark' || (stored === 'system' && getSystemPreference())
  applyTheme(shouldBeDark)
}
