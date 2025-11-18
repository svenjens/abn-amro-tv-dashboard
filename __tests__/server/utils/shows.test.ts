import { describe, it, expect } from 'vitest'
import { groupShowsByGenre } from '~/server/utils/shows'
import type { Show } from '~/types'

describe('server/utils/shows', () => {
  describe('groupShowsByGenre', () => {
    const mockShow1: Show = {
      id: 1,
      name: 'Show 1',
      url: 'https://tvmaze.com/1',
      type: 'Scripted',
      language: 'English',
      genres: ['Drama', 'Thriller'],
      status: 'Running',
      runtime: 60,
      premiered: '2020-01-01',
      officialSite: null,
      schedule: { time: '20:00', days: ['Monday'] },
      rating: { average: 8.5 },
      weight: 98,
      network: {
        id: 1,
        name: 'HBO',
        country: { name: 'US', code: 'US', timezone: 'America/New_York' },
      },
      webChannel: null,
      image: {
        medium: 'https://example.com/medium.jpg',
        original: 'https://example.com/original.jpg',
      },
      summary: 'A great show',
      updated: 1234567890,
      _links: { self: { href: 'https://api.tvmaze.com/shows/1' } },
    }

    const mockShow2: Show = {
      ...mockShow1,
      id: 2,
      name: 'Show 2',
      genres: ['Comedy', 'Drama'],
      rating: { average: 7.2 },
    }

    const mockShow3: Show = {
      ...mockShow1,
      id: 3,
      name: 'Show 3',
      genres: ['Drama'],
      rating: { average: 9.0 },
    }

    const mockShow4: Show = {
      ...mockShow1,
      id: 4,
      name: 'Show 4',
      genres: ['Comedy'],
      rating: { average: 6.5 },
    }

    it('should group shows by genre', () => {
      const shows = [mockShow1, mockShow2]
      const grouped = groupShowsByGenre(shows)

      expect(grouped).toHaveProperty('Drama')
      expect(grouped).toHaveProperty('Thriller')
      expect(grouped).toHaveProperty('Comedy')
      expect(grouped.Drama).toHaveLength(2)
      expect(grouped.Thriller).toHaveLength(1)
      expect(grouped.Comedy).toHaveLength(1)
    })

    it('should sort shows within genre by rating (highest first)', () => {
      const shows = [mockShow1, mockShow2, mockShow3]
      const grouped = groupShowsByGenre(shows)

      // Drama should have all three shows, sorted by rating
      expect(grouped.Drama).toHaveLength(3)
      expect(grouped.Drama[0].rating.average).toBe(9.0) // mockShow3
      expect(grouped.Drama[1].rating.average).toBe(8.5) // mockShow1
      expect(grouped.Drama[2].rating.average).toBe(7.2) // mockShow2
    })

    it('should handle shows without genres', () => {
      const showWithoutGenres: Show = {
        ...mockShow1,
        id: 5,
        genres: [],
      }

      const shows = [mockShow1, showWithoutGenres]
      const grouped = groupShowsByGenre(shows)

      // Should only include mockShow1's genres
      expect(grouped.Drama).toHaveLength(1)
      expect(grouped.Drama[0].id).toBe(1)
    })

    it('should handle shows with null/undefined genres gracefully', () => {
      const showWithNullGenres: Show = {
        ...mockShow1,
        id: 6,
        genres: null as any,
      }

      const shows = [mockShow1, showWithNullGenres]
      const grouped = groupShowsByGenre(shows)

      // Should only include mockShow1's genres
      expect(grouped.Drama).toHaveLength(1)
      expect(grouped.Drama[0].id).toBe(1)
    })

    it('should handle empty shows array', () => {
      const grouped = groupShowsByGenre([])
      expect(grouped).toEqual({})
    })

    it('should handle shows with null rating', () => {
      const showWithNullRating: Show = {
        ...mockShow1,
        id: 7,
        rating: { average: null },
      }

      const shows = [mockShow1, showWithNullRating, mockShow3]
      const grouped = groupShowsByGenre(shows)

      // Shows with null rating should be sorted as 0
      expect(grouped.Drama).toHaveLength(3)
      expect(grouped.Drama[0].rating.average).toBe(9.0)
      expect(grouped.Drama[1].rating.average).toBe(8.5)
      expect(grouped.Drama[2].rating.average).toBe(null)
    })

    it('should handle shows with multiple genres correctly', () => {
      const multiGenreShow: Show = {
        ...mockShow1,
        id: 8,
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        rating: { average: 8.0 },
      }

      const grouped = groupShowsByGenre([multiGenreShow])

      expect(grouped).toHaveProperty('Action')
      expect(grouped).toHaveProperty('Adventure')
      expect(grouped).toHaveProperty('Sci-Fi')
      expect(grouped.Action[0].id).toBe(8)
      expect(grouped.Adventure[0].id).toBe(8)
      expect(grouped['Sci-Fi'][0].id).toBe(8)
    })

    it('should place the same show in multiple genre arrays', () => {
      const shows = [mockShow1] // Has both Drama and Thriller
      const grouped = groupShowsByGenre(shows)

      expect(grouped.Drama[0].id).toBe(1)
      expect(grouped.Thriller[0].id).toBe(1)
      // Should be the same show object
      expect(grouped.Drama[0]).toBe(grouped.Thriller[0])
    })

    it('should maintain correct sort order across different genres', () => {
      const shows = [mockShow1, mockShow2, mockShow3, mockShow4]
      const grouped = groupShowsByGenre(shows)

      // Comedy: mockShow2 (7.2) and mockShow4 (6.5)
      expect(grouped.Comedy[0].rating.average).toBe(7.2)
      expect(grouped.Comedy[1].rating.average).toBe(6.5)

      // Drama: mockShow3 (9.0), mockShow1 (8.5), mockShow2 (7.2)
      expect(grouped.Drama[0].rating.average).toBe(9.0)
      expect(grouped.Drama[1].rating.average).toBe(8.5)
      expect(grouped.Drama[2].rating.average).toBe(7.2)
    })

    it('should handle shows with same rating', () => {
      const show5: Show = {
        ...mockShow1,
        id: 5,
        name: 'Show 5',
        genres: ['Drama'],
        rating: { average: 8.5 }, // Same as mockShow1
      }

      const shows = [mockShow1, show5]
      const grouped = groupShowsByGenre(shows)

      expect(grouped.Drama).toHaveLength(2)
      // Both should have rating 8.5, order may vary but both should be present
      expect(grouped.Drama.every((s) => s.rating.average === 8.5)).toBe(true)
    })

    it('should create new genre entry if not exists', () => {
      const shows = [mockShow1]
      const grouped = groupShowsByGenre(shows)

      expect(grouped).toHaveProperty('Drama')
      expect(grouped).toHaveProperty('Thriller')
      expect(Array.isArray(grouped.Drama)).toBe(true)
      expect(Array.isArray(grouped.Thriller)).toBe(true)
    })

    it('should not mutate original shows array', () => {
      const shows = [mockShow1, mockShow2, mockShow3]
      const originalOrder = [...shows]

      groupShowsByGenre(shows)

      expect(shows).toEqual(originalOrder)
    })

    it('should handle genre names with special characters', () => {
      const showWithSpecialGenre: Show = {
        ...mockShow1,
        id: 9,
        genres: ['Science-Fiction', 'Horror/Thriller'],
        rating: { average: 7.5 },
      }

      const grouped = groupShowsByGenre([showWithSpecialGenre])

      expect(grouped).toHaveProperty('Science-Fiction')
      expect(grouped).toHaveProperty('Horror/Thriller')
      expect(grouped['Science-Fiction'][0].id).toBe(9)
      expect(grouped['Horror/Thriller'][0].id).toBe(9)
    })
  })
})
