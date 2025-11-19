<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Search Header -->
    <div
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center gap-4 mb-4">
          <button
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Go back"
            @click="navigateTo(localePath('/'))"
          >
            <svg
              class="h-6 w-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ t('search.title') }}
          </h1>
        </div>

        <!-- Search Mode Toggle -->
        <SearchModeToggle v-model="isSemanticMode" class="mb-3" />

        <!-- Info Bar explaining search modes -->
        <SearchModeInfo :is-semantic-mode="isSemanticMode" class="mb-4" />

        <!-- Search Bar with Submit Button -->
        <div class="flex gap-0">
          <div class="flex-1 search-input-wrapper">
            <SearchBar
              ref="searchBarRef"
              v-model="searchQuery"
              :placeholder="
                isSemanticMode ? t('search.semanticPlaceholder') : t('search.searchByName')
              "
              :recent-searches="searchStore.recentSearches"
              :disable-type-ahead="isSemanticMode"
              @search="handleSearch"
              @clear-recent="searchStore.clearRecentSearches()"
            />
          </div>
          <button
            class="hidden sm:flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border-l-0"
            :disabled="!searchQuery.trim() || searchQuery.trim().length < 2"
            @click="handleSearch(searchQuery)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Example Queries (in semantic mode when no search performed) -->
      <ExampleQueries
        v-if="
          isSemanticMode && (!searchQuery || !searchStore.hasResults) && !searchStore.isSearching
        "
        :examples="exampleQueries"
        :has-query="!!searchQuery"
        class="mb-8"
        @select="
          (query) => {
            searchQuery = query
            handleSearch(query)
          }
        "
      />

      <!-- Semantic Intent Display -->
      <SemanticIntentDisplay :intent="semanticIntent" class="mb-6" />

      <!-- Filters -->
      <FilterBar
        v-model="filters"
        :shows="searchStore.results"
        :show-streaming-filter="hasStreamingData"
      />

      <!-- Loading State -->
      <div v-if="searchStore.isSearching || isSemanticLoading" class="flex justify-center py-12">
        <LoadingSpinner :text="isSemanticMode ? t('search.aiSearching') : t('search.searching')" />
      </div>

      <!-- Error State -->
      <ErrorMessage
        v-else-if="searchStore.hasError"
        :message="searchStore.error?.message || 'Search failed'"
        :retry="true"
        @retry="handleSearch(searchQuery)"
      />

      <!-- Results -->
      <div v-else-if="searchQuery">
        <!-- Results Header -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            <span v-if="filteredResults.length > 0">
              {{
                t(
                  'search.resultsFor',
                  { count: filteredResults.length, query: searchQuery },
                  filteredResults.length
                )
              }}
            </span>
            <span v-else-if="searchStore.hasResults && filteredResults.length === 0">
              {{ t('filters.noResults') }}
            </span>
            <span v-else>
              {{ t('search.noResults', { query: searchQuery }) }}
            </span>
          </h2>
        </div>

        <!-- Results Grid -->
        <div v-if="filteredResults.length > 0">
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr mb-8"
          >
            <ShowCard
              v-for="(result, index) in filteredResults"
              :key="result.show.id"
              :show="result.show"
              :match-reason="isSemanticMode ? result.matchedTerm : undefined"
              :lazy="index >= 10"
            />
          </div>

          <!-- Advertisement -->
          <AdSense format="horizontal" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <Icon
            name="heroicons:magnifying-glass"
            class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
          />
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ t('search.noResultsTitle') }}
          </h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            {{ t('search.noResultsHint') }}
          </p>
        </div>
      </div>

      <!-- Initial State -->
      <EmptyState
        v-else
        :title="t('search.initialStateTitle')"
        :message="t('search.initialStateHint')"
        heading-level="h3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useSearchStore } from '@/stores'
import { useSEO } from '@/composables'
import { STREAMING_PLATFORMS } from '@/types/streaming'
import SearchBar from '@/components/SearchBar.client.vue'
import ShowCard from '@/components/ShowCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import AdSense from '@/components/AdSense.vue'
import FilterBar from '@/components/FilterBar.vue'
import SearchModeToggle from '@/components/SearchModeToggle.vue'
import SearchModeInfo from '@/components/SearchModeInfo.vue'
import ExampleQueries from '@/components/ExampleQueries.vue'
import SemanticIntentDisplay from '@/components/SemanticIntentDisplay.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const searchStore = useSearchStore()

const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const searchQuery = ref('')
const filters = ref({ status: '', network: '', year: '', streaming: [] as string[] })
const isSemanticMode = ref(false)
const semanticIntent = ref<any>(null)
const isSemanticLoading = ref(false)

