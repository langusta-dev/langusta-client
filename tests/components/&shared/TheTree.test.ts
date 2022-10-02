import TheTree from '~/components/&shared/TheTree.vue'

import { mount } from '@vue/test-utils'

describe('TheTree', () => {
  it('should render', () => {
    const wrapper = mount(TheTree)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should shake', async () => {
    const wrapper = mount(TheTree)
    await wrapper.trigger('click')
    expect(wrapper.classes('shake')).toBe(true)
  })
})
