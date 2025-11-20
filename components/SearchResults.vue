<script setup lang="ts">
import { useSearchStore } from '@/stores'
import ShowCard from '@/components/ShowCard.vue'
import SemanticIntentDisplay from '@/components/SemanticIntentDisplay.vue'

defineProps<{
  searchQuery: string
  isSemanticMode: boolean
  semanticIntent: any
}>()

const { t } = useI18n()
const searchStore = useSearchStore()
</script>

<template>
  <div>
    <SemanticIntentDisplay
      v-if="isSemanticMode"
      :intent="semanticIntent"
      :search-query="searchQuery"
      class="mb-6"
    />

    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      {{ t('search.resultsTitle', { query: searchQuery }) }}
    </h2>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
      <ShowCard
        v-for="result in searchStore.fullResults"
        :key="result.show.id"
        :show="result.show"
        :match-reason="result.matchedTerm"
      />
    </div>
  </div>
</template>
