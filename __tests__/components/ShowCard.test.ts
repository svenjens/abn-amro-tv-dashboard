import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowCard from '@/components/ShowCard.vue'
import type { Show } from '@/types'

// Mock Nuxt composables
vi.mock('#app', async () => {
  const actual = await vi.importActual('#app')
  return {
    ...actual,
    navigateTo: vi.fn(),
  }
})

// Mock i18n composables
vi.mock('#i18n', () => ({
  useLocalePath: () => (path: string) => `/en${path}`,
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'en' },
  }),
}))

// Mock NuxtImg component
vi.mock('#components', () => ({
  NuxtImg: {
    name: 'NuxtImg',
    template: '<img :src="src" :alt="alt" />',
    props: ['src', 'alt', 'loading', 'fetchpriority', 'decoding', 'format', 'quality', 'class'],
  },
}))

// Mock child components that use i18n
vi.mock('@/components/WatchlistButton.vue', () => ({
  default: {
    name: 'WatchlistButton',
    template: '<button>Watchlist</button>',
    props: ['show', 'variant', 'size'],
  },
}))

vi.mock('@/components/RatingBadge.vue', () => ({
  default: {
    name: 'RatingBadge',
    template: '<span>Rating Badge</span>',
    props: ['rating'],
  },
}))

vi.mock('@/components/GenreTags.vue', () => ({
  default: {
    name: 'GenreTags',
    template: '<div>Genre Tags</div>',
    props: ['genres', 'maxDisplay'],
  },
}))

// Mock IntersectionObserver composable
vi.mock('@/composables/useIntersectionObserver', () => ({
  useIntersectionObserver: () => ({
    target: { value: null },
    isIntersecting: { value: true },
  }),
}))

const mockShow: Show = {
  id: 1,
  url: 'https://www.tvmaze.com/shows/1/under-the-dome',
  name: 'Under the Dome',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Science-Fiction', 'Thriller'],
  status: 'Ended',
  runtime: 60,
  averageRuntime: 60,
  premiered: '2013-06-24',
  ended: '2015-09-10',
  officialSite: 'http://www.cbs.com/shows/under-the-dome/',
  schedule: {
    time: '22:00',
    days: ['Thursday'],
  },
  rating: {
    average: 6.5,
  },
  weight: 98,
  network: {
    id: 2,
    name: 'CBS',
    country: {
      name: 'United States',
      code: 'US',
      timezone: 'America/New_York',
    },
    officialSite: 'https://www.cbs.com/',
  },
  webChannel: null,
  dvdCountry: null,
  externals: {
    tvrage: 25988,
    thetvdb: 264492,
    imdb: 'tt1553656',
  },
  image: {
    medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg',
    original: 'https://static.tvmaze.com/uploads/images/original_untouched/81/202627.jpg',
  },
  summary: '<p><b>Under the Dome</b> is a science fiction drama.</p>',
  updated: 1704794065,
  _links: {
    self: {
      href: 'https://api.tvmaze.com/shows/1',
    },
  },
}

describe('ShowCard', () => {
  it('should render show name', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        lazy: false,
      },
    })

    expect(wrapper.text()).toContain('Under the Dome')
  })

  it('should render show rating badge', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        lazy: false,
      },
    })

    // RatingBadge component should be present
    expect(wrapper.findComponent({ name: 'RatingBadge' }).exists()).toBe(true)
  })

  it('should render genre tags', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        lazy: false,
      },
    })

    // GenreTags component should be present
    expect(wrapper.findComponent({ name: 'GenreTags' }).exists()).toBe(true)
  })

  it('should display premiered year', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        lazy: false,
      },
    })

    expect(wrapper.text()).toContain('2013')
  })

  it('should render match reason when provided', () => {
    const matchReason = 'High rating match'
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        matchReason,
        lazy: false,
      },
    })

    expect(wrapper.text()).toContain(matchReason)
  })

  it('should not render match reason when not provided', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        lazy: false,
      },
    })

    expect(wrapper.find('.bg-blue-600').exists()).toBe(false)
  })

  it('should render WatchlistButton component', () => {
    const wrapper = mount(ShowCard, {
      props: {
        show: mockShow,
        lazy: false,
      },
    })

    expect(wrapper.findComponent({ name: 'WatchlistButton' }).exists()).toBe(true)
  })

  it('should handle show without image gracefully', () => {
    const showWithoutImage = {
      ...mockShow,
      image: null,
    }

    const wrapper = mount(ShowCard, {
      props: {
        show: showWithoutImage,
        lazy: false,
      },
    })

    // Should show placeholder SVG
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should handle show without premiered date', () => {
    const showWithoutPremiered: Show = {
      ...mockShow,
      premiered: null,
    }

    const wrapper = mount(ShowCard, {
      props: {
        show: showWithoutPremiered,
        lazy: false,
      },
    })

    // Should still render without error
    expect(wrapper.exists()).toBe(true)
  })

  it('should render streaming availability logos', () => {
    const showWithStreaming: Show = {
      ...mockShow,
      streamingAvailability: [
        {
          service: {
            id: 'netflix',
            name: 'Netflix',
            logo: '/logos/streaming/netflix.svg',
            type: 'subscription',
            link: 'https://netflix.com',
            country: 'US',
          },
          link: 'https://netflix.com',
          availableFrom: undefined,
          availableUntil: undefined,
        },
      ],
    }

    const wrapper = mount(ShowCard, {
      props: {
        show: showWithStreaming,
        lazy: false,
      },
    })

    // Should render streaming logo
    expect(wrapper.findAll('.w-7.h-7').length).toBeGreaterThan(0)
  })
})
