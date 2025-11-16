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
            @click="router.push({ name: 'home', params: { locale: route.params.locale || 'en' } })"
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

        <SearchBar
          ref="searchBarRef"
          v-model="searchQuery"
          :placeholder="t('search.searchByName')"
          :recent-searches="searchStore.recentSearches"
          @search="handleSearch"
          @clear-recent="searchStore.clearRecentSearches()"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Filters -->
      <FilterBar v-if="searchStore.hasResults" v-model="filters" :shows="searchStore.results" />

      <!-- Loading State -->
      <div v-if="searchStore.isSearching" class="flex justify-center py-12">
        <LoadingSpinner text="Searching..." />
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
            <ShowCard v-for="show in filteredResults" :key="show.id" :show="show" />
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
        <picture>
          <source
            type="image/webp"
            srcset="
              /optimized/empty-state-illustration-256.webp 256w,
              /optimized/empty-state-illustration.webp     512w
            "
            sizes="192px"
          />
          <img
            src="/optimized/empty-state-illustration.png"
            alt=""
            class="mx-auto h-48 w-48 object-contain opacity-50"
            aria-hidden="true"
          />
        </picture>
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
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSearchStore } from '@/stores'
import { useSEO } from '@/composables'
import SearchBar from '@/components/SearchBar.vue'
import ShowCard from '@/components/ShowCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import AdSense from '@/components/AdSense.vue'
import FilterBar from '@/components/FilterBar.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const searchQuery = ref('')
const filters = ref({ status: '', network: '', year: '' })

// Apply filters to search results
const filteredResults = computed(() => {
  let results = searchStore.results

  if (filters.value.status) {
    results = results.filter((show) => show.status === filters.value.status)
  }

  if (filters.value.network) {
    results = results.filter((show) => {
      const networkName = show.network?.name || show.webChannel?.name
      return networkName === filters.value.network
    })
  }

  if (filters.value.year) {
    results = results.filter((show) => {
      if (!show.premiered) return false
      const year = new Date(show.premiered).getFullYear()
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

  // Update URL query parameter
  if (query) {
    const locale = route.params.locale || 'en'
    router.push({ name: 'search', params: { locale }, query: { q: query } })
  }

  // Perform search
  await searchStore.search(query)
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
  if (typeof query === 'string' && query) {
    searchQuery.value = query
    searchStore.search(query)
  }

  // Auto-focus search bar when navigating from home page
  nextTick(() => {
    searchBarRef.value?.focus()
  })
})
</script>
