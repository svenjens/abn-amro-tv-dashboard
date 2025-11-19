<script setup lang="ts">
const { t } = useI18n()

interface Props {
  isSemanticMode: boolean
}

defineProps<Props>()
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div
      :key="isSemanticMode ? 'smart' : 'regular'"
      class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
    >
      <div class="flex items-center gap-2">
        <Icon
          name="heroicons:information-circle"
          class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
        />
        <div class="text-sm text-blue-800 dark:text-blue-200">
          <span v-if="!isSemanticMode">
            {{ t('search.regularInfo') }}
          </span>
          <span v-else>
            {{ t('search.smartInfo') }}
            <strong class="font-semibold">{{ t('search.smartInfoAction') }}</strong>
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
