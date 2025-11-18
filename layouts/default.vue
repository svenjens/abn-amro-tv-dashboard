<template>
  <div
    class="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
  >
    <!-- Main Content -->
    <div class="flex-grow">
      <slot />
    </div>

    <!-- Footer -->
    <AppFooter />

    <!-- Cache Debug Component (only in dev mode or with ?debug param) -->
    <ClientOnly>
      <LazyCacheDebug v-if="showDebug" />
    </ClientOnly>

    <!-- Toast Notifications -->
    <ToastNotification />

    <!-- PWA Install Prompt -->
    <PWAInstallPrompt />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const showDebug = computed(() => {
  if (!import.meta.client) return false
  const isDev = import.meta.dev
  const hasDebugParam = route.query.debug !== undefined
  return isDev || hasDebugParam
})
</script>

<style scoped>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
