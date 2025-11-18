/**
 * TypeScript type definitions for TVMaze API responses
 * See: https://www.tvmaze.com/api
 */

export interface TVMazeShow {
  id: number
  url: string
  name: string
  type?: string
  language?: string
  genres: string[]
  status?: string
  runtime?: number | null
  averageRuntime?: number | null
  premiered?: string
  ended?: string | null
  officialSite?: string | null
  schedule?: {
    time: string
    days: string[]
  }
  rating: {
    average: number | null
  }
  weight?: number
  network?: {
    id: number
    name: string
    country?: {
      name: string
      code: string
      timezone: string
    }
    officialSite?: string | null
  } | null
  webChannel?: {
    id: number
    name: string
    country?: {
      name: string
      code: string
      timezone: string
    } | null
    officialSite?: string | null
  } | null
  dvdCountry?: unknown | null
  externals?: {
    tvrage?: number | null
    thetvdb?: number | null
    imdb?: string | null
  }
  image?: {
    medium: string
    original: string
  } | null
  summary?: string | null
  updated?: number
  _links?: {
    self?: {
      href: string
    }
    previousepisode?: {
      href: string
    }
  }
}

export interface TVMazeCastMember {
  person: {
    id: number
    url: string
    name: string
    country?: {
      name: string
      code: string
      timezone: string
    } | null
    birthday?: string | null
    deathday?: string | null
    gender?: string | null
    image?: {
      medium: string
      original: string
    } | null
    updated?: number
    _links?: {
      self: {
        href: string
      }
    }
  }
  character: {
    id: number
    url: string
    name: string
    image?: {
      medium: string
      original: string
    } | null
    _links?: {
      self: {
        href: string
      }
    }
  }
  self?: boolean
  voice?: boolean
}

export interface TVMazeEpisode {
  id: number
  url: string
  name: string
  season: number
  number: number | null
  type?: string
  airdate?: string
  airtime?: string
  airstamp?: string
  runtime?: number | null
  rating: {
    average: number | null
  }
  image?: {
    medium: string
    original: string
  } | null
  summary?: string | null
  _links?: {
    self: {
      href: string
    }
    show?: {
      href: string
    }
  }
}

export interface TVMazeSearchResult {
  score: number
  show: TVMazeShow
}

/**
 * Type guard to check if an object is a valid TVMazeShow
 */
export function isTVMazeShow(obj: unknown): obj is TVMazeShow {
  if (!obj || typeof obj !== 'object') return false
  const show = obj as Partial<TVMazeShow>

  return (
    typeof show.id === 'number' &&
    typeof show.name === 'string' &&
    Array.isArray(show.genres) &&
    show.rating !== undefined &&
    (show.rating === null || typeof show.rating === 'object')
  )
}

/**
 * Type guard to check if response is an array of TVMazeShows
 */
export function isTVMazeShowArray(obj: unknown): obj is TVMazeShow[] {
  return Array.isArray(obj) && (obj.length === 0 || isTVMazeShow(obj[0]))
}
