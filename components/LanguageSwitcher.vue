<template>
  <div class="relative">
    <button
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all duration-200 active:scale-95 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
      :aria-label="t('accessibility.toggleLanguage')"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <Icon name="heroicons:language" class="h-5 w-5" />
      <span class="uppercase">{{ currentLocale }}</span>
      <Icon
        name="heroicons:chevron-down"
        class="h-4 w-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
      >
        <div class="py-1" role="menu" aria-orientation="vertical">
          <button
            v-for="loc in availableLocales"
            :key="loc.code"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            :class="{ 'bg-gray-50 dark:bg-gray-700 font-semibold': loc.code === currentLocale }"
            role="menuitem"
            @click="changeLanguage(loc.code)"
          >
            <span>{{ loc.name }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ loc.code }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { t, locale, setLocale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const isOpen = ref(false)
const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

async function changeLanguage(newLocale: string) {
  if (newLocale === currentLocale.value) {
    isOpen.value = false
    return
  }

  // Use Nuxt i18n's setLocale to change language
  await setLocale(newLocale as 'en' | 'nl' | 'es')

  // Navigate to the same page in the new locale
  const newPath = switchLocalePath(newLocale as 'en' | 'nl' | 'es')
  await navigateTo(newPath)

  isOpen.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  })
})
</script>
