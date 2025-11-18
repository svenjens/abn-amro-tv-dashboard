<template>
  <button
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :title="title"
    @click.prevent="handleClick"
  >
    <!-- Bookmark Icon (filled when in watchlist) -->
    <Icon v-if="isInWatchlist" name="heroicons:bookmark-solid" class="h-5 w-5" />
    <Icon v-else name="heroicons:bookmark" class="h-5 w-5" />
    <span v-if="showText" class="ml-2">{{ buttonText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWatchlistStore } from '@/stores'
import { useToast } from '@/composables'
import type { Show } from '@/types'

interface Props {
  show: Show
  variant?: 'icon' | 'button'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'icon',
  size: 'md',
})

const { t } = useI18n()
const watchlistStore = useWatchlistStore()
const { show: showToastNotification } = useToast()

const isInWatchlist = computed(() => watchlistStore.isInWatchlist(props.show.id))

const showText = computed(() => props.variant === 'button')

const buttonText = computed(() => {
  return isInWatchlist.value ? t('watchlist.removeFromWatchlist') : t('watchlist.addToWatchlist')
})

const ariaLabel = computed(() => {
  return isInWatchlist.value ? t('watchlist.removeFromWatchlist') : t('watchlist.addToWatchlist')
})

const title = computed(() => ariaLabel.value)

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'

  const sizeClasses = {
    sm: 'p-1.5 rounded',
    md: 'p-2 rounded-lg',
    lg: 'px-4 py-2 rounded-lg',
  }

  const variantClasses = {
    icon: isInWatchlist.value
      ? 'text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100'
      : 'text-gray-600 hover:text-primary-600 bg-gray-100 hover:bg-primary-50',
    button: isInWatchlist.value
      ? 'btn-secondary bg-primary-600 hover:bg-primary-700 text-white'
      : 'btn-primary',
  }

  return [base, sizeClasses[props.size], variantClasses[props.variant]]
})

function handleClick() {
  watchlistStore.toggleWatchlist(props.show)

  if (isInWatchlist.value) {
    showToastNotification(t('watchlist.addedToast', { name: props.show.name }), 'success')
  } else {
    showToastNotification(t('watchlist.removedToast', { name: props.show.name }), 'info')
  }
}
</script>
