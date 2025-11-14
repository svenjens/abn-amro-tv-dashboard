/**
 * Composable for pagination logic
 */

import { ref, computed } from 'vue'

export interface PaginationOptions {
  initialPage?: number
  itemsPerPage?: number
}

export function usePagination<T>(items: T[], options: PaginationOptions = {}) {
  const { initialPage = 1, itemsPerPage = 20 } = options

  const currentPage = ref(initialPage)
  const perPage = ref(itemsPerPage)

  const totalPages = computed(() => Math.ceil(items.length / perPage.value))

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return items.slice(start, end)
  })

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPreviousPage = computed(() => currentPage.value > 1)

  const pageNumbers = computed(() => {
    const pages: (number | string)[] = []
    const delta = 2 // Number of pages to show around current page

    if (totalPages.value <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      let start = Math.max(2, currentPage.value - delta)
      let end = Math.min(totalPages.value - 1, currentPage.value + delta)

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...')
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages.value - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages.value)
    }

    return pages
  })

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function nextPage() {
    if (hasNextPage.value) {
      goToPage(currentPage.value + 1)
    }
  }

  function previousPage() {
    if (hasPreviousPage.value) {
      goToPage(currentPage.value - 1)
    }
  }

  function reset() {
    currentPage.value = 1
  }

  return {
    currentPage,
    perPage,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPreviousPage,
    pageNumbers,
    goToPage,
    nextPage,
    previousPage,
    reset,
  }
}
