import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'

describe('IconLinkedIn.vue', () => {
  it('Should render the SVG', () => {
    const wrapper = mount(IconLinkedIn)
    expect(wrapper.get('svg')).toBeTruthy()
  })
})
