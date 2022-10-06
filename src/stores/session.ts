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

  const logIn = async (payload: LogInPayload) => {
    const { data } = await api.logIn(payload)

    if (data?.token) {
      setJwt(data.token)
    }
  }

  const logOut = () => {
    unsetJwt()
  }

  const register = async (payload: RegisterPayload) => {
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
