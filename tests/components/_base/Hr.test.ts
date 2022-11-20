import Hr from '~/components/_base/Hr.vue';

import { mount } from '@vue/test-utils';

describe('Hr', () => {
  it('should render', () => {
    const wrapper = mount(Hr);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
