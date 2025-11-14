import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShowsStore } from '@/stores/shows'
import { tvMazeAPI } from '@/api'
import type { Show } from '@/types'

// Mock the API
vi.mock('@/api', () => ({
  tvMazeAPI: {
    fetchAllShows: vi.fn(),
    fetchShowById: vi.fn(),
  },
}))

const mockShow: Show = {
  id: 1,
  url: 'http://example.com',
  name: 'Test Show',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Action'],
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
}

describe('Shows Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchAllShows', () => {
    it('should fetch and store shows', async () => {
      const mockShows = [mockShow]
      vi.mocked(tvMazeAPI.fetchAllShows).mockResolvedValue(mockShows)

      const store = useShowsStore()
      await store.fetchAllShows()

      expect(store.allShows).toEqual(mockShows)
      expect(store.showsByGenre).toHaveProperty('Drama')
      expect(store.showsByGenre).toHaveProperty('Action')
      expect(store.loading).toBe(false)
    })

    it('should handle API errors', async () => {
      const error = { message: 'API Error' }
      vi.mocked(tvMazeAPI.fetchAllShows).mockRejectedValue(error)

      const store = useShowsStore()
      await store.fetchAllShows()

      expect(store.error).toEqual(error)
      expect(store.loading).toBe(false)
    })

    it('should not fetch if already loaded', async () => {
      const store = useShowsStore()
      store.allShows = [mockShow]

      await store.fetchAllShows()

      expect(tvMazeAPI.fetchAllShows).not.toHaveBeenCalled()
    })
  })

  describe('fetchShowById', () => {
    it('should fetch show by ID', async () => {
      vi.mocked(tvMazeAPI.fetchShowById).mockResolvedValue(mockShow)

      const store = useShowsStore()
      const show = await store.fetchShowById(1)

      expect(show).toEqual(mockShow)
      expect(store.currentShow).toEqual(mockShow)
    })

    it('should handle API errors', async () => {
      const error = { message: 'Show not found' }
      vi.mocked(tvMazeAPI.fetchShowById).mockRejectedValue(error)

      const store = useShowsStore()
      const show = await store.fetchShowById(999)

      expect(show).toBeNull()
      expect(store.error).toEqual(error)
    })
  })

  describe('getShowById', () => {
    it('should return show from store', () => {
      const store = useShowsStore()
      store.allShows = [mockShow]

      const show = store.getShowById(1)

      expect(show).toEqual(mockShow)
    })

    it('should return null if show not found', () => {
      const store = useShowsStore()
      const show = store.getShowById(999)

      expect(show).toBeNull()
    })
  })

  describe('getRelatedShows', () => {
    it('should return related shows from same genres', () => {
      const show1 = { ...mockShow, id: 1 }
      const show2 = { ...mockShow, id: 2 }
      const show3 = { ...mockShow, id: 3 }

      const store = useShowsStore()
      store.allShows = [show1, show2, show3]
      store.showsByGenre = {
        Drama: [show1, show2, show3],
        Action: [show1, show2, show3],
      }

      const related = store.getRelatedShows(show1, 2)

      expect(related.length).toBeLessThanOrEqual(2)
      expect(related).not.toContain(show1)
    })

    it('should return empty array for show without genres', () => {
      const showWithoutGenres = { ...mockShow, genres: [] }
      const store = useShowsStore()

      const related = store.getRelatedShows(showWithoutGenres)

      expect(related).toEqual([])
    })
  })

  describe('getters', () => {
    it('should return sorted genres', () => {
      const store = useShowsStore()
      store.showsByGenre = {
        Comedy: [],
        Action: [],
        Drama: [],
      }

      expect(store.genres).toEqual(['Action', 'Comedy', 'Drama'])
    })

    it('should return top rated shows', () => {
      const show1 = { ...mockShow, id: 1, rating: { average: 7.5 } }
      const show2 = { ...mockShow, id: 2, rating: { average: 9.0 } }
      const show3 = { ...mockShow, id: 3, rating: { average: 8.0 } }

      const store = useShowsStore()
      store.allShows = [show1, show2, show3]

      const topRated = store.topRatedShows

      expect(topRated[0]?.rating.average).toBe(9.0)
      expect(topRated[1]?.rating.average).toBe(8.0)
      expect(topRated[2]?.rating.average).toBe(7.5)
    })
  })
})
