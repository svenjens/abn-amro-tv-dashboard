<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSearchStore } from '@/stores'
import BackButton from '@/components/BackButton.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import SearchBar from '@/components/SearchBar.vue'
import SearchModeToggle from '@/components/SearchModeToggle.vue'
import SearchModeInfo from '@/components/SearchModeInfo.vue'
import ExampleQueries from '@/components/ExampleQueries.vue'

interface Props {
  modelValue: string
  isSemanticMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSemanticMode: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue' | 'search', value: string): void
  (e: 'update:isSemanticMode', value: boolean): void
}>()

const { t } = useI18n()
const searchStore = useSearchStore()
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)

// Example queries for semantic search (from i18n)
const exampleQueries = computed(() => {
  // Access individual array items directly
  const queries = []
  for (let i = 0; i < 10; i++) {
    const query = t(`search.exampleQueries.${i}`)
    if (query && !query.startsWith('search.exampleQueries')) {
      queries.push(query)
    } else {
      break
    }
  }
  return queries
})

// Show example queries in semantic mode - always show when in semantic mode
const showExampleQueries = computed(() => {
  return props.isSemanticMode
})

// Expose focus method
defineExpose({
  focus: () => searchBarRef.value?.focus(),
})
</script>

<template>
  <header
    class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
  >
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-4">
        <BackButton variant="header" />
        <div class="flex items-center gap-3">
          <DarkModeToggle variant="header" />
          <LanguageSwitcher variant="header" />
        </div>
      </div>

      <!-- Search Mode Toggle and Info -->
      <div class="max-w-2xl mx-auto mb-6">
        <SearchModeToggle
          class="mb-3"
          :model-value="isSemanticMode"
          @update:model-value="emit('update:isSemanticMode', $event)"
        />
        <SearchModeInfo :is-semantic-mode="isSemanticMode" />
      </div>

      <!-- Example Queries (in semantic mode) - shown ABOVE search bar -->
      <ExampleQueries
        v-if="showExampleQueries"
        class="mb-6 max-w-2xl mx-auto"
        :examples="exampleQueries"
        :has-query="!!modelValue"
        @select="emit('search', $event)"
      />

      <div class="flex gap-2 max-w-2xl mx-auto">
        <div class="flex-1">
          <SearchBar
            ref="searchBarRef"
            data-testid="search-bar"
            :model-value="modelValue"
            :placeholder="t('search.placeholder')"
            :recent-searches="searchStore.recentSearches"
            @update:model-value="emit('update:modelValue', $event)"
            @search="emit('search', $event)"
            @clear-recent="searchStore.clearRecentSearches()"
          />
        </div>
        <button
          class="flex-shrink-0 h-[48px] bg-white hover:bg-gray-100 active:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-primary-600 dark:text-primary-400 font-medium px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
          :aria-label="t('search.searchButton')"
          @click="emit('search', modelValue)"
        >
          <Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </header>
</template>
