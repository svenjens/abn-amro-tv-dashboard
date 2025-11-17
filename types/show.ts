/**
 * Type definitions for TVMaze API responses
 */

export interface Show {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string
  ended: string | null
  officialSite: string | null
  schedule: Schedule
  rating: Rating
  weight: number
  network: Network | null
  webChannel: WebChannel | null
  dvdCountry: null
  externals: Externals
  image: Image | null
  summary: string | null
  updated: number
  _links: Links
}

export interface Schedule {
  time: string
  days: string[]
}

export interface Rating {
  average: number | null
}

export interface Network {
  id: number
  name: string
  country: Country
  officialSite: string | null
}

export interface WebChannel {
  id: number
  name: string
  country: Country | null
  officialSite: string | null
}

export interface Country {
  name: string
  code: string
  timezone: string
}

export interface Externals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

export interface Image {
  medium: string
  original: string
}

export interface Links {
  self: Link
  previousepisode?: Link
}

export interface Link {
  href: string
}

export interface SearchResult {
  score: number
  show: Show
  matchedTerm?: string // For Smart Search: shows which term matched this result
}

export interface ShowsByGenre {
  [genre: string]: Show[]
}

/**
 * API response and error types
 */
export interface ApiResponse<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

export interface ApiError {
  message: string
  status?: number
  details?: unknown
}

/**
 * Episode types
 */
export interface Episode {
  id: number
  url: string
  name: string
  season: number
  number: number
  type: string
  airdate: string
  airtime: string
  airstamp: string
  runtime: number | null
  rating: Rating
  image: Image | null
  summary: string | null
  _links: {
    self: Link
    show: Link
  }
}

export interface EpisodesBySeason {
  [season: number]: Episode[]
}

/**
 * Cast types
 */
export interface CastMember {
  person: Person
  character: Character
  self: boolean
  voice: boolean
}

export interface Person {
  id: number
  url: string
  name: string
  country: Country | null
  birthday: string | null
  deathday: string | null
  gender: string | null
  image: Image | null
  updated: number
  _links: {
    self: Link
  }
}

export interface Character {
  id: number
  url: string
  name: string
  image: Image | null
  _links: {
    self: Link
  }
}

/**
 * Episode tracking
 */
export interface WatchedEpisode {
  showId: number
  episodeId: number
  season: number
  episode: number
  watchedAt: number
}
