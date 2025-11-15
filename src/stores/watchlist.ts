/**
 * Watchlist Store
 * Manages user's watchlist with localStorage persistence
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Show } from '@/types'
import { logger } from '@/utils'

const WATCHLIST_STORAGE_KEY = 'tv-dashboard-watchlist'

export const useWatchlistStore = defineStore('watchlist', () => {
  const watchlist = ref<Show[]>([])

  // Load watchlist from localStorage on init
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY)
      if (stored) {
        watchlist.value = JSON.parse(stored)
        logger.debug(`[Watchlist] Loaded ${watchlist.value.length} shows from storage`)
      }
    } catch (error) {
      logger.error('[Watchlist] Failed to load from localStorage:', error)
    }
  }

  // Save watchlist to localStorage
  function saveToStorage() {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist.value))
      logger.debug(`[Watchlist] Saved ${watchlist.value.length} shows to storage`)
    } catch (error) {
      logger.error('[Watchlist] Failed to save to localStorage:', error)
    }
  }

  // Check if a show is in the watchlist
  function isInWatchlist(showId: number): boolean {
    return watchlist.value.some((show) => show.id === showId)
  }

  // Add a show to the watchlist
  function addToWatchlist(show: Show) {
    if (!isInWatchlist(show.id)) {
      watchlist.value.push(show)
      saveToStorage()
      logger.debug(`[Watchlist] Added show: ${show.name}`)
    }
  }

  // Remove a show from the watchlist
  function removeFromWatchlist(showId: number) {
    const index = watchlist.value.findIndex((show) => show.id === showId)
    if (index !== -1) {
      const removedShow = watchlist.value.splice(index, 1)[0]
      saveToStorage()
      if (removedShow) {
        logger.debug(`[Watchlist] Removed show: ${removedShow.name}`)
      }
    }
  }

  // Toggle a show in the watchlist
  function toggleWatchlist(show: Show) {
    if (isInWatchlist(show.id)) {
      removeFromWatchlist(show.id)
    } else {
      addToWatchlist(show)
    }
  }

  // Clear the entire watchlist
  function clearWatchlist() {
    watchlist.value = []
    saveToStorage()
    logger.debug('[Watchlist] Cleared all shows')
  }

  // Computed properties
  const watchlistCount = computed(() => watchlist.value.length)
  const hasShows = computed(() => watchlist.value.length > 0)

  // Initialize on store creation
  loadFromStorage()

  return {
    watchlist,
    watchlistCount,
    hasShows,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
  }
})

