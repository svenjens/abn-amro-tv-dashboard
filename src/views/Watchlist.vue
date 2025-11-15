<template>
  <div class="min-h-screen bg-gray-50">
    <SkipToContent />

    <!-- Header -->
    <div
      class="bg-gradient-to-r from-primary-600 to-primary-800 text-white"
      role="banner"
    >
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <button
              class="inline-flex items-center gap-2 hover:text-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded-lg px-2 py-1"
              :aria-label="t('navigation.back')"
              @click="router.back()"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {{ t('navigation.back') }}
            </button>
          </div>

          <LanguageSwitcher />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold">{{ t('watchlist.title') }}</h1>
            <p class="text-primary-100 mt-2">
              {{ t('watchlist.showCount', watchlistStore.watchlistCount) }}
            </p>
          </div>

          <button
            v-if="watchlistStore.hasShows"
            class="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/30"
            @click="handleClearAll"
          >
            {{ t('watchlist.clearAll') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Shows Grid -->
      <div
        v-if="watchlistStore.hasShows"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <div
          v-for="show in watchlistStore.watchlist"
          :key="show.id"
          class="relative group"
        >
          <ShowCard :show="show" />
          
          <!-- Remove Button Overlay -->
          <button
            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            :aria-label="t('watchlist.removeFromWatchlist')"
            @click="watchlistStore.removeFromWatchlist(show.id)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-4" role="status">
        <picture>
          <source
            type="image/webp"
            srcset="/optimized/empty-state-illustration-256.webp 256w, /optimized/empty-state-illustration.webp 512w"
            sizes="192px"
          />
          <img
            src="/empty-state-illustration.png"
            alt=""
            class="mx-auto h-48 w-48 object-contain opacity-50"
            aria-hidden="true"
          />
        </picture>
        <h2 class="mt-6 text-lg font-medium text-gray-900">{{ t('watchlist.empty') }}</h2>
        <p class="mt-2 text-sm text-gray-500">{{ t('watchlist.emptyMessage') }}</p>
        <div class="mt-6">
          <button
            class="btn-primary"
            @click="router.push({ name: 'home', params: { locale: route.params.locale || 'en' } })"
          >
            {{ t('navigation.home') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWatchlistStore } from '@/stores'
import { useSEO } from '@/composables'
import ShowCard from '@/components/ShowCard.vue'
import SkipToContent from '@/components/SkipToContent.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const watchlistStore = useWatchlistStore()

// SEO (multilingual)
useSEO({
  title: t('watchlist.title') + ' - TV Show Dashboard',
  description: t('watchlist.emptyMessage'),
  keywords: ['watchlist', 'tv shows', 'series', 'favorites'],
})

function handleClearAll() {
  if (confirm(t('watchlist.confirmClear'))) {
    watchlistStore.clearWatchlist()
  }
}

onMounted(() => {
  // Ensure watchlist is loaded (already done in store init, but just in case)
})
</script>

