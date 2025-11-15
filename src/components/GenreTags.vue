<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="genre in displayGenres"
      :key="genre"
      class="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-xs font-medium text-primary-800 dark:text-primary-200"
    >
      {{ genre }}
    </span>
    <span
      v-if="hasMore"
      class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
    >
      +{{ remainingCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  genres: string[]
  maxDisplay?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 3,
})

const displayGenres = computed(() => {
  return props.genres.slice(0, props.maxDisplay)
})

const hasMore = computed(() => {
  return props.genres.length > props.maxDisplay
})

const remainingCount = computed(() => {
  return props.genres.length - props.maxDisplay
})
</script>
