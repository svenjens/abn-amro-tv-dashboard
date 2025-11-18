<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {{ t('filters.title') }}
      </h2>
      <button
        v-if="hasActiveFilters"
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        @click="clearFilters"
      >
        {{ t('filters.clearAll') }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>

    <!-- Active Filters Summary -->
    <div
      v-if="hasActiveFilters"
      class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
    >
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('filters.active') }}:</span>
      <span
        v-if="localFilters.status"
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
      >
        {{ t('filters.status') }}: {{ localFilters.status }}
        <button @click="clearStatus">
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
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
      >
        {{ t('filters.network') }}: {{ localFilters.network }}
        <button @click="clearNetwork">
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
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
      >
        {{ t('filters.year') }}: {{ localFilters.year }}
        <button @click="clearYear">
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Show } from '@/types'

interface Filters {
  status: string
  network: string
  year: string
}

interface Props {
  shows: Show[]
  modelValue?: Filters
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ status: '', network: '', year: '' }),
})

const emit = defineEmits<{
  'update:modelValue': [filters: Filters]
}>()

const { t } = useI18n()

const localFilters = ref<Filters>({ ...props.modelValue })

// Extract unique networks from shows
const availableNetworks = computed(() => {
  const networks = new Set<string>()
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

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return !!(localFilters.value.status || localFilters.value.network || localFilters.value.year)
})

// Clear all filters
function clearFilters() {
  localFilters.value = { status: '', network: '', year: '' }
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

// Watch for external filter changes
watch(
  () => props.modelValue,
  (newValue) => {
    localFilters.value = { ...newValue }
  },
  { deep: true }
)
</script>
