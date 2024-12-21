import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => new Promise((resolve) => resolve({ data: null }))),
  },
}))

describe('AnimatedBackground.vue', () => {
  it('Should render the canvas', () => {
    const wrapper = mount(AnimatedBackground, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
        })],
      },
    })
    expect(wrapper.get('#background-canvas')).toBeTruthy()
  })
})
