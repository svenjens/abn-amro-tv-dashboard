<template>
  <div class="min-h-screen bg-gray-50">
    <SkipToContent />

    <!-- Hero Section -->
    <div
      class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden"
      role="banner"
    >
      <!-- Hero Background -->
      <div
        class="absolute inset-0 opacity-10 bg-cover bg-center"
        :style="{ backgroundImage: 'url(/optimized/hero-background.webp)' }"
        aria-hidden="true"
      ></div>

      <div class="relative max-w-7xl mx-auto px-4 py-12">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-4">
            <!-- Logo -->
            <picture>
              <source srcset="/optimized/logo-main.webp" type="image/webp" />
              <img
                src="/optimized/logo-main.png"
                alt="TV Show Dashboard Logo"
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
          <LanguageSwitcher />
        </div>

        <SearchBar
          v-model="searchQuery"
          :placeholder="t('home.searchPlaceholder')"
          :recent-searches="searchStore.recentSearches"
          @search="handleSearch"
          @clear-recent="searchStore.clearRecentSearches()"
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
          <p class="text-gray-600">
            {{
              t('home.showsCount', {
                count: showsStore.showsCount,
                genres: showsStore.genres.length,
              })
            }}
          </p>
        </div>

        <GenreRow
          v-for="genre in showsStore.genres"
          :key="genre"
          :genre="genre"
          :shows="showsStore.getShowsByGenre(genre)"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-4" role="status">
        <picture>
          <source srcset="/optimized/empty-state-illustration.webp" type="image/webp" />
          <img
            src="/optimized/empty-state-illustration.png"
            alt=""
            class="mx-auto h-48 w-48 object-contain opacity-50"
            aria-hidden="true"
          />
        </picture>
        <h3 class="mt-6 text-lg font-medium text-gray-900">{{ t('home.noShows') }}</h3>
        <p class="mt-2 text-sm text-gray-500">{{ t('home.noShowsMessage') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useShowsStore } from '@/stores'
import { useSearchStore } from '@/stores'
import { useSEO } from '@/composables'
import GenreRow from '@/components/GenreRow.vue'
import SearchBar from '@/components/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import SkipToContent from '@/components/SkipToContent.vue'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const showsStore = useShowsStore()
const searchStore = useSearchStore()
const searchQuery = ref('')

// SEO
useSEO({
  title: 'TV Show Dashboard - Discover thousands of TV shows',
  description:
    'Explore and discover thousands of TV shows organized by genre. Search, browse, and find detailed information about your favorite series.',
  keywords: ['tv shows', 'series', 'entertainment', 'genres', 'streaming'],
})

function handleSearch(query: string) {
  if (query.trim()) {
    const locale = route.params.locale || 'en'
    router.push({ name: 'search', params: { locale }, query: { q: query } })
  }
}

onMounted(() => {
  showsStore.fetchAllShows()
})
</script>
