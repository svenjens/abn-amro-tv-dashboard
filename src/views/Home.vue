<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Hero Section -->
    <div
      class="relative bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white overflow-hidden"
      role="banner"
    >
      <!-- Hero Background -->
      <picture class="absolute inset-0 opacity-10 dark:opacity-20" aria-hidden="true">
        <source
          type="image/webp"
          srcset="
            /optimized/hero-background-768.webp   768w,
            /optimized/hero-background-1280.webp 1280w,
            /optimized/hero-background.webp      1920w
          "
          sizes="100vw"
        />
        <img
          src="/optimized/hero-background.png"
          alt=""
          class="w-full h-full object-cover"
          aria-hidden="true"
        />
      </picture>

      <div class="relative max-w-7xl mx-auto px-4 py-12">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-4">
            <!-- Logo (hidden on mobile) -->
            <picture class="hidden md:block">
              <source
                type="image/webp"
                srcset="
                  /optimized/logo-main-64.webp   64w,
                  /optimized/logo-main-128.webp 128w,
                  /optimized/logo-main-256.webp 256w
                "
                sizes="64px"
              />
              <img
                src="/optimized/logo-main.png"
                alt="BingeList Logo"
                class="h-16 w-16 object-contain"
              />
            </picture>
            <div>
              <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('home.title') }}</h1>
              <p class="text-lg md:text-xl text-primary-100 mb-8">
                {{ t('home.subtitle') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Watchlist Link -->
            <router-link
              :to="{ name: 'watchlist', params: { locale: route.params.locale || 'en' } }"
              class="relative inline-flex items-center gap-2 text-white hover:text-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded-lg px-3 py-2"
              :aria-label="t('watchlist.title')"
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
              >
                {{ watchlistStore.watchlistCount }}
              </span>
            </router-link>

            <!-- Dark Mode Toggle -->
            <DarkModeToggle variant="header" />

            <LanguageSwitcher />
          </div>
        </div>

        <SearchBar
          v-model="searchQuery"
          :placeholder="t('home.searchPlaceholder')"
          :recent-searches="searchStore.recentSearches"
          @search="handleSearch"
          @clear-recent="searchStore.clearRecentSearches()"
          @focus="handleSearchFocus"
        />
      </div>
    </div>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto py-8 overflow-visible" tabindex="-1">
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
      <div v-else-if="showsStore.genres.length > 0" role="region" :aria-label="t('home.title')">
        <div class="px-4 md:px-0 mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            {{
              t('home.showsCount', {
                count: showsStore.showsCount,
                genres: showsStore.genres.length,
              })
            }}
          </p>
        </div>

        <GenreRow
          v-for="genre in displayedGenres"
          :key="genre"
          :genre="genre"
          :shows="showsStore.getShowsByGenre(genre)"
        />

        <!-- Infinite Scroll Trigger -->
        <div
          v-if="canLoadMore"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
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
        <h3 class="mt-6 text-lg font-medium text-gray-900 dark:text-gray-100">
          {{ t('home.noShows') }}
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t('home.noShowsMessage') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useShowsStore, useSearchStore, useWatchlistStore } from '@/stores'
import { useSEO } from '@/composables'
import GenreRow from '@/components/GenreRow.vue'
import SearchBar from '@/components/SearchBar.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import SkipToContent from '@/components/SkipToContent.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const showsStore = useShowsStore()
const searchStore = useSearchStore()
const watchlistStore = useWatchlistStore()
const searchQuery = ref('')

// Performance: Lazy load genres with infinite scroll
const genresPerPage = 5
const visibleGenresCount = ref(genresPerPage)
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const displayedGenres = computed(() => {
  return showsStore.genres.slice(0, visibleGenresCount.value)
})

const canLoadMore = computed(() => {
  return visibleGenresCount.value < showsStore.genres.length
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
    const locale = route.params.locale || 'en'
    router.push({ name: 'search', params: { locale }, query: { q: query } })
  }
}

function handleSearchFocus() {
  const locale = route.params.locale || 'en'
  router.push({ name: 'search', params: { locale } })
}

onMounted(async () => {
  await showsStore.fetchAllShows()
  // Setup infinite scroll after genres are loaded
  setTimeout(() => setupInfiniteScroll(), 100)
})
</script>
