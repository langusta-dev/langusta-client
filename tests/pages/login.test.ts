import Login from '~/pages/login.vue';

import { flushPromises, mount } from '@vue/test-utils';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import * as confirm from '~/composables/confirm';

describe('login page', () => {
  it('should render', () => {
    const wrapper = mount(Login);

    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(2);

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);

    expect(wrapper.text()).toContain('login.username');
    expect(wrapper.text()).toContain('login.password');

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should log in', async () => {
    const wrapper = mount(Login);

    const inputs = wrapper.findAll('input');

    const username = 'some-username';
    const password = 'some-password';

    await inputs[0].setValue(username);
    await inputs[1].setValue(password);

    const button = wrapper.find('button');
    await button.trigger('click');

    const sessionStore = useSessionStore();

    expect(sessionStore.logIn).toHaveBeenCalledOnce();
    expect(sessionStore.logIn).toHaveBeenCalledWith({ username, password });
  });

  it('should show error and clear password input on failed login', async () => {
    const wrapper = mount(Login);

    const inputs = wrapper.findAll('input');

    await inputs[0].setValue('some-username');
    await inputs[1].setValue('some-password');

    const sessionStore = useSessionStore();

    // @ts-expect-error it's readonly
    sessionStore.isAuth = false;

    const button = wrapper.find('button');
    await button.trigger('click');
    await flushPromises();

    expect(sessionStore.logIn).toHaveBeenCalledOnce();

    // @ts-expect-error it's readonly
    sessionStore.isAuth = false;

    // error label
    expect(wrapper.html()).toContain('login.login_failed_error');

    // password input
    expect(inputs[1].element.value).toBe('');
    expect(inputs[1].classes()).toContain('border-error');
  });

  it('should enable local profile', async () => {
    const wrapper = mount(Login);

    const buttons = wrapper.findAll('button');

    const showConfirmSpy = vi
      .spyOn(confirm, 'showConfirm')
      .mockImplementation(() => {});

    await buttons[1].trigger('click');

    const localProfileStore = useLocalProfileStore();

    expect(showConfirmSpy).toHaveBeenCalledOnce();
    expect(showConfirmSpy).toHaveBeenCalledWith({
      msg: 'login.local_profile_confirm',
      cb: localProfileStore.enableLocalProfile,
    });
  });
});
