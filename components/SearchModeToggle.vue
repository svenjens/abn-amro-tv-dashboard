<script setup lang="ts">
const { t } = useI18n()

interface Props {
  modelValue: boolean // true = semantic, false = regular
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-all',
        !modelValue
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
      ]"
      @click="$emit('update:modelValue', false)"
    >
      {{ t('search.regular') }}
    </button>
    <button
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
        modelValue
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
      ]"
      @click="$emit('update:modelValue', true)"
    >
      <Icon name="heroicons:sparkles" class="w-5 h-5" />
      {{ t('search.smart') }}
    </button>
  </div>
</template>
