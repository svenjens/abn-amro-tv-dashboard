/**
 * Streaming Availability Service
 *
 * Provides methods to fetch streaming availability data
 * Combines TVMaze's web channel data with TMDB's watch providers API
 * for comprehensive multi-platform streaming availability
 */

import type { StreamingAvailability, AffiliateConfig, TMDBWatchProvider } from '@/types'
import { STREAMING_PLATFORMS } from '@/types'
import { logger } from '@/utils'
import { tmdbAPI } from './tmdb'
import type { Show } from '@/types'

interface WebChannel {
  id: number
  name: string
  country: {
    name: string
    code: string
    timezone: string
  } | null
  officialSite: string | null
}

class StreamingService {
  private affiliateConfig: AffiliateConfig = {}

  /**
   * Set affiliate configuration
   */
  setAffiliateConfig(config: AffiliateConfig): void {
    this.affiliateConfig = config
  }

  /**
   * Get streaming availability from TVMaze web channel data
   */
  getStreamingFromWebChannel(webChannel: WebChannel | null): StreamingAvailability[] {
    if (!webChannel) {
      return []
    }

    const availability: StreamingAvailability[] = []

    // Map common web channels to streaming services
    const channelMap: Record<string, { id: string; name: string; logo: string; baseUrl: string }> =
      {
        Netflix: { id: 'netflix', name: 'Netflix', logo: '🎬', baseUrl: 'https://www.netflix.com' },
        'Amazon Prime Video': {
          id: 'prime',
          name: 'Amazon Prime Video',
          logo: '📺',
          baseUrl: 'https://www.primevideo.com',
        },
        'Prime Video': {
          id: 'prime',
          name: 'Amazon Prime Video',
          logo: '📺',
          baseUrl: 'https://www.primevideo.com',
        },
        'Disney+': {
          id: 'disney',
          name: 'Disney+',
          logo: '🏰',
          baseUrl: 'https://www.disneyplus.com',
        },
        'HBO Max': { id: 'hbo', name: 'HBO Max', logo: '🎭', baseUrl: 'https://www.max.com' },
        Hulu: { id: 'hulu', name: 'Hulu', logo: '📱', baseUrl: 'https://www.hulu.com' },
        'Apple TV+': {
          id: 'apple',
          name: 'Apple TV+',
          logo: '🍎',
          baseUrl: 'https://tv.apple.com',
        },
        'Paramount+': {
          id: 'paramount',
          name: 'Paramount+',
          logo: '⛰️',
          baseUrl: 'https://www.paramountplus.com',
        },
        Peacock: {
          id: 'peacock',
          name: 'Peacock',
          logo: '🦚',
          baseUrl: 'https://www.peacocktv.com',
        },
        SkyShowtime: {
          id: 'skyshowtime',
          name: 'SkyShowtime',
          logo: '🌟',
          baseUrl: 'https://www.skyshowtime.com',
        },
        Videoland: {
          id: 'videoland',
          name: 'Videoland',
          logo: '📹',
          baseUrl: 'https://www.videoland.com',
        },
      }

    const channelInfo = channelMap[webChannel.name]
    if (channelInfo) {
      let link = webChannel.officialSite || channelInfo.baseUrl

      // Add affiliate tag for Amazon Prime Video
      if (channelInfo.id === 'prime' && this.affiliateConfig.amazonAssociateTag) {
        link = this.addAmazonAffiliateTag(link, this.affiliateConfig.amazonAssociateTag)
      }

      availability.push({
        service: {
          id: channelInfo.id,
          name: channelInfo.name,
          logo: channelInfo.logo,
          link: channelInfo.baseUrl,
          country: webChannel.country?.code || 'US',
          type: 'subscription',
        },
        link,
      })
    }

    logger.debug(
      `[Streaming] Found ${availability.length} streaming options for ${webChannel.name}`
    )
    return availability
  }

  /**
   * Add Amazon affiliate tag to a URL
   */
  private addAmazonAffiliateTag(url: string, tag: string): string {
    try {
      const urlObj = new URL(url)
      urlObj.searchParams.set('tag', tag)
      return urlObj.toString()
    } catch {
      // If URL parsing fails, return original URL
      return url
    }
  }

  /**
   * Get suggested streaming services based on show title
   * This is a placeholder for future integration with streaming APIs
   */
  async getSuggestedServices(showTitle: string): Promise<string[]> {
    logger.debug(`[Streaming] Getting suggestions for: ${showTitle}`)

    // This is a placeholder. In a real implementation, you would:
    // 1. Call a streaming availability API (e.g., Watchmode API)
    // 2. Return the list of services where the show is available

    // For now, return popular streaming services
    return [
      'Check Netflix',
      'Check Prime Video',
      'Check Disney+',
      'Check HBO Max',
      'Check SkyShowtime',
    ]
  }

