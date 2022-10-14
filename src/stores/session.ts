import { acceptHMRUpdate, defineStore } from 'pinia'

import { jwt, setJwt, unsetJwt } from '~/composables/jwt'

import * as api from '~/api/session'

import { useLocalProfileStore } from './localProfile'

import type { LogInPayload, RegisterPayload } from '~/types/session'

export const useSessionStore = defineStore('session', () => {
  const localProfileStore = useLocalProfileStore()

  const isAuth = $computed(
    () => !!jwt.value || localProfileStore.isLocalProfileEnabled
  )

  const logOut = () => {
    unsetJwt()

    if (localProfileStore.isLocalProfileEnabled) {
      localProfileStore.disableLocalProfile()
    }
  }

  const logIn = async (payload: LogInPayload) => {
    if (isAuth) {
      logOut()
    }

    const { data } = await api.logIn(payload)

    if (data?.token) {
      setJwt(data.token)
    }
  }

  const register = async (payload: RegisterPayload) => {
    if (isAuth) {
      logOut()
    }

    const { data } = await api.register(payload)

    if (data?.token) {
      setJwt(data.token)
    }
  }

  return $$({ isAuth, logIn, logOut, register })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot))
}
