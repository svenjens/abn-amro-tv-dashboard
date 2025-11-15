<template>
  <button
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :title="title"
    @click.prevent="handleClick"
  >
    <!-- Bookmark Icon (filled when in watchlist) -->
    <svg
      v-if="isInWatchlist"
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 3C3.89543 3 3 3.89543 3 5V21L12 17L21 21V5C21 3.89543 20.1046 3 19 3H5Z"
      />
    </svg>
    <svg
      v-else
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 3H19C20.1046 3 21 3.89543 21 5V21L12 17L3 21V5C3 3.89543 3.89543 3 5 3Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span v-if="showText" class="ml-2">{{ buttonText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
  return isInWatchlist.value
    ? t('watchlist.removeFromWatchlist')
    : t('watchlist.addToWatchlist')
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

