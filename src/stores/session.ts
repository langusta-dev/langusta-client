import { acceptHMRUpdate, defineStore } from 'pinia'

import { jwt, setJwt, unsetJwt } from '~/composables/jwt'

import * as api from '~/api/session'

import type { AuthPayload } from '~/types/session'

export const useSession = defineStore('session', () => {
  const isAuth = $computed(() => !!jwt.value)

  const logIn = async (payload: AuthPayload) => {
    const { data } = await api.logIn(payload)

    if (data?.token) {
      setJwt(data.token)
    }
  }

  const logOut = () => {
    unsetJwt()
  }

  const register = async (payload: AuthPayload) => {
    const { data } = await api.register(payload)

    if (data?.token) {
      setJwt(data.token)
    }
  }

  return $$({ isAuth, logIn, logOut, register })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSession, import.meta.hot))
}
