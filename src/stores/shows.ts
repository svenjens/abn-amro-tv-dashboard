/**
 * Pinia store for managing TV shows state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tvMazeAPI } from '@/api'
import { groupShowsByGenre, getSortedGenres } from '@/utils'
import type { Show, ShowsByGenre, ApiError } from '@/types'

export const useShowsStore = defineStore('shows', () => {
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
   * Get shows for a specific genre
   */
  const getShowsByGenre = computed(() => {
    return (genre: string): Show[] => {
      return showsByGenre.value[genre] || []
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
   * Fetch all shows from the API and group them by genre
   */
  async function fetchAllShows(): Promise<void> {
    // Don't fetch if we already have data
    if (allShows.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const shows = await tvMazeAPI.fetchAllShows()
      allShows.value = shows
      showsByGenre.value = groupShowsByGenre(shows)
      console.log(`[Store] Loaded ${shows.length} shows across ${genres.value.length} genres`)
    } catch (err) {
      error.value = err as ApiError
      console.error('[Store] Failed to fetch shows:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single show by ID
   */
  async function fetchShowById(id: number, embed?: string[]): Promise<Show | null> {
    loading.value = true
    error.value = null

    try {
      const show = await tvMazeAPI.fetchShowById(id, embed)
      currentShow.value = show
      return show
    } catch (err) {
      error.value = err as ApiError
      console.error(`[Store] Failed to fetch show ${id}:`, err)
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
    fetchAllShows,
    fetchShowById,
    getShowById,
    getRelatedShows,
    clearError,
    $reset,
  }
})
