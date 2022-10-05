import { useSession } from '~/stores/session'

import { jwt } from '~/composables/jwt'

import type { InstallModule } from '~/types/modules'

export const install: InstallModule = ({ isClient, router }) => {
  if (!isClient) {
    return
  }

  router.beforeEach((to) => {
    if (to.meta.auth) {
      const session = useSession()

      if (!session.isAuth) {
        return '/login'
      }
    }

    return true
  })

  watch(jwt, (v) => {
    if (!v) {
      router.push('/login')
    }
  })
}
