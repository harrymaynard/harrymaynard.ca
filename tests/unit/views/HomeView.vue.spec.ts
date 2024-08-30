import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'

describe('HomeView.vue', () => {
  it('Should render the view', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          AnimatedBackground: true,
          IconLinkedIn: true,
          IconGitHub: true,
        }
      }
    })
    expect(wrapper.get('.home-page')).toBeTruthy()
  })
})
