<template>
  <div class="rounded-lg bg-red-50 border border-red-200 p-4" :class="containerClass">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="h-5 w-5 text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-sm font-medium text-red-800">{{ title }}</h3>
        <div class="text-sm text-red-700" :class="{ 'mt-2': title }">
          <p>{{ message }}</p>
        </div>
        <div v-if="retry" class="mt-4">
          <button
            type="button"
            class="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 transition-colors"
            @click="$emit('retry')"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  message: string
  retry?: boolean
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Error',
  retry: false,
  fullScreen: false,
})

defineEmits<{
  retry: []
}>()

const containerClass = computed(() => {
  return props.fullScreen ? 'max-w-2xl mx-auto mt-8' : ''
})
</script>
