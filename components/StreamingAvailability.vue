<template>
  <div class="streaming-availability">
    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
      <span class="text-2xl">📺</span>
      {{ t('streaming.title') }}
    </h3>

    <!-- Available Streaming Options -->
    <div v-if="availability.length > 0" class="streaming-scroll-container">
      <div class="streaming-horizontal-list">
        <a
          v-for="option in availability"
          :key="option.service.id"
          :href="option.link"
          target="_blank"
          rel="noopener noreferrer"
          class="streaming-card group"
          :aria-label="`${t('streaming.watch_on')} ${option.service.name}`"
          @click="handleStreamingClick($event, option.service, option.link)"
        >
          <!-- Service Logo/Icon -->
          <div
            class="streaming-icon"
            :style="{
              background: getServiceGradient(option.service.id),
            }"
          >
            <img
              v-if="getServiceLogo(option.service.id)"
              :src="getServiceLogo(option.service.id)"
              :alt="`${option.service.name} logo`"
              class="streaming-logo"
              @error="handleImageError"
            />
            <span v-else class="streaming-brand-text">
              {{ getServiceBrandName(option.service.id) }}
            </span>
          </div>

          <!-- Service Info -->
          <div class="mt-3 text-center">
            <div
              class="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              {{ option.service.name }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span class="capitalize">{{ option.service.type }}</span>
            </div>
            <div v-if="hasAffiliate(option.service.id)" class="affiliate-badge mt-1">
              {{ t('streaming.affiliate_note') }}
            </div>
          </div>

          <!-- Price if available -->
          <div
            v-if="option.price !== undefined && option.price !== null"
            class="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center"
          >
            {{ formatPrice(option.price, option.currency) }}
          </div>
        </a>
      </div>
    </div>

    <!-- Not Available State -->
    <div v-else class="not-available-state">
      <div class="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
        <Icon name="heroicons:information-circle" class="w-6 h-6" />
        <p class="text-sm">{{ t('streaming.not_available') }}</p>
      </div>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
        {{ t('streaming.check_later') }}
      </p>
    </div>

    <!-- Disclaimer -->
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
      {{ t('streaming.disclaimer') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StreamingAvailability } from '@/types'
import { STREAMING_PLATFORMS } from '@/types'
import { trackStreamingClick } from '@/utils'

interface Props {
  availability: StreamingAvailability[]
  showName?: string
}

const props = defineProps<Props>()
const { t, locale } = useI18n()

/**
 * Handle streaming link click and track event
 * Prevents default navigation to ensure tracking completes
 */
const handleStreamingClick = (
  event: MouseEvent,
  service: StreamingAvailability['service'],
  link: string
) => {
  // Allow default behavior for modified clicks (cmd/ctrl/middle-click/right-click)
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) {
    return
  }

  // Prevent default navigation for normal left clicks only
  event.preventDefault()

  const platform = service.name
  const showName = props.showName || 'Unknown'
  const isAffiliate = hasAffiliate(service.id)

  // Track the event
  trackStreamingClick(platform, showName, isAffiliate)

  // Use small delay to ensure tracking completes before navigation
  // This is more reliable than trying to await gtag which is fire-and-forget
  setTimeout(() => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }, 100)
}

/**
 * Get the theme color for a streaming service
 */
const getServiceColor = (serviceId: string): string => {
  const platform = STREAMING_PLATFORMS[serviceId]
  return platform?.themeColorCode || '#6B7280'
}

/**
 * Get logo path for a streaming service
 */
const getServiceLogo = (serviceId: string): string => {
  const platform = STREAMING_PLATFORMS[serviceId]
  return platform?.logo || ''
}

/**
 * Get gradient background for a streaming service
 */
const getServiceGradient = (serviceId: string): string => {
  const color = getServiceColor(serviceId)

  // Create a lighter and darker shade for gradient
  const gradients: Record<string, string> = {
    netflix: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
    prime: 'linear-gradient(135deg, #00A8E1 0%, #0779ff 100%)',
    disney: 'linear-gradient(135deg, #113CCF 0%, #0A2A8F 100%)',
    hbo: 'linear-gradient(135deg, #002BE7 0%, #001BA0 100%)',
    hulu: 'linear-gradient(135deg, #1CE783 0%, #16B864 100%)',
    apple: 'linear-gradient(135deg, #1d1d1f 0%, #000000 100%)',
    paramount: 'linear-gradient(135deg, #0064FF 0%, #0050CC 100%)',
    peacock: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    skyshowtime: 'linear-gradient(135deg, #5433FF 0%, #3D20CC 100%)',
    videoland: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
  }

  return gradients[serviceId] || `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
}

/**
 * Get brand name to display for a streaming service
 */
const getServiceBrandName = (serviceId: string): string => {
  const brandNames: Record<string, string> = {
    netflix: 'NETFLIX',
    prime: 'prime video',
    disney: 'Disney+',
    hbo: 'Max',
    hulu: 'hulu',
    apple: 'tv+',
    paramount: 'Paramount+',
    peacock: 'Peacock',
    skyshowtime: 'SkyShowtime',
    videoland: 'Videoland',
  }
  return brandNames[serviceId] || serviceId.toUpperCase()
}

/**
 * Check if a service has an affiliate program
 */
const hasAffiliate = (serviceId: string): boolean => {
  const platform = STREAMING_PLATFORMS[serviceId]
  return platform?.hasAffiliateProgram || false
}

/**
 * Handle image loading errors
 */
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  // Hide the image if it fails to load
  target.style.display = 'none'
}

/**
 * Format price with currency
 */
const formatPrice = (price: number, currency?: string): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '-'
  }
  const curr = currency || 'USD'
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: curr,
  }).format(price)
}
</script>

<style scoped>
.streaming-availability {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700;
}

.streaming-scroll-container {
  @apply -mx-2 px-2 overflow-x-auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(209 213 219) transparent;
}

.streaming-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.streaming-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.streaming-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 3px;
}

.dark .streaming-scroll-container {
  scrollbar-color: rgb(75 85 99) transparent;
}

.dark .streaming-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

.streaming-horizontal-list {
  @apply flex gap-4 pb-2;
  min-width: min-content;
}

.streaming-card {
  @apply flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 
         hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
         flex-shrink-0 w-32;
}

.streaming-icon {
  @apply w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 12px;
}

.streaming-logo {
  @apply w-full h-full object-contain;
  /* Make SVG logos white on colored backgrounds */
  filter: brightness(0) invert(1);
}

.streaming-brand-text {
  @apply text-white font-bold text-center px-1;
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.affiliate-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
         bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400;
}

.not-available-state {
  @apply py-8 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600;
}
</style>
