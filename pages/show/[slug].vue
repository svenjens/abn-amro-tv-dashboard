<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Loading State -->
    <LoadingSpinner
      v-if="loading"
      :text="t('status.loadingDetails')"
      :full-screen="true"
      role="status"
      :aria-label="t('status.loading')"
    />

    <!-- Error State -->
    <ErrorMessage
      v-else-if="error"
      :message="error.message || 'Failed to load show details'"
      :retry="true"
      :full-screen="true"
      @retry="() => navigateTo(localePath(`/show/${route.params.slug}`))"
    />

    <!-- Show Details -->
    <div v-else-if="show" class="pb-12">
      <!-- Hero Section -->
      <header class="relative bg-gray-900 dark:bg-gray-950 text-white">
        <!-- Background Image -->
        <div
          v-if="show.image?.original"
          class="absolute inset-0 opacity-20 dark:opacity-30"
          :aria-label="`${show.name} background`"
        >
          <NuxtImg
            :src="transformImageUrl(show.image.original)"
            :alt="`${show.name} background`"
            class="w-full h-full object-cover"
            format="webp"
            :quality="70"
            loading="eager"
          />
        </div>

        <div class="relative max-w-7xl mx-auto px-4 py-12">
          <div class="flex items-center justify-between mb-6">
            <button
              class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1"
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
                class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20"
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

          <div class="flex flex-col md:flex-row gap-8">
            <!-- Poster -->
            <div v-if="getShowImage(show, 'original')" class="flex-shrink-0">
              <NuxtImg
                :src="getShowImage(show, 'original')!"
                :alt="`${show.name} poster`"
                class="w-64 rounded-lg shadow-2xl"
                loading="eager"
                fetchpriority="high"
                format="webp"
                :quality="90"
                width="256"
              />
            </div>

            <!-- Info -->
            <div class="flex-1">
              <h1 id="show-title" class="text-4xl md:text-5xl font-bold mb-4">{{ show.name }}</h1>

              <div class="flex flex-wrap items-center gap-4 mb-6">
                <RatingBadge v-if="show.rating.average" :rating="show.rating.average" />
                <GenreTags v-if="show.genres" :genres="show.genres" :max-display="5" />
                <WatchlistButton :show="show" variant="button" size="lg" />
              </div>

              <dl class="space-y-3 text-gray-200">
                <div v-if="show.premiered" class="flex items-center gap-2">
                  <dt class="font-semibold">{{ t('show.premiered') }}:</dt>
                  <dd>
                    {{ formatDate(show.premiered) }}
                    <span v-if="show.ended" class="text-gray-400">
                      - {{ formatDate(show.ended) }}
                    </span>
                  </dd>
                </div>

                <div v-if="show.status" class="flex items-center gap-2">
                  <dt class="font-semibold">{{ t('show.status') }}:</dt>
                  <dd>
                    <span
                      class="px-2 py-1 rounded text-sm"
                      :class="show.status === 'Running' ? 'bg-green-600' : 'bg-gray-600'"
                    >
                      {{ show.status }}
                    </span>
                  </dd>
                </div>

                <div v-if="show.network" class="flex items-center gap-2">
                  <dt class="font-semibold">{{ t('show.network') }}:</dt>
                  <dd>{{ show.network.name }}</dd>
                </div>

                <div v-if="show.schedule" class="flex items-center gap-2">
                  <dt class="font-semibold">{{ t('show.schedule') }}:</dt>
                  <dd>{{ formatSchedule(show.schedule) }}</dd>
                </div>

                <div v-if="show.runtime" class="flex items-center gap-2">
                  <dt class="font-semibold">{{ t('show.runtime') }}:</dt>
                  <dd>{{ t('show.minutes', { count: show.runtime }) }}</dd>
                </div>
              </dl>

              <div v-if="show.officialSite" class="mt-6">
                <a
                  :href="show.officialSite"
                  target="_blank"
                  rel="noopener noreferrer external nofollow"
                  class="inline-flex items-center gap-2 btn-primary focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  :aria-label="`${t('show.officialWebsite')} - ${t('accessibility.externalLink')}`"
                >
                  {{ t('show.officialWebsite') }}
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Tabs Section -->
      <main id="main-content" class="max-w-7xl mx-auto px-4 py-12" tabindex="-1">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav class="-mb-px flex space-x-8" role="tablist" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-all"
              :class="
                activeTab === tab.id
                  ? 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              "
              :aria-selected="activeTab === tab.id"
              role="tab"
              @click="activeTab = tab.id"
            >
              {{ t(tab.label) }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div role="tabpanel">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'">
            <article v-if="show.summary" class="mb-12">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {{ t('show.summary') }}
              </h2>
              <SafeHtml
                :content="show.summary || ''"
                class="prose dark:prose-invert prose-lg max-w-none text-gray-700 dark:text-gray-300"
                role="region"
                :aria-labelledby="'show-title'"
              />
            </article>

            <!-- Streaming Availability -->
            <section class="mb-12">
              <StreamingAvailability :availability="streamingAvailability" :show-name="show.name" />
            </section>

            <!-- Advertisement -->
            <AdSense format="horizontal" />

            <!-- Related Shows -->
            <section
              v-if="relatedShows.length > 0"
              class="mt-12"
              :aria-label="t('show.relatedShows')"
            >
              <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ t('show.relatedShows') }}</h2>
              <div
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-fr"
                role="list"
              >
                <ShowCard
                  v-for="relatedShow in relatedShows"
                  :key="relatedShow.id"
                  :show="relatedShow"
                  role="listitem"
                />
              </div>
            </section>
          </div>

          <!-- Episodes Tab -->
          <div v-else-if="activeTab === 'episodes'">
            <SeasonList
              :episodes="episodes || []"
              :show-id="show.id"
              :loading="episodesLoading"
              :error="episodesError"
              @retry="fetchEpisodes"
            />
          </div>

          <!-- Cast Tab -->
          <div v-else-if="activeTab === 'cast'">
            <CastList
              :cast="(cast as any) || []"
              :loading="castLoading"
              :error="castError"
              @retry="fetchCast"
            />
          </div>
        </div>
      </main>
    </div>

    <!-- Not Found -->
    <div v-else class="flex items-center justify-center min-h-screen" role="alert">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t('show.notFound') }}</h2>
        <p class="text-gray-600 mb-6">{{ t('show.notFoundMessage') }}</p>
        <button
          class="btn-primary focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
          @click="navigateTo(localePath('/'))"
        >
          {{ t('show.goHome') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SafeHtml from '@/components/SafeHtml.vue'
import { useShowsStore } from '@/stores'
import {
  getShowImage,
  transformImageUrl,
  formatSchedule,
  extractIdFromSlug,
  createShowSlug,
} from '@/utils'
import { useSEO, getShowSEO, generateShowStructuredData } from '@/composables'
import RatingBadge from '@/components/RatingBadge.vue'
import GenreTags from '@/components/GenreTags.vue'
import ShowCard from '@/components/ShowCard.vue'
import SkipToContent from '@/components/SkipToContent.client.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import WatchlistButton from '@/components/WatchlistButton.vue'
import AdSense from '@/components/AdSense.vue'
import SeasonList from '@/components/SeasonList.vue'
import CastList from '@/components/CastList.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import StreamingAvailability from '@/components/StreamingAvailability.vue'

const { t } = useI18n()
const localePath = useLocalePath()

const route = useRoute()
const showsStore = useShowsStore()

// Active tab
const activeTab = ref('overview')

// Tab configuration
const tabs = [
  { id: 'overview', label: 'tabs.overview' },
  { id: 'episodes', label: 'tabs.episodes' },
  { id: 'cast', label: 'tabs.cast' },
]

// Extract ID from slug (format: show-name-123)
const slug = computed(() => route.params.slug as string)
const showId = computed(() => extractIdFromSlug(slug.value))

// Get user's country from location middleware
const { country } = useLocation()
const userCountry = computed(() => country.value || 'US')

// Server-side data fetching with useAsyncData
// This runs on the server during SSR and provides instant content
const {
  data: show,
  error,
  pending: loading,
} = await useAsyncData(
  `show-${showId.value}`,
  () =>
    // @ts-ignore - Type recursion issue with Nuxt routes
    $fetch(`/api/shows/${showId.value}`, {
      query: { country: userCountry.value },
    }),
  {
    watch: [showId, userCountry],
  }
)

// Streaming availability comes from server now
const streamingAvailability = computed(() => show.value?.streamingAvailability || [])

// Related shows
const relatedShows = computed(() => {
  if (!show.value) return []
  return showsStore.getRelatedShows(show.value, 6)
})

// Episodes - lazy loaded via server API when tab is opened
const {
  data: episodes,
  error: episodesError,
  pending: episodesLoading,
  execute: fetchEpisodes,
} = await useLazyAsyncData(
  `episodes-${showId.value}`,
  () => $fetch(`/api/shows/${showId.value}/episodes`),
  {
    immediate: false,
    server: false, // Only fetch on client when needed
  }
)

// Cast - lazy loaded via server API when tab is opened
const {
  data: cast,
  error: castError,
  pending: castLoading,
  execute: fetchCast,
} = await useLazyAsyncData(
  `cast-${showId.value}`,
  () => $fetch(`/api/shows/${showId.value}/cast`),
  {
    immediate: false,
    server: false, // Only fetch on client when needed
  }
)

// Update SEO when show changes (multilingual)
watch(
  show,
  (newShow) => {
    if (newShow) {
      const fallbackDesc = t('seo.show.fallbackDescription', { name: newShow.name })
      const seoConfig = getShowSEO(newShow, fallbackDesc)
      // Update with show-specific config
      useSEO(seoConfig)
      // Add structured data
      generateShowStructuredData(newShow)
    }
  },
  { immediate: false }
)

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Validate slug and redirect if incorrect (for SEO)
watch(
  show,
  (showData) => {
    if (showData && showId.value) {
      const correctSlug = createShowSlug(showData.name, showId.value)
      if (slug.value !== correctSlug) {
        navigateTo(localePath(`/show/${correctSlug}`), { replace: true })
      }
    }
  },
  { immediate: true }
)

// Lazy load episodes and cast when tabs are opened
watch(activeTab, (newTab) => {
  if (newTab === 'episodes' && !episodes.value && !episodesLoading.value) {
    fetchEpisodes()
  } else if (newTab === 'cast' && !cast.value && !castLoading.value) {
    fetchCast()
  }
})

// SEO: Update meta tags when show data changes
watch(
  show,
  (showData) => {
    if (showData) {
      const description = showData.summary
        ? showData.summary.replace(/<[^>]*>/g, '').substring(0, 160)
        : `Watch ${showData.name} - Find streaming availability and full details on BingeList`

      const title = `${showData.name} - BingeList`
      const image = showData.image?.original || showData.image?.medium

      useHead({
        title,
        meta: [{ name: 'description', content: description }],
      })

      useSeoMeta({
        title,
        description,
        ogTitle: title,
        ogDescription: description,
        ogImage: image,
        ogType: 'video.tv_show',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
      })
    }
  },
  { immediate: true }
)
</script>
