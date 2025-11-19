<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <PageHeader
      :title="t('legal.disclaimerTitle')"
      :subtitle="`${t('legal.lastUpdated')}: ${lastUpdated}`"
    />

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <LegalArticle>
        <section>
          <h2>1. {{ t('legal.generalDisclaimer') }}</h2>
          <p>{{ t('legal.disclaimer.generalDesc') }}</p>
        </section>

        <section>
          <h2>2. {{ t('legal.contentAccuracy') }}</h2>
          <SafeHtml :content="t('legal.disclaimer.accuracyDesc', { tvmaze: tvmazeLink })" />
        </section>

        <section>
          <h2>3. {{ t('legal.externalLinks') }}</h2>
          <p>{{ t('legal.disclaimer.linksDesc') }}</p>
        </section>

        <section>
          <h2>4. {{ t('legal.copyrightNotice') }}</h2>
          <p>{{ t('legal.disclaimer.copyrightDesc') }}</p>
        </section>

        <section>
          <h2>5. {{ t('legal.noWarranties') }}</h2>
          <p>{{ t('legal.disclaimer.warrantiesDesc') }}</p>
          <ul>
            <li>{{ t('legal.disclaimer.warrantiesItem1') }}</li>
            <li>{{ t('legal.disclaimer.warrantiesItem2') }}</li>
          </ul>
        </section>

        <section>
          <h2>6. {{ t('legal.userResponsibility') }}</h2>
          <p>{{ t('legal.disclaimer.responsibilityDesc') }}</p>
        </section>

        <section>
          <h2>7. {{ t('legal.dataLoss') }}</h2>
          <p>{{ t('legal.disclaimer.lossDesc') }}</p>
        </section>

        <section>
          <h2>8. {{ t('legal.availabilityDisclaimer') }}</h2>
          <p>{{ t('legal.disclaimer.availabilityDesc') }}</p>
        </section>

        <section>
          <h2>9. {{ t('legal.fairUseStatement') }}</h2>
          <p>{{ t('legal.disclaimer.fairUseDesc') }}</p>
        </section>

        <section>
          <h2>10. {{ t('legal.contact') }}</h2>
          <p>{{ t('legal.disclaimer.contactDesc') }}</p>
        </section>
      </LegalArticle>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useSEO } from '@/composables'
import SkipToContent from '@/components/SkipToContent.client.vue'
import LegalArticle from '@/components/LegalArticle.vue'
import SafeHtml from '@/components/SafeHtml.vue'

const { t, locale } = useI18n()

const tvmazeLink =
  '<a href="https://www.tvmaze.com" target="_blank" rel="noopener noreferrer external">TVmaze.com</a>'

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'nl' ? 'nl-NL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(() => {
  useSEO({
    title: t('legal.disclaimerTitle'),
    description:
      'Disclaimer for BingeList - Information about service limitations and liabilities.',
  })
})
</script>
