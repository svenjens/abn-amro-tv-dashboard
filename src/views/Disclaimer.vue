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
        <h1 class="text-3xl md:text-4xl font-bold">{{ t('legal.disclaimer') }}</h1>
        <p class="text-primary-100 mt-2">{{ t('legal.lastUpdated') }}: {{ lastUpdated }}</p>
      </div>
    </div>

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <article class="prose dark:prose-invert prose-lg max-w-none">
        <section>
          <h2>1. {{ t('legal.generalDisclaimer') }}</h2>
          <p>
            The information provided by BingeList ("we", "us", or "our") on bingelist.app (the "Service") is
            for general informational purposes only. All information on the Service is provided in good faith,
            however we make no representation or warranty of any kind, express or implied, regarding the
            accuracy, adequacy, validity, reliability, availability, or completeness of any information on the
            Service.
          </p>
        </section>

        <section>
          <h2>2. {{ t('legal.contentAccuracy') }}</h2>
          <p>
            <strong>TV Show Data:</strong> All TV show information, including titles, descriptions, air dates,
            ratings, and images, is provided by the TVmaze API. We do not verify the accuracy of this
            information and are not responsible for any errors, omissions, or inconsistencies in the data.
          </p>
          <p>
            Information may be outdated or incorrect. Users should verify important information (such as air
            dates or episode numbers) through official sources before making decisions based on it.
          </p>
        </section>

        <section>
          <h2>3. {{ t('legal.externalLinks') }}</h2>
          <p>
            The Service may contain links to external websites (including official show websites and TVmaze).
            These links are provided for your convenience to provide further information. We have no control
            over the nature, content, and availability of those sites.
          </p>
          <p>
            The inclusion of any links does not necessarily imply a recommendation or endorse the views
            expressed within them. We are not responsible for the content of external websites.
          </p>
        </section>

        <section>
          <h2>4. {{ t('legal.copyrightNotice') }}</h2>
          <p>
            <strong>Trademarks & Copyright:</strong> All TV show names, logos, images, and related content are
            trademarks and/or copyrights of their respective owners. BingeList is not affiliated with,
            endorsed by, or sponsored by any TV shows, networks, or production companies.
          </p>
          <p>
            We display this content under fair use for informational and discovery purposes only. If you
            believe any content infringes your copyright, please contact us via our GitHub repository.
          </p>
        </section>

        <section>
          <h2>5. {{ t('legal.noWarranties') }}</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Service is at your
            sole risk. To the fullest extent permitted by law, we disclaim all warranties, whether express or
            implied, including but not limited to:
          </p>
          <ul>
            <li>Implied warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy of information</li>
            <li>Uninterrupted or error-free service</li>
          </ul>
        </section>

        <section>
          <h2>6. {{ t('legal.userResponsibility') }}</h2>
          <p>
            You are responsible for:
          </p>
          <ul>
            <li><strong>Backing up your data</strong> - Your watchlist is stored locally in your browser</li>
            <li><strong>Verifying information</strong> - Check official sources for important details</li>
            <li><strong>Complying with laws</strong> - Ensure your use complies with local regulations</li>
            <li><strong>Browser compatibility</strong> - Ensuring your browser supports modern web standards</li>
          </ul>
        </section>

        <section>
          <h2>7. {{ t('legal.thirdPartyServices') }}</h2>
          <p>
            The Service integrates with third-party services:
          </p>
          <ul>
            <li><strong>TVmaze API</strong> - We are not responsible for their service availability or data accuracy</li>
            <li><strong>Google AdSense</strong> - Advertisements are provided by Google; we do not control ad content</li>
            <li><strong>Vercel</strong> - Hosting and analytics; service availability is subject to their terms</li>
          </ul>
          <p>
            We are not liable for any issues, downtime, or problems caused by these third-party services.
          </p>
        </section>

        <section>
          <h2>8. {{ t('legal.dataLoss') }}</h2>
          <p>
            <strong>No Guarantees:</strong> Since your watchlist is stored in your browser's localStorage, we
            cannot guarantee against data loss. Data may be lost if you:
          </p>
          <ul>
            <li>Clear your browser cache/cookies</li>
            <li>Use incognito/private browsing mode</li>
            <li>Switch browsers or devices</li>
            <li>Experience browser crashes or errors</li>
          </ul>
          <p>
            We strongly recommend periodically exporting or backing up your watchlist data.
          </p>
        </section>

        <section>
          <h2>9. {{ t('legal.availabilityDisclaimer') }}</h2>
          <p>
            We do not guarantee that:
          </p>
          <ul>
            <li>The Service will be available at all times</li>
            <li>The Service will be free from bugs or errors</li>
            <li>Any defects will be corrected</li>
            <li>The Service will meet your specific requirements</li>
          </ul>
          <p>
            We reserve the right to suspend, discontinue, or modify the Service at any time without notice.
          </p>
        </section>

        <section>
          <h2>10. {{ t('legal.limitationOfLiability') }}</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall BingeList or its developers
            be liable for any indirect, incidental, special, consequential, or punitive damages, including
            without limitation:
          </p>
          <ul>
            <li>Loss of profits, data, or use</li>
            <li>Business interruption</li>
            <li>Personal injury or property damage</li>
            <li>Any other damages arising from your use of the Service</li>
          </ul>
          <p>
            Even if we have been advised of the possibility of such damages.
          </p>
        </section>

        <section>
          <h2>11. {{ t('legal.fairUseStatement') }}</h2>
          <p>
            BingeList is a non-commercial, educational project designed to help users discover and track TV
            shows. We believe our use of TV show data and imagery constitutes fair use under copyright law.
            All content is used solely for informational purposes, with proper attribution to TVmaze and
            original copyright holders.
          </p>
        </section>

        <section>
          <h2>12. {{ t('legal.changes') }}</h2>
          <p>
            We reserve the right to update this disclaimer at any time. Changes will be effective immediately
            upon posting. Your continued use of the Service constitutes acceptance of the updated disclaimer.
          </p>
        </section>

        <section>
          <h2>13. {{ t('legal.contact') }}</h2>
          <p>
            For questions or concerns about this disclaimer, please visit our
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
    title: t('legal.disclaimer'),
    description: 'Disclaimer for BingeList - Information about service limitations and liabilities.',
  })
})
</script>

