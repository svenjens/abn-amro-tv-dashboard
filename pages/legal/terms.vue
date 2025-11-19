<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <PageHeader
      :title="t('legal.termsOfService')"
      :subtitle="`${t('legal.lastUpdated')}: ${lastUpdated}`"
    />

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <LegalArticle>
        <section>
          <h2>1. {{ t('legal.acceptanceOfTerms') }}</h2>
          <p>{{ t('legal.terms.acceptance') }}</p>
        </section>

        <section>
          <h2>2. {{ t('legal.useOfService') }}</h2>
          <p>{{ t('legal.terms.useDesc') }}</p>
        </section>

        <section>
          <h2>3. {{ t('legal.intellectualProperty') }}</h2>
          <p>
            {{ t('legal.terms.ipDesc', { tvmaze: tvmazeLink }) }}
          </p>
        </section>

        <section>
          <h2>4. {{ t('legal.userContent') }}</h2>
          <p>{{ t('legal.terms.userContentDesc') }}</p>
        </section>

        <section>
          <h2>5. {{ t('legal.thirdPartyServices') }}</h2>
          <p>{{ t('legal.terms.thirdPartyDesc') }}</p>
        </section>

        <section>
          <h2>6. {{ t('legal.disclaimerOfWarranties') }}</h2>
          <p>{{ t('legal.terms.warrantyDesc') }}</p>
        </section>

        <section>
          <h2>7. {{ t('legal.limitationOfLiability') }}</h2>
          <p>{{ t('legal.terms.liabilityDesc') }}</p>
        </section>

        <section>
          <h2>8. {{ t('legal.modifications') }}</h2>
          <p>{{ t('legal.terms.modificationsDesc') }}</p>
        </section>

        <section>
          <h2>9. {{ t('legal.governingLaw') }}</h2>
          <p>{{ t('legal.terms.lawDesc') }}</p>
        </section>

        <section>
          <h2>10. {{ t('legal.contact') }}</h2>
          <p>{{ t('legal.terms.contactDesc') }}</p>
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
    title: t('legal.termsOfService'),
    description: 'Terms of Service for BingeList - TV show discovery and tracking platform.',
  })
})
</script>
