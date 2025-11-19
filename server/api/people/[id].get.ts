import { z } from 'zod'
import { logger } from '~/utils/logger'
import type { H3Event } from 'h3'
import type { TVMazePerson } from '~/types/show'

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
    biography: string
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
  if (!data || typeof data !== 'object') return false

  const person = data as Record<string, unknown>

  return (
    typeof person.id === 'number' &&
    typeof person.url === 'string' &&
    typeof person.name === 'string' &&
    (person.image === null ||
      (typeof person.image === 'object' &&
        person.image !== null &&
        typeof (person.image as Record<string, unknown>).medium === 'string'))
  )
}

export default cachedEventHandler(
  async (event: H3Event) => {
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

      // Fetch person data from TVMaze
      const [personResponse, creditsResponse] = await Promise.all([
        $fetch<unknown>(`https://api.tvmaze.com/people/${id}`, {
          headers: {
            'User-Agent': 'BingeList/1.0',
          },
        }),
        $fetch<CastCredit[]>(
          `https://api.tvmaze.com/people/${id}/castcredits?embed[]=show&embed[]=character`,
          {
            headers: {
              'User-Agent': 'BingeList/1.0',
            },
          }
        ).catch(() => [] as CastCredit[]),
      ])

      // Validate person response
      if (!isTVMazePerson(personResponse)) {
        logger.error(
          'Invalid person response from TVMaze API',
          {
            module: 'api/people/[id]',
            action: 'fetchPersonById',
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

      // Extract cast credits with embedded show data
      const castCredits: CastCreditShow[] = []

      if (Array.isArray(creditsResponse)) {
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
      }

      const personData: PersonDetailsResponse = {
        ...personResponse,
        castCredits,
        tmdb: null,
      }

      // Fetch TMDB data if API key is available
      const config = useRuntimeConfig()
      const tmdbApiKey = config.public.tmdbApiKey

      if (tmdbApiKey) {
        try {
          // Search for the person on TMDB by name
          const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${tmdbApiKey}&query=${encodeURIComponent(personResponse.name)}`
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
                action: 'fetchTMDBPerson',
                personName: personResponse.name,
              })
            } else {
              const tmdbId = tmdbPerson.id

              // Fetch full person details from TMDB
              const detailsUrl = `https://api.themoviedb.org/3/person/${tmdbId}?api_key=${tmdbApiKey}`
              const detailsResponse = await $fetch<TMDBPersonDetails>(detailsUrl)

              // Add TMDB data to combined response
              personData.tmdb = {
                id: detailsResponse.id,
                biography: detailsResponse.biography || '',
                placeOfBirth: detailsResponse.place_of_birth,
                profilePath: detailsResponse.profile_path,
                knownForDepartment: detailsResponse.known_for_department,
                popularity: detailsResponse.popularity,
              }

              logger.debug('TMDB person data fetched successfully', {
                module: 'api/people/[id]',
                action: 'fetchTMDBPerson',
                personName: personResponse.name,
                tmdbId,
                hasBiography: !!detailsResponse.biography,
              })
            }
          }
        } catch (error) {
          // Log but don't fail if TMDB enrichment fails
          logger.warn('Failed to fetch TMDB person data', {
            module: 'api/people/[id]',
            action: 'fetchTMDBPerson',
            personName: personResponse.name,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }

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
  },
  {
    maxAge: 60 * 60 * 24, // Cache for 24 hours
    swr: true, // Enable stale-while-revalidate
    getKey: (event: H3Event) => {
      const id = getRouterParam(event, 'id')
      return `person-v2-${id}` // v2: includes TMDB biography enrichment
    },
  }
)
