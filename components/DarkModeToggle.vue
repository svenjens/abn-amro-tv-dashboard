<template>
  <button
    class="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2"
    :class="[buttonClass, focusClass]"
    :aria-label="t('darkMode.toggle')"
    :title="themeLabel"
    @click="toggle"
  >
    <!-- Sun Icon (Light Mode) -->
    <Icon v-if="!isDark" name="heroicons:sun" class="h-5 w-5 transition-transform duration-200" />

    <!-- Moon Icon (Dark Mode) -->
    <Icon v-else name="heroicons:moon" class="h-5 w-5 transition-transform duration-200" />

    <!-- Optional Text Label (hidden on mobile) -->
    <span v-if="showLabel" class="hidden sm:inline text-sm font-medium">
      {{ themeLabel }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  showLabel?: boolean
  variant?: 'default' | 'header' | 'menu'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: false,
  variant: 'default',
})

const { t } = useI18n()
const colorMode = useColorMode()

// Map @nuxtjs/color-mode to our interface
const isDark = computed(() => colorMode.value === 'dark')
const theme = computed(() => colorMode.preference as 'light' | 'dark' | 'system')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

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
