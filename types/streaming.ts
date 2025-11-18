/**
 * Streaming Availability Types
 *
 * Types for streaming service information and availability
 */

export interface StreamingService {
  id: string
  name: string
  logo: string
  link: string
  country: string
  type: 'subscription' | 'buy' | 'rent' | 'free' | 'ads'
}

export interface StreamingAvailability {
  service: StreamingService
  availableFrom?: string
  availableUntil?: string
  link: string
  price?: number
  currency?: string
}

export interface StreamingPlatform {
  id: string
  name: string
  logo: string
  homePage: string
  searchUrl?: string // URL template for searching shows (use {query} placeholder)
  themeColorCode: string
  hasAffiliateProgram: boolean
}

// Popular streaming platforms with their details
export const STREAMING_PLATFORMS: Record<string, StreamingPlatform> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    logo: '/logos/streaming/netflix.svg',
    homePage: 'https://www.netflix.com',
    searchUrl: 'https://www.netflix.com/search?q={query}',
    themeColorCode: '#E50914',
    hasAffiliateProgram: false,
  },
  prime: {
    id: 'prime',
    name: 'Amazon Prime Video',
    logo: '/logos/streaming/prime.svg',
    homePage: 'https://www.primevideo.com',
    searchUrl: 'https://www.primevideo.com/search?phrase={query}',
    themeColorCode: '#00A8E1',
    hasAffiliateProgram: true,
  },
  disney: {
    id: 'disney',
    name: 'Disney+',
    logo: '/logos/streaming/disney.svg',
    homePage: 'https://www.disneyplus.com',
    searchUrl: 'https://www.disneyplus.com/search?q={query}',
    themeColorCode: '#113CCF',
    hasAffiliateProgram: false,
  },
  hbo: {
    id: 'hbo',
    name: 'HBO Max',
    logo: '/logos/streaming/hbo.svg',
    homePage: 'https://www.max.com',
    searchUrl: 'https://www.max.com/search?q={query}',
    themeColorCode: '#002BE7',
    hasAffiliateProgram: false,
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    logo: '/logos/streaming/hulu.svg',
    homePage: 'https://www.hulu.com',
    searchUrl: 'https://www.hulu.com/search?q={query}',
    themeColorCode: '#1CE783',
    hasAffiliateProgram: false,
  },
  apple: {
    id: 'apple',
    name: 'Apple TV+',
    logo: '/logos/streaming/apple.svg',
    homePage: 'https://tv.apple.com',
    searchUrl: 'https://tv.apple.com/search?q={query}',
    themeColorCode: '#000000',
    hasAffiliateProgram: false,
  },
  paramount: {
    id: 'paramount',
    name: 'Paramount+',
    logo: '/logos/streaming/paramount.svg',
    homePage: 'https://www.paramountplus.com',
    searchUrl: 'https://www.paramountplus.com/search?query={query}',
    themeColorCode: '#0064FF',
    hasAffiliateProgram: false,
  },
  peacock: {
    id: 'peacock',
    name: 'Peacock',
    logo: '/logos/streaming/peacock.svg',
    homePage: 'https://www.peacocktv.com',
    searchUrl: 'https://www.peacocktv.com/search?q={query}',
    themeColorCode: '#000000',
    hasAffiliateProgram: false,
  },
  skyshowtime: {
    id: 'skyshowtime',
    name: 'SkyShowtime',
    logo: '/logos/streaming/skyshowtime.svg',
    homePage: 'https://www.skyshowtime.com',
    searchUrl: 'https://www.skyshowtime.com/search?q={query}',
    themeColorCode: '#5433FF',
    hasAffiliateProgram: false,
  },
  videoland: {
    id: 'videoland',
    name: 'Videoland',
    logo: '/logos/streaming/videoland.svg',
    homePage: 'https://www.videoland.com',
    searchUrl: 'https://www.videoland.com/zoeken?q={query}',
    themeColorCode: '#FF0000',
    hasAffiliateProgram: false,
  },
}

export interface AffiliateConfig {
  amazonAssociateTag?: string
  // Future: other affiliate programs can be added here
}
