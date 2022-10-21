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

  it('should show error on invalid email input', async () => {
    const wrapper = mount(Register)

    const inputs = wrapper.findAll('input')
    const emailInput = inputs[0]

    const invalidEmail = 'not-an-email'

    await emailInput.setValue(invalidEmail)

    vi.useFakeTimers()

    await emailInput.trigger('blur')

    vi.advanceTimersToNextTimer()
    await flushPromises()

    expect(wrapper.html()).toContain('register.invalid_email_error')
    expect(emailInput.element.value).toBe(invalidEmail)
  })

  it('should show error on too short password input', async () => {
    const wrapper = mount(Register)

    const inputs = wrapper.findAll('input')
    const passwordInput = inputs[4]

    await passwordInput.setValue(
      'x'.repeat(import.meta.env.VITE_PASSWORD_MIN_LENGTH - 1)
    )

    vi.useFakeTimers()

    await passwordInput.trigger('blur')

    vi.advanceTimersToNextTimer()
    await flushPromises()

    expect(wrapper.html()).toContain('register.password_too_short_error')
    expect(passwordInput.element.value).toBe('')
  })

  it('should show error on not matching passwords', async () => {
    const wrapper = mount(Register)

    const inputs = wrapper.findAll('input')
    const passwordInput = inputs[4]
    const repeatPasswordInput = inputs[5]

    await inputs[0].setValue(email)
    await inputs[1].setValue(username)
    await inputs[2].setValue(firstname)
    await inputs[3].setValue(lastname)
    await passwordInput.setValue(password)
    await repeatPasswordInput.setValue(password + 'x')

    const sessionStore = useSessionStore()

    vi.useFakeTimers()

    const button = wrapper.find('button')
    await button.trigger('click')

    vi.advanceTimersToNextTimer()
    await flushPromises()

    expect(sessionStore.register).not.toHaveBeenCalled()

    expect(wrapper.html()).toContain('register.passwords_not_equal_error')

    expect(passwordInput.element.value).toBe('')
    expect(repeatPasswordInput.element.value).toBe('')
  })
})
