<template>
  <button
    :class="[
      'inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 rounded-lg px-3 py-2',
      variant === 'header'
        ? 'text-white hover:text-primary-300 bg-white/10 hover:bg-white/20 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-primary-800'
        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-primary-500',
    ]"
    :aria-label="t('navigation.home')"
    @click="navigateTo(localePath('/'))"
  >
    <Icon name="heroicons:home" class="h-5 w-5" />
    <span v-if="showLabel">{{ t('navigation.home') }}</span>
  </button>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

interface Props {
  variant?: 'header' | 'default'
  showLabel?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  showLabel: true,
})
</script>
