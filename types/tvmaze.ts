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
  if (typeof obj !== 'object' || obj === null) return false

  const show = obj as Partial<TVMazeShow>

  // Validate required fields
  const hasValidId = typeof show.id === 'number'
  const hasValidName = typeof show.name === 'string'

  // Validate genres array contains only strings
  const hasGenresArray = Array.isArray(show.genres)
  const hasValidGenres = hasGenresArray && show.genres!.every((g) => typeof g === 'string')

  // Validate rating structure (rating may be null or an object with optional average)
  const hasRating = show.rating !== undefined
  const hasValidRating = !hasRating
    ? false
    : show.rating === null ||
      (typeof show.rating === 'object' &&
        ((show.rating as { average?: unknown }).average === null ||
          typeof (show.rating as { average?: unknown }).average === 'number'))

  return hasValidId && hasValidName && hasValidGenres && hasValidRating
}

/**
 * Type guard to check if response is an array of TVMazeShows
 * Validates all elements in the array for production safety
 * For large arrays (>100), validates a sample for performance
 */
export function isTVMazeShowArray(obj: unknown): obj is TVMazeShow[] {
  if (!Array.isArray(obj)) return false

  const isLargeArray = obj.length > 100
  const isEmpty = obj.length === 0

  // For large arrays, validate a sample for performance
  if (isLargeArray) {
    const firstItem = obj[0]
    const middleItem = obj[Math.floor(obj.length / 2)]
    const lastItem = obj[obj.length - 1]

    const hasValidFirst = isEmpty || isTVMazeShow(firstItem)
    const hasValidMiddle = isTVMazeShow(middleItem)
    const hasValidLast = isTVMazeShow(lastItem)

    return hasValidFirst && hasValidMiddle && hasValidLast
  }

  // For smaller arrays, validate all elements
  return obj.every(isTVMazeShow)
}
