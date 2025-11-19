<script setup lang="ts">
const { t } = useI18n()

interface SemanticIntent {
  genres?: string[]
  mood?: string[]
  similar?: string
  fallback?: boolean
}

interface Props {
  intent: SemanticIntent | null
}

defineProps<Props>()
</script>

<template>
  <div
    v-if="intent && !intent.fallback"
    class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
  >
    <div class="flex items-start gap-3">
      <Icon
        name="heroicons:information-circle"
        class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
      />
      <div class="flex-1">
        <p class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          {{ t('search.searchingFor') }}
        </p>
        <div class="flex flex-wrap gap-2">
          <!-- Genres -->
          <span
            v-for="genre in intent.genres"
            :key="genre"
            class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
          >
            {{ genre }}
          </span>

          <!-- Moods -->
          <span
            v-for="mood in intent.mood"
            :key="mood"
            class="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-xs font-medium"
          >
            {{ mood }}
          </span>

          <!-- Similar to -->
          <span
            v-if="intent.similar"
            class="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded text-xs font-medium"
          >
            {{ t('search.similarTo', { show: intent.similar }) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
