<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <LoadingSpinner
      v-if="loading"
      :text="t('person.loading')"
      :full-screen="true"
      role="status"
      :aria-label="t('status.loading')"
    />

    <!-- Error State -->
    <ErrorMessage
      v-else-if="error"
      :message="error.message"
      :retry="true"
      :full-screen="true"
      @retry="refreshPerson"
    />

    <!-- Person Content -->
    <DetailPageLayout
      v-else-if="person"
      :title="person.name"
      :background-image="person.image?.original"
      :tabs="tabs"
      v-model="activeTab"
    >
      <!-- Header Content -->
      <template #header>
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Person Image -->
          <div v-if="person.image?.original" class="flex-shrink-0">
            <NuxtImg
              :src="person.image.original"
              :alt="`${person.name} photo`"
              format="webp"
              :quality="85"
              class="w-64 rounded-lg shadow-2xl"
              loading="eager"
              fetchpriority="high"
              width="256"
              height="384"
            />
          </div>

          <!-- Person Info -->
          <div class="flex-1">
            <h1 id="person-title" class="text-4xl md:text-5xl font-bold mb-6">
              {{ person.name }}
            </h1>

            <!-- Quick Info Pills -->
            <div class="flex flex-wrap gap-4 mb-6">
              <span
                v-if="person.tmdb?.knownForDepartment"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
              >
                {{ person.tmdb.knownForDepartment }}
              </span>
              <span
                v-if="age"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20"
              >
                {{ age }} {{ t('person.yearsOld') }}
              </span>
              <span
                v-if="placeOfBirth"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20"
              >
                <Icon name="heroicons:map-pin" class="h-4 w-4 mr-1" />
                {{ placeOfBirth }}
              </span>
            </div>

            <!-- Biography Preview (first 300 chars) -->
            <div v-if="biography" class="text-gray-200 leading-relaxed">
              <p class="line-clamp-4">
                {{ biography.replace(/<[^>]*>/g, '').slice(0, 300)
                }}{{ biography.length > 300 ? '...' : '' }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab Content -->
      <template #content>
        <!-- Biography Tab -->
        <div v-if="activeTab === 'biography'">
          <article v-if="biography" class="mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {{ t('person.biography') }}
            </h2>
            <SafeHtml
              :content="biography"
              class="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-lg dark:prose-invert max-w-none"
            />
          </article>
          <div
            v-else
            class="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <Icon
              name="heroicons:document-text"
              class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
            />
            <p>{{ t('person.noBiography') }}</p>
          </div>
        </div>

        <!-- Shows Tab -->
        <div v-else-if="activeTab === 'shows'">
          <div v-if="person.castCredits && person.castCredits.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {{ t('person.knownFor') }}
            </h2>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <NuxtLink
                v-for="(credit, index) in displayedCredits"
                :key="credit.id"
                :to="localePath(`/show/${createSlugWithId(credit.name, credit.id)}`)"
                class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all"
              >
                <!-- Show Image -->
                <div class="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <NuxtImg
                    v-if="credit.image"
                    :src="credit.image.medium"
                    :alt="credit.name"
                    format="webp"
                    :quality="85"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    :loading="index < 5 ? 'eager' : 'lazy'"
                    :fetchpriority="index < 5 ? 'high' : undefined"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
                  >
                    <Icon name="heroicons:tv" class="w-12 h-12" />
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

                  <!-- Character name under title -->
                  <p
                    v-if="credit._embedded?.character"
                    class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate"
                    :title="t('person.asCharacter', { character: credit._embedded.character.name })"
                  >
                    {{ t('person.asCharacter', { character: credit._embedded.character.name }) }}
                  </p>

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
              v-if="uniqueCredits.length > initialDisplayCount && !showAllCredits"
              class="text-center mt-6"
            >
              <button
                class="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
                @click="showAllCredits = true"
              >
                {{ t('person.showMore') }} ({{ uniqueCredits.length - initialDisplayCount }})
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

        <!-- Information Tab -->
        <div v-else-if="activeTab === 'information'">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {{ t('person.information') }}
            </h2>

            <dl class="space-y-4">
              <div v-if="person.birthday" class="flex flex-col sm:flex-row sm:gap-4">
                <dt class="font-semibold text-gray-900 dark:text-white min-w-[180px]">
                  {{ t('person.birthday') }}:
                </dt>
                <dd class="text-gray-700 dark:text-gray-300">
                  {{ d(new Date(person.birthday), 'long') }}
                  <span v-if="age" class="text-gray-500 dark:text-gray-400 ml-2"
                    >({{ age }} {{ t('person.yearsOld') }})</span
                  >
                </dd>
              </div>

              <div v-if="person.deathday" class="flex flex-col sm:flex-row sm:gap-4">
                <dt class="font-semibold text-gray-900 dark:text-white min-w-[180px]">
                  {{ t('person.deathday') }}:
                </dt>
                <dd class="text-gray-700 dark:text-gray-300">
                  {{ d(new Date(person.deathday), 'long') }}
                </dd>
              </div>

              <div v-if="placeOfBirth" class="flex flex-col sm:flex-row sm:gap-4">
                <dt class="font-semibold text-gray-900 dark:text-white min-w-[180px]">
                  {{ t('person.placeOfBirth') }}:
                </dt>
                <dd class="text-gray-700 dark:text-gray-300">{{ placeOfBirth }}</dd>
              </div>

              <div v-if="person.country" class="flex flex-col sm:flex-row sm:gap-4">
                <dt class="font-semibold text-gray-900 dark:text-white min-w-[180px]">
                  {{ t('person.country') }}:
                </dt>
                <dd class="text-gray-700 dark:text-gray-300">{{ person.country.name }}</dd>
              </div>

              <div v-if="person.gender" class="flex flex-col sm:flex-row sm:gap-4">
                <dt class="font-semibold text-gray-900 dark:text-white min-w-[180px]">
                  {{ t('person.gender') }}:
                </dt>
                <dd class="text-gray-700 dark:text-gray-300">{{ person.gender }}</dd>
              </div>

              <div v-if="person.tmdb?.popularity" class="flex flex-col sm:flex-row sm:gap-4">
                <dt class="font-semibold text-gray-900 dark:text-white min-w-[180px]">
                  Popularity:
                </dt>
                <dd class="text-gray-700 dark:text-gray-300">
                  {{ person.tmdb.popularity.toFixed(2) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </template>
    </DetailPageLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PersonDetailsResponse } from '~/server/api/people/[id].get'
import { extractIdFromSlug, createSlugWithId } from '~/utils/slug'
import SafeHtml from '~/components/SafeHtml.vue'
import DetailPageLayout from '~/components/DetailPageLayout.vue'

const route = useRoute()
const router = useRouter()
const { t, d } = useI18n()
const localePath = useLocalePath()

// Extract person ID from slug
const slug = computed(() => route.params.slug as string)
const personId = computed(() => extractIdFromSlug(slug.value))

// Validate person ID before fetching
if (!personId.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Invalid person URL',
    fatal: true,
  })
}

