import { createPinia } from 'pinia';

import type { InstallModule } from '~/types/modules';

export const install: InstallModule = ({ isClient, initialState, app }) => {
  const pinia = createPinia();

  app.use(pinia);

  if (isClient) {
    pinia.state.value = initialState.pinia || {};
  } else {
    initialState.pinia = pinia.state.value;
  }
};
