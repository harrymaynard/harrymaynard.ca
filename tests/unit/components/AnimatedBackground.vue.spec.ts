import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

vi.hoisted(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(null),
    text: () => Promise.resolve('<svg width="1" height="1"></svg>'),
  })))
})

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
