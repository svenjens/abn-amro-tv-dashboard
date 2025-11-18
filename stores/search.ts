/**
 * Pinia store for managing search state
 * Note: Search page should use direct API calls for better SSR
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/utils'
import { useToast } from '@/composables'
import type { Show, SearchResult, ApiError } from '@/types'

export const useSearchStore = defineStore('search', () => {
  // Only initialize toast on client-side
  const toast = import.meta.client ? useToast() : null

  // State
  const searchQuery = ref<string>('')
  const searchResults = ref<SearchResult[]>([])
  const loading = ref<boolean>(false)
  const error = ref<ApiError | null>(null)
  const recentSearches = ref<string[]>([])
  const loadingStreamingData = ref<boolean>(false)

  // AbortController for streaming data enrichment
  let enrichmentController: AbortController | null = null

  // Getters
  const results = computed(() => searchResults.value.map((result) => result.show))

  const fullResults = computed(() => searchResults.value) // Returns SearchResult[] with matchedTerm

  const hasResults = computed(() => searchResults.value.length > 0)

  const isSearching = computed(() => loading.value)

  const hasError = computed(() => error.value !== null)

  // Actions
  /**
   * Perform a search for TV shows using server API
   */
  async function search(query: string): Promise<void> {
    searchQuery.value = query

    // Cancel any ongoing streaming enrichment from previous search
    if (enrichmentController) {
      enrichmentController.abort()
      enrichmentController = null
      loadingStreamingData.value = false
    }

    if (!query.trim()) {
      searchResults.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const results = await $fetch<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`)
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

      logger.debug(`[Search Store] Found ${results.length} results for "${query}"`)
    } catch (err) {
      error.value = err as ApiError
      if (toast) {
        toast.error('Search failed. Please try again.')
      }
      logger.error('[Search Store] Search failed:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Enrich search results with streaming data from TMDB
   */
  async function enrichWithStreamingData(): Promise<void> {
    if (searchResults.value.length === 0) return

    // Cancel previous enrichment if still running
    if (enrichmentController) {
      enrichmentController.abort()
    }

    // Create new AbortController for this enrichment
    enrichmentController = new AbortController()
    const signal = enrichmentController.signal

    // Take a snapshot of current results to validate data freshness
    const currentResults = searchResults.value

    logger.info(
      `[Search Store] Enriching ${searchResults.value.length} search results with streaming data`
    )
    loadingStreamingData.value = true

    try {
      // Process results in small batches to respect rate limits
      const batchSize = 5
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

      for (let i = 0; i < currentResults.length; i += batchSize) {
        // Check if enrichment was cancelled
        if (signal.aborted) {
          logger.info('[Search Store] Streaming data enrichment cancelled')
          return
        }

        const batch = currentResults.slice(i, i + batchSize)

        // Process batch concurrently
        await Promise.all(
          batch.map(async (result) => {
            try {
              // Check if enrichment was cancelled before each fetch
              if (signal.aborted) return

              // Fetch show details which includes streaming availability
              const showDetails = await $fetch<Show>(`/api/shows/${result.show.id}`)

              // Validate data freshness: only update if results haven't changed
              if (signal.aborted || searchResults.value !== currentResults) {
                return
              }

              // Update the show with streaming data
              if (showDetails.streamingAvailability) {
                result.show.streamingAvailability = showDetails.streamingAvailability
              }
            } catch (err: any) {
              // Ignore abort errors
              if (err.name === 'AbortError') return

              logger.warn(
                `[Search Store] Failed to fetch streaming data for show ${result.show.id}:`,
                err
              )
              // Continue with other shows even if one fails
            }
          })
        )

        // Add delay between batches to respect rate limits
        if (i + batchSize < currentResults.length && !signal.aborted) {
          await delay(300) // 300ms delay between batches
        }
      }

      if (!signal.aborted) {
        logger.info('[Search Store] Completed streaming data enrichment')
      }
    } catch (err: any) {
      // Ignore abort errors
      if (err.name !== 'AbortError') {
        logger.error('[Search Store] Failed to enrich with streaming data:', err)
      }
    } finally {
      // Only reset loading state if this enrichment wasn't cancelled
      if (!signal.aborted) {
        loadingStreamingData.value = false
        enrichmentController = null
      }
    }
  }

  /**
   * Clear search results
   */
  function clearSearch(): void {
    // Cancel any ongoing streaming enrichment
    if (enrichmentController) {
      enrichmentController.abort()
      enrichmentController = null
      loadingStreamingData.value = false
    }

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
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
    } catch (err) {
      logger.error('[Search Store] Failed to save recent searches:', err)
    }
  }

  /**
   * Load recent searches from localStorage
   */
  function loadRecentSearches(): void {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        recentSearches.value = JSON.parse(saved)
      }
    } catch (err) {
      logger.error('[Search Store] Failed to load recent searches:', err)
    }
  }

  /**
   * Clear recent searches
   */
  function clearRecentSearches(): void {
    recentSearches.value = []
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.removeItem('recentSearches')
    } catch (err) {
      logger.error('[Search Store] Failed to clear recent searches:', err)
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
   * Type predicate to check if an item is a SearchResult
   */
  function isSearchResult(item: Show | SearchResult): item is SearchResult {
    return 'show' in item && 'score' in item
  }

  /**
   * Set search results directly (used for semantic search)
   */
  function setResults(results: Show[] | SearchResult[]): void {
    // Cancel any ongoing streaming enrichment from previous results
    if (enrichmentController) {
      enrichmentController.abort()
      enrichmentController = null
      loadingStreamingData.value = false
    }

    // Support both Show[] (legacy) and SearchResult[] (with matchedTerm)
    searchResults.value = results.map((item) => {
      if (isSearchResult(item)) {
        // Already a SearchResult
        return item
      }
      // Convert Show to SearchResult
      return { show: item, score: 1 }
    })
    loading.value = false
    error.value = null
  }

  /**
   * Reset store state
   */
  function $reset(): void {
    // Cancel any ongoing streaming enrichment
    if (enrichmentController) {
      enrichmentController.abort()
      enrichmentController = null
    }

    searchQuery.value = ''
    searchResults.value = []
    loading.value = false
    loadingStreamingData.value = false
    error.value = null
    // Don't clear recent searches on reset
  }

  // Load recent searches on store initialization (client-side only)
  if (import.meta.client) {
    loadRecentSearches()
  }

  return {
    // State
    searchQuery,
    searchResults,
    loading,
    error,
    recentSearches,
    loadingStreamingData,

    // Getters
    results,
    fullResults, // SearchResult[] with matchedTerm
    hasResults,
    isSearching,
    hasError,

    // Actions
    search,
    enrichWithStreamingData,
    setResults,
    clearSearch,
    clearError,
    clearRecentSearches,
    getShowFromResults,
    $reset,
  }
})
