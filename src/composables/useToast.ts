/**
 * Toast notification composable
 * Provides a simple toast notification system for user feedback
 */

import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])

let idCounter = 0

export function useToast() {
  const show = (message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = `toast-${++idCounter}`

    const toast: Toast = {
      id,
      message,
      type,
      duration,
    }

    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => {
    return show(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    return show(message, 'error', duration)
  }

  const warning = (message: string, duration?: number) => {
    return show(message, 'warning', duration)
  }

  const info = (message: string, duration?: number) => {
    return show(message, 'info', duration)
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear,
  }
}
