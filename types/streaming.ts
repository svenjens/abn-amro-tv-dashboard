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
  'apple-tv': {
    id: 'apple-tv',
    name: 'Apple TV',
    logo: '/logos/streaming/apple-tv.svg',
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
  'youtube-tv': {
    id: 'youtube-tv',
    name: 'YouTube TV',
    logo: '/logos/streaming/youtube-tv.svg',
    homePage: 'https://tv.youtube.com',
    searchUrl: 'https://tv.youtube.com/search?q={query}',
    themeColorCode: '#FF0000',
    hasAffiliateProgram: false,
  },
  fubo: {
    id: 'fubo',
    name: 'fuboTV',
    logo: '/logos/streaming/fubo.svg',
    homePage: 'https://www.fubo.tv',
    searchUrl: 'https://www.fubo.tv/welcome/search?query={query}',
    themeColorCode: '#FF4A00',
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
  'hbo-amazon': {
    id: 'hbo-amazon',
    name: 'HBO Max Amazon Channel',
    logo: '/logos/streaming/hbo-amazon.svg',
    homePage: 'https://www.amazon.com/gp/video/storefront',
    searchUrl: 'https://www.amazon.com/s?k={query}',
    themeColorCode: '#002BE7',
    hasAffiliateProgram: true,
  },
  tbs: {
    id: 'tbs',
    name: 'TBS',
    logo: '/logos/streaming/tbs.svg',
    homePage: 'https://www.tbs.com',
    searchUrl: 'https://www.tbs.com/search?q={query}',
    themeColorCode: '#FF0066',
    hasAffiliateProgram: false,
  },
  'google-play': {
    id: 'google-play',
    name: 'Google Play Movies',
    logo: '/logos/streaming/google-play.svg',
    homePage: 'https://play.google.com/store/movies',
    searchUrl: 'https://play.google.com/store/search?q={query}&c=movies',
    themeColorCode: '#4285F4',
    hasAffiliateProgram: false,
  },
  'fandango-at-home': {
    id: 'fandango-at-home',
    name: 'Fandango At Home',
    logo: '/logos/streaming/fandango-at-home.svg',
    homePage: 'https://www.fandangoathome.com',
    searchUrl: 'https://www.fandangoathome.com/search?q={query}',
    themeColorCode: '#FF6600',
    hasAffiliateProgram: false,
  },
}

export interface AffiliateConfig {
  amazonAssociateTag?: string
  // Future: other affiliate programs can be added here
}

// TMDB Provider ID to internal service ID mapping
// https://www.themoviedb.org/talk/5efb0b71d11adf001682f79c
export const TMDB_PROVIDER_MAP: Record<string, string> = {
  '8': 'netflix', // Netflix
  '1796': 'netflix', // Netflix Standard with Ads
  '9': 'prime', // Amazon Prime Video
  '10': 'prime', // Amazon Video (buy/rent)
  '119': 'prime', // Amazon Prime Video (alternate ID)
  '2141': 'prime', // MGM Plus Amazon Channel
  '337': 'disney', // Disney+
  '384': 'hbo', // HBO Max
  '1899': 'hbo', // Max (rebranded HBO Max)
  '15': 'hulu', // Hulu
  '350': 'apple', // Apple TV+
  '2': 'apple-tv', // Apple TV (buy/rent)
  '531': 'paramount', // Paramount+
  '386': 'peacock', // Peacock
  '1853': 'skyshowtime', // SkyShowtime
  '1773': 'skyshowtime', // SkyShowtime (alternate ID)
  '72': 'videoland', // Videoland
  '1970': 'hbo', // HBO Max Amazon Channel
  '188': 'youtube-tv', // YouTube TV
  '257': 'fubo', // fuboTV
  '503': 'tbs', // TBS
  '3': 'google-play', // Google Play Movies
  '7': 'fandango-at-home', // Vudu / Fandango At Home
  '332': 'fandango-at-home', // Vudu (alternate ID)
}
