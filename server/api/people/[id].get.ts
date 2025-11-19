import { z } from 'zod'
import { logger } from '~/utils/logger'
import type { H3Event } from 'h3'
import type { TVMazePerson } from '~/types/show'
import { translateText } from '~/server/utils/translate'
import { getLocaleFromRequest, needsTranslation } from '~/server/utils/language'

/**
 * TVMaze Cast Credit Response
 * Shows that a person has appeared in
 */
interface CastCredit {
  _links: {
    show: {
      href: string
    }
    character?: {
      href: string
    }
  }
}

interface CastCreditShow {
  id: number
  url: string
  name: string
  type?: string
  language?: string
  genres: string[]
  status?: string
  premiered?: string
  ended?: string | null
  rating: {
    average: number | null
  }
  image?: {
    medium: string
    original: string
  } | null
  summary?: string | null
  _embedded?: {
    character?: {
      id: number
      name: string
      image?: {
        medium: string
        original: string
      } | null
    }
  }
}

/**
 * TMDB Person Search Response
 */
interface TMDBPersonSearchResponse {
  results: Array<{
    id: number
    name: string
    profile_path: string | null
    known_for_department: string
    popularity: number
  }>
}

/**
 * TMDB Person Details Response
 */
interface TMDBPersonDetails {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  popularity: number
}

/**
 * Person Details Response
 */
export interface PersonDetailsResponse extends TVMazePerson {
  castCredits?: CastCreditShow[]
  tmdb?: {
    id: number
    biography: string // AI-translated for non-English locales, original English otherwise
    placeOfBirth: string | null
    profilePath: string | null
    knownForDepartment: string
    popularity: number
  } | null
}

/**
 * Validate person ID parameter
 */
function validatePersonId(id: string | number): number {
  const schema = z.coerce.number().int().positive()
  const result = schema.safeParse(id)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid person ID',
      data: result.error.flatten(),
    })
  }

  return result.data
}

/**
 * Type guard to validate TVMaze person response
 */
function isTVMazePerson(data: unknown): data is TVMazePerson {
  if (typeof data !== 'object' || data === null) return false

  const person = data as Record<string, unknown>

  const hasValidId = typeof person.id === 'number'
  const hasValidUrl = typeof person.url === 'string'
  const hasValidName = typeof person.name === 'string'

  // Image may be null, or an object with a string medium property
  const image = person.image
  const hasValidImage =
    image === null ||
    (typeof image === 'object' &&
      image !== null &&
      typeof (image as Record<string, unknown>).medium === 'string')

  return hasValidId && hasValidUrl && hasValidName && hasValidImage
}

/**
 * Fetch person data from TVMaze API with caching
 */
async function fetchPersonFromTVMaze(id: number): Promise<{
  person: TVMazePerson
  credits: CastCredit[]
}> {
  // Use cached versions for better performance
  const { getCachedPerson, getCachedPersonCredits } = await import('~/server/utils/tvmaze-cache')

  const [personResponse, creditsResponse] = await Promise.all([
    getCachedPerson(id),
    getCachedPersonCredits(id).catch(() => [] as CastCredit[]),
  ])

  // Validate person response
  if (!isTVMazePerson(personResponse)) {
    logger.error(
      'Invalid person response from TVMaze API',
      {
        module: 'api/people/[id]',
        action: 'fetchPersonFromTVMaze',
        personId: id,
        responseType: typeof personResponse,
      },
      personResponse
    )
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid person data received from API',
    })
  }

  return {
    person: personResponse,
    credits: creditsResponse as CastCredit[],
  }
}

/**
 * Extract cast credits with embedded show data
 */
function extractCastCredits(creditsResponse: CastCredit[]): CastCreditShow[] {
  const castCredits: CastCreditShow[] = []

  if (!Array.isArray(creditsResponse)) {
    return castCredits
  }

  for (const credit of creditsResponse) {
    // TVMaze embeds show data when using ?embed[]=show&embed[]=character
    const embedded = (credit as unknown as Record<string, unknown>)._embedded as
      | Record<string, unknown>
      | undefined

    if (embedded?.show) {
      const showData = embedded.show as CastCreditShow
      // Create a proper show object with character info if available
      const show: CastCreditShow = {
        ...showData,
        _embedded: embedded.character
          ? {
              character: embedded.character as NonNullable<
                CastCreditShow['_embedded']
              >['character'],
            }
          : undefined,
      }
      castCredits.push(show)
    }
  }

  return castCredits
}

/**
 * Search for a person on TMDB by name
 */
