/**
 * Composable for handling API calls with loading and error states
 */

import { ref, type Ref } from 'vue'
import type { ApiError } from '@/types'

export interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<ApiError | null>
  execute: () => Promise<void>
}

/**
 * Generic composable for API calls with loading and error handling
 * @param apiCall - Async function that returns data
 * @param immediate - Execute immediately on mount (default: true)
 * @returns Object with data, loading, error, and execute function
 */
export function useApi<T>(apiCall: () => Promise<T>, immediate: boolean = true): UseApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref<boolean>(false)
  const error = ref<ApiError | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      data.value = result
    } catch (err) {
      error.value = err as ApiError
      console.error('API call failed:', err)
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
  }
}
