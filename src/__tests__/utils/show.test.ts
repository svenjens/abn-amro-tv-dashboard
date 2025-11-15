import { describe, it, expect } from 'vitest'
import {
  groupShowsByGenre,
  getSortedGenres,
  stripHtml,
  formatRating,
  getShowImage,
  truncateText,
  formatSchedule,
} from '@/utils/show'
import type { Show } from '@/types'

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
    days: ['Monday', 'Tuesday'],
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
  image: {
    medium: 'http://example.com/medium.jpg',
    original: 'http://example.com/original.jpg',
  },
  summary: '<p>Test summary</p>',
  updated: 1234567890,
  _links: {
    self: { href: 'http://example.com/show/1' },
  },
}

describe('Show Utils', () => {
  describe('groupShowsByGenre', () => {
    it('should group shows by genre', () => {
      const shows = [mockShow]
      const grouped = groupShowsByGenre(shows)

      expect(grouped).toHaveProperty('Drama')
      expect(grouped).toHaveProperty('Action')
      expect(grouped.Drama).toContain(mockShow)
      expect(grouped.Action).toContain(mockShow)
    })

    it('should sort shows by rating within each genre', () => {
      const show1 = { ...mockShow, id: 1, rating: { average: 7.5 } }
      const show2 = { ...mockShow, id: 2, rating: { average: 9.0 } }
      const show3 = { ...mockShow, id: 3, rating: { average: 8.0 } }

      const grouped = groupShowsByGenre([show1, show2, show3])

      expect(grouped.Drama).toBeDefined()
      const dramaShows = grouped.Drama
      if (dramaShows) {
        expect(dramaShows[0].rating.average).toBe(9.0)
        expect(dramaShows[1].rating.average).toBe(8.0)
        expect(dramaShows[2].rating.average).toBe(7.5)
      }
    })

    it('should skip shows without genres', () => {
      const showWithoutGenres = { ...mockShow, genres: [] }
      const grouped = groupShowsByGenre([showWithoutGenres])

      expect(Object.keys(grouped)).toHaveLength(0)
    })
  })

  describe('getSortedGenres', () => {
    it('should return sorted list of genres', () => {
      const showsByGenre = {
        Comedy: [],
        Action: [],
        Drama: [],
      }
      const sorted = getSortedGenres(showsByGenre)

      expect(sorted).toEqual(['Action', 'Comedy', 'Drama'])
    })
  })

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
    })

    it('should return empty string for null', () => {
      expect(stripHtml(null)).toBe('')
    })
  })

  describe('formatRating', () => {
    it('should format rating to 1 decimal place', () => {
      expect(formatRating(8.567)).toBe('8.6')
    })

    it('should return N/A for null rating', () => {
      expect(formatRating(null)).toBe('N/A')
    })
  })

  describe('getShowImage', () => {
    it('should return medium image by default', () => {
      expect(getShowImage(mockShow)).toBe('http://example.com/medium.jpg')
    })

    it('should return original image when specified', () => {
      expect(getShowImage(mockShow, 'original')).toBe('http://example.com/original.jpg')
    })

    it('should return null when image is not available', () => {
      const showWithoutImage = { ...mockShow, image: null }
      expect(getShowImage(showWithoutImage)).toBe(null)
    })
  })

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that should be truncated'
      expect(truncateText(text, 20)).toBe('This is a very long...')
    })

    it('should not truncate text shorter than max length', () => {
      const text = 'Short text'
      expect(truncateText(text, 20)).toBe('Short text')
    })
  })

  describe('formatSchedule', () => {
    it('should format schedule with days and time', () => {
      const schedule = { days: ['Monday', 'Tuesday'], time: '20:00' }
      expect(formatSchedule(schedule)).toBe('Monday, Tuesday at 20:00')
    })

    it('should handle schedule without days', () => {
      const schedule = { days: [], time: '20:00' }
      expect(formatSchedule(schedule)).toBe('Schedule not available')
    })

    it('should handle schedule without time', () => {
      const schedule = { days: ['Monday'], time: '' }
      expect(formatSchedule(schedule)).toBe('Monday at Time TBA')
    })
  })
})
