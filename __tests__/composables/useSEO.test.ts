import { describe, it, expect } from 'vitest'
import { getShowSEO } from '@/composables/useSEO'
import type { Show } from '@/types'

// Note: useSEO now uses Nuxt's useHead and useSeoMeta composables
// These are better tested via E2E/integration tests rather than unit tests
// as they rely on Nuxt's rendering context

describe('getShowSEO', () => {
  const mockShow: Show = {
    id: 123,
    name: 'Breaking Bad',
    url: 'https://www.tvmaze.com/shows/123/breaking-bad',
    summary: '<p>A high school chemistry teacher turned methamphetamine manufacturer.</p>',
    genres: ['Drama', 'Crime'],
    status: 'Ended',
    premiered: '2008-01-20',
    ended: '2013-09-29',
    rating: { average: 9.5 },
    runtime: 45,
    network: {
      id: 1,
      name: 'AMC',
      country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
      officialSite: 'https://www.amc.com',
    },
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg',
    },
    officialSite: 'https://www.amc.com/shows/breaking-bad',
    schedule: { time: '21:00', days: ['Sunday'] },
    type: 'Scripted',
    language: 'English',
    averageRuntime: 47,
    weight: 99,
    externals: { tvrage: 18164, thetvdb: 81189, imdb: 'tt0903747' },
    updated: 1704067200,
    dvdCountry: null,
    webChannel: null,
    _links: {
      self: { href: 'https://api.tvmaze.com/shows/123' },
    },
  }

  it('should generate SEO config from show data', () => {
    const seo = getShowSEO(mockShow)

    expect(seo.title).toBe('Breaking Bad - TV Show Dashboard')
    expect(seo.description).toContain('A high school chemistry teacher')
    expect(seo.description).not.toContain('<p>')
    expect(seo.description).not.toContain('</p>')
    expect(seo.keywords).toContain('Breaking Bad')
    expect(seo.keywords).toContain('Drama')
    expect(seo.keywords).toContain('Crime')
    expect(seo.image).toBe(mockShow.image?.original)
  })

  it('should handle show without summary', () => {
    const showWithoutSummary = { ...mockShow, summary: null }

    const seo = getShowSEO(showWithoutSummary)

    expect(seo.description).toContain('Breaking Bad')
    expect(seo.description).toContain('TV Show Dashboard')
  })

  it('should use fallback description when provided', () => {
    const showWithoutSummary = { ...mockShow, summary: null }
    const fallback = 'Custom fallback description'

    const seo = getShowSEO(showWithoutSummary, fallback)

    expect(seo.description).toBe(fallback)
  })

  it('should strip HTML from summary', () => {
    const showWithHTMLSummary = {
      ...mockShow,
      summary: '<p>Test <strong>show</strong> with <em>HTML</em> tags.</p>',
    }

    const seo = getShowSEO(showWithHTMLSummary)

    expect(seo.description).not.toContain('<p>')
    expect(seo.description).not.toContain('<strong>')
    expect(seo.description).not.toContain('<em>')
    expect(seo.description).toContain('Test show with HTML tags')
  })

  it('should truncate long summaries', () => {
    const longSummary = '<p>' + 'A'.repeat(300) + '</p>'
    const showWithLongSummary = { ...mockShow, summary: longSummary }

    const seo = getShowSEO(showWithLongSummary)

    expect(seo.description).toBeDefined()
    expect(seo.description!.length).toBeLessThanOrEqual(163) // 160 + '...'
    expect(seo.description).toMatch(/\.\.\.$/)
  })

  it('should handle show without image', () => {
    const showWithoutImage = { ...mockShow, image: null }

    const seo = getShowSEO(showWithoutImage)

    expect(seo.image).toBeUndefined()
  })

  it('should include show name in keywords', () => {
    const seo = getShowSEO(mockShow)

    expect(seo.keywords).toContain('Breaking Bad')
    expect(seo.keywords).toContain('tv show')
    expect(seo.keywords).toContain('series')
  })

  it('should include genres in keywords', () => {
    const seo = getShowSEO(mockShow)

    expect(seo.keywords).toContain('Drama')
    expect(seo.keywords).toContain('Crime')
  })
})
