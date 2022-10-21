import FadeTransition from '~/components/_base/FadeTransition.vue';

import { mount } from '@vue/test-utils';

describe('FadeTransition', () => {
  it('should render', () => {
    const wrapper = mount(FadeTransition, {
      slots: { default: '<div> abc </div>' },
    });

    expect(wrapper.html()).toContain('<div> abc </div>');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
