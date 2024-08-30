import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconGitHub from '@/components/icons/IconGitHub.vue'

describe('IconGitHub.vue', () => {
  it('Should render the SVG', () => {
    const wrapper = mount(IconGitHub)
    expect(wrapper.get('svg')).toBeTruthy()
  })
})
