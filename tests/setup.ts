import { createTestingPinia } from '@pinia/testing';
import { config } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import {
  VueRouterMock,
  createRouterMock,
  injectRouterMock,
} from 'vue-router-mock';

import { rest } from '~/composables/api';

const router = createRouterMock();
const i18n = createI18n({ legacy: false, locale: 'en', messages: {} });

config.plugins.VueWrapper.install(VueRouterMock);

beforeEach(() => {
  injectRouterMock(router);

  const pinia = createTestingPinia({ stubActions: false });

  setActivePinia(pinia);
  config.global.plugins = [router, pinia, i18n];

  const emptyResponse = { data: null };
  vi.spyOn(rest, 'get').mockResolvedValue(emptyResponse);
  vi.spyOn(rest, 'post').mockResolvedValue(emptyResponse);
  vi.spyOn(rest.silent, 'get').mockResolvedValue(emptyResponse);
  vi.spyOn(rest.silent, 'post').mockResolvedValue(emptyResponse);

  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
