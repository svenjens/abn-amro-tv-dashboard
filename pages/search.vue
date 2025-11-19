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
import BackButton from '@/components/BackButton.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import EmptyState from '@/components/EmptyState.vue'

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

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <header
      class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-4">
          <BackButton />
          <div class="flex items-center gap-3">
            <DarkModeToggle variant="header" />
            <LanguageSwitcher />
          </div>
        </div>

        <SearchBar
          ref="searchBarRef"
          v-model="searchQuery"
          :placeholder="t('search.placeholder')"
          :recent-searches="searchStore.recentSearches"
          data-testid="search-bar"
          @search="handleSearch"
          @clear-recent="searchStore.clearRecentSearches()"
        />
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 py-8" tabindex="-1">
      <div class="mb-6">
        <SearchModeToggle v-model="isSemanticMode" class="mb-3" />
        <SearchModeInfo :is-semantic-mode="isSemanticMode" class="mb-4" />
      </div>

      <div v-if="searchStore.isSearching || isSemanticLoading" class="text-center py-16">
        <LoadingSpinner :text="t('status.searching')" :full-screen="false" />
      </div>

      <div v-else-if="searchStore.hasResults">
        <SemanticIntentDisplay
          v-if="isSemanticMode"
          :intent="semanticIntent"
          :search-query="searchQuery"
          class="mb-6"
        />

        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ t('search.resultsTitle', { query: searchQuery }) }}
        </h2>

        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr"
        >
          <ShowCard
            v-for="result in searchStore.results"
            :key="result.show.id"
            :show="result.show"
            :match-reason="result.matchedTerm"
          />
        </div>
      </div>

      <!-- Initial State -->
      <EmptyState
        v-else
        :title="t('search.initialStateTitle')"
        :message="t('search.initialStateHint')"
      />

      <!-- Example Queries (in semantic mode when no search performed) -->
      <ExampleQueries
        v-if="
          isSemanticMode && (!searchQuery || !searchStore.hasResults) && !searchStore.isSearching
        "
        :examples="exampleQueries"
        :has-query="!!searchQuery"
        @select="
          (example) => {
            searchQuery = example
            handleSearch(example)
          }
        "
        class="mt-8"
      />
    </main>
  </div>
</template>

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
