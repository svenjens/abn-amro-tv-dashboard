/**
 * Composable for debouncing values
 */

import { ref, watch, type Ref } from 'vue'

/**
 * Debounce a ref value
 * @param value - Reactive value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced ref value
 */
export function useDebounce<T>(value: Ref<T>, delay: number = 300): Ref<T> {
  const debouncedValue = ref<T>(value.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}
