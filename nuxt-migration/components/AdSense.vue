<template>
  <div v-if="shouldShowAd" class="ad-container my-8">
    <!-- Ad Label -->
    <p class="text-xs text-gray-500 text-center mb-2">{{ t('ads.sponsored') }}</p>

    <!-- AdSense Ad Unit -->
    <div class="ad-wrapper flex justify-center">
      <ins
        class="adsbygoogle"
        :style="adStyle"
        :data-ad-client="adClient"
        v-bind="adSlot ? { 'data-ad-slot': adSlot } : {}"
        :data-ad-format="format"
        data-full-width-responsive="true"
      ></ins>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { logger } from '@/utils'

interface Props {
  adSlot?: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  style?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  adSlot: undefined,
  format: 'auto',
  style: () => ({ display: 'block' }),
})

const { t } = useI18n()

// Get AdSense client ID from environment
const adClient = import.meta.env.VITE_GOOGLE_ADSENSE_ID || ''

// Only show ads in production and if client ID is configured
const shouldShowAd = computed(() => {
  return import.meta.env.PROD && adClient !== '' && adClient !== 'ca-pub-XXXXXXXXXXXXXXXX'
})

const adStyle = computed(() => {
  return {
    display: props.style.display || 'block',
    ...props.style,
  }
})

const adPushed = ref(false)
const scriptLoaded = ref(false)

// Load AdSense script dynamically
const loadAdSenseScript = () => {
  if (!shouldShowAd.value || scriptLoaded.value) return

  // Check if script already exists
  const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`)
  if (existingScript) {
    scriptLoaded.value = true
    return
  }

  // Create and inject script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
  script.crossOrigin = 'anonymous'
  script.onerror = () => {
    logger.error('[AdSense] Failed to load script')
  }
  script.onload = () => {
    scriptLoaded.value = true
    logger.debug('[AdSense] Script loaded successfully')
  }

  document.head.appendChild(script)
}

// Push ad to AdSense queue
const pushAd = () => {
  if (!shouldShowAd.value || adPushed.value || !scriptLoaded.value) return

  try {
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      ;(window.adsbygoogle as unknown[]).push({})
      adPushed.value = true
      logger.debug('[AdSense] Ad pushed to queue')
    }
  } catch (error) {
    logger.error('[AdSense] Failed to push ad:', error)
  }
}

onMounted(() => {
  if (!shouldShowAd.value) {
    logger.debug('[AdSense] Ads disabled (not in production or no client ID)')
    return
  }

  // Load script first
  loadAdSenseScript()

  // Wait for script to load, then push ad
  const checkInterval = setInterval(() => {
    if (scriptLoaded.value) {
      clearInterval(checkInterval)
      setTimeout(() => {
        pushAd()
      }, 100)
    }
  }, 100)

  // Cleanup after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval)
  }, 10000)
})

// Re-push ad if props change
watch(
  () => props.adSlot,
  () => {
    adPushed.value = false
    setTimeout(() => {
      pushAd()
    }, 100)
  }
)
</script>

<style scoped>
.ad-container {
  max-width: 100%;
  overflow: hidden;
}

.ad-wrapper {
  min-height: 50px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 8px;
  padding: 8px;
}

/* Responsive ad sizing */
.adsbygoogle {
  max-width: 100%;
}

@media (max-width: 640px) {
  .ad-wrapper {
    min-height: 100px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .ad-wrapper {
    min-height: 90px;
  }
}

@media (min-width: 1025px) {
  .ad-wrapper {
    min-height: 90px;
  }
}
</style>
