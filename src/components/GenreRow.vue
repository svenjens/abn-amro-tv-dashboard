<template>
  <section
    v-motion
    :initial="{ opacity: 0, x: -20 }"
    :visible="{ opacity: 1, x: 0, transition: { duration: 500 } }"
    class="mb-8 overflow-visible"
  >
    <div class="flex items-center justify-between mb-4 px-4 md:px-0">
      <h2
        class="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
        @click="navigateToGenre"
      >
        {{ genre }}
      </h2>
      <button
        class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500 rounded px-2 py-1"
        @click="navigateToGenre"
      >
        {{ t('genre.viewAll') }} →
      </button>
    </div>

    <!-- Desktop: Horizontal Scroll -->
    <div class="hidden md:block overflow-visible">
      <div class="relative group overflow-visible">
        <button
          v-if="canScrollLeft"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
          @click="scrollLeft"
        >
          <svg
            class="h-6 w-6 text-gray-800 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          ref="scrollContainer"
          class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-0 py-2"
          style="overflow-y: visible"
          role="region"
          :aria-label="`${genre} shows, scroll horizontally`"
          tabindex="0"
          @scroll="updateScrollButtons"
        >
          <div v-for="show in limitedShowsDesktop" :key="show.id" class="flex-none w-48">
            <ShowCard :show="show" />
          </div>
        </div>

        <button
          v-if="canScrollRight"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
          @click="scrollRight"
        >
          <svg
            class="h-6 w-6 text-gray-800 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile: Grid -->
    <div class="md:hidden px-4">
      <div class="grid grid-cols-2 gap-4">
        <ShowCard v-for="show in limitedShows" :key="show.id" :show="show" />
      </div>
      <button
        v-if="shows.length > mobileLimit"
        class="mt-4 w-full btn-primary"
        @click="expandMobile"
      >
        Show More ({{ shows.length - mobileLimit }} more)
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Show } from '@/types'
import ShowCard from './ShowCard.vue'

interface Props {
  genre: string
  shows: Show[]
}

const props = defineProps<Props>()

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const mobileLimit = ref(6)
const desktopLimit = 12 // Limit shows on desktop for better performance

const limitedShows = computed(() => {
  return props.shows.slice(0, mobileLimit.value)
})

const limitedShowsDesktop = computed(() => {
  return props.shows.slice(0, desktopLimit)
})

function scrollLeft() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -400, behavior: 'smooth' })
  }
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 400, behavior: 'smooth' })
  }
}

function updateScrollButtons() {
  if (!scrollContainer.value) return

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

function expandMobile() {
  mobileLimit.value += 6
}

function navigateToGenre() {
  const locale = route.params.locale || 'en'
  router.push({ name: 'genre-overview', params: { locale, genre: props.genre.toLowerCase() } })
}

onMounted(() => {
  updateScrollButtons()
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateScrollButtons)
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', updateScrollButtons)
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
