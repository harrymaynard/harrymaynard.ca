import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => new Promise((resolve) => resolve({ data: null }))),
  },
}))

describe('AnimatedBackground.vue', () => {
  it('Should render the canvas', () => {
    const wrapper = mount(AnimatedBackground)
    expect(wrapper.get('#background-canvas')).toBeTruthy()
  })
})
