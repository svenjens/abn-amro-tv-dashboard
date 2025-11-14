<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-4 py-3 rounded-lg shadow-lg flex items-start gap-3',
            'transform transition-all duration-300',
            toastClasses[toast.type],
          ]"
          role="alert"
        >
          <span class="text-xl flex-shrink-0" aria-hidden="true">
            {{ toastIcons[toast.type] }}
          </span>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button
            class="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
            :aria-label="`Close notification: ${toast.message}`"
            @click="remove(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

const toastClasses = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-600 text-white',
  info: 'bg-blue-600 text-white',
}

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
