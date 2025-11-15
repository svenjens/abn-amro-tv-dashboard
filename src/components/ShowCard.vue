<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: 50 } }"
    class="card group/card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 h-full flex flex-col"
    @click="navigateToShow"
  >
    <div class="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
      <img
        v-if="imageLoaded && showImage"
        :src="showImage"
        :alt="show.name"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-110"
        @error="handleImageError"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
        <svg
          class="h-16 w-16"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <!-- Rating Badge Overlay -->
      <div v-if="show.rating.average" class="absolute top-2 right-2">
        <RatingBadge :rating="show.rating.average" />
      </div>

      <!-- Watchlist Button Overlay -->
      <div class="absolute top-2 left-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
        <WatchlistButton :show="show" variant="icon" size="md" @click.stop />
      </div>
    </div>

    <div class="p-4 flex-1 flex flex-col min-h-0">
      <h3
        class="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-3 group-hover/card:text-primary-600 dark:group-hover/card:text-primary-400 transition-colors min-h-[3.5rem]"
      >
        {{ show.name }}
      </h3>

      <div class="mt-auto space-y-2">
        <div class="min-h-[2rem]">
          <GenreTags
            v-if="show.genres && show.genres.length > 0"
            :genres="show.genres"
            :max-display="2"
          />
        </div>

        <div v-if="show.premiered" class="text-sm text-gray-500 dark:text-gray-400">
          {{ premieredYear }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Show } from '@/types'
import { getShowImage, createShowSlug } from '@/utils'
import RatingBadge from './RatingBadge.vue'
import GenreTags from './GenreTags.vue'
import WatchlistButton from './WatchlistButton.vue'

interface Props {
  show: Show
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true,
})

const router = useRouter()
const imageLoaded = ref(!props.lazy)
const imageError = ref(false)

const showImage = computed(() => {
  if (imageError.value) {
    return null
  }
  return getShowImage(props.show, 'medium')
})

const premieredYear = computed(() => {
  if (!props.show.premiered) return ''
  return new Date(props.show.premiered).getFullYear()
})

function navigateToShow() {
  const currentRoute = router.currentRoute.value
  const locale = currentRoute.params.locale || 'en'
  const slug = createShowSlug(props.show.name, props.show.id)
  router.push({ name: 'show-detail', params: { locale, slug } })
}

function handleImageError() {
  imageError.value = true
}

onMounted(() => {
  if (props.lazy) {
    // Simulate lazy loading - in production, use IntersectionObserver
    setTimeout(() => {
      imageLoaded.value = true
    }, 100)
  }
})
</script>
