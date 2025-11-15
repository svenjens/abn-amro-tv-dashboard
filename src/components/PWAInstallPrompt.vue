<template>
  <transition name="slide-up">
    <div
      v-if="showPrompt"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div class="p-6">
        <div class="flex items-start gap-4">
          <!-- App Icon -->
          <picture class="flex-shrink-0">
            <source type="image/webp" srcset="/optimized/logo-main-64.webp" sizes="48px" />
            <img
              src="/optimized/logo-main.png"
              alt="TV Show Dashboard"
              class="h-12 w-12 rounded-lg"
            />
          </picture>

          <!-- Content -->
          <div class="flex-1">
            <h3 id="pwa-install-title" class="text-lg font-semibold text-gray-900 mb-1">
              {{ t('pwa.installTitle') }}
            </h3>
            <p id="pwa-install-description" class="text-sm text-gray-600 mb-4">
              {{ t('pwa.installDescription') }}
            </p>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                @click="handleInstall"
              >
                {{ t('pwa.install') }}
              </button>
              <button
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                @click="handleDismiss"
              >
                {{ t('pwa.notNow') }}
              </button>
            </div>
          </div>

          <!-- Close Button -->
          <button
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
            :aria-label="t('common.close')"
            @click="handleDismiss"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { showInstallPrompt, isPWA } from '@/utils'
import { logger } from '@/utils'

const { t } = useI18n()
const showPrompt = ref(false)

// Don't show if already installed as PWA
const isAlreadyInstalled = isPWA()

// Check if user previously dismissed
const STORAGE_KEY = 'pwa-install-dismissed'
const dismissedAt = localStorage.getItem(STORAGE_KEY)
const dismissedRecently =
  dismissedAt && Date.now() - parseInt(dismissedAt) < 7 * 24 * 60 * 60 * 1000 // 7 days

function handleInstallAvailable() {
  // Show prompt if not already installed and not recently dismissed
  if (!isAlreadyInstalled && !dismissedRecently) {
    // Show after a short delay to not be too intrusive
    setTimeout(() => {
      showPrompt.value = true
    }, 3000)
  }
}

function handleInstalled() {
  showPrompt.value = false
  logger.debug('[PWA Install Prompt] App installed')
}

async function handleInstall() {
  const outcome = await showInstallPrompt()

  if (outcome === 'accepted') {
    showPrompt.value = false
    logger.debug('[PWA Install Prompt] User accepted install')
  } else if (outcome === 'dismissed') {
    handleDismiss()
    logger.debug('[PWA Install Prompt] User dismissed install')
  }
}

function handleDismiss() {
  showPrompt.value = false
  localStorage.setItem(STORAGE_KEY, Date.now().toString())
  logger.debug('[PWA Install Prompt] User dismissed prompt')
}

onMounted(() => {
  window.addEventListener('pwa-install-available', handleInstallAvailable)
  window.addEventListener('pwa-installed', handleInstalled)
})

onUnmounted(() => {
  window.removeEventListener('pwa-install-available', handleInstallAvailable)
  window.removeEventListener('pwa-installed', handleInstalled)
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
