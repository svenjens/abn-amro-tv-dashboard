<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <div
      class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
      role="banner"
    >
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-4">
          <button
            class="inline-flex items-center gap-2 hover:text-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded-lg px-2 py-1"
            :aria-label="t('navigation.back')"
            @click="router.back()"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h1 class="text-3xl md:text-4xl font-bold">{{ t('legal.privacyPolicy') }}</h1>
        <p class="text-primary-100 mt-2">{{ t('legal.lastUpdated') }}: {{ lastUpdated }}</p>
      </div>
    </div>

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <LegalArticle>
        <section>
          <h2>1. {{ t('legal.introduction') }}</h2>
          <p>{{ t('legal.privacy.intro') }}</p>
        </section>

        <section>
          <h2>2. {{ t('legal.dataWeCollect') }}</h2>
          <h3>a. {{ t('legal.personalData') }}</h3>
          <p>{{ t('legal.privacy.personalDataDesc') }}</p>
          <h3>b. {{ t('legal.nonPersonalData') }}</h3>
          <p>{{ t('legal.privacy.nonPersonalDataDesc') }}</p>
        </section>

        <section>
          <h2>3. {{ t('legal.cookies') }}</h2>
          <p>{{ t('legal.privacy.cookiesIntro') }}</p>
          <ul>
            <li>
              <strong>{{ t('legal.privacy.cookieTheme') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.privacy.cookieWatchlist') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.privacy.cookieSearches') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.privacy.cookieThirdParty') }}</strong>
              <ul>
                <li>
                  <SafeHtml
                    :content="t('legal.privacy.cookieTVMaze', { tvmazePolicy: tvmazeLink })"
                  />
                </li>
                <li>
                  <SafeHtml
                    :content="t('legal.privacy.cookieAdSense', { adSettings: adSettingsLink })"
                  />
                </li>
                <li>
                  <SafeHtml
                    :content="t('legal.privacy.cookieVercel', { vercelPolicy: vercelLink })"
                  />
                </li>
              </ul>
            </li>
          </ul>
          <p>{{ t('legal.privacy.cookieConfig') }}</p>
        </section>

        <section>
          <h2>4. {{ t('legal.howWeUseData') }}</h2>
          <p>{{ t('legal.privacy.useDataIntro') }}</p>
          <ul>
            <li>{{ t('legal.privacy.useDataItem1') }}</li>
            <li>{{ t('legal.privacy.useDataItem2') }}</li>
            <li>{{ t('legal.privacy.useDataItem3') }}</li>
            <li>{{ t('legal.privacy.useDataItem4') }}</li>
          </ul>
        </section>

        <section>
          <h2>5. {{ t('legal.dataRetention') }}</h2>
          <p>{{ t('legal.privacy.retentionDesc') }}</p>
        </section>

        <section>
          <h2>6. {{ t('legal.yourRights') }}</h2>
          <p>{{ t('legal.privacy.rightsDesc') }}</p>
        </section>

        <section>
          <h2>7. {{ t('legal.dataSecurity') }}</h2>
          <p>{{ t('legal.privacy.securityDesc') }}</p>
        </section>

        <section>
          <h2>8. {{ t('legal.childrenPrivacy') }}</h2>
          <p>{{ t('legal.privacy.childrenDesc') }}</p>
        </section>

        <section>
          <h2>9. {{ t('legal.gdprCompliance') }}</h2>
          <p>{{ t('legal.privacy.gdprDesc') }}</p>
        </section>

        <section>
          <h2>10. {{ t('legal.changes') }}</h2>
          <p>{{ t('legal.privacy.changesDesc') }}</p>
        </section>

        <section>
          <h2>11. {{ t('legal.contact') }}</h2>
          <p>{{ t('legal.privacy.contactDesc') }}</p>
        </section>
      </LegalArticle>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSEO } from '@/composables'
import SkipToContent from '@/components/SkipToContent.vue'
import LegalArticle from '@/components/LegalArticle.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import SafeHtml from '@/components/SafeHtml.vue'

const { t, locale } = useI18n()
const router = useRouter()

const tvmazeLink =
  '<a href="https://www.tvmaze.com/privacy" target="_blank" rel="noopener noreferrer external">TVmaze Privacy Policy</a>'
const adSettingsLink =
  '<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer external">Google Ad Settings</a>'
const vercelLink =
  '<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer external">Vercel Privacy Policy</a>'

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'nl' ? 'nl-NL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(() => {
  useSEO({
    title: t('legal.privacyPolicy'),
    description: 'Privacy Policy and Cookie information for BingeList - How we protect your data.',
  })
})
</script>
