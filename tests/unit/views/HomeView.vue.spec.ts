import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'

vi.mock('@/store/ModalStore', () => ({
  useModalStore: () => ({
    open: vi.fn(),
  }),
}))

describe('HomeView.vue', () => {
  it('Should render the view', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          AnimatedBackground: true,
          IconLinkedIn: true,
          IconGitHub: true,
          IconMail: true,
        }
      }
    })
    expect(wrapper.get('.home-view')).toBeTruthy()
  })
})
