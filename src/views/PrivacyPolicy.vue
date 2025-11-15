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
        <h1 class="text-3xl md:text-4xl font-bold">{{ t('legal.privacyPolicy') }}</h1>
        <p class="text-primary-100 mt-2">{{ t('legal.lastUpdated') }}: {{ lastUpdated }}</p>
      </div>
    </div>

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <article class="prose dark:prose-invert prose-lg max-w-none">
        <section>
          <h2>1. {{ t('legal.introduction') }}</h2>
          <p>
            BingeList ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, and safeguard your information when you use our Service.
          </p>
        </section>

        <section>
          <h2>2. {{ t('legal.dataWeCollect') }}</h2>
          
          <h3>2.1 Information You Provide</h3>
          <p>We do not require you to create an account. However, we may collect:</p>
          <ul>
            <li><strong>Watchlist Data</strong> - Stored locally in your browser (localStorage)</li>
            <li><strong>Theme Preferences</strong> - Stored locally in your browser</li>
            <li><strong>Language Preferences</strong> - Stored locally in your browser</li>
          </ul>
          <p class="font-semibold text-primary-600 dark:text-primary-400">
            ℹ️ This data never leaves your device. We do not have access to it.
          </p>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you visit our Service, we may automatically collect:</p>
          <ul>
            <li><strong>Usage Statistics</strong> - Anonymous page views via Vercel Analytics</li>
            <li><strong>Device Information</strong> - Browser type, operating system</li>
            <li><strong>Performance Metrics</strong> - Page load times, error logs</li>
          </ul>
        </section>

        <section>
          <h2>3. {{ t('legal.cookies') }}</h2>
          <p>We use the following types of cookies and local storage:</p>
          
          <h3>3.1 Essential Storage</h3>
          <ul>
            <li><strong>localStorage</strong> - Watchlist, theme, language preferences</li>
            <li>These are essential for the Service to function</li>
          </ul>

          <h3>3.2 Analytics Cookies</h3>
          <ul>
            <li><strong>Vercel Analytics</strong> - Anonymous usage statistics</li>
            <li>No personally identifiable information is collected</li>
          </ul>

          <h3>3.3 Advertising Cookies (Optional)</h3>
          <ul>
            <li><strong>Google AdSense</strong> - If configured by the site owner</li>
            <li>See Google's Privacy Policy for more information</li>
          </ul>
        </section>

        <section>
          <h2>4. {{ t('legal.thirdPartyServices') }}</h2>
          
          <h3>4.1 TVmaze API</h3>
          <p>
            We use TVmaze API to fetch TV show data. When you search for shows, your query is sent to TVmaze.
            See <a href="https://www.tvmaze.com/privacy" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">TVmaze Privacy Policy</a>.
          </p>

          <h3>4.2 Vercel (Hosting & Analytics)</h3>
          <p>
            Our Service is hosted on Vercel. Anonymous analytics data is collected to improve performance.
            See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">Vercel Privacy Policy</a>.
          </p>

          <h3>4.3 Google AdSense (Optional)</h3>
          <p>
            If enabled, Google AdSense may display personalized ads based on your browsing history.
            See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">Google Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2>5. {{ t('legal.howWeUseData') }}</h2>
          <p>We use collected data to:</p>
          <ul>
            <li>Provide and maintain the Service</li>
            <li>Improve user experience and functionality</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Detect and prevent technical issues</li>
            <li>Display relevant advertisements (if AdSense is enabled)</li>
          </ul>
        </section>

        <section>
          <h2>6. {{ t('legal.dataRetention') }}</h2>
          <p>
            <strong>Local Data:</strong> Your watchlist and preferences remain in your browser until you clear
            your browser data or use our "Clear All" feature.
          </p>
          <p>
            <strong>Analytics Data:</strong> Anonymous usage statistics are retained by Vercel according to
            their data retention policy.
          </p>
        </section>

        <section>
          <h2>7. {{ t('legal.yourRights') }}</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> - View your local data in browser DevTools</li>
            <li><strong>Delete</strong> - Clear your watchlist and preferences at any time</li>
            <li><strong>Opt-out</strong> - Use browser settings to block cookies</li>
            <li><strong>Data Portability</strong> - Export your data (stored locally in your browser)</li>
          </ul>
        </section>

        <section>
          <h2>8. {{ t('legal.dataSecurity') }}</h2>
          <p>
            We implement security measures to protect your data:
          </p>
          <ul>
            <li>HTTPS encryption for all connections</li>
            <li>No server-side storage of personal data</li>
            <li>Content Security Policy (CSP) headers</li>
            <li>Regular security updates and patches</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute
            security.
          </p>
        </section>

        <section>
          <h2>9. {{ t('legal.childrenPrivacy') }}</h2>
          <p>
            Our Service is not directed to children under 13. We do not knowingly collect personal information
            from children. If you believe we have collected such information, please contact us.
          </p>
        </section>

        <section>
          <h2>10. {{ t('legal.gdprCompliance') }}</h2>
          <p>
            For users in the European Union, we comply with GDPR by:
          </p>
          <ul>
            <li>Minimizing data collection</li>
            <li>Storing data locally on your device</li>
            <li>Providing transparency about data usage</li>
            <li>Respecting your rights to access and delete data</li>
          </ul>
        </section>

        <section>
          <h2>11. {{ t('legal.changes') }}</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an
            updated "Last Updated" date. Your continued use of the Service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2>12. {{ t('legal.contact') }}</h2>
          <p>
            For privacy-related questions, please visit our
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
    title: t('legal.privacyPolicy'),
    description: 'Privacy Policy and Cookie information for BingeList - How we protect your data.',
  })
})
</script>

