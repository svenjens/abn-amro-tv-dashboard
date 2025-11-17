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
        <div class="flex items-center gap-3 mb-3">
          <button
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              !isSemanticMode
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
            ]"
            @click="isSemanticMode = false"
          >
            {{ t('search.regular') }}
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
              isSemanticMode
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
            ]"
            @click="isSemanticMode = true"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            {{ t('search.smart') }}
          </button>
        </div>

        <!-- Info Bar explaining search modes -->
        <Transition name="fade" mode="out-in">
          <div
            :key="isSemanticMode ? 'smart' : 'regular'"
            class="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <div class="flex items-start gap-2">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="text-sm text-blue-800 dark:text-blue-200">
                <span v-if="!isSemanticMode">
                  {{ t('search.regularInfo') }}
                </span>
                <span v-else>
                  {{ t('search.smartInfo') }}
                  <strong class="font-semibold">{{ t('search.smartInfoAction') }}</strong>
                </span>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Search Bar with Submit Button -->
        <div class="flex gap-2">
          <div class="flex-1">
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
            class="hidden sm:flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div
        v-if="
          isSemanticMode && (!searchQuery || !searchStore.hasResults) && !searchStore.isSearching
        "
        class="mb-8"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ searchQuery ? t('search.orTryAsking') : t('search.tryAsking') }}
        </h3>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="example in exampleQueries"
            :key="example"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
            @click="
              () => {
                searchQuery = example
                handleSearch(example)
              }
            "
          >
            {{ example }}
          </button>
        </div>
      </div>

      <!-- Semantic Intent Display -->
      <div
        v-if="semanticIntent && !semanticIntent.fallback"
        class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div class="flex items-start gap-3">
          <svg
            class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              {{ t('search.searchingFor') }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="genre in semanticIntent.genres"
                v-if="semanticIntent.genres"
                :key="genre"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
              >
                {{ genre }}
              </span>
              <span
                v-for="mood in semanticIntent.mood"
                v-if="semanticIntent.mood"
                :key="mood"
                class="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-xs font-medium"
              >
                {{ mood }}
              </span>
              <span
                v-if="semanticIntent.similar"
                class="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-medium"
              >
                {{ t('search.similarTo', { show: semanticIntent.similar }) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <FilterBar v-if="searchStore.hasResults" v-model="filters" :shows="searchStore.results" />

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
              v-for="result in filteredResults"
              :key="result.show.id"
              :show="result.show"
              :match-reason="isSemanticMode ? result.matchedTerm : undefined"
            />
          </div>

          <!-- Advertisement -->
          <AdSense format="horizontal" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <svg
            class="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No shows found</h3>
          <p class="mt-2 text-gray-500">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-16">
        <NuxtImg
          src="/optimized/empty-state-illustration.png"
          alt=""
          class="mx-auto h-48 w-48 object-contain opacity-50"
          aria-hidden="true"
          width="192"
          height="192"
          loading="lazy"
        />
        <h3 class="mt-6 text-lg font-medium text-gray-900">Start searching</h3>
        <p class="mt-2 text-gray-500">
          Enter a TV show name to search through our extensive database.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useSearchStore } from '@/stores'
import { useSEO } from '@/composables'
import SearchBar from '@/components/SearchBar.client.vue'
import ShowCard from '@/components/ShowCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import AdSense from '@/components/AdSense.vue'
import FilterBar from '@/components/FilterBar.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const searchStore = useSearchStore()

const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const searchQuery = ref('')
const filters = ref({ status: '', network: '', year: '' })
const isSemanticMode = ref(false)
const semanticIntent = ref<any>(null)
const isSemanticLoading = ref(false)

// Example queries for semantic search
const exampleQueries = [
  'dark sci-fi shows like Black Mirror',
  'funny workplace comedies',
  'mystery series with strong female leads',
  'intense crime dramas',
  'feel-good family shows',
]

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
  } catch (error) {
    console.error('Semantic search failed:', error)
    // Fallback to regular search
    semanticIntent.value = null
    await searchStore.search(query)
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
/* Fade transition for info bar when switching modes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
