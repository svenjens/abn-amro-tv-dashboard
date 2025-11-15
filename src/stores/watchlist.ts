/**
 * Watchlist Store
 * Manages user's watchlist with localStorage persistence
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Show, WatchedEpisode } from '@/types'
import { logger } from '@/utils'

const WATCHLIST_STORAGE_KEY = 'tv-dashboard-watchlist'
const WATCHED_EPISODES_STORAGE_KEY = 'tv-dashboard-watched-episodes'

export const useWatchlistStore = defineStore('watchlist', () => {
  const watchlist = ref<Show[]>([])
  const watchedEpisodes = ref<WatchedEpisode[]>([])

  // Load watchlist from localStorage on init
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY)
      if (stored) {
        watchlist.value = JSON.parse(stored)
        logger.debug(`[Watchlist] Loaded ${watchlist.value.length} shows from storage`)
      }

      const storedEpisodes = localStorage.getItem(WATCHED_EPISODES_STORAGE_KEY)
      if (storedEpisodes) {
        watchedEpisodes.value = JSON.parse(storedEpisodes)
        logger.debug(
          `[Watchlist] Loaded ${watchedEpisodes.value.length} watched episodes from storage`
        )
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

  // Save watched episodes to localStorage
  function saveEpisodesToStorage() {
    try {
      localStorage.setItem(WATCHED_EPISODES_STORAGE_KEY, JSON.stringify(watchedEpisodes.value))
      logger.debug(`[Watchlist] Saved ${watchedEpisodes.value.length} watched episodes to storage`)
    } catch (error) {
      logger.error('[Watchlist] Failed to save episodes to localStorage:', error)
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

  // Episode tracking functions
  function isEpisodeWatched(showId: number, episodeId: number): boolean {
    return watchedEpisodes.value.some((ep) => ep.showId === showId && ep.episodeId === episodeId)
  }

  function markEpisodeAsWatched(
    showId: number,
    episodeId: number,
    season: number,
    episode: number
  ) {
    if (!isEpisodeWatched(showId, episodeId)) {
      watchedEpisodes.value.push({
        showId,
        episodeId,
        season,
        episode,
        watchedAt: Date.now(),
      })
      saveEpisodesToStorage()
      logger.debug(`[Watchlist] Marked episode S${season}E${episode} as watched`)
    }
  }

  function unmarkEpisodeAsWatched(showId: number, episodeId: number) {
    const index = watchedEpisodes.value.findIndex(
      (ep) => ep.showId === showId && ep.episodeId === episodeId
    )
    if (index !== -1) {
      watchedEpisodes.value.splice(index, 1)
      saveEpisodesToStorage()
      logger.debug(`[Watchlist] Unmarked episode as watched`)
    }
  }

  function toggleEpisodeWatched(
    showId: number,
    episodeId: number,
    season: number,
    episode: number
  ) {
    if (isEpisodeWatched(showId, episodeId)) {
      unmarkEpisodeAsWatched(showId, episodeId)
    } else {
      markEpisodeAsWatched(showId, episodeId, season, episode)
    }
  }

  function getWatchedEpisodesForShow(showId: number): WatchedEpisode[] {
    return watchedEpisodes.value.filter((ep) => ep.showId === showId)
  }

  function getWatchedEpisodesCount(showId: number): number {
    return getWatchedEpisodesForShow(showId).length
  }

  // Computed properties
  const watchlistCount = computed(() => watchlist.value.length)
  const hasShows = computed(() => watchlist.value.length > 0)
  const totalWatchedEpisodes = computed(() => watchedEpisodes.value.length)

  // Initialize on store creation
  loadFromStorage()

  return {
    // Watchlist
    watchlist,
    watchlistCount,
    hasShows,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
    // Episode tracking
    watchedEpisodes,
    totalWatchedEpisodes,
    isEpisodeWatched,
    markEpisodeAsWatched,
    unmarkEpisodeAsWatched,
    toggleEpisodeWatched,
    getWatchedEpisodesForShow,
    getWatchedEpisodesCount,
  }
})