  /**
   * Get affiliate link for a specific service and show
   */
  getAffiliateLink(serviceId: string, showUrl: string): string {
    if (serviceId === 'prime' && this.affiliateConfig.amazonAssociateTag) {
      return this.addAmazonAffiliateTag(showUrl, this.affiliateConfig.amazonAssociateTag)
    }
    return showUrl
  }

  /**
   * Map TMDB provider ID to our platform ID
   */
  private mapTMDBProviderToId(providerId: number, providerName: string): string | null {
    // Common TMDB provider IDs (these are consistent across regions)
    const providerMap: Record<number, string> = {
      8: 'netflix',
      119: 'prime',
      9: 'prime', // Amazon Video
      337: 'disney',
      384: 'hbo', // HBO Max
      15: 'hulu',
      350: 'apple',
      531: 'paramount',
      387: 'peacock',
    }

    // Try direct ID mapping first
    if (providerMap[providerId]) {
      return providerMap[providerId]
    }

    // Fall back to name matching
    const nameLower = providerName.toLowerCase()
    if (nameLower.includes('netflix')) return 'netflix'
    if (nameLower.includes('amazon') || nameLower.includes('prime')) return 'prime'
    if (nameLower.includes('disney')) return 'disney'
    if (nameLower.includes('hbo') || nameLower.includes('max')) return 'hbo'
    if (nameLower.includes('hulu')) return 'hulu'
    if (nameLower.includes('apple')) return 'apple'
    if (nameLower.includes('paramount')) return 'paramount'
    if (nameLower.includes('peacock')) return 'peacock'
    if (nameLower.includes('skyshowtime')) return 'skyshowtime'
    if (nameLower.includes('videoland')) return 'videoland'

    return null
  }

  /**
   * Convert TMDB watch provider to our StreamingAvailability format
   */
  private tmdbProviderToAvailability(
    provider: TMDBWatchProvider,
    type: 'subscription' | 'buy' | 'rent' | 'free' | 'ads',
    linkUrl: string
  ): StreamingAvailability | null {
    const platformId = this.mapTMDBProviderToId(provider.provider_id, provider.provider_name)
    
    if (!platformId) {
      logger.debug(`[Streaming] Unknown TMDB provider: ${provider.provider_name} (ID: ${provider.provider_id})`)
      return null
    }

    const platform = STREAMING_PLATFORMS[platformId]
    if (!platform) {
      return null
    }

    let link = linkUrl

    // Add affiliate tag for Amazon Prime Video
    if (platformId === 'prime' && this.affiliateConfig.amazonAssociateTag) {
      link = this.addAmazonAffiliateTag(link, this.affiliateConfig.amazonAssociateTag)
    }

    return {
      service: {
        id: platform.id,
        name: platform.name,
        logo: platform.logo,
        link: platform.homePage,
        country: 'NL', // This comes from TMDB response
        type,
      },
      link,
    }
  }

  /**
   * Get comprehensive streaming availability from TMDB
   * Combines with webChannel data for complete picture
   */
  async getStreamingAvailability(
    show: Show,
    country: string = 'NL'
  ): Promise<StreamingAvailability[]> {
    const availability: StreamingAvailability[] = []

    // First, add webChannel data (for originals like Netflix Originals)
    const webChannelData = this.getStreamingFromWebChannel(show.webChannel || null)
    availability.push(...webChannelData)

    // Then, fetch TMDB data for multi-platform availability
    if (tmdbAPI.isEnabled()) {
      try {
        const tmdbData = await tmdbAPI.getStreamingAvailability(
          show.name,
          show.premiered,
          country
        )

        if (tmdbData && tmdbData.results[country]) {
          const countryData = tmdbData.results[country]

          // Add subscription services (Netflix, Disney+, etc.)
          if (countryData.flatrate) {
            for (const provider of countryData.flatrate) {
              const streamingOption = this.tmdbProviderToAvailability(
                provider,
                'subscription',
                countryData.link
              )
              if (streamingOption && !this.isDuplicate(availability, streamingOption)) {
                availability.push(streamingOption)
              }
            }
          }

          // Add free with ads services
          if (countryData.ads) {
            for (const provider of countryData.ads) {
              const streamingOption = this.tmdbProviderToAvailability(
                provider,
                'ads',
                countryData.link
              )
              if (streamingOption && !this.isDuplicate(availability, streamingOption)) {
                availability.push(streamingOption)
              }
            }
          }

          // Optionally add rent/buy options (commented out to focus on streaming)
          // if (countryData.rent) { ... }
          // if (countryData.buy) { ... }
        }
      } catch (error) {
        logger.error('[Streaming] Error fetching TMDB data:', error)
      }
    }

    logger.info(
      `[Streaming] Found ${availability.length} total streaming options for: ${show.name}`
    )

    return availability
  }

  /**
   * Check if a streaming option is already in the list (avoid duplicates)
   */
  private isDuplicate(
    list: StreamingAvailability[],
    option: StreamingAvailability
  ): boolean {
    return list.some((item) => item.service.id === option.service.id)
  }
}

// Export singleton instance
export const streamingService = new StreamingService()

// Export class for testing
export { StreamingService }
