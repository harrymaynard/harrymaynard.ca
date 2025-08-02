import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconMail from '@/components/icons/IconMail.vue'

describe('IconMail.vue', () => {
  it('Should render the SVG', () => {
    const wrapper = mount(IconMail)
    expect(wrapper.get('svg')).toBeTruthy()
  })
})
