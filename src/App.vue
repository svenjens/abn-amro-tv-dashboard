<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
    <!-- Main Content -->
    <div class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Footer -->
    <AppFooter />

    <!-- Cache Debug Component (only in dev mode or with ?debug param) -->
    <CacheDebug v-if="showDebug" />

    <!-- Toast Notifications -->
    <ToastNotification />

    <!-- PWA Install Prompt -->
    <PWAInstallPrompt />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import ToastNotification from '@/components/ToastNotification.vue'
import PWAInstallPrompt from '@/components/PWAInstallPrompt.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useDarkMode } from '@/composables'

// Lazy load debug component (only needed in dev mode)
const CacheDebug = defineAsyncComponent(() => import('@/components/CacheDebug.vue'))

const showDebug = ref(false)
const { init: initDarkMode } = useDarkMode()
let cleanupDarkMode: (() => void) | undefined

onMounted(() => {
  const isDev = import.meta.env.DEV
  const hasDebugParam = new URLSearchParams(window.location.search).has('debug')
  showDebug.value = isDev || hasDebugParam
  
  // Initialize dark mode (watch for system preference changes)
  cleanupDarkMode = initDarkMode()
})

onUnmounted(() => {
  cleanupDarkMode?.()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Screen reader only class for accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
