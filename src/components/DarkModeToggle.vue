<template>
  <button
    class="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2"
    :class="[buttonClass, focusClass]"
    :aria-label="t('darkMode.toggle')"
    :title="themeLabel"
    @click="toggle"
  >
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-if="!isDark"
      class="h-5 w-5 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-else
      class="h-5 w-5 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>

    <!-- Optional Text Label (hidden on mobile) -->
    <span v-if="showLabel" class="hidden sm:inline text-sm font-medium">
      {{ themeLabel }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDarkMode } from '@/composables'

interface Props {
  showLabel?: boolean
  variant?: 'default' | 'header' | 'menu'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: false,
  variant: 'default',
})

const { t } = useI18n()
const { isDark, theme, toggle } = useDarkMode()

const themeLabel = computed(() => {
  if (theme.value === 'system') {
    return t('darkMode.system')
  }
  return isDark.value ? t('darkMode.dark') : t('darkMode.light')
})

const buttonClass = computed(() => {
  const base = 'hover:bg-gray-100 dark:hover:bg-gray-700'
  
  switch (props.variant) {
    case 'header':
      return 'text-white hover:text-primary-200 hover:bg-white/10'
    case 'menu':
      return 'w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
    default:
      return `${base} text-gray-700 dark:text-gray-200`
  }
})

const focusClass = computed(() => {
  if (props.variant === 'header') {
    return 'focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 dark:focus:ring-offset-gray-800'
  }
  return 'focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
})
</script>

