<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Hero Section -->
    <header class="relative bg-gray-900 dark:bg-gray-950 text-white">
      <!-- Background Image -->
      <div
        v-if="backgroundImage"
        class="absolute inset-0 opacity-20 dark:opacity-30"
        :aria-label="`${title} background`"
      >
        <NuxtImg
          :src="backgroundImage"
          :alt="`${title} background`"
          format="webp"
          :quality="85"
          class="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 py-12">
        <!-- Navigation -->
        <div class="flex items-center justify-between mb-6">
          <button
            class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1"
            :aria-label="t('navigation.back')"
            @click="router.back()"
          >
            <Icon name="heroicons:chevron-left" class="h-5 w-5" />
            {{ t('navigation.back') }}
          </button>

          <div class="flex items-center gap-3">
            <DarkModeToggle variant="header" />
            <button
              class="inline-flex items-center gap-2 text-white hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20"
              :aria-label="t('navigation.home')"
              @click="router.push(localePath('/'))"
            >
              <Icon name="heroicons:home" class="h-5 w-5" />
              {{ t('navigation.home') }}
            </button>
          </div>
        </div>

        <!-- Header Content Slot -->
        <slot name="header" />
      </div>
    </header>

    <!-- Main Content with Tabs -->
    <main class="max-w-7xl mx-auto px-4 py-12">
      <!-- Tabs Navigation -->
      <div
        v-if="tabs && tabs.length > 0"
        class="border-b border-gray-200 dark:border-gray-700 mb-8"
      >
        <nav class="-mb-px flex space-x-8" aria-label="Tabs" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-all"
            :class="
              modelValue === tab.id
                ? 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            "
            :aria-selected="modelValue === tab.id"
            role="tab"
            @click="$emit('update:modelValue', tab.id)"
          >
            {{ t(tab.label) }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div role="tabpanel">
        <slot name="content" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()

export interface Tab {
  id: string
  label: string
}

interface Props {
  title: string
  backgroundImage?: string | null
  tabs?: Tab[]
  modelValue?: string // Active tab ID
}

withDefaults(defineProps<Props>(), {
  backgroundImage: null,
  tabs: () => [],
  modelValue: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
