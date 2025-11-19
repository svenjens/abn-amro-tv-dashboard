<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useShowsStore } from '@/stores'
import { useSEO } from '@/composables'
import ShowCard from '@/components/ShowCard.vue'
import SkipToContent from '@/components/SkipToContent.client.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AdSense from '@/components/AdSense.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import BackButton from '@/components/BackButton.vue'
import HomeButton from '@/components/HomeButton.vue'
import EmptyState from '@/components/EmptyState.vue'

const { t } = useI18n()
const route = useRoute()
const showsStore = useShowsStore()

const genreName = computed(() => {
  const genre = route.params.genre as string
  return genre.charAt(0).toUpperCase() + genre.slice(1)
})

const genreShows = computed(() => {
  return showsStore.getShowsByGenre(genreName.value)
})

// SEO
// SEO (multilingual)
useSEO({
  title: t('seo.genre.title', { genre: genreName.value }),
  description: t('seo.genre.description', { genre: genreName.value }),
  keywords: t('seo.genre.keywords', { genre: genreName.value }).split(', '),
})

onMounted(() => {
  // Ensure shows are loaded
  if (showsStore.allShows.length === 0) {
    showsStore.fetchAllShows()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <header
      class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex items-center justify-between mb-6">
          <BackButton variant="header" />

          <div class="flex items-center gap-3">
            <DarkModeToggle variant="header" />
            <HomeButton variant="header" />
          </div>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ genreName }}</h1>
        <p class="text-lg text-primary-100">
          {{ t('genre.showsInGenre', { count: genreShows.length }) }}
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 py-8" tabindex="-1">
      <!-- Loading State -->
      <LoadingSpinner
        v-if="showsStore.isLoading"
        :text="t('status.loadingShows')"
        :full-screen="true"
      />

      <!-- Shows Grid -->
      <div v-else-if="genreShows.length > 0">
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr"
        >
          <ShowCard v-for="show in genreShows" :key="show.id" :show="show" />
        </div>

        <!-- Advertisement -->
        <AdSense format="horizontal" />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else
        :title="t('genre.noShows')"
        :message="t('genre.noShowsMessage')"
        heading-level="h3"
      />
    </main>
  </div>
</template>
