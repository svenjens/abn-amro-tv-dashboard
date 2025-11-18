import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

// Mock IntersectionObserver
let observeCallback: IntersectionObserverCallback | null = null
const observedElements: Set<Element> = new Set()

const mockIntersectionObserver = vi.fn((callback, options) => {
  observeCallback = callback
  return {
    observe: vi.fn((element: Element) => {
      observedElements.add(element)
    }),
    unobserve: vi.fn((element: Element) => {
      observedElements.delete(element)
    }),
    disconnect: vi.fn(() => {
      observedElements.clear()
      observeCallback = null
    }),
    takeRecords: vi.fn(() => []),
    root: options?.root || null,
    rootMargin: options?.rootMargin || '0px',
    thresholds: Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0],
  }
})

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    // Setup IntersectionObserver mock
    global.IntersectionObserver = mockIntersectionObserver as any
    observedElements.clear()
    observeCallback = null
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with isIntersecting false', () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver()
        return { target, isIntersecting }
      },
    }

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.isIntersecting).toBe(false)
  })

  it('should observe target element when mounted', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver()
        return { target, isIntersecting }
      },
    }

    mount(TestComponent)
    await nextTick()

    expect(mockIntersectionObserver).toHaveBeenCalled()
    expect(observedElements.size).toBe(1)
  })

  it('should set isIntersecting to true when element enters viewport', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver()
        return { target, isIntersecting }
      },
    }

    const wrapper = mount(TestComponent)
    await nextTick()

    // Simulate intersection
    if (observeCallback) {
      const mockEntry = {
        isIntersecting: true,
        target: wrapper.element,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      observeCallback([mockEntry], {} as any)
    }

    await nextTick()
    expect(wrapper.vm.isIntersecting).toBe(true)
  })

  it('should disconnect observer on unmount', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver()
        return { target, isIntersecting }
      },
    }

    const wrapper = mount(TestComponent)
    await nextTick()

    const observerInstance = mockIntersectionObserver.mock.results[0]?.value
    wrapper.unmount()

    expect(observerInstance.disconnect).toHaveBeenCalled()
  })

  it('should stop observing after first intersection when once is true', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver({ once: true })
        return { target, isIntersecting }
      },
    }

    const wrapper = mount(TestComponent)
    await nextTick()

    const observerInstance = mockIntersectionObserver.mock.results[0]?.value

    // Simulate intersection
    if (observeCallback) {
      const mockEntry = {
        isIntersecting: true,
        target: wrapper.element,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      observeCallback([mockEntry], observerInstance as any)
    }

    await nextTick()

    // Should disconnect after first intersection
    expect(observerInstance.disconnect).toHaveBeenCalled()
    expect(wrapper.vm.isIntersecting).toBe(true)
  })

  it('should use custom rootMargin option', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver({ rootMargin: '50px' })
        return { target, isIntersecting }
      },
    }

    mount(TestComponent)
    await nextTick()

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '50px',
      })
    )
  })

  it('should use custom threshold option', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver({ threshold: 0.5 })
        return { target, isIntersecting }
      },
    }

    mount(TestComponent)
    await nextTick()

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
      })
    )
  })

  it('should handle array threshold option', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver({ threshold: [0, 0.5, 1] })
        return { target, isIntersecting }
      },
    }

    mount(TestComponent)
    await nextTick()

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: [0, 0.5, 1],
      })
    )
  })

  it('should not update isIntersecting when leaving viewport in once mode', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver({ once: true })
        return { target, isIntersecting }
      },
    }

    const wrapper = mount(TestComponent)
    await nextTick()

    // First intersection - enters viewport
    if (observeCallback) {
      const mockEntry1 = {
        isIntersecting: true,
        target: wrapper.element,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      const observerInstance = mockIntersectionObserver.mock.results[0]?.value
      observeCallback([mockEntry1], observerInstance as any)
    }

    await nextTick()
    expect(wrapper.vm.isIntersecting).toBe(true)

    // Second intersection - leaves viewport (should not update because of once mode)
    if (observeCallback) {
      const mockEntry2 = {
        isIntersecting: false,
        target: wrapper.element,
        intersectionRatio: 0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      const observerInstance = mockIntersectionObserver.mock.results[0]?.value
      observeCallback([mockEntry2], observerInstance as any)
    }

    await nextTick()
    // Should still be true because once mode keeps it true
    expect(wrapper.vm.isIntersecting).toBe(true)
  })

  it('should update isIntersecting when leaving viewport in continuous mode', async () => {
    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver({ once: false })
        return { target, isIntersecting }
      },
    }

    const wrapper = mount(TestComponent)
    await nextTick()

    const observerInstance = mockIntersectionObserver.mock.results[0]?.value

    // First intersection - enters viewport
    if (observeCallback) {
      const mockEntry1 = {
        isIntersecting: true,
        target: wrapper.element,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      observeCallback([mockEntry1], observerInstance as any)
    }

    await nextTick()
    expect(wrapper.vm.isIntersecting).toBe(true)

    // Second intersection - leaves viewport
    if (observeCallback) {
      const mockEntry2 = {
        isIntersecting: false,
        target: wrapper.element,
        intersectionRatio: 0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      observeCallback([mockEntry2], observerInstance as any)
    }

    await nextTick()
    // Should update to false in continuous mode
    expect(wrapper.vm.isIntersecting).toBe(false)
  })

  it('should fallback gracefully when IntersectionObserver is not supported', async () => {
    // Remove IntersectionObserver
    const originalIO = global.IntersectionObserver
    // @ts-ignore - Testing fallback when IntersectionObserver is not available in browser
    global.IntersectionObserver = undefined

    const TestComponent = {
      template: '<div ref="target">Test</div>',
      setup() {
        const { target, isIntersecting } = useIntersectionObserver()
        return { target, isIntersecting }
      },
    }

    const wrapper = mount(TestComponent)
    await nextTick()

    // Should fallback to true immediately
    expect(wrapper.vm.isIntersecting).toBe(true)

    // Restore
    global.IntersectionObserver = originalIO
  })
})
