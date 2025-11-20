<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const { t } = useI18n()

interface Props {
  modelValue: string
  placeholder?: string
  recentSearches?: string[]
  debounce?: number
  disableTypeAhead?: boolean // Disable automatic search on input (for Smart Search)
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search TV shows...',
  recentSearches: () => [],
  debounce: 300,
  disableTypeAhead: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  'clear-recent': []
  focus: []
}>()

const searchInput = ref<HTMLInputElement | null>(null)
const localQuery = ref(props.modelValue)
const showSuggestions = ref(false)

// Determine when to show recent searches dropdown
const showRecentSearches = computed(() => {
  return showSuggestions.value && props.recentSearches.length > 0 && !localQuery.value
})

// Focus method to be called from parent
function focus() {
  searchInput.value?.focus()
}

// Expose focus method
defineExpose({ focus })
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (newValue) => {
    localQuery.value = newValue
  }
)

function handleInput() {
  emit('update:modelValue', localQuery.value)

  // Skip type-ahead for Smart Search (user must press Enter)
  if (props.disableTypeAhead) {
    return
  }

  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  debounceTimeout = setTimeout(() => {
    handleSearch()
  }, props.debounce)
}

function handleSearch() {
  emit('search', localQuery.value)
  showSuggestions.value = false
}

function clearSearch() {
  localQuery.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}

function selectRecentSearch(search: string) {
  localQuery.value = search
  emit('update:modelValue', search)
  emit('search', search)
  showSuggestions.value = false
}

function handleFocus() {
  showSuggestions.value = true
  emit('focus')
}

// Close suggestions when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showSuggestions.value = false
  }
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: -10 }"
    :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: 200 } }"
    class="relative w-full max-w-2xl mx-auto"
  >
    <div class="relative">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-transform duration-200"
      >
        <Icon
          name="heroicons:magnifying-glass-20-solid"
          class="h-5 w-5 text-gray-400 transition-colors"
        />
      </div>
      <label for="tv-show-search" class="sr-only">{{ placeholder }}</label>
      <input
        id="tv-show-search"
        ref="searchInput"
        v-model="localQuery"
        type="text"
        class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 pl-10 pr-12 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:shadow-lg sm:text-sm transition-all duration-200"
        :placeholder="placeholder"
        :aria-label="placeholder"
        @input="handleInput"
        @keyup.enter="handleSearch"
        @focus="handleFocus"
      />
      <div v-if="localQuery" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button
          class="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          aria-label="Clear search"
          @click="clearSearch"
        >
          <Icon
            name="heroicons:x-mark"
            class="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          />
        </button>
      </div>
    </div>

    <!-- Recent Searches Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showRecentSearches"
        class="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div
          class="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
        >
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{
            t('search.recentSearches')
          }}</span>
          <button
            class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            @click="$emit('clear-recent')"
          >
            {{ t('search.clearRecent') }}
          </button>
        </div>
        <ul class="max-h-60 overflow-auto">
          <li
            v-for="(search, index) in recentSearches"
            :key="index"
            class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-all duration-150 hover:translate-x-1"
            @click="selectRecentSearch(search)"
          >
            <svg
              class="h-4 w-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ search }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
