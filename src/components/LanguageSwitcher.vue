<template>
  <div
    v-motion
    :initial="{ opacity: 0, scale: 0.9 }"
    :visible="{ opacity: 1, scale: 1, transition: { duration: 300, delay: 100 } }"
    class="relative"
  >
    <button
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all duration-200 active:scale-95"
      :aria-label="t('accessibility.toggleLanguage')"
      @click="toggleLanguage"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span class="uppercase">{{ currentLocale }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { setCurrentLocale } from '@/i18n/helpers'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

const currentLocale = computed(() => locale.value)

function toggleLanguage() {
  const newLocale = currentLocale.value === 'en' ? 'nl' : 'en'
  setCurrentLocale(newLocale as 'en' | 'nl')

  // Update route path to reflect new locale, preserving query params
  const pathWithoutLocale = route.path.replace(/^\/(en|nl)/, '') || '/'
  router.push({
    path: `/${newLocale}${pathWithoutLocale}`,
    query: route.query,
  })
}
</script>
