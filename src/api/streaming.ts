/**
 * Streaming Availability Service
 *
 * Provides methods to fetch streaming availability data
 * This uses TVMaze's web channel data and can be extended with
 * third-party streaming APIs like Watchmode or Streaming Availability API
 */

import type { StreamingAvailability, AffiliateConfig } from '@/types'
import { logger } from '@/utils'

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
}

// Export singleton instance
export const streamingService = new StreamingService()

// Export class for testing
export { StreamingService }
