import { useNProgress } from '@vueuse/integrations/useNProgress'

import type { InstallModule } from '~/types/modules'

const { start, done } = useNProgress(null, { showSpinner: false })

// prevent the router from disabling nprogress, if triggered by something else
let startedByRouter = false
const startByRouter = () => {
  start()
  startedByRouter = true
}

const {
  start: detachStart,
  stop,
  isPending,
} = $(useTimeoutFn(startByRouter, 0, { immediate: false }))

export const install: InstallModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from) => {
      if (to.path !== from.path) {
        detachStart()
      }
    })

    router.afterEach(() => {
      if (isPending) {
        stop()
      }

      if (startedByRouter) {
        done()
        startedByRouter = false
      }
    })
  }
}
