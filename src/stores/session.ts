import { acceptHMRUpdate, defineStore } from 'pinia';

import { jwt, setJwt, unsetJwt } from '~/composables/jwt';

import * as api from '~/api/session';

import { useLocalProfileStore } from './localProfile';

import type { RestResponse } from '~/types/api';
import type { JwtTokenPayload } from '~/types/jwt';
import type { LogInPayload, RegisterPayload } from '~/types/session';

export const useSessionStore = defineStore('session', () => {
  const localProfileStore = useLocalProfileStore();

  const isAuth = $computed(
    () => !!jwt.value || localProfileStore.isLocalProfileEnabled
  );

  const logOut = () => {
    unsetJwt();

    if (localProfileStore.isLocalProfileEnabled) {
      localProfileStore.disableLocalProfile();
    }
  };

  const _authenticate = async (
    tokenPayloadResponse: Promise<RestResponse<JwtTokenPayload>>
  ) => {
    if (isAuth) {
      logOut();
    }

    const { data } = await tokenPayloadResponse;

    if (data?.token) {
      setJwt(data.token);
    }
  };

  const logIn = (payload: LogInPayload) => _authenticate(api.logIn(payload));

  const register = async (payload: RegisterPayload) =>
    _authenticate(api.register(payload));

  return { isAuth: $$(isAuth), logIn, logOut, register };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot));
}
