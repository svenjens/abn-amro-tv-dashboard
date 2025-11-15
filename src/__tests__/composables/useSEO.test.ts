import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useSEO, getShowSEO } from '@/composables/useSEO'
import type { Show } from '@/types'

describe('useSEO', () => {
  beforeEach(() => {
    // Clean up existing meta tags
    document.head.innerHTML = '<title>Original Title</title>'
  })

  afterEach(() => {
    document.head.innerHTML = ''
  })

  describe('basic functionality', () => {
    it('should set page title', () => {
      useSEO({ title: 'Test Page' })

      expect(document.title).toBe('Test Page')
    })

    it('should set meta description', () => {
      useSEO({ description: 'Test description' })

      const metaDescription = document.querySelector('meta[name="description"]')
      expect(metaDescription?.getAttribute('content')).toBe('Test description')
    })

    it('should set meta keywords', () => {
      useSEO({ keywords: ['test', 'vue', 'seo'] })

      const metaKeywords = document.querySelector('meta[name="keywords"]')
      expect(metaKeywords?.getAttribute('content')).toBe('test, vue, seo')
    })
  })

  describe('Open Graph tags', () => {
    it('should set og:title', () => {
      useSEO({ title: 'Test Page', description: 'Test desc' })

      const ogTitle = document.querySelector('meta[property="og:title"]')
      expect(ogTitle?.getAttribute('content')).toBe('Test Page')
    })

    it('should set og:description', () => {
      useSEO({ title: 'Test', description: 'Test description' })

      const ogDescription = document.querySelector('meta[property="og:description"]')
      expect(ogDescription?.getAttribute('content')).toBe('Test description')
    })

    it('should set og:image when provided', () => {
      useSEO({
        title: 'Test',
        description: 'Test',
        image: 'https://example.com/image.jpg',
      })

      const ogImage = document.querySelector('meta[property="og:image"]')
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/image.jpg')
    })

    it('should set og:url when provided', () => {
      useSEO({
        title: 'Test',
        description: 'Test',
        url: 'https://bingelist.app/shows/123',
      })

      const ogUrl = document.querySelector('meta[property="og:url"]')
      expect(ogUrl?.getAttribute('content')).toBe('https://bingelist.app/shows/123')
    })
  })

  describe('Twitter Card tags', () => {
    it('should set twitter:title', () => {
      useSEO({ title: 'Test Page', description: 'Test' })

      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      expect(twitterTitle?.getAttribute('content')).toBe('Test Page')
    })

    it('should set twitter:description', () => {
      useSEO({ title: 'Test', description: 'Test description' })

      const twitterDescription = document.querySelector('meta[name="twitter:description"]')
      expect(twitterDescription?.getAttribute('content')).toBe('Test description')
    })

    it('should set twitter:image when provided', () => {
      useSEO({
        title: 'Test',
        description: 'Test',
        image: 'https://example.com/image.jpg',
      })

      const twitterImage = document.querySelector('meta[name="twitter:image"]')
      expect(twitterImage?.getAttribute('content')).toBe('https://example.com/image.jpg')
    })
  })

  describe('canonical URL', () => {
    it('should set canonical link when URL provided', () => {
      useSEO({
        title: 'Test',
        description: 'Test',
        url: 'https://bingelist.app/shows/123',
      })

      const canonical = document.querySelector('link[rel="canonical"]')
      expect(canonical?.getAttribute('href')).toBe('https://bingelist.app/shows/123')
    })

    it('should update existing canonical link', () => {
      // Add initial canonical
      const initialCanonical = document.createElement('link')
      initialCanonical.rel = 'canonical'
      initialCanonical.href = 'https://example.com/old'
      document.head.appendChild(initialCanonical)

      useSEO({
        title: 'Test',
        description: 'Test',
        url: 'https://bingelist.app/shows/123',
      })

      const canonicals = document.querySelectorAll('link[rel="canonical"]')
      expect(canonicals.length).toBe(1)
      expect(canonicals[0]?.getAttribute('href')).toBe('https://bingelist.app/shows/123')
    })
  })

  describe('meta tag updates', () => {
    it('should update existing meta tags instead of creating duplicates', () => {
      useSEO({ title: 'First', description: 'First description' })
      useSEO({ title: 'Second', description: 'Second description' })

      const descriptions = document.querySelectorAll('meta[name="description"]')
      expect(descriptions.length).toBe(1)
      expect(descriptions[0]?.getAttribute('content')).toBe('Second description')
    })

    it('should handle multiple SEO calls', () => {
      useSEO({ title: 'Page 1', description: 'Description 1' })
      useSEO({ title: 'Page 2', description: 'Description 2', keywords: ['test'] })
      useSEO({ title: 'Page 3', description: 'Description 3' })

      expect(document.title).toBe('Page 3')

      const metaDescription = document.querySelector('meta[name="description"]')
      expect(metaDescription?.getAttribute('content')).toBe('Description 3')
    })
  })
})

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
    expect(seo.image).toBe(mockShow.image.original)
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

    expect(seo.description.length).toBeLessThanOrEqual(163) // 160 + '...'
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
