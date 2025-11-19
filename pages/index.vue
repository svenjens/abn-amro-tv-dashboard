<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Hero Section -->
    <header
      class="relative bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white overflow-hidden"
    >
      <!-- Hero Background -->
      <picture>
        <source
          media="(min-width: 1280px)"
          srcset="/optimized/hero-background.webp"
          type="image/webp"
        />
        <source
          media="(min-width: 768px)"
          srcset="/optimized/hero-background-1280.webp"
          type="image/webp"
        />
        <source srcset="/optimized/hero-background-768.webp" type="image/webp" />
        <img
          src="/optimized/hero-background.png"
          alt=""
          class="absolute inset-0 opacity-10 dark:opacity-20 w-full h-full object-cover"
          aria-hidden="true"
          loading="eager"
          fetchpriority="high"
        />
      </picture>

      <div class="relative max-w-7xl mx-auto px-4 py-12">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-4">
            <!-- Logo (hidden on mobile, clickable to home) -->
            <NuxtLink
              :to="localePath('/')"
              class="hidden md:block focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded-lg"
              :aria-label="t('navigation.home')"
            >
              <img
                src="/optimized/logo-main.png"
                alt="BingeList Logo"
                class="h-16 w-16 object-contain hover:scale-105 transition-transform"
                width="64"
                height="64"
                loading="eager"
                fetchpriority="high"
              />
            </NuxtLink>
            <div>
              <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('home.title') }}</h1>
              <p class="text-lg md:text-xl text-white/90 mb-8">
                {{ t('home.subtitle') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Watchlist Link -->
            <NuxtLink
              :to="localePath('/watchlist')"
              class="relative inline-flex items-center gap-2 text-white hover:text-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded-lg px-3 py-2"
              :aria-label="t('watchlist.title')"
              data-testid="watchlist-link"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 3H19C20.1046 3 21 3.89543 21 5V21L12 17L3 21V5C3 3.89543 3.89543 3 5 3Z"
                />
              </svg>
              <span class="hidden md:inline">{{ t('watchlist.title') }}</span>
              <span
                v-if="watchlistStore.hasShows"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                data-testid="watchlist-count"
              >
                {{ watchlistStore.watchlistCount }}
              </span>
            </NuxtLink>

            <!-- Dark Mode Toggle -->
            <DarkModeToggle variant="header" />

            <LanguageSwitcher />
          </div>
        </div>

        <SearchBar
          v-model="searchQuery"
          :placeholder="t('home.searchPlaceholder')"
          :recent-searches="searchStore.recentSearches"
          data-testid="search-bar"
          @search="handleSearch"
          @clear-recent="searchStore.clearRecentSearches()"
          @focus="handleSearchFocus"
        />
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto py-8 overflow-visible" tabindex="-1">
      <!-- Filters -->
      <div class="px-4 md:px-0">
        <FilterBar
          v-if="!showsStore.isLoading && showsStore.showsCount > 0"
          v-model="filters"
          :shows="showsStore.allShows"
        />
      </div>

      <!-- Loading State -->
      <LoadingSpinner
        v-if="showsStore.isLoading"
        :text="t('status.loadingShows')"
        :full-screen="true"
      />

      <!-- Error State -->
      <ErrorMessage
        v-else-if="showsStore.hasError"
        :message="showsStore.error?.message || t('status.error')"
        :retry="true"
        :full-screen="true"
        @retry="showsStore.fetchAllShows()"
      />

      <!-- Genre Rows -->
      <div v-else-if="filteredGenres.length > 0" role="region" :aria-label="t('home.title')">
        <div class="px-4 md:px-0 mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            {{
              t('home.showsCount', {
                count: filteredShows.length,
                genres: filteredGenres.length,
              })
            }}
          </p>
        </div>

        <GenreRow
          v-for="(genreData, index) in displayedGenres"
          :key="genreData.name"
          :genre="genreData.name"
          :shows="genreData.shows"
          :priority="index === 0"
        />

        <!-- Infinite Scroll Trigger -->
        <div
          v-show="canLoadMore"
          ref="loadMoreTrigger"
          class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm"
        >
          <div class="flex items-center justify-center gap-2">
            <svg
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{{ t('home.loadingMore') }}...</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-4" role="status">
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
        <h2 class="mt-6 text-lg font-medium text-gray-900 dark:text-gray-100">
          {{ t('home.noShows') }}
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t('home.noShowsMessage') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useShowsStore, useSearchStore, useWatchlistStore } from '@/stores'
import { useSEO } from '@/composables'
import GenreRow from '@/components/GenreRow.vue'
import SearchBar from '@/components/SearchBar.client.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import SkipToContent from '@/components/SkipToContent.client.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FilterBar from '@/components/FilterBar.vue'
import type { Show } from '@/types'

