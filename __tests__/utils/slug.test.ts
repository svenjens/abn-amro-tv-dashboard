import { describe, it, expect } from 'vitest'
import { createSlug, createShowSlug, extractIdFromSlug, validateSlug } from '@/utils/slug'

describe('Slug Utilities', () => {
  describe('createSlug', () => {
    it('should convert basic show name to slug', () => {
      expect(createSlug('Breaking Bad')).toBe('breaking-bad')
      expect(createSlug('Game of Thrones')).toBe('game-of-thrones')
    })

    it('should handle special characters', () => {
      expect(createSlug("Marvel's Agents of S.H.I.E.L.D.")).toBe('marvels-agents-of-shield')
      expect(createSlug('The Office (US)')).toBe('the-office-us')
      expect(createSlug('Modern Family!')).toBe('modern-family')
    })

    it('should handle apostrophes', () => {
      expect(createSlug("Grey's Anatomy")).toBe('greys-anatomy')
      expect(createSlug("Bob's Burgers")).toBe('bobs-burgers')
      expect(createSlug("The Handmaid's Tale")).toBe('the-handmaids-tale')
    })

    it('should replace multiple spaces with single hyphen', () => {
      expect(createSlug('How   I   Met   Your   Mother')).toBe('how-i-met-your-mother')
      expect(createSlug('Too  Many  Spaces')).toBe('too-many-spaces')
    })

    it('should replace multiple hyphens with single hyphen', () => {
      expect(createSlug('Show---With---Hyphens')).toBe('show-with-hyphens')
    })

    it('should trim hyphens from start and end', () => {
      expect(createSlug('---Show Name---')).toBe('show-name')
      expect(createSlug('- Show -')).toBe('show')
    })

    it('should handle mixed case', () => {
      expect(createSlug('ThE OfFiCe')).toBe('the-office')
      expect(createSlug('BREAKING BAD')).toBe('breaking-bad')
    })

    it('should handle numbers', () => {
      expect(createSlug('Stranger Things 4')).toBe('stranger-things-4')
      expect(createSlug('13 Reasons Why')).toBe('13-reasons-why')
      expect(createSlug('9-1-1')).toBe('9-1-1')
    })

    it('should handle empty or whitespace-only strings', () => {
      expect(createSlug('')).toBe('')
      expect(createSlug('   ')).toBe('')
      expect(createSlug('---')).toBe('')
    })

    it('should handle unicode and international characters', () => {
      expect(createSlug('Café Society')).toBe('caf-society')
      expect(createSlug('Élite')).toBe('lite')
    })

    it('should handle special brackets and parentheses', () => {
      expect(createSlug('Show [2021]')).toBe('show-2021')
      expect(createSlug('Show {Reboot}')).toBe('show-reboot')
      expect(createSlug('(Prequel) Show')).toBe('prequel-show')
    })

    it('should handle ampersands and plus signs', () => {
      expect(createSlug('Law & Order')).toBe('law-order')
      expect(createSlug('Show + Movie')).toBe('show-movie')
    })

    it('should handle colons and semicolons', () => {
      expect(createSlug('Show: The Series')).toBe('show-the-series')
      expect(createSlug('Show; Part 2')).toBe('show-part-2')
    })
  })

  describe('createShowSlug', () => {
    it('should create slug with ID appended', () => {
      expect(createShowSlug('Breaking Bad', 169)).toBe('breaking-bad-169')
      expect(createShowSlug('Kingdom', 214)).toBe('kingdom-214')
    })

    it('should handle shows with same name but different IDs', () => {
      expect(createShowSlug('Kingdom', 214)).toBe('kingdom-214')
      expect(createShowSlug('Kingdom', 999)).toBe('kingdom-999')
      expect(createShowSlug('Kingdom', 214)).not.toBe(createShowSlug('Kingdom', 999))
    })

    it('should create unique slugs for similar show names', () => {
      expect(createShowSlug('The Office', 123)).toBe('the-office-123')
      expect(createShowSlug('The Office (US)', 456)).toBe('the-office-us-456')
      expect(createShowSlug('The Office (UK)', 789)).toBe('the-office-uk-789')
    })

    it('should handle special characters in show name', () => {
      expect(createShowSlug("Marvel's Agents of S.H.I.E.L.D.", 123)).toBe(
        'marvels-agents-of-shield-123'
      )
    })

    it('should handle single-digit IDs', () => {
      expect(createShowSlug('Show', 1)).toBe('show-1')
      expect(createShowSlug('Show', 9)).toBe('show-9')
    })

    it('should handle large IDs', () => {
      expect(createShowSlug('Show', 999999)).toBe('show-999999')
    })

    it('should handle zero ID', () => {
      expect(createShowSlug('Show', 0)).toBe('show-0')
    })
  })

  describe('extractIdFromSlug', () => {
    it('should extract ID from valid slug', () => {
      expect(extractIdFromSlug('breaking-bad-169')).toBe(169)
      expect(extractIdFromSlug('kingdom-214')).toBe(214)
      expect(extractIdFromSlug('game-of-thrones-82')).toBe(82)
    })

    it('should extract single-digit IDs', () => {
      expect(extractIdFromSlug('show-1')).toBe(1)
      expect(extractIdFromSlug('show-9')).toBe(9)
    })

    it('should extract large IDs', () => {
      expect(extractIdFromSlug('show-999999')).toBe(999999)
    })

    it('should handle slug without ID', () => {
      expect(extractIdFromSlug('just-a-slug')).toBeNull()
      expect(extractIdFromSlug('no-number-here')).toBeNull()
    })

    it('should handle empty or invalid slugs', () => {
      expect(extractIdFromSlug('')).toBeNull()
      expect(extractIdFromSlug('---')).toBeNull()
    })

    it('should handle slug with non-numeric last part', () => {
      expect(extractIdFromSlug('show-name-abc')).toBeNull()
      // parseInt('12abc') returns 12, so this is valid behavior
      expect(extractIdFromSlug('show-name-12abc')).toBe(12)
    })

    it('should extract only the last number', () => {
      expect(extractIdFromSlug('9-1-1-show-456')).toBe(456)
      expect(extractIdFromSlug('show-2022-version-999')).toBe(999)
    })

    it('should handle zero ID', () => {
      expect(extractIdFromSlug('show-0')).toBe(0)
    })

    it('should handle double hyphens', () => {
      // Double hyphen means the last part is '-123', and '-' is not a digit
      // so it extracts '123' from the last part
      expect(extractIdFromSlug('show--123')).toBe(123)
    })
  })

  describe('validateSlug', () => {
    it('should validate matching slugs', () => {
      expect(validateSlug('breaking-bad-169', 'Breaking Bad', 169)).toBe(true)
      expect(validateSlug('game-of-thrones-82', 'Game of Thrones', 82)).toBe(true)
    })

    it('should reject mismatched show name', () => {
      expect(validateSlug('breaking-bad-169', 'Game of Thrones', 169)).toBe(false)
      expect(validateSlug('wrong-show-123', 'Breaking Bad', 123)).toBe(false)
    })

    it('should reject mismatched ID', () => {
      expect(validateSlug('breaking-bad-169', 'Breaking Bad', 999)).toBe(false)
      expect(validateSlug('show-123', 'Show', 456)).toBe(false)
    })

    it('should validate with special characters', () => {
      expect(
        validateSlug('marvels-agents-of-shield-123', "Marvel's Agents of S.H.I.E.L.D.", 123)
      ).toBe(true)
      expect(validateSlug('the-office-us-456', 'The Office (US)', 456)).toBe(true)
    })

    it('should be case-insensitive for show name', () => {
      expect(validateSlug('breaking-bad-169', 'BREAKING BAD', 169)).toBe(true)
      expect(validateSlug('breaking-bad-169', 'breaking bad', 169)).toBe(true)
    })

    it('should reject completely invalid slug format', () => {
      expect(validateSlug('invalid', 'Breaking Bad', 169)).toBe(false)
      expect(validateSlug('', 'Breaking Bad', 169)).toBe(false)
    })

    it('should validate old-style URL redirects', () => {
      // If someone has an old URL with just the ID or different format
      const slug = 'old-url-format-123'
      const correctSlug = createShowSlug('Old URL Format', 123)

      expect(validateSlug(slug, 'Old URL Format', 123)).toBe(slug === correctSlug)
    })

    it('should handle shows with numbers in name', () => {
      expect(validateSlug('9-1-1-lone-star-456', '9-1-1: Lone Star', 456)).toBe(true)
      expect(validateSlug('stranger-things-4-789', 'Stranger Things 4', 789)).toBe(true)
    })
  })

  describe('Edge Cases & Integration', () => {
    it('should handle roundtrip: name -> slug -> extract ID', () => {
      const name = 'Breaking Bad'
      const id = 169

      const slug = createShowSlug(name, id)
      const extractedId = extractIdFromSlug(slug)

      expect(extractedId).toBe(id)
      expect(validateSlug(slug, name, id)).toBe(true)
    })

    it('should handle roundtrip with complex names', () => {
      const testCases = [
        { name: "Marvel's Agents of S.H.I.E.L.D.", id: 31 },
        { name: 'The Office (US)', id: 526 },
        { name: 'How I Met Your Mother', id: 75 },
        { name: '13 Reasons Why', id: 1837 },
      ]

      testCases.forEach(({ name, id }) => {
        const slug = createShowSlug(name, id)
        const extractedId = extractIdFromSlug(slug)

        expect(extractedId).toBe(id)
        expect(validateSlug(slug, name, id)).toBe(true)
      })
    })

    it('should maintain uniqueness for shows with similar names', () => {
      const shows = [
        { name: 'Kingdom', id: 214 },
        { name: 'Kingdom', id: 999 },
        { name: 'The Kingdom', id: 888 },
      ]

      const slugs = shows.map(({ name, id }) => createShowSlug(name, id))

      // All slugs should be unique
      expect(new Set(slugs).size).toBe(slugs.length)

      // Each slug should validate correctly
      shows.forEach(({ name, id }, index) => {
        expect(validateSlug(slugs[index]!, name, id)).toBe(true)
        expect(extractIdFromSlug(slugs[index]!)).toBe(id)
      })
    })

    it('should handle extremely long show names', () => {
      const longName = 'This Is An Extremely Long Show Name That Goes On And On And On And On'
      const id = 12345

      const slug = createShowSlug(longName, id)
      expect(extractIdFromSlug(slug)).toBe(id)
      expect(validateSlug(slug, longName, id)).toBe(true)
    })

    it('should be URL-safe', () => {
      const name = "Test Show: Special Edition (2023) - Director's Cut!"
      const slug = createSlug(name)

      // Should not contain any characters that need URL encoding
      expect(slug).toMatch(/^[a-z0-9-]*$/)
    })
  })
})
