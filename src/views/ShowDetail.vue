<template>
  <div class="min-h-screen bg-gray-50">
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
      @retry="loadShow"
    />

    <!-- Show Details -->
    <div v-else-if="show" class="pb-12">
      <!-- Hero Section -->
      <div class="relative bg-gray-900 text-white" role="banner">
        <!-- Background Image -->
        <div
          v-if="show.image?.original"
          class="absolute inset-0 opacity-20"
          role="img"
          :aria-label="`${show.name} background`"
          :style="{
            backgroundImage: `url(${show.image.original})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        ></div>

        <div class="relative max-w-7xl mx-auto px-4 py-12">
          <div class="flex items-center justify-between mb-6">
            <button
              class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1"
              :aria-label="t('navigation.back')"
              @click="router.back()"
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

            <button
              class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20"
              :aria-label="t('navigation.home')"
              @click="
                router.push({ name: 'home', params: { locale: route.params.locale || 'en' } })
              "
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

          <div class="flex flex-col md:flex-row gap-8">
            <!-- Poster -->
            <div v-if="getShowImage(show, 'original')" class="flex-shrink-0">
              <img
                :src="getShowImage(show, 'original')!"
                :alt="`${show.name} poster`"
                class="w-64 rounded-lg shadow-2xl"
                loading="eager"
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
      </div>

      <!-- Tabs Section -->
      <main id="main-content" class="max-w-7xl mx-auto px-4 py-12" tabindex="-1">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 mb-8">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-all"
              :class="
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ t('show.summary') }}</h2>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                class="prose prose-lg max-w-none text-gray-700"
                role="region"
                :aria-labelledby="'show-title'"
                v-html="sanitizedSummary"
              ></div>
              <!-- Safe: HTML is sanitized with DOMPurify before rendering -->
            </article>

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
              :episodes="episodes"
              :show-id="show.id"
              :loading="episodesLoading"
              :error="episodesError"
              @retry="fetchEpisodes"
            />
          </div>

          <!-- Cast Tab -->
          <div v-else-if="activeTab === 'cast'">
            <CastList :cast="cast" :loading="castLoading" :error="castError" @retry="fetchCast" />
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
          @click="router.push({ name: 'home', params: { locale: route.params.locale || 'en' } })"
        >
          {{ t('show.goHome') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import { useShowsStore } from '@/stores'
import type { Show, ApiError, Episode, CastMember } from '@/types'
import { getShowImage, formatSchedule } from '@/utils'
import { useSEO, getShowSEO, generateShowStructuredData } from '@/composables'
import { tvMazeAPI } from '@/api/tvmaze'
import RatingBadge from '@/components/RatingBadge.vue'
import GenreTags from '@/components/GenreTags.vue'
import ShowCard from '@/components/ShowCard.vue'
import SkipToContent from '@/components/SkipToContent.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import WatchlistButton from '@/components/WatchlistButton.vue'
import AdSense from '@/components/AdSense.vue'
import SeasonList from '@/components/SeasonList.vue'
import CastList from '@/components/CastList.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const showsStore = useShowsStore()

const show = ref<Show | null>(null)
const loading = ref(true)
const error = ref<ApiError | null>(null)

// Episodes state
const episodes = ref<Episode[]>([])
const episodesLoading = ref(false)
const episodesError = ref<ApiError | null>(null)

// Cast state
const cast = ref<CastMember[]>([])
const castLoading = ref(false)
const castError = ref<ApiError | null>(null)

// Active tab
const activeTab = ref('overview')

// Tab configuration
const tabs = [
  { id: 'overview', label: 'tabs.overview' },
  { id: 'episodes', label: 'tabs.episodes' },
  { id: 'cast', label: 'tabs.cast' },
]

// Sanitize HTML to prevent XSS attacks
const sanitizedSummary = computed(() => {
  if (!show.value?.summary) return ''
  return DOMPurify.sanitize(show.value.summary)
})

const relatedShows = computed(() => {
  if (!show.value) return []
  return showsStore.getRelatedShows(show.value, 6)
})

// Fetch episodes
async function fetchEpisodes() {
  if (!show.value) return

  episodesLoading.value = true
  episodesError.value = null

  try {
    episodes.value = await tvMazeAPI.fetchEpisodes(show.value.id)
  } catch (err) {
    episodesError.value = err as ApiError
  } finally {
    episodesLoading.value = false
  }
}

// Fetch cast
async function fetchCast() {
  if (!show.value) return

  castLoading.value = true
  castError.value = null

  try {
    cast.value = await tvMazeAPI.fetchCast(show.value.id)
  } catch (err) {
    castError.value = err as ApiError
  } finally {
    castLoading.value = false
  }
}

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

async function loadShow() {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    error.value = { message: 'Invalid show ID' }
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  // Reset episodes and cast data when loading a new show
  episodes.value = []
  episodesError.value = null
  cast.value = []
  castError.value = null

  try {
    // First try to get from store
    let showData = showsStore.getShowById(id)

    // If not in store, fetch from API
    if (!showData) {
      showData = await showsStore.fetchShowById(id)
    }

    show.value = showData

    // If user is already on episodes/cast tab, trigger fetch for new show
    if (activeTab.value === 'episodes') {
      await fetchEpisodes()
    } else if (activeTab.value === 'cast') {
      await fetchCast()
    }
  } catch (err) {
    error.value = err as ApiError
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadShow()
})

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      loadShow()
    }
  }
)

// Lazy load episodes and cast when tabs are opened
watch(activeTab, (newTab) => {
  if (newTab === 'episodes' && episodes.value.length === 0 && !episodesLoading.value) {
    fetchEpisodes()
  } else if (newTab === 'cast' && cast.value.length === 0 && !castLoading.value) {
    fetchCast()
  }
})
</script>