// Example queries for semantic search (from i18n)
const exampleQueries = computed(() => {
  const queries = t('search.exampleQueries', { returnObjects: true })
  return Array.isArray(queries) ? queries : []
})

// Check if any search results have streaming data or if we're loading it
const hasStreamingData = computed(() => {
  return (
    searchStore.loadingStreamingData ||
    searchStore.fullResults.some((result) => result.show.streamingAvailability)
  )
})

// Apply filters to search results
const filteredResults = computed(() => {
  let results = searchStore.fullResults

  if (filters.value.status) {
    results = results.filter((result) => result.show.status === filters.value.status)
  }

  if (filters.value.network) {
    results = results.filter((result) => {
      const networkName = result.show.network?.name || result.show.webChannel?.name
      return networkName === filters.value.network
    })
  }

  if (filters.value.year) {
    results = results.filter((result) => {
      if (!result.show.premiered) return false
      const year = new Date(result.show.premiered).getFullYear()
      return year.toString() === filters.value.year
    })
  }

  if (filters.value.streaming.length > 0) {
    results = results.filter((result) => {
      if (!result.show.streamingAvailability) return false
      return result.show.streamingAvailability.some((option) => {
        const platform = STREAMING_PLATFORMS[option.service.id]
        return platform?.name && filters.value.streaming.includes(platform.name)
      })
    })
  }

  return results
})

// SEO (multilingual)
useSEO({
  title: t('seo.search.title'),
  description: t('seo.search.description'),
  keywords: t('seo.search.keywords').split(', '),
})

async function handleSearch(query: string) {
  searchQuery.value = query

  // Validate minimum query length (at least 2 characters)
  if (!query || query.trim().length < 2) {
    return // Don't search with queries shorter than 2 characters
  }

  // Update URL query parameter
  if (query) {
    navigateTo(
      localePath(
        `/search?q=${encodeURIComponent(query)}&mode=${isSemanticMode.value ? 'smart' : 'regular'}`
      )
    )
  }

  if (isSemanticMode.value) {
    // AI-powered semantic search
    await handleSemanticSearch(query)
  } else {
    // Regular keyword search
    semanticIntent.value = null
    await searchStore.search(query)
  }

  // Enrich results with streaming data (runs in background)
  if (searchStore.hasResults) {
    searchStore.enrichWithStreamingData()
  }
}

async function handleSemanticSearch(query: string) {
  isSemanticLoading.value = true
  semanticIntent.value = null

  try {
    const response = await $fetch<{ results: any[]; intent: any }>('/api/search/semantic', {
      method: 'POST',
      body: { query },
    })

    // Store intent for display
    semanticIntent.value = response.intent

    // Update search store with results (including matchedTerm for each result)
    const searchResults = response.results.map((r: any) => ({
      show: r.show,
      score: r.score,
      matchedTerm: r.matchedTerm,
    }))
    searchStore.setResults(searchResults)

    // Enrich results with streaming data (runs in background)
    if (searchStore.hasResults) {
      searchStore.enrichWithStreamingData()
    }
  } catch (error) {
    console.error('Semantic search failed:', error)
    // Fallback to regular search
    semanticIntent.value = null
    await searchStore.search(query)

    // Enrich fallback results with streaming data
    if (searchStore.hasResults) {
      searchStore.enrichWithStreamingData()
    }
  } finally {
    isSemanticLoading.value = false
  }
}

// Watch for URL query parameter changes
watch(
  () => route.query.q,
  (newQuery) => {
    if (typeof newQuery === 'string' && newQuery !== searchQuery.value) {
      searchQuery.value = newQuery
      searchStore.search(newQuery)
    }
  }
)

onMounted(() => {
  // Load search from URL query parameter
  const query = route.query.q
  const mode = route.query.mode

  // Set search mode from URL parameter
  if (mode === 'smart') {
    isSemanticMode.value = true
  } else {
    isSemanticMode.value = false
  }

  if (typeof query === 'string' && query) {
    searchQuery.value = query
    // Trigger search with the appropriate mode
    if (isSemanticMode.value) {
      handleSemanticSearch(query)
    } else {
      searchStore.search(query)
    }
  }

  // Auto-focus search bar when navigating from home page
  nextTick(() => {
    searchBarRef.value?.focus()
  })
})
</script>

<style scoped>
/* Make search input connect seamlessly with button on desktop */
@media (min-width: 640px) {
  .search-input-wrapper :deep(input) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  /* Ensure SearchBar takes full width */
  .search-input-wrapper :deep(.relative) {
    max-width: none;
  }
}
</style>
