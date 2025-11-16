<template>
  <div v-if="availability.length > 0" class="streaming-availability">
    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
      <span class="text-2xl">📺</span>
      {{ t('streaming.title') }}
    </h3>
    
    <div class="grid gap-3">
      <a
        v-for="option in availability"
        :key="option.service.id"
        :href="option.link"
        target="_blank"
        rel="noopener noreferrer"
        class="streaming-card group"
        :aria-label="`${t('streaming.watch_on')} ${option.service.name}`"
      >
        <div class="flex items-center gap-4">
          <!-- Service Logo/Icon -->
          <div 
            class="streaming-icon"
            :style="{ backgroundColor: getServiceColor(option.service.id) }"
          >
            <span class="text-2xl">{{ option.service.logo }}</span>
          </div>
          
          <!-- Service Info -->
          <div class="flex-1">
            <div class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ option.service.name }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span class="capitalize">{{ option.service.type }}</span>
              <span v-if="hasAffiliate(option.service.id)" class="affiliate-badge">
                {{ t('streaming.affiliate_note') }}
              </span>
            </div>
          </div>
          
          <!-- Arrow Icon -->
          <div class="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <!-- Price if available -->
        <div v-if="option.price" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ formatPrice(option.price, option.currency) }}
        </div>
      </a>
    </div>
    
    <!-- Disclaimer -->
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
      {{ t('streaming.disclaimer') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { StreamingAvailability } from '@/types'
import { STREAMING_PLATFORMS } from '@/types'

interface Props {
  availability: StreamingAvailability[]
}

defineProps<Props>()
const { t } = useI18n()

/**
 * Get the theme color for a streaming service
 */
const getServiceColor = (serviceId: string): string => {
  const platform = STREAMING_PLATFORMS[serviceId]
  return platform?.themeColorCode || '#6B7280'
}

/**
 * Check if a service has an affiliate program
 */
const hasAffiliate = (serviceId: string): boolean => {
  const platform = STREAMING_PLATFORMS[serviceId]
  return platform?.hasAffiliateProgram || false
}

/**
 * Format price with currency
 */
const formatPrice = (price: number, currency?: string): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '-'
  }
  const curr = currency || 'USD'
  const { locale } = useI18n()
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

.streaming-card {
  @apply block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 
         hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
}

.streaming-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center shadow-sm;
}

.affiliate-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
         bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400;
}
</style>

