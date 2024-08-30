import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  it('Should render application\'s root component', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: true,
        }
      }
    })
    expect(wrapper.get('#app')).toBeTruthy()
  })
})
