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
  themeColorCode: string
  hasAffiliateProgram: boolean
}

// Popular streaming platforms with their details
export const STREAMING_PLATFORMS: Record<string, StreamingPlatform> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    logo: '🎬',
    homePage: 'https://www.netflix.com',
    themeColorCode: '#E50914',
    hasAffiliateProgram: false,
  },
  prime: {
    id: 'prime',
    name: 'Amazon Prime Video',
    logo: '📺',
    homePage: 'https://www.primevideo.com',
    themeColorCode: '#00A8E1',
    hasAffiliateProgram: true,
  },
  disney: {
    id: 'disney',
    name: 'Disney+',
    logo: '🏰',
    homePage: 'https://www.disneyplus.com',
    themeColorCode: '#113CCF',
    hasAffiliateProgram: false,
  },
  hbo: {
    id: 'hbo',
    name: 'HBO Max',
    logo: '🎭',
    homePage: 'https://www.max.com',
    themeColorCode: '#002BE7',
    hasAffiliateProgram: false,
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    logo: '📱',
    homePage: 'https://www.hulu.com',
    themeColorCode: '#1CE783',
    hasAffiliateProgram: false,
  },
  apple: {
    id: 'apple',
    name: 'Apple TV+',
    logo: '🍎',
    homePage: 'https://tv.apple.com',
    themeColorCode: '#000000',
    hasAffiliateProgram: false,
  },
  paramount: {
    id: 'paramount',
    name: 'Paramount+',
    logo: '⛰️',
    homePage: 'https://www.paramountplus.com',
    themeColorCode: '#0064FF',
    hasAffiliateProgram: false,
  },
  peacock: {
    id: 'peacock',
    name: 'Peacock',
    logo: '🦚',
    homePage: 'https://www.peacocktv.com',
    themeColorCode: '#000000',
    hasAffiliateProgram: false,
  },
  skyshowtime: {
    id: 'skyshowtime',
    name: 'SkyShowtime',
    logo: '🌟',
    homePage: 'https://www.skyshowtime.com',
    themeColorCode: '#5433FF',
    hasAffiliateProgram: false,
  },
  videoland: {
    id: 'videoland',
    name: 'Videoland',
    logo: '📹',
    homePage: 'https://www.videoland.com',
    themeColorCode: '#FF0000',
    hasAffiliateProgram: false,
  },
}

export interface AffiliateConfig {
  amazonAssociateTag?: string
  // Future: other affiliate programs can be added here
}
