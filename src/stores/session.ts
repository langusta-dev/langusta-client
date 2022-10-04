import { acceptHMRUpdate, defineStore } from 'pinia'

import { jwt, setJwt, unsetJwt } from '~/composables/jwt'

import * as api from '~/api/session'

import type { AuthPayload } from '~/types/session'

export const useSession = defineStore('session', () => {
  const isAuth = $computed(() => !!jwt.value)

  const logIn = async (data: AuthPayload) => {
    const { data: newJwt } = await api.logIn(data)
    if (newJwt) {
      setJwt(newJwt)
    }
  }

  const logOut = () => {
    unsetJwt()
  }

  const register = async (data: AuthPayload) => {
    const { data: newJwt } = await api.register(data)
    if (newJwt) {
      setJwt(newJwt)
    }
  }

  watch($$(isAuth), (currentValue, previousValue) => {
    if (!currentValue && previousValue) {
      const router = useRouter()
      router.push('/login')
    }
  })

  return $$({ isAuth, logIn, logOut, register })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSession, import.meta.hot))
}
