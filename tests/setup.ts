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
const pinia = createTestingPinia()

config.global.plugins = [
  router,
  pinia,
  createI18n({ legacy: false, locale: 'en', messages: {} }),
]
config.plugins.VueWrapper.install(VueRouterMock)

beforeEach(() => {
  injectRouterMock(router)
  setActivePinia(pinia)
})
