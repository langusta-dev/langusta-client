import type { VueWrapper as BaseVueWrapper } from '@vue/test-utils'
import type { RouterMock } from 'vue-router-mock'

declare module '@vue/test-utils' {
  interface VueWrapper extends BaseVueWrapper {
    router: RouterMock
  }
}
