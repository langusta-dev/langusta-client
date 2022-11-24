import { acceptHMRUpdate, defineStore } from 'pinia';

import { getJwt } from '~/composables/jwt';

export const useLocalProfileStore = defineStore('localProfile', () => {
  let isLocalProfileEnabled = $(
    useLocalStorage<boolean>('enable-local-profile', false)
  );

  const enableLocalProfile = () => {
    isLocalProfileEnabled = true;
  };

  const disableLocalProfile = () => {
    isLocalProfileEnabled = false;
  };

  whenever(getJwt, disableLocalProfile);

  return {
    isLocalProfileEnabled: computed(() => isLocalProfileEnabled),
    enableLocalProfile,
    disableLocalProfile,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLocalProfileStore, import.meta.hot)
  );
}
