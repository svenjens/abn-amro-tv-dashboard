<script setup lang="ts">
import { useWatchlistStore } from '@/stores'
import { useSEO } from '@/composables'
import ShowCard from '@/components/ShowCard.vue'
import SkipToContent from '@/components/SkipToContent.client.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import WatchlistButtonRemove from '@/components/WatchlistButtonRemove.vue'
import BackButton from '@/components/BackButton.vue'
import HomeButton from '@/components/HomeButton.vue'
import EmptyState from '@/components/EmptyState.vue'

const { t } = useI18n()
const watchlistStore = useWatchlistStore()

// SEO (multilingual)
useSEO({
  title: t('watchlist.title') + ' - BingeList',
  description: t('watchlist.emptyMessage'),
  keywords: ['watchlist', 'tv shows', 'series', 'favorites'],
})

function handleClearAll() {
  if (confirm(t('watchlist.confirmClear'))) {
    watchlistStore.clearWatchlist()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <header
      class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <BackButton variant="header" />
          </div>

          <div class="flex items-center gap-3">
            <DarkModeToggle variant="header" />
            <LanguageSwitcher />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold">{{ t('watchlist.title') }}</h1>
            <p class="text-primary-100 mt-2">
              {{ t('watchlist.showCount', watchlistStore.watchlistCount) }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <HomeButton :text="t('watchlist.browseShows')" />
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
    </header>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Shows Grid -->
      <div
        v-if="watchlistStore.hasShows"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <div v-for="show in watchlistStore.watchlist" :key="show.id" class="relative group">
          <ShowCard :show="show" />
          <WatchlistButtonRemove :show-id="show.id" />
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState v-else :title="t('watchlist.empty')" :message="t('watchlist.emptyMessage')" />
    </main>
  </div>
</template>
