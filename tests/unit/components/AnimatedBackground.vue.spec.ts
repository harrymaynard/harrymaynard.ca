import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

describe('AnimatedBackground.vue', () => {
  it('Should render the canvas', () => {
    const wrapper = mount(AnimatedBackground)
    expect(wrapper.get('#background-canvas')).toBeTruthy()
  })
})
