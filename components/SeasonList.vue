<template>
  <div class="space-y-6">
    <!-- Season selector -->
    <div v-if="seasons.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="season in seasons"
        :key="season"
        class="px-4 py-2 rounded-lg font-medium transition-all"
        :class="
          selectedSeason === season
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        "
        @click="selectedSeason = season"
      >
        {{ t('episodes.season', { number: season }) }}
      </button>
    </div>

    <!-- Loading state -->
    <LoadingSpinner v-if="loading" :text="t('episodes.loading')" />

    <!-- Error state -->
    <ErrorMessage v-else-if="error" :message="error.message" :retry="true" @retry="emit('retry')" />

    <!-- Episodes list -->
    <div v-else-if="currentSeasonEpisodes.length > 0" class="space-y-3">
      <div
        v-for="episode in currentSeasonEpisodes"
        :key="episode.id"
        class="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
      >
        <!-- Checkbox -->
        <div class="flex-shrink-0 pt-1">
          <button
            class="w-6 h-6 rounded border-2 flex items-center justify-center transition-all"
            :class="
              isWatched(episode.id)
                ? 'bg-primary-600 border-primary-600'
                : 'border-gray-300 hover:border-primary-400'
            "
            :aria-label="
              isWatched(episode.id) ? t('episodes.markUnwatched') : t('episodes.markWatched')
            "
            @click="toggleWatched(episode)"
          >
            <svg
              v-if="isWatched(episode.id)"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>

        <!-- Episode image (if available) -->
        <div
          v-if="episode.image"
          class="flex-shrink-0 w-24 h-16 rounded overflow-hidden bg-gray-100"
        >
          <img
            :src="transformImageUrl(episode.image.medium)"
            :alt="episode.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- Episode info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-1">
            <h3 class="font-semibold text-gray-900">
              <span class="text-primary-600">{{ episode.number }}.</span>
              {{ episode.name }}
            </h3>
            <RatingBadge v-if="episode.rating.average" :rating="episode.rating.average" size="sm" />
          </div>

          <p v-if="episode.airdate" class="text-sm text-gray-500 mb-2">
            {{ formatDate(episode.airdate) }}
            <span v-if="episode.runtime" class="ml-2">
              • {{ episode.runtime }} {{ t('episodes.minutes') }}
            </span>
          </p>

          <!-- Summary (collapsed/expanded) -->
          <div v-if="episode.summary">
            <SafeHtml
              v-if="!expandedEpisodes.has(episode.id)"
              :content="episode.summary"
              class="text-sm text-gray-600 line-clamp-2"
            />
            <div v-else>
              <SafeHtml :content="episode.summary" class="text-sm text-gray-600 mb-2" />
            </div>
            <button
              class="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1"
              @click="toggleExpanded(episode.id)"
            >
              {{
                expandedEpisodes.has(episode.id) ? t('episodes.showLess') : t('episodes.showMore')
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Season progress -->
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ t('episodes.progress') }}
          </span>
          <span class="text-sm font-semibold text-primary-600">
            {{ seasonProgress.watched }} / {{ seasonProgress.total }} ({{
              seasonProgress.percentage
            }}%)
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${seasonProgress.percentage}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500">{{ t('episodes.noEpisodes') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SafeHtml from '@/components/SafeHtml.vue'
import type { Episode, EpisodesBySeason, ApiError } from '@/types'
import { transformImageUrl } from '@/utils/show'
import { useWatchlistStore } from '@/stores'
import RatingBadge from './RatingBadge.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ErrorMessage from './ErrorMessage.vue'

interface Props {
  episodes: Episode[]
  showId: number
  loading?: boolean
  error?: ApiError | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n()
const watchlistStore = useWatchlistStore()

const selectedSeason = ref(1)
const expandedEpisodes = ref(new Set<number>())

// Group episodes by season
const episodesBySeason = computed<EpisodesBySeason>(() => {
  return props.episodes.reduce((acc, episode) => {
    if (!acc[episode.season]) {
      acc[episode.season] = []
    }
    const seasonEpisodes = acc[episode.season]
    if (seasonEpisodes) {
      seasonEpisodes.push(episode)
    }
    return acc
  }, {} as EpisodesBySeason)
})

// Get available seasons
const seasons = computed(() => {
  return Object.keys(episodesBySeason.value)
    .map(Number)
    .sort((a, b) => a - b)
})

// Get episodes for selected season
const currentSeasonEpisodes = computed(() => {
  return episodesBySeason.value[selectedSeason.value] || []
})

// Calculate season progress
const seasonProgress = computed(() => {
  const total = currentSeasonEpisodes.value.length
  const watched = currentSeasonEpisodes.value.filter((ep) =>
    watchlistStore.isEpisodeWatched(props.showId, ep.id)
  ).length
  const percentage = total > 0 ? Math.round((watched / total) * 100) : 0

  return { total, watched, percentage }
})

// Check if episode is watched
function isWatched(episodeId: number): boolean {
  return watchlistStore.isEpisodeWatched(props.showId, episodeId)
}

// Toggle watched status
function toggleWatched(episode: Episode) {
  watchlistStore.toggleEpisodeWatched(props.showId, episode.id, episode.season, episode.number)
}

// Toggle episode summary expanded state
function toggleExpanded(episodeId: number) {
  if (expandedEpisodes.value.has(episodeId)) {
    expandedEpisodes.value.delete(episodeId)
  } else {
    expandedEpisodes.value.add(episodeId)
  }
}

// Sanitize HTML
// SafeHtml component handles sanitization

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Auto-select last season when episodes load
watch(
  () => props.episodes.length,
  (newLength) => {
    if (newLength > 0 && seasons.value.length > 0) {
      const lastSeason = seasons.value[seasons.value.length - 1]
      if (lastSeason !== undefined) {
        selectedSeason.value = lastSeason
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
