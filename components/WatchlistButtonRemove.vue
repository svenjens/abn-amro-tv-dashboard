<template>
  <button
    class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    :aria-label="t('watchlist.removeFromWatchlist')"
    @click="handleRemove"
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
</template>

<script setup lang="ts">
import { useWatchlistStore } from '@/stores'

const { t } = useI18n()
const watchlistStore = useWatchlistStore()

interface Props {
  showId: number
}

const props = defineProps<Props>()

const handleRemove = () => {
  watchlistStore.removeFromWatchlist(props.showId)
}
</script>
