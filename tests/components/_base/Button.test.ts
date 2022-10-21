import Button from '~/components/_base/Button.vue';

import { mount } from '@vue/test-utils';

describe('Button', () => {
  it('should render', () => {
    const wrapper = mount(Button, { slots: { default: 'abc' } });
    expect(wrapper.text()).toContain('abc');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
