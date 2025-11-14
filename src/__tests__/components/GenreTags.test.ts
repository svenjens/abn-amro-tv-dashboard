import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GenreTags from '@/components/GenreTags.vue'

describe('GenreTags', () => {
  it('should render all genres when count is below max', () => {
    const wrapper = mount(GenreTags, {
      props: {
        genres: ['Drama', 'Action'],
        maxDisplay: 3,
      },
    })

    expect(wrapper.text()).toContain('Drama')
    expect(wrapper.text()).toContain('Action')
    expect(wrapper.text()).not.toContain('+')
  })

  it('should limit displayed genres and show remaining count', () => {
    const wrapper = mount(GenreTags, {
      props: {
        genres: ['Drama', 'Action', 'Comedy', 'Thriller'],
        maxDisplay: 2,
      },
    })

    expect(wrapper.text()).toContain('Drama')
    expect(wrapper.text()).toContain('Action')
    expect(wrapper.text()).not.toContain('Comedy')
    expect(wrapper.text()).toContain('+2')
  })

  it('should use default maxDisplay of 3', () => {
    const wrapper = mount(GenreTags, {
      props: {
        genres: ['Drama', 'Action', 'Comedy', 'Thriller'],
      },
    })

    expect(wrapper.findAll('span').length).toBe(4) // 3 genres + 1 "+1"
  })

  it('should render empty when no genres provided', () => {
    const wrapper = mount(GenreTags, {
      props: {
        genres: [],
      },
    })

    expect(wrapper.findAll('span').length).toBe(0)
  })
})
