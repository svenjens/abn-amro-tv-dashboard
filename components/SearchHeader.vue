<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSearchStore } from '@/stores'
import BackButton from '@/components/BackButton.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import SearchBar from '@/components/SearchBar.client.vue'
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
  (e: 'update:modelValue', value: string): void
  (e: 'update:isSemanticMode', value: boolean): void
  (e: 'search', query: string): void
}>()

const { t } = useI18n()
const searchStore = useSearchStore()
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)

// Example queries for semantic search (from i18n)
const exampleQueries = computed(() => {
  const queries = t('search.exampleQueries', { returnObjects: true })
  return Array.isArray(queries) ? queries : []
})

// Show example queries in semantic mode
const showExampleQueries = computed(() => {
  return props.isSemanticMode && !searchStore.isSearching
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

      <SearchBar
        ref="searchBarRef"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        :placeholder="t('search.placeholder')"
        :recent-searches="searchStore.recentSearches"
        data-testid="search-bar"
        @search="emit('search', $event)"
        @clear-recent="searchStore.clearRecentSearches()"
      />

      <!-- Search Mode Toggle and Info -->
      <div class="mt-6">
        <SearchModeToggle
          :model-value="isSemanticMode"
          @update:model-value="emit('update:isSemanticMode', $event)"
          class="mb-3"
        />
        <SearchModeInfo :is-semantic-mode="isSemanticMode" class="mb-4" />
      </div>

      <!-- Example Queries (in semantic mode) -->
      <ExampleQueries
        v-if="showExampleQueries"
        class="mt-6"
        :examples="exampleQueries"
        :has-query="!!modelValue"
        @select="emit('search', $event)"
      />
    </div>
  </header>
</template>
