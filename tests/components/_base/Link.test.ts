import Link from '~/components/_base/Link.vue';

import { mount } from '@vue/test-utils';

import type { SpyInstance } from 'vitest';

describe('Link', () => {
  it('should render', () => {
    const wrapper = mount(Link, { slots: { default: 'abc' } });
    expect(wrapper.text()).toContain('abc');
    expect(wrapper.html()).toMatchSnapshot();
  });

  const to = '/abc';

  let openSpy: SpyInstance;
  let focusSpy: SpyInstance;
  beforeEach(() => {
    openSpy = vi.spyOn(window, 'open').mockImplementation(() => window);
    focusSpy = vi.spyOn(window, 'focus').mockImplementation(() => {});
  });

  it('should do nothing', async () => {
    const wrapper = mount(Link);

    await wrapper.trigger('click');

    expect(wrapper.router.push).not.toHaveBeenCalled();
    expect(wrapper.router.replace).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should open external link', async () => {
    const wrapper = mount(Link, { props: { to, external: true } });

    await wrapper.trigger('click');

    expect(openSpy).toHaveBeenCalledOnce();
    expect(openSpy).toHaveBeenCalledWith(to, '_blank');
    expect(focusSpy).toHaveBeenCalledOnce();
  });

  it('should push router', async () => {
    const wrapper = mount(Link, { props: { to } });

    await wrapper.trigger('click');

    expect(wrapper.router.push).toHaveBeenCalledOnce();
    expect(wrapper.router.push).toHaveBeenCalledWith(to);
  });

  it('should replace router', async () => {
    const wrapper = mount(Link, { props: { to, replace: true } });

    await wrapper.trigger('click');

    expect(wrapper.router.replace).toHaveBeenCalledOnce();
    expect(wrapper.router.replace).toHaveBeenCalledWith(to);
  });
});