const { t } = useI18n()
const localePath = useLocalePath()
const showsStore = useShowsStore()
const searchStore = useSearchStore()
const watchlistStore = useWatchlistStore()
const searchQuery = ref('')

// Filters
const filters = ref({
  status: '',
  network: '',
  year: '',
  streaming: [] as string[],
})

// Filter shows based on selected filters
const filteredShows = computed(() => {
  let shows = showsStore.allShows

  if (filters.value.status) {
    shows = shows.filter((show: Show) => show.status === filters.value.status)
  }

  if (filters.value.network) {
    shows = shows.filter(
      (show: Show) =>
        show.network?.name === filters.value.network ||
        show.webChannel?.name === filters.value.network
    )
  }

  if (filters.value.year) {
    const year = parseInt(filters.value.year)
    shows = shows.filter((show: Show) => {
      if (!show.premiered) return false
      const showYear = new Date(show.premiered).getFullYear()
      return showYear === year
    })
  }

  return shows
})

// Get genres from store's pre-sorted showsByGenre (server-side sorted by rating)
const filteredGenres = computed(() => {
  // Use pre-sorted showsByGenre from store (already sorted by rating on server)
  const serverSortedGenres = showsStore.showsByGenre

  // If filters are applied, filter the shows within each genre
  if (filters.value.status || filters.value.network || filters.value.year) {
    const genreMap = new Map<string, Show[]>()

    filteredShows.value.forEach((show: Show) => {
      if (show.genres && show.genres.length > 0) {
        show.genres.forEach((genre: string) => {
          if (!genreMap.has(genre)) {
            genreMap.set(genre, [])
          }
          genreMap.get(genre)!.push(show)
        })
      }
    })

    // Sort by genre size (number of shows per genre)
    return Array.from(genreMap.entries())
      .map(([genre, shows]) => ({
        name: genre,
        shows: shows, // These are filtered but preserve original order
      }))
      .sort((a, b) => b.shows.length - a.shows.length)
  }

  // No filters: use server-sorted data (already sorted by rating within each genre)
  return Object.entries(serverSortedGenres)
    .map(([genre, shows]) => ({
      name: genre,
      shows: shows,
    }))
    .sort((a, b) => b.shows.length - a.shows.length) // Sort genres by size
})

// Performance: Lazy load genres with infinite scroll
const genresPerPage = 5
const visibleGenresCount = ref(genresPerPage)
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const displayedGenres = computed(() => {
  return filteredGenres.value.slice(0, visibleGenresCount.value)
})

const canLoadMore = computed(() => {
  return visibleGenresCount.value < filteredGenres.value.length
})

// Setup intersection observer for infinite scroll
function setupInfiniteScroll() {
  if (!loadMoreTrigger.value) return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && canLoadMore.value) {
        // Load more genres when trigger comes into view
        visibleGenresCount.value += genresPerPage
      }
    },
    {
      root: null,
      rootMargin: '100px', // Start loading 100px before the trigger
      threshold: 0.1,
    }
  )

  observer.observe(loadMoreTrigger.value)
}

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value)
    observer.disconnect()
  }
})

// SEO (multilingual)
useSEO({
  title: t('seo.home.title'),
  description: t('seo.home.description'),
  keywords: t('seo.home.keywords').split(', '),
})

function handleSearch(query: string) {
  if (query.trim()) {
    navigateTo(localePath(`/search?q=${encodeURIComponent(query)}`))
  }
}

function handleSearchFocus() {
  // If user has already typed something, preserve it when navigating to search page
  if (searchQuery.value.trim()) {
    navigateTo(localePath(`/search?q=${encodeURIComponent(searchQuery.value)}`))
  } else {
    navigateTo(localePath('/search'))
  }
}

// Reset visible genres count when filters change
watch(
  filters,
  () => {
    visibleGenresCount.value = genresPerPage
  },
  { deep: true }
)

// Server-side data fetching - runs on server during SSR
const { data: showsData } = await useAsyncData(
  'all-shows',
  () => $fetch<{ shows: Show[]; showsByGenre: Record<string, Show[]> }>('/api/shows'),
  {
    dedupe: 'defer', // Dedupe requests during SSR
  }
)

// Populate store with server-fetched data (including pre-sorted genres)
if (showsData.value) {
  showsStore.setShowsWithGenres(showsData.value.shows, showsData.value.showsByGenre)
}

onMounted(() => {
  // Setup infinite scroll after genres are loaded
  setTimeout(() => setupInfiniteScroll(), 100)
})
</script>
