/**
 * TMDB API Types
 * 
 * Types for The Movie Database API integration
 * Used for fetching multi-platform streaming availability
 */

export interface TMDBWatchProvider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}

export interface TMDBWatchProviderResult {
  link: string
  flatrate?: TMDBWatchProvider[] // Subscription (Netflix, Disney+, etc.)
  rent?: TMDBWatchProvider[] // Rent options
  buy?: TMDBWatchProvider[] // Buy/purchase options
  ads?: TMDBWatchProvider[] // Free with ads
  free?: TMDBWatchProvider[] // Free (without ads)
}

export interface TMDBWatchProvidersResponse {
  id: number
  results: {
    [countryCode: string]: TMDBWatchProviderResult
  }
}

export interface TMDBExternalIds {
  imdb_id?: string
  freebase_mid?: string
  freebase_id?: string
  tvdb_id?: number
  tvrage_id?: number
  wikidata_id?: string
  facebook_id?: string
  instagram_id?: string
  twitter_id?: string
}

export interface TMDBSearchResult {
  id: number
  name?: string // TV shows
  title?: string // Movies
  original_name?: string
  original_title?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date?: string // TV shows
  release_date?: string // Movies
  vote_average: number
  vote_count: number
  popularity: number
}

export interface TMDBSearchResponse {
  page: number
  results: TMDBSearchResult[]
  total_pages: number
  total_results: number
}

export interface TMDBError {
  status_code: number
  status_message: string
  success: boolean
}

