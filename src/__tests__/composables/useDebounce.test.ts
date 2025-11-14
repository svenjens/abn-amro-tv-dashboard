import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce value changes', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)

    expect(debouncedValue.value).toBe('initial')

    // Change value
    value.value = 'updated'
    await nextTick()

    // Should not update immediately
    expect(debouncedValue.value).toBe('initial')

    // Fast forward time
    vi.advanceTimersByTime(300)
    await nextTick()

    // Should update after delay
    expect(debouncedValue.value).toBe('updated')
  })

  it('should cancel previous debounce on rapid changes', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)

    value.value = 'first'
    await nextTick()
    vi.advanceTimersByTime(100)

    value.value = 'second'
    await nextTick()
    vi.advanceTimersByTime(100)

    value.value = 'third'
    await nextTick()
    vi.advanceTimersByTime(300)
    await nextTick()

    // Should only update to the last value
    expect(debouncedValue.value).toBe('third')
  })

  it('should use custom delay', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 500)

    value.value = 'updated'
    await nextTick()
    vi.advanceTimersByTime(300)
    await nextTick()

    expect(debouncedValue.value).toBe('initial')

    vi.advanceTimersByTime(200)
    await nextTick()

    expect(debouncedValue.value).toBe('updated')
  })
})
