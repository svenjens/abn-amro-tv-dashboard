<template>
  <div>
    <!-- Loading state -->
    <LoadingSpinner v-if="loading" :text="t('cast.loading')" />

    <!-- Error state -->
    <ErrorMessage v-else-if="error" :message="error.message" :retry="true" @retry="emit('retry')" />

    <!-- Cast grid -->
    <div v-else-if="cast.length > 0">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div
          v-for="member in displayedCast"
          :key="member.person.id"
          class="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all"
        >
          <!-- Person image -->
          <div class="aspect-[3/4] bg-gray-100 overflow-hidden relative">
            <img
              v-if="member.person.image"
              :src="member.person.image.medium"
              :alt="member.person.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>

            <!-- Voice/Self badges -->
            <div v-if="member.voice || member.self" class="absolute top-2 right-2 flex gap-1">
              <span
                v-if="member.voice"
                class="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded"
              >
                {{ t('cast.voice') }}
              </span>
              <span
                v-if="member.self"
                class="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded"
              >
                {{ t('cast.self') }}
              </span>
            </div>
          </div>

          <!-- Cast info -->
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 text-sm truncate" :title="member.person.name">
              {{ member.person.name }}
            </h3>
            <p class="text-xs text-gray-500 truncate" :title="member.character.name">
              {{ member.character.name }}
            </p>
            <p v-if="member.person.country" class="text-xs text-gray-400 mt-1">
              {{ member.person.country.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Show more button -->
      <div v-if="cast.length > initialDisplayCount && !showAll" class="text-center mt-6">
        <button
          class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          @click="showAll = true"
        >
          {{ t('cast.showMore') }} ({{ cast.length - initialDisplayCount }} {{ t('cast.more') }})
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && !error && cast.length === 0" class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
        />
      </svg>
      <p class="text-gray-500">{{ t('cast.noCast') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CastMember, ApiError } from '@/types'
import LoadingSpinner from './LoadingSpinner.vue'
import ErrorMessage from './ErrorMessage.vue'

interface Props {
  cast: CastMember[]
  loading?: boolean
  error?: ApiError | null
  initialDisplayCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  initialDisplayCount: 10,
})

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n()
const showAll = ref(false)

const displayedCast = computed(() => {
  if (showAll.value) {
    return props.cast
  }
  return props.cast.slice(0, props.initialDisplayCount)
})
</script>
