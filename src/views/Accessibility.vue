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
        <h1 class="text-3xl md:text-4xl font-bold">{{ t('legal.accessibility') }}</h1>
        <p class="text-primary-100 mt-2">{{ t('legal.commitment') }}</p>
      </div>
    </div>

    <!-- Content -->
    <main id="main-content" class="max-w-4xl mx-auto px-4 py-12" tabindex="-1">
      <article class="prose dark:prose-invert prose-lg max-w-none">
        <section>
          <h2>{{ t('legal.ourCommitment') }}</h2>
          <p>
            BingeList is committed to ensuring digital accessibility for people with disabilities. We are
            continually improving the user experience for everyone and applying the relevant accessibility
            standards.
          </p>
        </section>

        <section>
          <h2>{{ t('legal.conformanceStatus') }}</h2>
          <p>
            We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>
            standards. These guidelines explain how to make web content more accessible for people with
            disabilities.
          </p>
          <p>
            BingeList is <strong>partially conformant</strong> with WCAG 2.1 Level AA. This means some parts
            of the content do not fully conform to the accessibility standard.
          </p>
        </section>

        <section>
          <h2>{{ t('legal.accessibilityFeatures') }}</h2>
          <p>Our Service includes the following accessibility features:</p>

          <h3>Keyboard Navigation</h3>
          <ul>
            <li>Full keyboard navigation support with Tab, Enter, and arrow keys</li>
            <li>"Skip to main content" link for screen reader users</li>
            <li>Visible focus indicators on interactive elements</li>
            <li>Logical tab order throughout the interface</li>
          </ul>

          <h3>Screen Reader Support</h3>
          <ul>
            <li>Semantic HTML with proper heading hierarchy</li>
            <li>ARIA labels and descriptions where appropriate</li>
            <li>Alternative text for images and icons</li>
            <li>Screen reader-only text for context</li>
          </ul>

          <h3>Visual Accessibility</h3>
          <ul>
            <li><strong>Dark Mode</strong> - Reduce eye strain with our dark theme</li>
            <li><strong>High Contrast</strong> - Text meets WCAG color contrast requirements</li>
            <li><strong>Responsive Design</strong> - Works on all screen sizes</li>
            <li><strong>Focus Indicators</strong> - Clear visual indication of focused elements</li>
          </ul>

          <h3>Content Accessibility</h3>
          <ul>
            <li>Clear, descriptive link text</li>
            <li>Consistent navigation across pages</li>
            <li>Error messages that are clear and helpful</li>
            <li>No time limits on content consumption</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.knownLimitations') }}</h2>
          <p>Despite our best efforts, some limitations may exist:</p>
          
          <h3>Third-Party Content</h3>
          <ul>
            <li><strong>TV Show Images</strong> - Some images from TVmaze may lack descriptive alt text</li>
            <li><strong>AdSense Ads</strong> - Third-party advertisements may not be fully accessible</li>
          </ul>

          <h3>Browser Compatibility</h3>
          <ul>
            <li>The Service requires modern browser features (ES6+, CSS Grid, localStorage)</li>
            <li>Older browsers or assistive technologies may have limited support</li>
          </ul>

          <h3>Dynamic Content</h3>
          <ul>
            <li>Some dynamic loading states may not be announced optimally to screen readers</li>
            <li>Infinite scroll pagination may require keyboard shortcuts</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.assistiveTechnologies') }}</h2>
          <p>BingeList has been tested with the following combinations:</p>
          <ul>
            <li><strong>Screen Readers:</strong> NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)</li>
            <li><strong>Browsers:</strong> Chrome, Firefox, Safari, Edge (latest versions)</li>
            <li><strong>Keyboard:</strong> Standard keyboard navigation without mouse</li>
            <li><strong>Zoom:</strong> Browser zoom up to 200%</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.feedback') }}</h2>
          <p>
            We welcome your feedback on the accessibility of BingeList. Please let us know if you encounter
            accessibility barriers:
          </p>
          <ul>
            <li><strong>GitHub:</strong> Report issues on our
              <a href="https://github.com/svenjens/tv-show-dashboard/issues" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">
                GitHub repository
              </a>
            </li>
            <li><strong>Response Time:</strong> We aim to respond within 5 business days</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.technicalSpecifications') }}</h2>
          <p>Accessibility of BingeList relies on the following technologies:</p>
          <ul>
            <li><strong>HTML5</strong> - Semantic markup</li>
            <li><strong>CSS3</strong> - Responsive design and styling</li>
            <li><strong>JavaScript (ES6+)</strong> - Interactive functionality</li>
            <li><strong>Vue.js 3</strong> - Framework for UI components</li>
            <li><strong>ARIA</strong> - Accessible Rich Internet Applications attributes</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.ongoingEfforts') }}</h2>
          <p>We are actively working to improve accessibility:</p>
          <ul>
            <li><strong>Automated Testing</strong> - Pa11y-CI runs on every build</li>
            <li><strong>Manual Testing</strong> - Regular keyboard and screen reader testing</li>
            <li><strong>Code Reviews</strong> - Accessibility checks in pull requests</li>
            <li><strong>User Feedback</strong> - Incorporating accessibility feedback from users</li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.additionalResources') }}</h2>
          <p>Learn more about web accessibility:</p>
          <ul>
            <li>
              <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">
                WCAG 2.1 Quick Reference
              </a>
            </li>
            <li>
              <a href="https://webaim.org/" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">
                WebAIM - Web Accessibility In Mind
              </a>
            </li>
            <li>
              <a href="https://www.a11yproject.com/" target="_blank" rel="noopener noreferrer external" class="text-primary-600 dark:text-primary-400 hover:underline">
                The A11Y Project
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ t('legal.lastReviewed') }}</h2>
          <p>
            This accessibility statement was last reviewed on <strong>{{ lastUpdated }}</strong>.
          </p>
          <p>
            We review and update this statement regularly to reflect our ongoing accessibility improvements.
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
    title: t('legal.accessibility'),
    description: 'Accessibility Statement for BingeList - Our commitment to WCAG 2.1 Level AA compliance.',
  })
})
</script>

