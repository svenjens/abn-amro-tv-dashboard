/**
 * Pinia store for managing search state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tvMazeAPI } from '@/api'
import type { Show, SearchResult, ApiError } from '@/types'

export const useSearchStore = defineStore('search', () => {
  // State
  const searchQuery = ref<string>('')
  const searchResults = ref<SearchResult[]>([])
  const loading = ref<boolean>(false)
  const error = ref<ApiError | null>(null)
  const recentSearches = ref<string[]>([])

  // Getters
  const results = computed(() => searchResults.value.map((result) => result.show))

  const hasResults = computed(() => searchResults.value.length > 0)

  const isSearching = computed(() => loading.value)

  const hasError = computed(() => error.value !== null)

  // Actions
  /**
   * Perform a search for TV shows
   */
  async function search(query: string): Promise<void> {
    searchQuery.value = query

    if (!query.trim()) {
      searchResults.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const results = await tvMazeAPI.searchShows(query)
      searchResults.value = results

      // Add to recent searches (avoid duplicates)
      if (!recentSearches.value.includes(query)) {
        recentSearches.value.unshift(query)
        // Keep only last 5 searches
        if (recentSearches.value.length > 5) {
          recentSearches.value = recentSearches.value.slice(0, 5)
        }
        // Save to localStorage
        saveRecentSearches()
      }

      console.log(`[Search Store] Found ${results.length} results for "${query}"`)
    } catch (err) {
      error.value = err as ApiError
      console.error('[Search Store] Search failed:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear search results
   */
  function clearSearch(): void {
    searchQuery.value = ''
    searchResults.value = []
    error.value = null
  }

  /**
   * Clear error state
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Save recent searches to localStorage
   */
  function saveRecentSearches(): void {
    try {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
    } catch (err) {
      console.error('[Search Store] Failed to save recent searches:', err)
    }
  }

  /**
   * Load recent searches from localStorage
   */
  function loadRecentSearches(): void {
    try {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        recentSearches.value = JSON.parse(saved)
      }
    } catch (err) {
      console.error('[Search Store] Failed to load recent searches:', err)
    }
  }

  /**
   * Clear recent searches
   */
  function clearRecentSearches(): void {
    recentSearches.value = []
    try {
      localStorage.removeItem('recentSearches')
    } catch (err) {
      console.error('[Search Store] Failed to clear recent searches:', err)
    }
  }

  /**
   * Get show from search results by ID
   */
  function getShowFromResults(id: number): Show | null {
    const result = searchResults.value.find((result) => result.show.id === id)
    return result ? result.show : null
  }

  /**
   * Reset store state
   */
  function $reset(): void {
    searchQuery.value = ''
    searchResults.value = []
    loading.value = false
    error.value = null
    // Don't clear recent searches on reset
  }

  // Load recent searches on store initialization
  loadRecentSearches()

  return {
    // State
    searchQuery,
    searchResults,
    loading,
    error,
    recentSearches,

    // Getters
    results,
    hasResults,
    isSearching,
    hasError,

    // Actions
    search,
    clearSearch,
    clearError,
    clearRecentSearches,
    getShowFromResults,
    $reset,
  }
})
