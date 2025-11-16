<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <header
      class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white"
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
        <h1 class="text-3xl md:text-4xl font-bold">{{ t('legal.accessibilityTitle') }}</h1>
        <p class="text-primary-100 mt-2">{{ t('legal.commitment') }}</p>
      </div>
    </header>

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <LegalArticle>
        <section>
          <h2>{{ t('legal.ourCommitment') }}</h2>
          <p>{{ t('legal.accessibility.commitmentDesc') }}</p>
        </section>

        <section>
          <h2>{{ t('legal.conformanceStatus') }}</h2>
          <p>{{ t('legal.accessibility.statusDesc') }}</p>
        </section>

        <section>
          <h2>{{ t('legal.accessibilityFeatures') }}</h2>
          <p>{{ t('legal.accessibility.featuresIntro') }}</p>
          <ul>
            <li>
              <strong>{{ t('legal.accessibility.featureKeyboard') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.accessibility.featureScreenReader') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.accessibility.featureDarkMode') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.accessibility.featureSkip') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.accessibility.featureLanguage') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.accessibility.featureFocus') }}</strong>
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.knownLimitations') }}</h2>
          <p>{{ t('legal.accessibility.limitationsDesc') }}</p>
          <ul>
            <li>
              <strong>{{ t('legal.accessibility.limitationThirdParty') }}</strong>
            </li>
            <li>
              <strong>{{ t('legal.accessibility.limitationDynamic') }}</strong>
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.assistiveTechnologies') }}</h2>
          <p>{{ t('legal.accessibility.techIntro') }}</p>
          <ul>
            <li>{{ t('legal.accessibility.techItem1') }}</li>
            <li>{{ t('legal.accessibility.techItem2') }}</li>
            <li>{{ t('legal.accessibility.techItem3') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.feedback') }}</h2>
          <p>{{ t('legal.accessibility.feedbackDesc') }}</p>
        </section>

        <section>
          <h2>{{ t('legal.technicalSpecifications') }}</h2>
          <p>{{ t('legal.accessibility.specsIntro') }}</p>
          <ul>
            <li>{{ t('legal.accessibility.specItem1') }}</li>
            <li>{{ t('legal.accessibility.specItem2') }}</li>
            <li>{{ t('legal.accessibility.specItem3') }}</li>
            <li>{{ t('legal.accessibility.specItem4') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.ongoingEfforts') }}</h2>
          <p>{{ t('legal.accessibility.effortsDesc') }}</p>
        </section>

        <section>
          <h2>{{ t('legal.additionalResources') }}</h2>
          <p>{{ t('legal.accessibility.resourcesIntro') }}</p>
          <ul>
            <li>
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                target="_blank"
                rel="noopener noreferrer external"
                >{{ t('legal.accessibility.resourceWCAG') }}</a
              >
            </li>
            <li>
              <a
                href="https://www.a11yproject.com/"
                target="_blank"
                rel="noopener noreferrer external"
                >{{ t('legal.accessibility.resourceA11y') }}</a
              >
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.lastReviewed') }}</h2>
          <p>{{ t('legal.accessibility.reviewedDesc', { date: lastUpdated }) }}</p>
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

const { t, locale } = useI18n()
const router = useRouter()

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'nl' ? 'nl-NL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(() => {
  useSEO({
    title: t('legal.accessibility'),
    description:
      'Accessibility Statement for BingeList - Our commitment to WCAG 2.1 Level AA compliance.',
  })
})
</script>
