<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="genre in displayGenres"
      :key="genre"
      class="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-xs font-medium text-primary-800 dark:text-primary-200"
    >
      {{ genre }}
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
</script>
