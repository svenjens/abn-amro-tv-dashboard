<template>
  <div
    v-motion
    :initial="{ opacity: 0, scale: 0.8 }"
    :enter="{ opacity: 1, scale: 1, transition: { duration: 300 } }"
    class="flex items-center justify-center"
    :class="containerClass"
  >
    <div
      class="animate-spin rounded-full border-b-2"
      :class="spinnerClass"
      :style="{ width: size, height: size }"
    ></div>
    <span v-if="text" class="ml-3 text-gray-600 fade-in">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: string
  color?: string
  text?: string
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: '48px',
  color: 'border-primary-600',
  text: '',
  fullScreen: false,
})

const containerClass = computed(() => {
  return props.fullScreen ? 'min-h-screen' : 'py-8'
})

const spinnerClass = computed(() => {
  return props.color
})
</script>
