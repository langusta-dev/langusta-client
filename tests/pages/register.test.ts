import Register from '~/pages/register.vue'

import { flushPromises, mount } from '@vue/test-utils'

import { useSessionStore } from '~/stores/session'

describe('register page', () => {
  const email = 'some@email.abc'
  const username = 'some-username'
  const firstname = 'some-firstname'
  const lastname = 'some-lastname'
  const password = 'some-password'

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render', () => {
    const wrapper = mount(Register)

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(6)

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(1)

    expect(wrapper.text()).toContain('register.email')
    expect(wrapper.text()).toContain('register.username')
    expect(wrapper.text()).toContain('register.firstname')
    expect(wrapper.text()).toContain('register.lastname')
    expect(wrapper.text()).toContain('register.password')
    expect(wrapper.text()).toContain('register.repeat_password')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should register', async () => {
    const wrapper = mount(Register)

    const inputs = wrapper.findAll('input')

    await inputs[0].setValue(email)
    await inputs[1].setValue(username)
    await inputs[2].setValue(firstname)
    await inputs[3].setValue(lastname)
    await inputs[4].setValue(password)
    await inputs[5].setValue(password)

    const button = wrapper.find('button')
    await button.trigger('click')

    const sessionStore = useSessionStore()

    expect(sessionStore.register).toHaveBeenCalledOnce()
    expect(sessionStore.register).toHaveBeenCalledWith({
      email,
      username,
      firstname,
      lastname,
      password,
    })
  })

  it('should show error on failed registration', async () => {
    const wrapper = mount(Register)

    const inputs = wrapper.findAll('input')

    await inputs[0].setValue(email)
    await inputs[1].setValue(username)
    await inputs[2].setValue(firstname)
    await inputs[3].setValue(lastname)
    await inputs[4].setValue(password)
    await inputs[5].setValue(password)

    const sessionStore = useSessionStore()

    // @ts-expect-error it's readonly
    sessionStore.isAuth = false

    vi.useFakeTimers()

    const button = wrapper.find('button')
    await button.trigger('click')

    vi.advanceTimersToNextTimer()
    await flushPromises()

    expect(sessionStore.register).toHaveBeenCalledOnce()

    // @ts-expect-error it's readonly
    sessionStore.isAuth = false

    expect(wrapper.html()).toContain('register.registration_failed_error')
  })
})