// Tabs configuration
const tabs = [
  { id: 'biography', label: 'tabs.biography' },
  { id: 'shows', label: 'tabs.shows' },
  { id: 'information', label: 'tabs.information' },
]

// Active tab management
const initialTab = (route.query.tab as string) || 'biography'
const validTabs = tabs.map((t) => t.id)
const activeTab = ref(validTabs.includes(initialTab) ? initialTab : 'biography')

// Function to change tab and update URL
const changeTab = (tabId: string) => {
  activeTab.value = tabId
  router.push({
    query: { ...route.query, tab: tabId },
  })
}

// Watch for URL query changes
watch(
  () => route.query.tab,
  (newTab) => {
    const tab = newTab as string
    if (validTabs.includes(tab)) {
      activeTab.value = tab
    }
  }
)

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
// Prefer TMDB biography over TVMaze biography
const biography = computed(() => {
  if (person.value?.tmdb?.biography) {
    return person.value.tmdb.biography
  }
  return person.value?.biography || null
})

// Show place of birth from TMDB if available
const placeOfBirth = computed(() => {
  return person.value?.tmdb?.placeOfBirth || null
})

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

const uniqueCredits = computed(() => {
  if (!person.value?.castCredits) return []

  // Remove duplicates based on show ID (a person can have multiple roles in the same show)
  return person.value.castCredits.reduce(
    (acc, credit) => {
      if (!acc.find((c) => c.id === credit.id)) {
        acc.push(credit)
      }
      return acc
    },
    [] as typeof person.value.castCredits
  )
})

const displayedCredits = computed(() => {
  if (showAllCredits.value) return uniqueCredits.value
  return uniqueCredits.value.slice(0, initialDisplayCount.value)
})

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
