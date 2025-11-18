<template>
  <ClientOnly>
    <div v-if="shouldShowAd" class="ad-container my-8">
      <!-- Ad Label -->
      <p class="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
        {{ t('ads.sponsored') }}
      </p>

      <!-- AdSense Ad Unit -->
      <div class="ad-wrapper flex justify-center">
        <ins
          class="adsbygoogle"
          :style="adStyle"
          :data-ad-client="adClient"
          v-bind="adSlot ? { 'data-ad-slot': adSlot } : {}"
          :data-ad-format="format"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  </ClientOnly>
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
const config = useRuntimeConfig()

// Get AdSense client ID from runtime config
const adClient = config.public.googleAdsenseId || ''

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

// Use Nuxt's useScript composable for better script management
const { load } = useScript(
  {
    src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`,
    async: true,
    crossorigin: 'anonymous',
    // Disable onload/onerror attributes as AdSense doesn't support them
    'data-onload': undefined,
    'data-onerror': undefined,
  },
  {
    use() {
      return { adsbygoogle: window.adsbygoogle }
    },
    // Use manual trigger to avoid automatic event handler injection
    trigger: 'manual',
  }
)

// Push ad to AdSense queue
const pushAd = () => {
  if (!shouldShowAd.value || adPushed.value) return

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

onMounted(async () => {
  if (!shouldShowAd.value) {
    logger.debug('[AdSense] Ads disabled (not in production or no client ID)')
    return
  }

  // Load script using Nuxt's useScript
  await load()

  // Wait a bit for script to initialize, then push ad
  setTimeout(() => {
    pushAd()
  }, 100)
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
