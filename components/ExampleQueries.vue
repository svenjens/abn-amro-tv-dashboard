<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
      {{ hasQuery ? t('search.orTryAsking') : t('search.tryAsking') }}
    </h3>
    <div class="flex flex-wrap gap-3">
      <button
        v-for="example in examples"
        :key="example"
        class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        @click="$emit('select', example)"
      >
        {{ example }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface Props {
  examples: string[]
  hasQuery?: boolean
}

defineProps<Props>()

defineEmits<{
  select: [query: string]
}>()
</script>
