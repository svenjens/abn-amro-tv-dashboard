/**
 * Composable for managing SEO meta tags (Nuxt compatible)
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
 * Update SEO meta tags for the current page using Nuxt's useHead and useSeoMeta
 */
export function useSEO(config: SEOConfig = {}) {
  const {
    title = 'BingeList - Your Ultimate TV Show Discovery Platform',
    description = 'Discover and explore thousands of TV shows organized by genre. Find streaming availability and full details.',
    image = '/og-image.png',
    url,
    type = 'website',
    keywords = ['tv shows', 'series', 'streaming', 'entertainment', 'bingelist'],
  } = config

  // Use Nuxt's useHead for meta tags
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
    ],
    link: url ? [
      { rel: 'canonical', href: url }
    ] : []
  })

  // Use Nuxt's useSeoMeta for OpenGraph and Twitter tags
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    ogType: type,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  })
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
 * Generate structured data (JSON-LD) for a show using Nuxt's useHead
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

  // Use Nuxt's useHead to add structured data
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData)
      }
    ]
  })
}

// Helper function
function stripHtml(html: string): string {
  // Simple HTML strip for SSR compatibility
  return html.replace(/<[^>]*>/g, '')
}
