<script setup lang="ts">
import { ref } from 'vue'
import { useSearchStore } from '@/stores'
import BackButton from '@/components/BackButton.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import SearchBar from '@/components/SearchBar.client.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', query: string): void
}>()

const { t } = useI18n()
const searchStore = useSearchStore()
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)

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
        <BackButton />
        <div class="flex items-center gap-3">
          <DarkModeToggle variant="header" />
          <LanguageSwitcher />
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
    </div>
  </header>
</template>
