import { createTestingPinia } from '@pinia/testing'
import { config } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import {
  VueRouterMock,
  createRouterMock,
  injectRouterMock,
} from 'vue-router-mock'

const router = createRouterMock()
const i18n = createI18n({ legacy: false, locale: 'en', messages: {} })

config.plugins.VueWrapper.install(VueRouterMock)

beforeEach(() => {
  injectRouterMock(router)

  const pinia = createTestingPinia()

  setActivePinia(pinia)
  config.global.plugins = [router, pinia, i18n]
})
