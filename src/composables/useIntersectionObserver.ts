/**
 * Composable for intersection observer (lazy loading images)
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * Composable for observing element intersection (lazy loading)
 * @param callback - Callback function when element intersects
 * @param options - IntersectionObserver options
 * @returns Ref to attach to the element
 */
export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: UseIntersectionObserverOptions
): Ref<HTMLElement | null> {
  const target = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!target.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry)
          }
        })
      },
      {
        root: options?.root || null,
        rootMargin: options?.rootMargin || '50px',
        threshold: options?.threshold || 0.1,
      }
    )

    observer.observe(target.value)
  })

  onUnmounted(() => {
    if (observer && target.value) {
      observer.unobserve(target.value)
      observer.disconnect()
    }
  })

  return target
}
