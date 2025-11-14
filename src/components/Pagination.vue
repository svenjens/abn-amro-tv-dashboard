<template>
  <nav
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm"
    :aria-label="t('pagination.navigation')"
    role="navigation"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        :disabled="!hasPreviousPage"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
        :aria-label="t('pagination.previous')"
        @click="$emit('previous')"
      >
        {{ t('pagination.previous') }}
      </button>
      <button
        :disabled="!hasNextPage"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
        :aria-label="t('pagination.next')"
        @click="$emit('next')"
      >
        {{ t('pagination.next') }}
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ t('pagination.showing') }}
          <span class="font-medium">{{ startItem }}</span>
          {{ t('pagination.to') }}
          <span class="font-medium">{{ endItem }}</span>
          {{ t('pagination.of') }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ t('pagination.results') }}
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            :disabled="!hasPreviousPage"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-600"
            :aria-label="t('pagination.previousPage')"
            @click="$emit('previous')"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            :disabled="page === '...'"
            :class="[
              page === currentPage
                ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-none focus:ring-2 focus:ring-primary-600',
            ]"
            :aria-current="page === currentPage ? 'page' : undefined"
            :aria-label="page === '...' ? undefined : t('pagination.page', { page })"
            @click="typeof page === 'number' && $emit('goToPage', page)"
          >
            {{ page }}
          </button>
          <button
            :disabled="!hasNextPage"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-600"
            :aria-label="t('pagination.nextPage')"
            @click="$emit('next')"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  pageNumbers: (number | string)[]
}

const props = defineProps<Props>()

defineEmits<{
  next: []
  previous: []
  goToPage: [page: number]
}>()

const { t } = useI18n()

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})
</script>
