<template>
  <footer
    class="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 transition-colors"
  >
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <img
              src="/optimized/logo-main.png"
              alt="BingeList Logo"
              class="h-10 w-10 object-contain"
              width="40"
              height="40"
            />
            <span class="text-xl font-bold text-gray-900 dark:text-white">BingeList</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ t('footer.tagline') }}
          </p>
          <div class="flex gap-4">
            <!-- Social links placeholder -->
            <a
              href="https://github.com/svenjens/tv-show-dashboard"
              target="_blank"
              rel="noopener noreferrer external"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-4">
            {{ t('footer.navigation') }}
          </h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                :to="localePath('/')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                {{ t('navigation.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/search')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                {{ t('search.title') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/watchlist')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                {{ t('watchlist.title') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-4">
            {{ t('footer.resources') }}
          </h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                :to="localePath('/roadmap')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm inline-flex items-center gap-2"
              >
                <Icon name="heroicons:light-bulb" class="w-4 h-4" />
                {{ t('roadmap.title') }}
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://github.com/svenjens/tv-show-dashboard"
                target="_blank"
                rel="noopener noreferrer external"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm inline-flex items-center gap-2"
              >
                <Icon name="heroicons:code-bracket" class="w-4 h-4" />
                {{ t('footer.sourceCode') }}
              </a>
            </li>
            <li>
              <a
                href="https://www.tvmaze.com"
                target="_blank"
                rel="noopener noreferrer external"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm inline-flex items-center gap-2"
              >
                <Icon name="heroicons:link" class="w-4 h-4" />
                {{ t('footer.apiProvider') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal & Languages -->
        <div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-4">
            {{ t('footer.languages') }}
          </h3>
          <ul class="space-y-3 mb-6">
            <li>
              <button
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm text-left"
                @click="switchLocale('en')"
              >
                🇬🇧 English
              </button>
            </li>
            <li>
              <button
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm text-left"
                @click="switchLocale('nl')"
              >
                🇳🇱 Nederlands
              </button>
            </li>
            <li>
              <button
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm text-left"
                @click="switchLocale('es')"
              >
                🇪🇸 Español
              </button>
            </li>
          </ul>

          <h3 class="text-gray-900 dark:text-white font-semibold mb-4">{{ t('footer.legal') }}</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                :to="localePath('/legal/terms')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                {{ t('legal.termsOfService') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/legal/privacy')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                {{ t('legal.privacyPolicy') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/legal/disclaimer')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                {{ t('legal.disclaimerTitle') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/legal/accessibility')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                {{ t('legal.accessibilityTitle') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-gray-200 dark:border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © {{ currentYear }} BingeList. {{ t('footer.rights') }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('footer.madeWith') }}
            <a
              href="https://vuejs.org"
              target="_blank"
              rel="noopener noreferrer external"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Vue 3
            </a>
            {{ t('footer.and') }}
            <a
              href="https://www.typescriptlang.org"
              target="_blank"
              rel="noopener noreferrer external"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              TypeScript
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const currentYear = new Date().getFullYear()
const currentLocale = computed(() => (route.params.locale as string) || 'en')

function switchLocale(newLocale: string) {
  const currentPath = route.path
  const newPath = currentPath.replace(`/${currentLocale.value}`, `/${newLocale}`)
  router.push(newPath)
}
</script>
