import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingBadge from '@/components/RatingBadge.vue'

describe('RatingBadge', () => {
  it('should render rating value', () => {
    const wrapper = mount(RatingBadge, {
      props: {
        rating: 8.5,
      },
    })

    expect(wrapper.text()).toContain('8.5')
  })

  it('should render N/A for null rating', () => {
    const wrapper = mount(RatingBadge, {
      props: {
        rating: null,
      },
    })

    expect(wrapper.text()).toBe('N/A')
  })

  it('should render star icon', () => {
    const wrapper = mount(RatingBadge, {
      props: {
        rating: 8.5,
      },
    })

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should format rating to 1 decimal place', () => {
    const wrapper = mount(RatingBadge, {
      props: {
        rating: 8.567,
      },
    })

    expect(wrapper.text()).toContain('8.6')
  })
})
