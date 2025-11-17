import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useToast } from '@/composables/useToast'
import type { ToastType } from '@/composables/useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    // Clear all toasts before each test
    const { clear } = useToast()
    clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Basic Toast Creation', () => {
    it('should create a toast with default type (info)', () => {
      const { show, toasts } = useToast()

      show('Test message')

      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]?.message).toBe('Test message')
      expect(toasts.value[0]?.type).toBe('info')
      expect(toasts.value[0]?.duration).toBe(5000)
      expect(toasts.value[0]?.id).toBeDefined()
    })

    it('should create toast with custom type', () => {
      const { show, toasts } = useToast()

      show('Success message', 'success')

      expect(toasts.value[0]?.type).toBe('success')
    })

    it('should create toast with custom duration', () => {
      const { show, toasts } = useToast()

      show('Custom duration', 'info', 3000)

      expect(toasts.value[0]?.duration).toBe(3000)
    })

    it('should generate unique IDs for each toast', () => {
      const { show, toasts } = useToast()

      const id1 = show('Message 1')
      const id2 = show('Message 2')
      const id3 = show('Message 3')

      expect(id1).not.toBe(id2)
      expect(id2).not.toBe(id3)
      expect(id1).not.toBe(id3)

      expect(toasts.value).toHaveLength(3)
      expect(toasts.value[0]?.id).toBe(id1)
      expect(toasts.value[1]?.id).toBe(id2)
      expect(toasts.value[2]?.id).toBe(id3)
    })

    it('should return toast ID', () => {
      const { show } = useToast()

      const id = show('Test')

      expect(id).toMatch(/^toast-\d+$/)
    })
  })

  describe('Toast Types', () => {
    it('should create success toast', () => {
      const { success, toasts } = useToast()

      success('Success message')

      expect(toasts.value[0]?.type).toBe('success')
      expect(toasts.value[0]?.message).toBe('Success message')
    })

    it('should create error toast', () => {
      const { error, toasts } = useToast()

      error('Error message')

      expect(toasts.value[0]?.type).toBe('error')
      expect(toasts.value[0]?.message).toBe('Error message')
    })

    it('should create warning toast', () => {
      const { warning, toasts } = useToast()

      warning('Warning message')

      expect(toasts.value[0]?.type).toBe('warning')
      expect(toasts.value[0]?.message).toBe('Warning message')
    })

    it('should create info toast', () => {
      const { info, toasts } = useToast()

      info('Info message')

      expect(toasts.value[0]?.type).toBe('info')
      expect(toasts.value[0]?.message).toBe('Info message')
    })

    it('should accept custom duration for type helpers', () => {
      const { success, error, warning, info, toasts } = useToast()

      success('Success', 1000)
      error('Error', 2000)
      warning('Warning', 3000)
      info('Info', 4000)

      expect(toasts.value[0]?.duration).toBe(1000)
      expect(toasts.value[1]?.duration).toBe(2000)
      expect(toasts.value[2]?.duration).toBe(3000)
      expect(toasts.value[3]?.duration).toBe(4000)
    })

    it('should return toast IDs from type helpers', () => {
      const { success, error, warning, info } = useToast()

      const id1 = success('Success')
      const id2 = error('Error')
      const id3 = warning('Warning')
      const id4 = info('Info')

      expect(id1).toMatch(/^toast-\d+$/)
      expect(id2).toMatch(/^toast-\d+$/)
      expect(id3).toMatch(/^toast-\d+$/)
      expect(id4).toMatch(/^toast-\d+$/)
    })
  })

  describe('Auto-removal', () => {
    it('should auto-remove toast after duration', () => {
      const { show, toasts } = useToast()

      show('Test message', 'info', 1000)

      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(1000)

      expect(toasts.value).toHaveLength(0)
    })

    it('should auto-remove multiple toasts independently', () => {
      const { show, toasts } = useToast()

      show('Message 1', 'info', 1000)
      show('Message 2', 'info', 2000)
      show('Message 3', 'info', 3000)

      expect(toasts.value).toHaveLength(3)

      vi.advanceTimersByTime(1000)
      expect(toasts.value).toHaveLength(2)
      expect(toasts.value[0]?.message).toBe('Message 2')

      vi.advanceTimersByTime(1000)
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]?.message).toBe('Message 3')

      vi.advanceTimersByTime(1000)
      expect(toasts.value).toHaveLength(0)
    })

    it('should not auto-remove toast with duration 0', () => {
      const { show, toasts } = useToast()

      show('Persistent toast', 'info', 0)

      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(10000)

      expect(toasts.value).toHaveLength(1)
    })

    it('should not auto-remove toast with negative duration', () => {
      const { show, toasts } = useToast()

      show('Persistent toast', 'info', -1)

      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(10000)

      expect(toasts.value).toHaveLength(1)
    })
  })

  describe('Manual Removal', () => {
    it('should manually remove toast by ID', () => {
      const { show, remove, toasts } = useToast()

      const id = show('Test message')

      expect(toasts.value).toHaveLength(1)

      remove(id)

      expect(toasts.value).toHaveLength(0)
    })

    it('should remove correct toast when multiple exist', () => {
      const { show, remove, toasts } = useToast()

      const id1 = show('Message 1')
      const id2 = show('Message 2')
      const id3 = show('Message 3')

      expect(toasts.value).toHaveLength(3)

      remove(id2)

      expect(toasts.value).toHaveLength(2)
      expect(toasts.value[0]?.id).toBe(id1)
      expect(toasts.value[1]?.id).toBe(id3)
    })

    it('should handle removing non-existent toast', () => {
      const { show, remove, toasts } = useToast()

      show('Message 1')

      expect(toasts.value).toHaveLength(1)

      remove('non-existent-id')

      expect(toasts.value).toHaveLength(1)
    })

    it('should handle removing from empty toast list', () => {
      const { remove, toasts } = useToast()

      expect(toasts.value).toHaveLength(0)

      remove('some-id')

      expect(toasts.value).toHaveLength(0)
    })

    it('should prevent auto-removal after manual removal', () => {
      const { show, remove, toasts } = useToast()

      const id = show('Test message', 'info', 1000)

      expect(toasts.value).toHaveLength(1)

      remove(id)

      expect(toasts.value).toHaveLength(0)

      // Advance time - should not cause issues
      vi.advanceTimersByTime(2000)

      expect(toasts.value).toHaveLength(0)
    })
  })

  describe('Clear All', () => {
    it('should clear all toasts', () => {
      const { show, clear, toasts } = useToast()

      show('Message 1')
      show('Message 2')
      show('Message 3')

      expect(toasts.value).toHaveLength(3)

      clear()

      expect(toasts.value).toHaveLength(0)
    })

    it('should handle clearing empty toast list', () => {
      const { clear, toasts } = useToast()

      expect(toasts.value).toHaveLength(0)

      clear()

      expect(toasts.value).toHaveLength(0)
    })

    it('should allow adding toasts after clearing', () => {
      const { show, clear, toasts } = useToast()

      show('Message 1')
      clear()

      expect(toasts.value).toHaveLength(0)

      show('Message 2')

      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]?.message).toBe('Message 2')
    })
  })

  describe('State Sharing', () => {
    it('should share toasts across multiple composable instances', () => {
      const toast1 = useToast()
      const toast2 = useToast()

      toast1.show('Message from instance 1')

      expect(toast1.toasts.value).toHaveLength(1)
      expect(toast2.toasts.value).toHaveLength(1)
      expect(toast2.toasts.value[0]?.message).toBe('Message from instance 1')
    })

    it('should sync removal across instances', () => {
      const toast1 = useToast()
      const toast2 = useToast()

      const id = toast1.show('Shared message')

      expect(toast1.toasts.value).toHaveLength(1)
      expect(toast2.toasts.value).toHaveLength(1)

      toast2.remove(id)

      expect(toast1.toasts.value).toHaveLength(0)
      expect(toast2.toasts.value).toHaveLength(0)
    })

    it('should sync clear across instances', () => {
      const toast1 = useToast()
      const toast2 = useToast()

      toast1.show('Message 1')
      toast1.show('Message 2')

      expect(toast1.toasts.value).toHaveLength(2)
      expect(toast2.toasts.value).toHaveLength(2)

      toast2.clear()

      expect(toast1.toasts.value).toHaveLength(0)
      expect(toast2.toasts.value).toHaveLength(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      const { show, toasts } = useToast()

      show('')

      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]?.message).toBe('')
    })

    it('should handle very long messages', () => {
      const { show, toasts } = useToast()

      const longMessage = 'A'.repeat(1000)
      show(longMessage)

      expect(toasts.value[0]?.message).toBe(longMessage)
      expect(toasts.value[0]?.message.length).toBe(1000)
    })

    it('should handle special characters in message', () => {
      const { show, toasts } = useToast()

      const specialMessage = '<script>alert("XSS")</script> & "quotes" \'apostrophes\''
      show(specialMessage)

      expect(toasts.value[0]?.message).toBe(specialMessage)
    })

    it('should handle unicode characters', () => {
      const { show, toasts } = useToast()

      show('Hello 世界 🌍 Здравствуй')

      expect(toasts.value[0]?.message).toBe('Hello 世界 🌍 Здравствуй')
    })

    it('should handle rapid consecutive toast creation', () => {
      const { show, toasts } = useToast()

      for (let i = 0; i < 100; i++) {
        show(`Message ${i}`)
      }

      expect(toasts.value).toHaveLength(100)

      // All should have unique IDs
      const ids = new Set(toasts.value.map((t) => t.id))
      expect(ids.size).toBe(100)
    })

    it('should handle very short duration', () => {
      const { show, toasts } = useToast()

      show('Quick toast', 'info', 1)

      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(1)

      expect(toasts.value).toHaveLength(0)
    })

    it('should handle very long duration', () => {
      const { show, toasts } = useToast()

      show('Long toast', 'info', 999999999)

      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(100000)

      // Should still be there
      expect(toasts.value).toHaveLength(1)
    })
  })

  describe('Toast Queue Management', () => {
    it('should maintain toast order (FIFO)', () => {
      const { show, toasts } = useToast()

      show('First')
      show('Second')
      show('Third')

      expect(toasts.value[0]?.message).toBe('First')
      expect(toasts.value[1]?.message).toBe('Second')
      expect(toasts.value[2]?.message).toBe('Third')
    })

    it('should handle mixed durations correctly', () => {
      const { show, toasts } = useToast()

      show('Message 1', 'info', 3000)
      show('Message 2', 'info', 1000)
      show('Message 3', 'info', 2000)

      expect(toasts.value).toHaveLength(3)

      vi.advanceTimersByTime(1000)
      expect(toasts.value).toHaveLength(2)
      expect(toasts.value[0]?.message).toBe('Message 1')
      expect(toasts.value[1]?.message).toBe('Message 3')

      vi.advanceTimersByTime(1000)
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]?.message).toBe('Message 1')

      vi.advanceTimersByTime(1000)
      expect(toasts.value).toHaveLength(0)
    })

    it('should handle adding toast while others are expiring', () => {
      const { show, toasts } = useToast()

      show('Message 1', 'info', 1000)

      vi.advanceTimersByTime(500)

      show('Message 2', 'info', 2000)

      expect(toasts.value).toHaveLength(2)

      vi.advanceTimersByTime(500)

      // Message 1 should be gone
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]?.message).toBe('Message 2')

      vi.advanceTimersByTime(1500)

      // Message 2 should be gone
      expect(toasts.value).toHaveLength(0)
    })
  })

  describe('Type Safety', () => {
    it('should accept all valid toast types', () => {
      const { show, toasts } = useToast()

      const types: ToastType[] = ['success', 'error', 'warning', 'info']

      types.forEach((type) => {
        show(`${type} message`, type)
      })

      expect(toasts.value).toHaveLength(4)
      types.forEach((type, index) => {
        expect(toasts.value[index]?.type).toBe(type)
      })
    })
  })
})
