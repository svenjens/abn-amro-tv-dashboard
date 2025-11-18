<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SkipToContent />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <LoadingSpinner :text="t('person.loading')" />
    </div>

    <!-- Error State -->
    <ErrorMessage v-else-if="error" :message="error.message" :retry="true" @retry="refreshPerson" />

    <!-- Person Content -->
    <div v-else-if="person" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Person Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div class="md:flex">
          <!-- Person Image -->
          <div class="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div class="aspect-[3/4] bg-gray-200 dark:bg-gray-700 relative">
              <NuxtImg
                v-if="person.image"
                :src="person.image.original"
                :alt="person.name"
                format="webp"
                :quality="90"
                class="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
              >
                <Icon name="heroicons:user-solid" class="w-24 h-24" />
              </div>
            </div>
          </div>

          <!-- Person Info -->
          <div class="md:w-2/3 lg:w-3/4 p-6 md:p-8">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ person.name }}
            </h1>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div v-if="person.birthday">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('person.birthday') }}
                </dt>
                <dd class="text-base text-gray-900 dark:text-white mt-1">
                  {{ formatDate(person.birthday) }}
                  <span v-if="age" class="text-gray-500 dark:text-gray-400">({{ age }})</span>
                </dd>
              </div>

              <div v-if="person.deathday">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('person.deathday') }}
                </dt>
                <dd class="text-base text-gray-900 dark:text-white mt-1">
                  {{ formatDate(person.deathday) }}
                </dd>
              </div>

              <div v-if="person.country">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('person.country') }}
                </dt>
                <dd class="text-base text-gray-900 dark:text-white mt-1">
                  {{ person.country.name }}
                </dd>
              </div>

              <div v-if="person.gender">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('person.gender') }}
                </dt>
                <dd class="text-base text-gray-900 dark:text-white mt-1">
                  {{ person.gender }}
                </dd>
              </div>
            </div>

            <!-- External Links -->
            <div class="flex gap-4">
              <a
                v-if="person.url"
                :href="person.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Icon name="heroicons:link" class="w-5 h-5" />
                {{ t('person.viewOnTVMaze') }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast Credits Section -->
      <div v-if="person.castCredits && person.castCredits.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('person.knownFor') }}
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <NuxtLink
            v-for="credit in displayedCredits"
            :key="credit.id"
            :to="localePath(`/show/${createSlugWithId(credit.name, credit.id)}`)"
            class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all"
          >
            <!-- Show Image -->
            <div class="aspect-[2/3] bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <NuxtImg
                v-if="credit.image"
                :src="credit.image.medium"
                :alt="credit.name"
                format="webp"
                :quality="85"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
              >
                <Icon name="heroicons:tv" class="w-12 h-12" />
              </div>

              <!-- Character Badge -->
              <div
                v-if="credit._embedded?.character"
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2"
              >
                <p class="text-xs text-white font-medium truncate">
                  {{ t('person.asCharacter', { character: credit._embedded.character.name }) }}
                </p>
              </div>
            </div>

            <!-- Show Info -->
            <div class="p-3">
              <h3
                class="font-semibold text-gray-900 dark:text-white text-sm truncate"
                :title="credit.name"
              >
                {{ credit.name }}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="credit.premiered" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ new Date(credit.premiered).getFullYear() }}
                </span>
                <RatingBadge
                  v-if="credit.rating.average"
                  :rating="credit.rating.average"
                  size="sm"
                />
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Show More Button -->
        <div
          v-if="person.castCredits.length > initialDisplayCount && !showAllCredits"
          class="text-center mt-6"
        >
          <button
            class="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
            @click="showAllCredits = true"
          >
            {{ t('person.showMore') }} ({{ person.castCredits.length - initialDisplayCount }})
          </button>
        </div>
      </div>

      <!-- Empty State for No Credits -->
      <div v-else class="text-center py-12">
        <Icon
          name="heroicons:film"
          class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
        />
        <p class="text-gray-500 dark:text-gray-400">{{ t('person.noCredits') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PersonDetailsResponse } from '~/server/api/people/[id].get'
import { extractIdFromSlug, createSlugWithId } from '~/utils/slug'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

// Extract person ID from slug
const slug = computed(() => route.params.slug as string)
const personId = computed(() => extractIdFromSlug(slug.value))

// Display settings
const initialDisplayCount = ref(10)
const showAllCredits = ref(false)

// Fetch person data
const {
  data: person,
  pending: loading,
  error,
  refresh: refreshPerson,
} = await useFetch<PersonDetailsResponse>(`/api/people/${personId.value}`, {
  key: `person-${personId.value}`,
})

// Computed properties
const age = computed(() => {
  if (!person.value?.birthday) return null
  const endDate = person.value.deathday ? new Date(person.value.deathday) : new Date()
  const birthDate = new Date(person.value.birthday)
  let age = endDate.getFullYear() - birthDate.getFullYear()
  const monthDiff = endDate.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

const displayedCredits = computed(() => {
  if (!person.value?.castCredits) return []
  if (showAllCredits.value) return person.value.castCredits
  return person.value.castCredits.slice(0, initialDisplayCount.value)
})

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// SEO
if (person.value) {
  useSEO({
    title: `${person.value.name} - ${t('person.title')}`,
    description: person.value.country
      ? t('person.description', {
          name: person.value.name,
          country: person.value.country.name,
        })
      : `${person.value.name} - ${t('person.fallbackDescription')}`,
    keywords: [person.value.name, 'actor', 'actress', 'tv shows', 'cast'],
    image: person.value.image?.original,
  })
}
</script>
