<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Cache Debug Component (only in dev mode or with ?debug param) -->
    <CacheDebug v-if="showDebug" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CacheDebug from '@/components/CacheDebug.vue'

const showDebug = ref(false)

onMounted(() => {
  const isDev = import.meta.env.DEV
  const hasDebugParam = new URLSearchParams(window.location.search).has('debug')
  showDebug.value = isDev || hasDebugParam
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
</style>
