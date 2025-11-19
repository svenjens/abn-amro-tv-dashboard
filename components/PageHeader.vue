<template>
  <header
    class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
  >
    <div class="max-w-7xl mx-auto px-4" :class="compact ? 'py-6' : 'py-8'">
      <div class="flex items-center justify-between mb-4">
        <button
          class="inline-flex items-center gap-2 hover:text-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded-lg px-2 py-1"
          :aria-label="t('navigation.back')"
          @click="handleBack"
        >
          <svg
            class="h-5 w-5"
            :class="{ 'h-6 w-6': !compact }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t('navigation.back') }}
        </button>
        <DarkModeToggle variant="header" />
      </div>

      <!-- Icon + Title Layout (for pages like Roadmap) -->
      <div v-if="icon" class="flex items-start gap-4">
        <div
          class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-white/90 text-lg">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Simple Title Layout (for legal pages) -->
      <div v-else>
        <h1 class="text-3xl md:text-4xl font-bold">{{ title }}</h1>
        <p v-if="subtitle" class="text-primary-100 mt-2">{{ subtitle }}</p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

interface Props {
  title: string
  subtitle?: string
  icon?: string // SVG path for icon
  compact?: boolean // Use smaller padding
}

defineProps<Props>()

const { t } = useI18n()
const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>
