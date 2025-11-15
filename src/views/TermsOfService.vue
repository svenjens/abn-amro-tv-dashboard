<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white" role="banner">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="flex items-center gap-4 mb-4">
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
        </div>
        <h1 class="text-3xl md:text-4xl font-bold">{{ t('legal.termsOfService') }}</h1>
        <p class="text-primary-100 mt-2">{{ t('legal.lastUpdated') }}: {{ lastUpdated }}</p>
      </div>
    </div>

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <article class="prose dark:prose-invert prose-lg max-w-none">
        <section>
          <h2>1. {{ t('legal.acceptanceOfTerms') }}</h2>
          <p>
            By accessing and using BingeList ("the Service"), you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. {{ t('legal.useOfService') }}</h2>
          <p>
            BingeList is a free TV show discovery and tracking platform. The Service is provided "as is" without
            any warranties, expressed or implied.
          </p>
          <p>You agree to:</p>
          <ul>
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to gain unauthorized access to any part of the Service</li>
            <li>Not interfere with or disrupt the Service or servers</li>
            <li>Not use automated systems to access the Service without permission</li>
          </ul>
        </section>

        <section>
          <h2>3. {{ t('legal.intellectualProperty') }}</h2>
          <p>
            All content, including but not limited to text, graphics, logos, and software, is the property of
            BingeList or its content suppliers and is protected by international copyright laws.
          </p>
          <p>
            TV show data, images, and metadata are provided by TVmaze API and remain the property of their
            respective owners.
          </p>
        </section>

        <section>
          <h2>4. {{ t('legal.userContent') }}</h2>
          <p>
            Your watchlist data is stored locally in your browser using localStorage. We do not collect or store
            this data on our servers. You are responsible for backing up your data.
          </p>
        </section>

        <section>
          <h2>5. {{ t('legal.thirdPartyServices') }}</h2>
          <p>The Service integrates with the following third-party services:</p>
          <ul>
            <li><strong>TVmaze API</strong> - TV show data provider</li>
            <li><strong>Google AdSense</strong> - Advertising (optional)</li>
            <li><strong>Vercel Analytics</strong> - Anonymous usage statistics</li>
          </ul>
          <p>These services have their own terms of service and privacy policies.</p>
        </section>

        <section>
          <h2>6. {{ t('legal.disclaimerOfWarranties') }}</h2>
          <p>
            The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed or
            implied, regarding the Service, including but not limited to:
          </p>
          <ul>
            <li>Accuracy, reliability, or completeness of content</li>
            <li>Availability or uninterrupted access</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
          </ul>
        </section>

        <section>
          <h2>7. {{ t('legal.limitationOfLiability') }}</h2>
          <p>
            In no event shall BingeList be liable for any direct, indirect, incidental, special, consequential,
            or punitive damages arising out of or related to your use of the Service.
          </p>
        </section>

        <section>
          <h2>8. {{ t('legal.modifications') }}</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon
            posting. Your continued use of the Service after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2>9. {{ t('legal.governingLaw') }}</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the Netherlands,
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>10. {{ t('legal.contact') }}</h2>
          <p>
            For questions about these terms, please visit our
            <a href="https://github.com/svenjens/tv-show-dashboard" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">
              GitHub repository
            </a>.
          </p>
        </section>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSEO } from '@/composables'
import SkipToContent from '@/components/SkipToContent.vue'

const { t } = useI18n()
const router = useRouter()

const lastUpdated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

onMounted(() => {
  useSEO({
    title: t('legal.termsOfService'),
    description: 'Terms of Service for BingeList - TV show discovery and tracking platform.',
  })
})
</script>

