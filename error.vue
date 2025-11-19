<template>
  <NuxtLayout>
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12"
    >
      <div class="max-w-2xl w-full">
        <!-- BingeList Logo -->
        <div class="text-center mb-8">
          <NuxtLink :to="localePath('/')" class="inline-block">
            <img
              src="/optimized/logo-main.png"
              alt="BingeList"
              width="300"
              height="90"
              class="h-20 w-auto mx-auto dark:brightness-110 hover:scale-105 transition-transform"
            />
          </NuxtLink>
        </div>

        <div
          class="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
        >
          <!-- Error Icon -->
          <div class="mb-8">
            <div
              v-if="error.statusCode === 404"
              class="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-primary-600 dark:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div
              v-else
              class="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <!-- Error Code -->
          <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {{ error.statusCode }}
          </h1>

          <!-- Error Message -->
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {{ errorTitle }}
          </h2>

          <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {{ errorMessage }}
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              class="btn-primary inline-flex items-center justify-center gap-2"
              @click="handleError"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {{ t('navigation.home') }}
            </button>

            <button
              v-if="error.statusCode !== 404"
              class="btn-secondary inline-flex items-center justify-center gap-2"
              @click="handleRetry"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ t('errors.tryAgain') }}
            </button>
          </div>

          <!-- Additional Help -->
          <div
            v-if="error.statusCode === 404"
            class="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('errors.lookingFor') }}
            </h3>
            <div class="flex flex-wrap gap-3 justify-center">
              <NuxtLink
                :to="localePath('/')"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ t('navigation.home') }}
              </NuxtLink>
              <span class="text-gray-400">•</span>
              <NuxtLink
                :to="localePath('/search')"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ t('navigation.search') }}
              </NuxtLink>
              <span class="text-gray-400">•</span>
              <NuxtLink
                :to="localePath('/watchlist')"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ t('navigation.watchlist') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Developer Info (only in dev mode) -->
        <div v-if="isDev" class="mt-8">
          <div
            class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left border border-gray-200 dark:border-gray-700"
          >
            <details>
              <summary class="cursor-pointer font-semibold text-gray-900 dark:text-white mb-2">
                Developer Info
              </summary>
              <pre class="text-xs text-gray-700 dark:text-gray-300 overflow-auto mt-2">{{
                error
              }}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

interface ErrorProps {
  error: {
    url?: string
    statusCode?: number
    statusMessage?: string
    message?: string
    description?: string
    data?: any
  }
}

const props = defineProps<ErrorProps>()

const isDev = import.meta.dev

const errorTitle = computed(() => {
  if (props.error.statusCode === 404) {
    return t('errors.notFound')
  } else if (props.error.statusCode === 500) {
    return t('errors.serverError')
  }
  return t('errors.somethingWrong')
})

const errorMessage = computed(() => {
  if (props.error.statusCode === 404) {
    return t('errors.notFoundMessage')
  } else if (props.error.statusCode === 500) {
    return t('errors.serverErrorMessage')
  }
  return props.error.message || t('errors.defaultMessage')
})

// SEO for error pages
useSEO({
  title: `${errorTitle.value} - BingeList`,
  description: errorMessage.value,
})

// Don't index error pages
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const handleError = () => {
  navigateTo(localePath('/'))
}

const handleRetry = () => {
  clearError({ redirect: props.error.url || '/' })
}
</script>
