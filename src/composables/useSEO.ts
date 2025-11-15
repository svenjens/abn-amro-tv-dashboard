/**
 * Composable for managing SEO meta tags
 */

import type { Show } from '@/types'

interface SEOConfig {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  keywords?: string[]
}

/**
 * Update SEO meta tags for the current page
 */
export function useSEO(config: SEOConfig = {}) {
  const updateMeta = () => {
    const {
      title = 'TV Show Dashboard',
      description = 'Discover and explore thousands of TV shows organized by genre',
      image = '/og-image.png',
      url = window.location.href,
      type = 'website',
      keywords = ['tv shows', 'series', 'movies', 'entertainment'],
    } = config

    // Update document title
    document.title = title

    // Update or create meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords.join(', '))

    // Open Graph tags
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image, 'property')
    updateMetaTag('og:url', url, 'property')
    updateMetaTag('og:type', type, 'property')

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name')
    updateMetaTag('twitter:title', title, 'name')
    updateMetaTag('twitter:description', description, 'name')
    updateMetaTag('twitter:image', image, 'name')

    // Canonical URL
    updateCanonicalUrl(url)
  }

  // Update meta immediately
  updateMeta()

  return {
    updateMeta,
  }
}

/**
 * Generate SEO configuration for a show
 * @param show - Show object
 * @param fallbackDescription - Fallback description if show.summary is empty (should be localized)
 */
export function getShowSEO(show: Show, fallbackDescription?: string): SEOConfig {
  const title = `${show.name} - TV Show Dashboard`
  const description = show.summary
    ? stripHtml(show.summary).slice(0, 160) + '...'
    : fallbackDescription || `Watch ${show.name} and discover more TV shows on TV Show Dashboard`

  return {
    title,
    description,
    image: show.image?.original || show.image?.medium,
    type: 'article',
    keywords: [show.name, 'tv show', 'series', ...show.genres, show.network?.name].filter(
      Boolean
    ) as string[],
  }
}

/**
 * Generate structured data (JSON-LD) for a show
 */
export function generateShowStructuredData(show: Show) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    description: show.summary ? stripHtml(show.summary) : undefined,
    image: show.image?.original || show.image?.medium,
    genre: show.genres,
    datePublished: show.premiered,
    aggregateRating: show.rating.average
      ? {
          '@type': 'AggregateRating',
          ratingValue: show.rating.average,
          bestRating: 10,
          worstRating: 0,
        }
      : undefined,
    productionCompany: show.network
      ? {
          '@type': 'Organization',
          name: show.network.name,
        }
      : undefined,
  }

  // Add or update script tag
  let script = document.querySelector(
    'script[type="application/ld+json"]'
  ) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(structuredData)
}

// Helper functions
function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function updateCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
