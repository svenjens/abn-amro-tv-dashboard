<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Show } from '@/types'
import { STREAMING_PLATFORMS } from '@/types/streaming'

interface Filters {
  status: string
  network: string
  year: string
  streaming: string[]
}

interface Props {
  shows: Show[]
  modelValue?: Filters
  showStreamingFilter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ status: '', network: '', year: '', streaming: [] }),
  showStreamingFilter: false,
})

const emit = defineEmits<{
  'update:modelValue': [filters: Filters]
}>()

const { t } = useI18n()

const localFilters = ref<Filters>({
  status: props.modelValue.status || '',
  network: props.modelValue.network || '',
  year: props.modelValue.year || '',
  streaming: props.modelValue.streaming || [],
})
const isExpanded = ref(false)
const showStreamingDropdown = ref(false)
const streamingDropdownRef = ref<HTMLElement | null>(null)

// Check if desktop on mount and set expanded state accordingly
const checkIsDesktop = () => {
  isExpanded.value = window.innerWidth >= 768 // md breakpoint
}

onMounted(() => {
  checkIsDesktop()
  window.addEventListener('resize', checkIsDesktop)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsDesktop)
  document.removeEventListener('click', handleClickOutside)
})

// Toggle filters (only works on mobile)
function toggleFilters() {
  if (window.innerWidth < 768) {
    isExpanded.value = !isExpanded.value
  }
}

// Extract unique networks from shows
const availableNetworks = computed(() => {
  const networks = new Set<string>()
  if (!props.shows || props.shows.length === 0) {
    return []
  }
  props.shows.forEach((show) => {
    if (show.network?.name) {
      networks.add(show.network.name)
    }
    if (show.webChannel?.name) {
      networks.add(show.webChannel.name)
    }
  })
  return Array.from(networks).sort()
})

// Extract unique years from shows
const availableYears = computed(() => {
  const years = new Set<number>()
  if (!props.shows || props.shows.length === 0) {
    return []
  }
  props.shows.forEach((show) => {
    if (show.premiered) {
      const year = new Date(show.premiered).getFullYear()
      if (!isNaN(year)) {
        years.add(year)
      }
    }
  })
  return Array.from(years).sort((a, b) => b - a) // Newest first
})

// Extract unique streaming services from shows, or show all available platforms
const availableStreamingServices = computed(() => {
  const services = new Set<string>()

  // If we have shows, extract services from them
  if (props.shows && props.shows.length > 0) {
    props.shows.forEach((show) => {
      if (show.streamingAvailability) {
        show.streamingAvailability.forEach((option) => {
          const platform = STREAMING_PLATFORMS[option.service.id]
          if (platform) {
            services.add(platform.name)
          }
        })
      }
    })
  }

  // If no services found from shows, show all available platforms
  if (services.size === 0) {
    Object.values(STREAMING_PLATFORMS).forEach((platform) => {
      services.add(platform.name)
    })
  }

  return Array.from(services).sort()
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return !!(
    localFilters.value.status ||
    localFilters.value.network ||
    localFilters.value.year ||
    (props.showStreamingFilter && localFilters.value.streaming.length > 0)
  )
})

// Clear all filters
function clearFilters() {
  localFilters.value = { status: '', network: '', year: '', streaming: [] }
  showStreamingDropdown.value = false
  emitFilters()
}

// Emit filter changes
function emitFilters() {
  emit('update:modelValue', { ...localFilters.value })
}

// Clear individual filters
function clearStatus() {
  localFilters.value.status = ''
  emitFilters()
}

function clearNetwork() {
  localFilters.value.network = ''
  emitFilters()
}

function clearYear() {
  localFilters.value.year = ''
  emitFilters()
}

// Multi-select streaming functions
function toggleStreamingDropdown() {
  showStreamingDropdown.value = !showStreamingDropdown.value
}

function toggleStreamingService(service: string) {
  const index = localFilters.value.streaming.indexOf(service)
  if (index === -1) {
    localFilters.value.streaming.push(service)
  } else {
    localFilters.value.streaming.splice(index, 1)
  }
  emitFilters()
}

function removeStreamingService(service: string) {
  const index = localFilters.value.streaming.indexOf(service)
  if (index !== -1) {
    localFilters.value.streaming.splice(index, 1)
  }
  emitFilters()
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (streamingDropdownRef.value && !streamingDropdownRef.value.contains(target)) {
    showStreamingDropdown.value = false
  }
}

