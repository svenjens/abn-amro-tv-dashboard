/**
 * Composable for using IntersectionObserver to detect when elements enter viewport
 * Used for lazy loading images and content
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseIntersectionObserverOptions {
  /**
   * The element that is used as the viewport for checking visibility
   * Defaults to the browser viewport if null
   */
  root?: Element | null
  /**
   * Margin around the root (e.g., "50px" to load images 50px before they enter viewport)
   */
  rootMargin?: string
  /**
   * A threshold indicating what percentage of the target's visibility is needed
   * 0 = as soon as 1px is visible, 1 = 100% must be visible
   */
  threshold?: number | number[]
  /**
   * Whether to stop observing after the first intersection
   */
  once?: boolean
}

/**
 * Hook to observe when an element enters the viewport
 *
 * @param options - IntersectionObserver options
 * @returns Object with target ref and isIntersecting state
 *
 * @example
 * const { target, isIntersecting } = useIntersectionObserver({ rootMargin: '50px', once: true })
 * // In template: <div ref="target">...</div>
 * // isIntersecting will be true when element is visible
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { root = null, rootMargin = '0px', threshold = 0, once = true } = options

  const target: Ref<Element | null> = ref(null)
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    if (!target.value) {
      return
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver
      isIntersecting.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true

            // Stop observing if once option is set
            if (once && observer) {
              observer.disconnect()
            }
          } else {
            // Only update if not "once" mode
            if (!once) {
              isIntersecting.value = false
            }
          }
        })
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )

    observer.observe(target.value)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    target,
    isIntersecting,
  }
}
