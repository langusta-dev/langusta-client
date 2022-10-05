import { startNProgress, stopNProgress } from '~/composables/nprogress'

import type { InstallModule } from '~/types/modules'

export const install: InstallModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(startNProgress)
    router.afterEach(stopNProgress)
  }
}
