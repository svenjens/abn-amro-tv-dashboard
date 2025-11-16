<template>
  <footer class="bg-gray-900 text-gray-300 border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-white">BingeList</span>
          </div>
          <p class="text-sm text-gray-400 mb-4">
            {{ t('footer.tagline') }}
          </p>
          <div class="flex gap-4">
            <!-- Social links placeholder -->
            <a
              href="https://github.com/svenjens/tv-show-dashboard"
              target="_blank"
              rel="noopener noreferrer external"
              class="text-gray-400 hover:text-white transition-colors"
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
          <h3 class="text-white font-semibold mb-4">{{ t('footer.navigation') }}</h3>
          <ul class="space-y-3">
            <li>
              <router-link
                :to="{ name: 'home', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ t('navigation.home') }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'search', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ t('search.title') }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'watchlist', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ t('watchlist.title') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-white font-semibold mb-4">{{ t('footer.resources') }}</h3>
          <ul class="space-y-3">
            <li>
              <router-link
                :to="{ name: 'roadmap', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                {{ t('roadmap.title') }}
              </router-link>
            </li>
            <li>
              <a
                href="https://github.com/svenjens/tv-show-dashboard"
                target="_blank"
                rel="noopener noreferrer external"
                class="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ t('footer.sourceCode') }}
              </a>
            </li>
            <li>
              <a
                href="https://www.tvmaze.com"
                target="_blank"
                rel="noopener noreferrer external"
                class="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                {{ t('footer.apiProvider') }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal & Languages -->
        <div>
          <h3 class="text-white font-semibold mb-4">{{ t('footer.languages') }}</h3>
          <ul class="space-y-3 mb-6">
            <li>
              <button
                class="text-gray-400 hover:text-white transition-colors text-sm text-left"
                @click="switchLocale('en')"
              >
                🇬🇧 English
              </button>
            </li>
            <li>
              <button
                class="text-gray-400 hover:text-white transition-colors text-sm text-left"
                @click="switchLocale('nl')"
              >
                🇳🇱 Nederlands
              </button>
            </li>
          </ul>

          <h3 class="text-white font-semibold mb-4">{{ t('footer.legal') }}</h3>
          <ul class="space-y-3">
            <li>
              <router-link
                :to="{ name: 'terms', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ t('legal.termsOfService') }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'privacy', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ t('legal.privacyPolicy') }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'disclaimer', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ t('legal.disclaimer') }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'accessibility-statement', params: { locale: currentLocale } }"
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ t('legal.accessibility') }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-500">
            © {{ currentYear }} BingeList. {{ t('footer.rights') }}
          </p>
          <p class="text-sm text-gray-500">
            {{ t('footer.madeWith') }}
            <a
              href="https://vuejs.org"
              target="_blank"
              rel="noopener noreferrer external"
              class="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Vue 3
            </a>
            {{ t('footer.and') }}
            <a
              href="https://www.typescriptlang.org"
              target="_blank"
              rel="noopener noreferrer external"
              class="text-primary-400 hover:text-primary-300 transition-colors"
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
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const currentYear = new Date().getFullYear()
const currentLocale = computed(() => (route.params.locale as string) || 'en')

function switchLocale(newLocale: string) {
  const currentPath = route.path
  const newPath = currentPath.replace(`/${currentLocale.value}`, `/${newLocale}`)
  router.push(newPath)
}
</script>

