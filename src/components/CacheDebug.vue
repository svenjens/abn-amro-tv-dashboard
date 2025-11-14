<template>
  <div
    v-if="show"
    class="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-4 max-w-sm z-50"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-gray-900">🔍 Cache Statistics</h3>
      <button
        class="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
        @click="toggleShow"
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

    <div class="space-y-3 text-xs">
      <!-- API Cache -->
      <div class="bg-blue-50 p-2 rounded">
        <div class="font-semibold text-blue-900 mb-1">API Cache</div>
        <div class="grid grid-cols-2 gap-1 text-blue-700">
          <div>Hits: {{ stats.api.hits }}</div>
          <div>Misses: {{ stats.api.misses }}</div>
          <div>Size: {{ stats.api.size }}/{{ stats.api.maxSize }}</div>
          <div>Hit Rate: {{ stats.api.hitRate }}%</div>
        </div>
      </div>

      <!-- Search Cache -->
      <div class="bg-green-50 p-2 rounded">
        <div class="font-semibold text-green-900 mb-1">Search Cache</div>
        <div class="grid grid-cols-2 gap-1 text-green-700">
          <div>Hits: {{ stats.search.hits }}</div>
          <div>Misses: {{ stats.search.misses }}</div>
          <div>Size: {{ stats.search.size }}/{{ stats.search.maxSize }}</div>
          <div>Hit Rate: {{ stats.search.hitRate }}%</div>
        </div>
      </div>

      <!-- Show Cache -->
      <div class="bg-purple-50 p-2 rounded">
        <div class="font-semibold text-purple-900 mb-1">Show Cache</div>
        <div class="grid grid-cols-2 gap-1 text-purple-700">
          <div>Hits: {{ stats.show.hits }}</div>
          <div>Misses: {{ stats.show.misses }}</div>
          <div>Size: {{ stats.show.size }}/{{ stats.show.maxSize }}</div>
          <div>Hit Rate: {{ stats.show.hitRate }}%</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-2 border-t border-gray-200">
        <button
          class="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          @click="refreshStats"
        >
          Refresh
        </button>
        <button
          class="flex-1 px-3 py-1.5 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
          @click="pruneCache"
        >
          Prune
        </button>
        <button
          class="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          @click="clearCache"
        >
          Clear
        </button>
      </div>
    </div>
  </div>

  <!-- Toggle Button -->
  <button
    v-else
    class="fixed bottom-4 right-4 bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition-colors z-50"
    aria-label="Show cache statistics"
    @click="toggleShow"
  >
    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { tvMazeAPI } from '@/api'

const show = ref(false)
const stats = ref({
  api: { hits: 0, misses: 0, size: 0, maxSize: 0, hitRate: 0 },
  search: { hits: 0, misses: 0, size: 0, maxSize: 0, hitRate: 0 },
  show: { hits: 0, misses: 0, size: 0, maxSize: 0, hitRate: 0 },
})

let intervalId: number | null = null

function toggleShow() {
  show.value = !show.value
  if (show.value) {
    refreshStats()
    // Auto-refresh every 2 seconds when visible
    intervalId = window.setInterval(refreshStats, 2000)
  } else if (intervalId) {
    window.clearInterval(intervalId)
    intervalId = null
  }
}

function refreshStats() {
  stats.value = tvMazeAPI.getCacheStats()
}

function pruneCache() {
  tvMazeAPI.pruneCache()
  refreshStats()
}

function clearCache() {
  if (confirm('Are you sure you want to clear all caches?')) {
    tvMazeAPI.clearCache()
    refreshStats()
  }
}

onMounted(() => {
  // Check for dev mode or specific query param to show debug tools
  const isDev = import.meta.env.DEV
  const hasDebugParam = new URLSearchParams(window.location.search).has('debug')

  if (isDev || hasDebugParam) {
    // Component is available
  } else {
    // Don't show in production unless debug param is present
    show.value = false
  }
})

onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})
</script>
