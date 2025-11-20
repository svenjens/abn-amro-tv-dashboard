<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useSearchStore } from '@/stores'
import { useSEO } from '@/composables'
import SearchHeader from '@/components/SearchHeader.vue'
import SearchResults from '@/components/SearchResults.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SearchModeToggle from '@/components/SearchModeToggle.vue'
import SearchModeInfo from '@/components/SearchModeInfo.vue'
import ExampleQueries from '@/components/ExampleQueries.vue'
import EmptyState from '@/components/EmptyState.vue'
import SkipToContent from '@/components/SkipToContent.client.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const searchStore = useSearchStore()

const searchHeaderRef = ref<InstanceType<typeof SearchHeader> | null>(null)
const searchQuery = ref('')
const isSemanticMode = ref(false)

// Example queries for semantic search (from i18n)
const exampleQueries = computed(() => {
  const queries = t('search.exampleQueries', { returnObjects: true })
  return Array.isArray(queries) ? queries : []
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
    await searchStore.semanticSearch(query)
  } else {
    // Regular keyword search
    searchStore.semanticIntent = null
    await searchStore.search(query)

    // Enrich results with streaming data (runs in background)
    if (searchStore.hasResults) {
      searchStore.enrichWithStreamingData()
    }
  }
}

// Watch for URL query parameter changes
watch(
  () => route.query.q,
  (newQuery) => {
    if (typeof newQuery === 'string' && newQuery !== searchQuery.value) {
      searchQuery.value = newQuery
      // We default to regular search when URL changes without explicit mode toggle,
      // but handleSearch handles the logic based on isSemanticMode which is set in onMounted/watch
      // Wait, if URL changes, we just call searchStore.search?
      // The original code did:
      /*
      searchQuery.value = newQuery
      searchStore.search(newQuery)
      */
      searchStore.search(newQuery)
      // Also enrich?
      if (searchStore.hasResults) {
        searchStore.enrichWithStreamingData()
      }
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
      searchStore.semanticSearch(query)
    } else {
      searchStore.search(query)
      if (searchStore.hasResults) {
        searchStore.enrichWithStreamingData()
      }
    }
  }

  // Auto-focus search bar when navigating from home page
  nextTick(() => {
    searchHeaderRef.value?.focus()
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <SearchHeader ref="searchHeaderRef" v-model="searchQuery" @search="handleSearch" />

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 py-8" tabindex="-1">
      <div class="mb-6">
        <SearchModeToggle v-model="isSemanticMode" class="mb-3" />
        <SearchModeInfo :is-semantic-mode="isSemanticMode" class="mb-4" />
      </div>

      <div v-if="searchStore.isSearching" class="text-center py-16">
        <LoadingSpinner :text="t('status.searching')" :full-screen="false" />
      </div>

      <SearchResults
        v-else-if="searchStore.hasResults"
        :search-query="searchQuery"
        :is-semantic-mode="isSemanticMode"
        :semantic-intent="searchStore.semanticIntent"
      />

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
        class="mt-8"
        :examples="exampleQueries"
        :has-query="!!searchQuery"
        @select="
          (example) => {
            searchQuery = example
            handleSearch(example)
          }
        "
      />
    </main>
  </div>
</template>
