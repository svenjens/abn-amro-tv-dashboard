import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '@/stores/search'
import { tvMazeAPI } from '@/api'
import type { SearchResult } from '@/types'

// Mock the API
vi.mock('@/api', () => ({
  tvMazeAPI: {
    searchShows: vi.fn(),
  },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const mockSearchResult: SearchResult = {
  score: 0.9,
  show: {
    id: 1,
    url: 'http://example.com',
    name: 'Test Show',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama'],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2020-01-01',
    ended: null,
    officialSite: null,
    schedule: {
      time: '20:00',
      days: ['Monday'],
    },
    rating: {
      average: 8.5,
    },
    weight: 100,
    network: null,
    webChannel: null,
    dvdCountry: null,
    externals: {
      tvrage: null,
      thetvdb: null,
      imdb: null,
    },
    image: null,
    summary: 'Test summary',
    updated: 1234567890,
    _links: {
      self: { href: 'http://example.com/show/1' },
    },
  },
}

describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  describe('search', () => {
    it('should search for shows', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      await store.search('test')

      expect(store.searchResults).toEqual([mockSearchResult])
      expect(store.searchQuery).toBe('test')
      expect(store.loading).toBe(false)
    })

    it('should clear results for empty query', async () => {
      const store = useSearchStore()
      await store.search('')

      expect(store.searchResults).toEqual([])
      expect(tvMazeAPI.searchShows).not.toHaveBeenCalled()
    })

    it('should handle API errors', async () => {
      const error = { message: 'Search failed' }
      vi.mocked(tvMazeAPI.searchShows).mockRejectedValue(error)

      const store = useSearchStore()
      await store.search('test')

      expect(store.error).toEqual(error)
      expect(store.loading).toBe(false)
    })

    it('should save search to recent searches', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      await store.search('test')

      expect(store.recentSearches).toContain('test')
    })

    it('should not duplicate recent searches', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      await store.search('test')
      await store.search('test')

      expect(store.recentSearches.filter((s) => s === 'test')).toHaveLength(1)
    })

    it('should limit recent searches to 5', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      await store.search('test1')
      await store.search('test2')
      await store.search('test3')
      await store.search('test4')
      await store.search('test5')
      await store.search('test6')

      expect(store.recentSearches).toHaveLength(5)
      expect(store.recentSearches[0]).toBe('test6')
    })
  })

  describe('clearSearch', () => {
    it('should clear search results and query', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      await store.search('test')
      store.clearSearch()

      expect(store.searchQuery).toBe('')
      expect(store.searchResults).toEqual([])
    })
  })

  describe('clearRecentSearches', () => {
    it('should clear recent searches', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      await store.search('test')
      store.clearRecentSearches()

      expect(store.recentSearches).toEqual([])
    })
  })

  describe('getters', () => {
    it('should return results as show array', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      await store.search('test')

      expect(store.results).toEqual([mockSearchResult.show])
    })

    it('should indicate if has results', async () => {
      vi.mocked(tvMazeAPI.searchShows).mockResolvedValue([mockSearchResult])

      const store = useSearchStore()
      expect(store.hasResults).toBe(false)

      await store.search('test')
      expect(store.hasResults).toBe(true)
    })
  })
})
