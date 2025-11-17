<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <header
      class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex items-center justify-between mb-6">
          <button
            class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-primary-800 rounded-lg px-2 py-1"
            :aria-label="t('navigation.back')"
            @click="useRouter().back()"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {{ t('navigation.back') }}
          </button>

          <div class="flex items-center gap-3">
            <DarkModeToggle variant="header" />
            <button
              class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-primary-800 rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20"
              :aria-label="t('navigation.home')"
              @click="navigateTo(localePath('/'))"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {{ t('navigation.home') }}
            </button>
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
      <div v-else class="text-center py-16" role="status">
        <NuxtImg
          src="/optimized/empty-state-illustration.png"
          alt=""
          class="mx-auto h-48 w-48 object-contain opacity-50"
          aria-hidden="true"
          width="192"
          height="192"
          loading="lazy"
        />
        <h3 class="mt-6 text-lg font-medium text-gray-900">{{ t('genre.noShows') }}</h3>
        <p class="mt-2 text-sm text-gray-500">{{ t('genre.noShowsMessage') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useShowsStore } from '@/stores'
import { useSEO } from '@/composables'
import ShowCard from '@/components/ShowCard.vue'
import SkipToContent from '@/components/SkipToContent.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AdSense from '@/components/AdSense.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const { t } = useI18n()
const localePath = useLocalePath()
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
