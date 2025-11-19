<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors"
  >
    <SkipToContent />

    <!-- Header -->
    <PageHeader
      :title="t('roadmap.title')"
      :subtitle="t('roadmap.subtitle')"
      icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      compact
    />

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 py-12" tabindex="-1">
      <!-- Current Status -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span
            class="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg"
          >
            <svg
              class="w-6 h-6 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          {{ t('roadmap.currentStatus') }}
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="feature in currentFeatures"
            :key="feature.title"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ t(feature.title) }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-3">{{ t(feature.description) }}</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tech in feature.tech"
                    :key="tech"
                    class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- AI Vision -->
      <section class="mb-12">
        <div
          class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white mb-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h2 class="text-3xl font-bold">{{ t('roadmap.aiVision') }}</h2>
          </div>
          <p class="text-primary-100 text-lg">
            {{ t('roadmap.aiVisionDescription') }}
          </p>
        </div>

        <!-- AI Features Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in aiFeatures"
            :key="feature.title"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600 transition-colors"
          >
            <div class="flex items-start gap-4 mb-4">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                :class="feature.phaseColor"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <span
                  class="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2"
                  :class="feature.badgeColor"
                >
                  {{ t(feature.phase) }}
                </span>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ t(feature.title) }}
                </h3>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t(feature.description) }}</p>
            <ul class="space-y-2">
              <li
                v-for="capability in feature.capabilities"
                :key="capability"
                class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <svg
                  class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ t(capability) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Technology Stack -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('roadmap.techStack') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="stack in techStacks"
            :key="stack.category"
            class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t(stack.category) }}
            </h3>
            <ul class="space-y-3">
              <li v-for="tech in stack.items" :key="tech.name" class="flex items-center gap-3">
                <span
                  class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs font-bold"
                >
                  {{ tech.icon }}
                </span>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ tech.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ tech.purpose }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Privacy & Ethics -->
      <section
        class="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-8 transition-colors"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {{ t('roadmap.privacyTitle') }}
            </h3>
            <div class="prose prose-amber dark:prose-invert max-w-none">
              <ul class="space-y-2 text-gray-700 dark:text-gray-300">
                <li>{{ t('roadmap.privacyPoint1') }}</li>
                <li>{{ t('roadmap.privacyPoint2') }}</li>
                <li>{{ t('roadmap.privacyPoint3') }}</li>
                <li>{{ t('roadmap.privacyPoint4') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO
useSEO({
  title: t('roadmap.title') + ' - BingeList',
  description: t('roadmap.subtitle'),
  keywords: ['AI', 'machine learning', 'roadmap', 'future', 'innovation', 'tv shows'],
})

// Current features
const currentFeatures = [
  {
    title: 'roadmap.current.smartSearch',
    description: 'roadmap.current.smartSearchDesc',
    tech: ['Vue 3', 'TypeScript', 'TVMaze API'],
  },
  {
    title: 'roadmap.current.watchlist',
    description: 'roadmap.current.watchlistDesc',
    tech: ['Pinia', 'LocalStorage', 'PWA'],
  },
  {
    title: 'roadmap.current.multilingual',
    description: 'roadmap.current.multilingualDesc',
    tech: ['Vue I18n', 'EN/NL'],
  },
  {
    title: 'roadmap.current.episodeTracking',
    description: 'roadmap.current.episodeTrackingDesc',
    tech: ['Progress Tracking', 'Season Progress'],
  },
]

// AI features
const aiFeatures = [
  {
    title: 'roadmap.ai.personalizedRecs',
    description: 'roadmap.ai.personalizedRecsDesc',
    phase: 'roadmap.phase.nearTerm',
    phaseColor: 'bg-blue-100 dark:bg-blue-900',
    badgeColor: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    capabilities: [
      'roadmap.ai.personalizedRecs1',
      'roadmap.ai.personalizedRecs2',
      'roadmap.ai.personalizedRecs3',
    ],
  },
  {
    title: 'roadmap.ai.smartNotifications',
    description: 'roadmap.ai.smartNotificationsDesc',
    phase: 'roadmap.phase.nearTerm',
    phaseColor: 'bg-blue-100 dark:bg-blue-900',
    badgeColor: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    capabilities: [
      'roadmap.ai.smartNotifications1',
      'roadmap.ai.smartNotifications2',
      'roadmap.ai.smartNotifications3',
    ],
  },
  {
    title: 'roadmap.ai.contentDiscovery',
    description: 'roadmap.ai.contentDiscoveryDesc',
    phase: 'roadmap.phase.midTerm',
    phaseColor: 'bg-purple-100 dark:bg-purple-900',
    badgeColor: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    capabilities: [
      'roadmap.ai.contentDiscovery1',
      'roadmap.ai.contentDiscovery2',
      'roadmap.ai.contentDiscovery3',
    ],
  },
  {
    title: 'roadmap.ai.aiChatbot',
    description: 'roadmap.ai.aiChatbotDesc',
    phase: 'roadmap.phase.midTerm',
    phaseColor: 'bg-purple-100 dark:bg-purple-900',
    badgeColor: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    capabilities: ['roadmap.ai.aiChatbot1', 'roadmap.ai.aiChatbot2', 'roadmap.ai.aiChatbot3'],
  },
  {
    title: 'roadmap.ai.predictiveWatching',
    description: 'roadmap.ai.predictiveWatchingDesc',
    phase: 'roadmap.phase.longTerm',
    phaseColor: 'bg-indigo-100 dark:bg-indigo-900',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
    capabilities: [
      'roadmap.ai.predictiveWatching1',
      'roadmap.ai.predictiveWatching2',
      'roadmap.ai.predictiveWatching3',
    ],
  },
  {
    title: 'roadmap.ai.socialIntegration',
    description: 'roadmap.ai.socialIntegrationDesc',
    phase: 'roadmap.phase.longTerm',
    phaseColor: 'bg-indigo-100 dark:bg-indigo-900',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
    capabilities: [
      'roadmap.ai.socialIntegration1',
      'roadmap.ai.socialIntegration2',
      'roadmap.ai.socialIntegration3',
    ],
  },
]

// Technology stacks
const techStacks = [
  {
    category: 'roadmap.tech.frontend',
    items: [
      { name: 'Vue 3', icon: '⚡', purpose: 'UI Framework' },
      { name: 'TypeScript', icon: 'TS', purpose: 'Type Safety' },
      { name: 'Tailwind CSS', icon: '🎨', purpose: 'Styling' },
      { name: 'Pinia', icon: '🍍', purpose: 'State Management' },
    ],
  },
  {
    category: 'roadmap.tech.aiPotential',
    items: [
      { name: 'OpenAI GPT-4', icon: '🤖', purpose: 'Recommendations' },
      { name: 'TensorFlow.js', icon: '🧠', purpose: 'Client ML' },
      { name: 'Vector DB', icon: '🔍', purpose: 'Semantic Search' },
      { name: 'Hugging Face', icon: '🤗', purpose: 'NLP Models' },
    ],
  },
  {
    category: 'roadmap.tech.infrastructure',
    items: [
      { name: 'Vercel', icon: '▲', purpose: 'Hosting' },
      { name: 'PWA', icon: '📱', purpose: 'Offline Support' },
      { name: 'Service Worker', icon: '⚙️', purpose: 'Caching' },
      { name: 'Analytics', icon: '📊', purpose: 'Insights' },
    ],
  },
]
</script>
