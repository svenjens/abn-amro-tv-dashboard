/**
 * Pinia store for managing TV shows state
 * Note: Prefer using server API routes directly with useAsyncData for SSR
 * This store is mainly for client-side state management and caching
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { groupShowsByGenre, getSortedGenres, logger } from '@/utils'
import { useToast } from '@/composables'
import type { Show, ShowsByGenre, ApiError } from '@/types'

export const useShowsStore = defineStore('shows', () => {
  // Only initialize toast on client-side
  const toast = import.meta.client ? useToast() : null

  // State
  const allShows = ref<Show[]>([])
  const showsByGenre = ref<ShowsByGenre>({})
  const currentShow = ref<Show | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<ApiError | null>(null)

  // Getters
  const genres = computed(() => getSortedGenres(showsByGenre.value))

  const isLoading = computed(() => loading.value)

  const hasError = computed(() => error.value !== null)

  const showsCount = computed(() => allShows.value.length)

  /**
   * Get shows for a specific genre (case-insensitive)
   */
  const getShowsByGenre = computed(() => {
    return (genre: string): Show[] => {
      // Capitalize first letter to match stored genre format
      const capitalizedGenre = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()
      return showsByGenre.value[capitalizedGenre] || []
    }
  })

  /**
   * Get top rated shows across all genres
   */
  const topRatedShows = computed(() => {
    return [...allShows.value]
      .filter((show) => show.rating.average !== null)
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
      .slice(0, 20)
  })

  // Actions
  /**
   * Set shows directly (used when data comes from server-side fetching)
   */
  function setShows(shows: Show[]): void {
    allShows.value = shows
    showsByGenre.value = groupShowsByGenre(shows)
    loading.value = false
    error.value = null
    logger.debug('Shows loaded and grouped by genre', {
      module: 'stores/shows',
      action: 'setShows',
      showsCount: shows.length,
      genresCount: genres.value.length,
    })
  }

  /**
   * Set shows with pre-sorted genre data from server (SSR)
   */
  function setShowsWithGenres(shows: Show[], sortedShowsByGenre: ShowsByGenre): void {
    allShows.value = shows
    showsByGenre.value = sortedShowsByGenre // Use server-sorted data
    loading.value = false
    error.value = null
    logger.debug('Shows loaded with server-sorted genres', {
      module: 'stores/shows',
      action: 'setShowsWithGenres',
      showsCount: shows.length,
      genresCount: Object.keys(sortedShowsByGenre).length,
    })
  }

  /**
   * Fetch all shows from server API
   * Note: Prefer using useAsyncData directly in pages for better SSR
   */
  async function fetchAllShows(): Promise<void> {
    // Don't fetch if we already have data
    if (allShows.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ shows: Show[]; showsByGenre: ShowsByGenre }>('/api/shows')
      // Use the pre-sorted data from the server
      allShows.value = response.shows
      showsByGenre.value = response.showsByGenre
      loading.value = false
      error.value = null
      logger.debug('Shows fetched from API', {
        module: 'stores/shows',
        action: 'fetchAllShows',
        showsCount: response.shows.length,
        genresCount: genres.value.length,
      })
    } catch (err) {
      error.value = err as ApiError
      if (toast) {
        toast.error('Failed to load TV shows. Please try again later.')
      }
      logger.error(
        'Failed to fetch shows',
        { module: 'stores/shows', action: 'fetchAllShows' },
        err
      )
      loading.value = false
    }
  }

  /**
   * Fetch a single show by ID from server API
   * Note: Prefer using useAsyncData directly in pages for better SSR
   */
  async function fetchShowById(id: number): Promise<Show | null> {
    loading.value = true
    error.value = null

    try {
      const show = await $fetch<Show>(`/api/shows/${id}`)
      currentShow.value = show
      return show
    } catch (err) {
      error.value = err as ApiError
      if (toast) {
        toast.error('Failed to load show details. Please try again later.')
      }
      logger.error(
        'Failed to fetch show by ID',
        { module: 'stores/shows', action: 'fetchShowById', showId: id },
        err
      )
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get a show from the store by ID (without API call)
   */
  function getShowById(id: number): Show | null {
    return allShows.value.find((show) => show.id === id) || null
  }

  /**
   * Get related shows by genre
   */
  function getRelatedShows(show: Show, limit: number = 6): Show[] {
    if (!show.genres || show.genres.length === 0) {
      return []
    }

    const relatedShows = new Set<Show>()

    // Get shows from the same genres
    show.genres.forEach((genre) => {
      const genreShows = showsByGenre.value[genre] || []
      genreShows.forEach((s) => {
        if (s.id !== show.id && relatedShows.size < limit * 2) {
          relatedShows.add(s)
        }
      })
    })

    // Convert to array, shuffle, and return limited results
    return Array.from(relatedShows)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
  }

  /**
   * Clear error state
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * Reset store state
   */
  function $reset(): void {
    allShows.value = []
    showsByGenre.value = {}
    currentShow.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    allShows,
    showsByGenre,
    currentShow,
    loading,
    error,

    // Getters
    genres,
    isLoading,
    hasError,
    showsCount,
    getShowsByGenre,
    topRatedShows,

    // Actions
    setShows,
    setShowsWithGenres,
    fetchAllShows,
    fetchShowById,
    getShowById,
    getRelatedShows,
    clearError,
    $reset,
  }
})
