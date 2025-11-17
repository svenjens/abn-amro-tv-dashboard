import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlist'
import type { Show, WatchedEpisode } from '@/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

// Mock logger
vi.mock('@/utils', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useWatchlistStore', () => {
  let store: ReturnType<typeof useWatchlistStore>

  const mockShow: Show = {
    id: 1,
    name: 'Breaking Bad',
    url: 'http://www.tvmaze.com/shows/1/breaking-bad',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Crime'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2008-01-20',
    ended: '2013-09-29',
    officialSite: 'http://www.amc.com/shows/breaking-bad',
    schedule: { time: '21:00', days: ['Sunday'] },
    rating: { average: 9.5 },
    weight: 99,
    network: {
      id: 20,
      name: 'AMC',
      country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
      officialSite: null,
    },
    webChannel: null,
    dvdCountry: null,
    externals: { tvrage: 18164, thetvdb: 81189, imdb: 'tt0903747' },
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg',
    },
    summary: '<p>Breaking Bad follows...</p>',
    updated: 1704067200,
    _links: { self: { href: 'https://api.tvmaze.com/shows/1' } },
  }

  const mockShow2: Show = {
    ...mockShow,
    id: 2,
    name: 'Game of Thrones',
  }

  beforeEach(() => {
    // Setup pinia
    setActivePinia(createPinia())

    // Setup localStorage mock
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })

    // Clear localStorage
    localStorageMock.clear()
    vi.clearAllMocks()

    // Create store instance
    store = useWatchlistStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Watchlist Management', () => {
    it('should initialize with empty watchlist', () => {
      expect(store.watchlist).toEqual([])
      expect(store.watchlistCount).toBe(0)
      expect(store.hasShows).toBe(false)
    })

    it('should add a show to watchlist', () => {
      store.addToWatchlist(mockShow)

      expect(store.watchlist).toHaveLength(1)
      expect(store.watchlist[0]).toEqual(mockShow)
      expect(store.watchlistCount).toBe(1)
      expect(store.hasShows).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tv-dashboard-watchlist',
        JSON.stringify([mockShow])
      )
    })

    it('should not add duplicate shows', () => {
      store.addToWatchlist(mockShow)
      store.addToWatchlist(mockShow)

      expect(store.watchlist).toHaveLength(1)
    })

    it('should check if show is in watchlist', () => {
      expect(store.isInWatchlist(mockShow.id)).toBe(false)

      store.addToWatchlist(mockShow)

      expect(store.isInWatchlist(mockShow.id)).toBe(true)
      expect(store.isInWatchlist(999)).toBe(false)
    })

    it('should remove a show from watchlist', () => {
      store.addToWatchlist(mockShow)
      store.addToWatchlist(mockShow2)

      expect(store.watchlist).toHaveLength(2)

      store.removeFromWatchlist(mockShow.id)

      expect(store.watchlist).toHaveLength(1)
      expect(store.watchlist[0]?.id).toBe(mockShow2.id)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should handle removing non-existent show', () => {
      store.addToWatchlist(mockShow)
      const initialLength = store.watchlist.length

      store.removeFromWatchlist(999)

      expect(store.watchlist).toHaveLength(initialLength)
    })

    it('should toggle show in watchlist', () => {
      expect(store.isInWatchlist(mockShow.id)).toBe(false)

      store.toggleWatchlist(mockShow)
      expect(store.isInWatchlist(mockShow.id)).toBe(true)

      store.toggleWatchlist(mockShow)
      expect(store.isInWatchlist(mockShow.id)).toBe(false)
    })

    it('should clear entire watchlist', () => {
      store.addToWatchlist(mockShow)
      store.addToWatchlist(mockShow2)

      expect(store.watchlist).toHaveLength(2)

      store.clearWatchlist()

      expect(store.watchlist).toHaveLength(0)
      expect(store.watchlistCount).toBe(0)
      expect(store.hasShows).toBe(false)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tv-dashboard-watchlist',
        JSON.stringify([])
      )
    })
  })

  describe('Episode Tracking', () => {
    const showId = 1
    const episodeId = 101
    const season = 1
    const episode = 1

    it('should initialize with no watched episodes', () => {
      expect(store.watchedEpisodes).toEqual([])
      expect(store.totalWatchedEpisodes).toBe(0)
    })

    it('should mark episode as watched', () => {
      store.markEpisodeAsWatched(showId, episodeId, season, episode)

      expect(store.watchedEpisodes).toHaveLength(1)
      expect(store.isEpisodeWatched(showId, episodeId)).toBe(true)
      expect(store.totalWatchedEpisodes).toBe(1)

      const watchedEpisode = store.watchedEpisodes[0]
      expect(watchedEpisode?.showId).toBe(showId)
      expect(watchedEpisode?.episodeId).toBe(episodeId)
      expect(watchedEpisode?.season).toBe(season)
      expect(watchedEpisode?.episode).toBe(episode)
      expect(watchedEpisode?.watchedAt).toBeDefined()

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tv-dashboard-watched-episodes',
        expect.any(String)
      )
    })

    it('should not mark same episode twice', () => {
      store.markEpisodeAsWatched(showId, episodeId, season, episode)
      store.markEpisodeAsWatched(showId, episodeId, season, episode)

      expect(store.watchedEpisodes).toHaveLength(1)
    })

    it('should check if episode is watched', () => {
      expect(store.isEpisodeWatched(showId, episodeId)).toBe(false)

      store.markEpisodeAsWatched(showId, episodeId, season, episode)

      expect(store.isEpisodeWatched(showId, episodeId)).toBe(true)
      expect(store.isEpisodeWatched(showId, 999)).toBe(false)
      expect(store.isEpisodeWatched(999, episodeId)).toBe(false)
    })

    it('should unmark episode as watched', () => {
      store.markEpisodeAsWatched(showId, episodeId, season, episode)
      expect(store.isEpisodeWatched(showId, episodeId)).toBe(true)

      store.unmarkEpisodeAsWatched(showId, episodeId)

      expect(store.isEpisodeWatched(showId, episodeId)).toBe(false)
      expect(store.watchedEpisodes).toHaveLength(0)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should handle unmarking non-existent episode', () => {
      store.markEpisodeAsWatched(showId, episodeId, season, episode)
      const initialLength = store.watchedEpisodes.length

      store.unmarkEpisodeAsWatched(999, 999)

      expect(store.watchedEpisodes).toHaveLength(initialLength)
    })

    it('should toggle episode watched status', () => {
      expect(store.isEpisodeWatched(showId, episodeId)).toBe(false)

      store.toggleEpisodeWatched(showId, episodeId, season, episode)
      expect(store.isEpisodeWatched(showId, episodeId)).toBe(true)

      store.toggleEpisodeWatched(showId, episodeId, season, episode)
      expect(store.isEpisodeWatched(showId, episodeId)).toBe(false)
    })

    it('should get watched episodes for specific show', () => {
      store.markEpisodeAsWatched(1, 101, 1, 1)
      store.markEpisodeAsWatched(1, 102, 1, 2)
      store.markEpisodeAsWatched(2, 201, 1, 1)

      const show1Episodes = store.getWatchedEpisodesForShow(1)
      const show2Episodes = store.getWatchedEpisodesForShow(2)

      expect(show1Episodes).toHaveLength(2)
      expect(show2Episodes).toHaveLength(1)
      expect(show1Episodes[0]?.episodeId).toBe(101)
      expect(show1Episodes[1]?.episodeId).toBe(102)
      expect(show2Episodes[0]?.episodeId).toBe(201)
    })

    it('should get watched episodes count for show', () => {
      store.markEpisodeAsWatched(1, 101, 1, 1)
      store.markEpisodeAsWatched(1, 102, 1, 2)
      store.markEpisodeAsWatched(2, 201, 1, 1)

      expect(store.getWatchedEpisodesCount(1)).toBe(2)
      expect(store.getWatchedEpisodesCount(2)).toBe(1)
      expect(store.getWatchedEpisodesCount(999)).toBe(0)
    })

    it('should return empty array for show with no watched episodes', () => {
      const episodes = store.getWatchedEpisodesForShow(999)
      expect(episodes).toEqual([])
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should load watchlist from localStorage on init', () => {
      const storedShows = [mockShow, mockShow2]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedShows))

      // Create new pinia instance and store
      setActivePinia(createPinia())
      const newStore = useWatchlistStore()

      expect(newStore.watchlist).toEqual(storedShows)
      expect(newStore.watchlistCount).toBe(2)
    })

    it('should load watched episodes from localStorage on init', () => {
      const storedEpisodes: WatchedEpisode[] = [
        { showId: 1, episodeId: 101, season: 1, episode: 1, watchedAt: Date.now() },
        { showId: 1, episodeId: 102, season: 1, episode: 2, watchedAt: Date.now() },
      ]

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'tv-dashboard-watchlist') return null
        if (key === 'tv-dashboard-watched-episodes') return JSON.stringify(storedEpisodes)
        return null
      })

      // Create new pinia instance and store
      setActivePinia(createPinia())
      const newStore = useWatchlistStore()

      expect(newStore.watchedEpisodes).toEqual(storedEpisodes)
      expect(newStore.totalWatchedEpisodes).toBe(2)
    })

    it('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      // Create new pinia instance and store
      setActivePinia(createPinia())

      // Should not throw, just log error
      const newStore = useWatchlistStore()

      expect(newStore.watchlist).toEqual([])
    })

    it('should handle missing localStorage gracefully', () => {
      // Remove localStorage
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true,
      })

      const newStore = useWatchlistStore()

      // Should not throw
      newStore.addToWatchlist(mockShow)
      expect(newStore.watchlist).toHaveLength(1)
    })

    it('should save to localStorage on add', () => {
      store.addToWatchlist(mockShow)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tv-dashboard-watchlist',
        JSON.stringify([mockShow])
      )
    })

    it('should save to localStorage on remove', () => {
      store.addToWatchlist(mockShow)
      vi.clearAllMocks()

      store.removeFromWatchlist(mockShow.id)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tv-dashboard-watchlist',
        JSON.stringify([])
      )
    })

    it('should save episodes to localStorage', () => {
      store.markEpisodeAsWatched(1, 101, 1, 1)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tv-dashboard-watched-episodes',
        expect.any(String)
      )
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full')
      })

      // Should not throw
      expect(() => store.addToWatchlist(mockShow)).not.toThrow()
      expect(store.watchlist).toHaveLength(1)
    })
  })

  describe('Computed Properties', () => {
    it('should track watchlist count reactively', () => {
      expect(store.watchlistCount).toBe(0)

      store.addToWatchlist(mockShow)
      expect(store.watchlistCount).toBe(1)

      store.addToWatchlist(mockShow2)
      expect(store.watchlistCount).toBe(2)

      store.removeFromWatchlist(mockShow.id)
      expect(store.watchlistCount).toBe(1)
    })

    it('should track hasShows reactively', () => {
      expect(store.hasShows).toBe(false)

      store.addToWatchlist(mockShow)
      expect(store.hasShows).toBe(true)

      store.clearWatchlist()
      expect(store.hasShows).toBe(false)
    })

    it('should track total watched episodes reactively', () => {
      expect(store.totalWatchedEpisodes).toBe(0)

      store.markEpisodeAsWatched(1, 101, 1, 1)
      expect(store.totalWatchedEpisodes).toBe(1)

      store.markEpisodeAsWatched(1, 102, 1, 2)
      expect(store.totalWatchedEpisodes).toBe(2)

      store.unmarkEpisodeAsWatched(1, 101)
      expect(store.totalWatchedEpisodes).toBe(1)
    })
  })
})
