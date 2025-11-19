<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  showLabel?: boolean
  variant?: 'default' | 'header' | 'menu' | 'footer'
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

const paddingClass = computed(() => {
  // Footer variant has no padding to align with adjacent icons
  if (props.variant === 'footer') {
    return ''
  }
  // All other variants have standard padding
  return 'px-3 py-2'
})

const iconClass = computed(() => {
  // Footer variant uses w-6 h-6 to match GitHub icon
  if (props.variant === 'footer') {
    return 'w-6 h-6 transition-transform duration-200'
  }
  // All other variants use h-5 w-5
  return 'h-5 w-5 transition-transform duration-200'
})

const buttonClass = computed(() => {
  const base = 'hover:bg-gray-100 dark:hover:bg-gray-700'

  switch (props.variant) {
    case 'header':
      return 'text-white hover:text-primary-200 hover:bg-white/10'
    case 'menu':
      return 'w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
    case 'footer':
      return 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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

<template>
  <button
    class="relative inline-flex items-center gap-2 rounded-lg transition-colors focus:outline-none focus:ring-2"
    :class="[buttonClass, focusClass, paddingClass]"
    :aria-label="t('darkMode.toggle')"
    :title="themeLabel"
    @click="toggle"
  >
    <!-- Sun Icon (Light Mode) -->
    <Icon v-if="!isDark" name="heroicons:sun" :class="iconClass" />

    <!-- Moon Icon (Dark Mode) -->
    <Icon v-else name="heroicons:moon" :class="iconClass" />

    <!-- Optional Text Label (hidden on mobile) -->
    <span v-if="showLabel" class="hidden sm:inline text-sm font-medium">
      {{ themeLabel }}
    </span>
  </button>
</template>