async function searchTMDBPerson(personName: string, apiKey: string): Promise<number | null> {
  try {
    const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(personName)}`
    const searchResponse = await $fetch<TMDBPersonSearchResponse>(searchUrl)

    if (
      searchResponse.results &&
      Array.isArray(searchResponse.results) &&
      searchResponse.results.length > 0
    ) {
      const tmdbPerson = searchResponse.results[0]
      if (!tmdbPerson) {
        logger.debug('No TMDB person found', {
          module: 'api/people/[id]',
          action: 'searchTMDBPerson',
          personName,
        })
        return null
      }
      return tmdbPerson.id
    }

    return null
  } catch (error) {
    logger.warn('Failed to search TMDB person', {
      module: 'api/people/[id]',
      action: 'searchTMDBPerson',
      personName,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/**
 * Fetch detailed person data from TMDB
 */
async function fetchTMDBPersonDetails(
  tmdbId: number,
  apiKey: string
): Promise<TMDBPersonDetails | null> {
  try {
    const detailsUrl = `https://api.themoviedb.org/3/person/${tmdbId}?api_key=${apiKey}`
    return await $fetch<TMDBPersonDetails>(detailsUrl)
  } catch (error) {
    logger.warn('Failed to fetch TMDB person details', {
      module: 'api/people/[id]',
      action: 'fetchTMDBPersonDetails',
      tmdbId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/**
 * Enrich person data with TMDB information
 */
async function enrichWithTMDBData(
  personData: PersonDetailsResponse,
  personName: string,
  locale: import('~/server/utils/language').SupportedLocale
): Promise<void> {
  const config = useRuntimeConfig()
  const tmdbApiKey = config.public.tmdbApiKey

  if (!tmdbApiKey) {
    return
  }

  // Search for the person on TMDB
  const tmdbId = await searchTMDBPerson(personName, tmdbApiKey)
  if (!tmdbId) {
    return
  }

  // Fetch full person details from TMDB
  const detailsResponse = await fetchTMDBPersonDetails(tmdbId, tmdbApiKey)
  if (!detailsResponse) {
    return
  }

  // Translate biography if needed before adding to response
  let biographyToUse = detailsResponse.biography || ''
  if (detailsResponse.biography && needsTranslation(locale)) {
    const translatedBiography = await translateText(detailsResponse.biography, locale)
    if (translatedBiography) {
      biographyToUse = translatedBiography
    }
  }

  // Add TMDB data to person data (with translated biography in the main field)
  personData.tmdb = {
    id: detailsResponse.id,
    biography: biographyToUse,
    placeOfBirth: detailsResponse.place_of_birth,
    profilePath: detailsResponse.profile_path,
    knownForDepartment: detailsResponse.known_for_department,
    popularity: detailsResponse.popularity,
  }

  logger.debug('TMDB person data fetched successfully', {
    module: 'api/people/[id]',
    action: 'enrichWithTMDBData',
    personName,
    tmdbId,
    hasBiography: !!detailsResponse.biography,
    wasTranslated: biographyToUse !== detailsResponse.biography,
  })
}

export default defineEventHandler(async (event: H3Event) => {
    const rawId = getRouterParam(event, 'id')

    try {
      // Validate person ID
      if (!rawId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Person ID is required',
        })
      }

      const id = validatePersonId(rawId)

      // Get locale from request for translation
      const locale = getLocaleFromRequest(event)

      // Fetch person data from TVMaze
      const { person, credits } = await fetchPersonFromTVMaze(id)

      // Extract cast credits with embedded show data
      const castCredits = extractCastCredits(credits)

      // Build person data response
      const personData: PersonDetailsResponse = {
        ...person,
        castCredits,
        tmdb: null,
      }

      // Enrich with TMDB data (optional, won't fail if TMDB is unavailable)
      await enrichWithTMDBData(personData, person.name, locale)

      logger.debug('Person details fetched successfully', {
        module: 'api/people/[id]',
        action: 'fetchPersonById',
        personId: id,
        creditsCount: castCredits.length,
        hasCredits: castCredits.length > 0,
        hasTMDBData: !!personData.tmdb,
        firstCredit: castCredits[0] ? { id: castCredits[0].id, name: castCredits[0].name } : null,
      })

      return personData
  } catch (error) {
    // Preserve H3 errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Log unexpected errors
    logger.error(
      'Failed to fetch person details',
      {
        module: 'api/people/[id]',
        action: 'fetchPersonById',
        personId: rawId,
      },
      error
    )

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch person details',
    })
  }
})