// Watch for external filter changes
watch(
  () => props.modelValue,
  (newValue) => {
    localFilters.value = {
      status: newValue.status || '',
      network: newValue.network || '',
      year: newValue.year || '',
      streaming: newValue.streaming || [],
    }
  },
  { deep: true }
)
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6"
  >
    <div class="flex items-center justify-between" :class="{ 'mb-4': isExpanded }">
      <button
        class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors md:pointer-events-none md:hover:text-gray-900 md:dark:hover:text-gray-100"
        @click="toggleFilters"
      >
        {{ t('filters.title') }}
        <Icon
          name="heroicons:chevron-down"
          class="h-4 w-4 transition-transform md:hidden"
          :class="{ 'rotate-180': isExpanded }"
        />
      </button>
      <button
        v-if="hasActiveFilters"
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        @click="clearFilters"
      >
        {{ t('filters.clearAll') }}
      </button>
    </div>

    <div
      v-show="isExpanded"
      class="grid grid-cols-1 gap-4"
      :class="showStreamingFilter ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'"
    >
      <!-- Status Filter -->
      <div>
        <label
          for="filter-status"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {{ t('filters.status') }}
        </label>
        <select
          id="filter-status"
          v-model="localFilters.status"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500"
          @change="emitFilters"
        >
          <option value="">{{ t('filters.allStatuses') }}</option>
          <option value="Running">{{ t('filters.running') }}</option>
          <option value="Ended">{{ t('filters.ended') }}</option>
          <option value="To Be Determined">{{ t('filters.toBeDetermined') }}</option>
          <option value="In Development">{{ t('filters.inDevelopment') }}</option>
        </select>
      </div>

      <!-- Network Filter -->
      <div>
        <label
          for="filter-network"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {{ t('filters.network') }}
        </label>
        <select
          id="filter-network"
          v-model="localFilters.network"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500"
          @change="emitFilters"
        >
          <option value="">{{ t('filters.allNetworks') }}</option>
          <option v-for="network in availableNetworks" :key="network" :value="network">
            {{ network }}
          </option>
        </select>
      </div>

      <!-- Year Filter -->
      <div>
        <label
          for="filter-year"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {{ t('filters.year') }}
        </label>
        <select
          id="filter-year"
          v-model="localFilters.year"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500"
          @change="emitFilters"
        >
          <option value="">{{ t('filters.allYears') }}</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Streaming Service Filter (Multi-select) -->
      <div v-if="showStreamingFilter" ref="streamingDropdownRef" class="relative">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('filters.streaming') }}
        </label>
        <button
          type="button"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm text-left focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 flex items-center justify-between"
          @click="toggleStreamingDropdown"
        >
          <span v-if="localFilters.streaming.length === 0" class="text-gray-500 dark:text-gray-400">
            {{ t('filters.allStreaming') }}
          </span>
          <span v-else class="truncate">
            {{ localFilters.streaming.length }} {{ t('filters.selected') }}
          </span>
          <Icon
            name="heroicons:chevron-down"
            class="h-4 w-4 transition-transform flex-shrink-0 ml-2"
            :class="{ 'rotate-180': showStreamingDropdown }"
          />
        </button>
        <div
          v-if="showStreamingDropdown"
          class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          <label
            v-for="service in availableStreamingServices"
            :key="service"
            class="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              :value="service"
              :checked="localFilters.streaming.includes(service)"
              class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-600 dark:focus:ring-primary-500"
              @change="toggleStreamingService(service)"
            />
            <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ service }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Active Filters Summary -->
    <div
      v-if="hasActiveFilters"
      v-show="isExpanded"
      class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
    >
      <span class="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
        {{ t('filters.active') }}:
      </span>
      <span
        v-if="localFilters.status"
        class="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded text-xs"
      >
        {{ t('filters.status') }}: {{ localFilters.status }}
        <button
          class="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          @click="clearStatus"
        >
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
      <span
        v-if="localFilters.network"
        class="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded text-xs"
      >
        {{ t('filters.network') }}: {{ localFilters.network }}
        <button
          class="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          @click="clearNetwork"
        >
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
      <span
        v-if="localFilters.year"
        class="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded text-xs"
      >
        {{ t('filters.year') }}: {{ localFilters.year }}
        <button
          class="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          @click="clearYear"
        >
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
      <span
        v-for="service in localFilters.streaming"
        v-if="showStreamingFilter"
        :key="service"
        class="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded text-xs"
      >
        {{ service }}
        <button
          class="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          @click="removeStreamingService(service)"
        >
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>
