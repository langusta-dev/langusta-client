import axios from 'axios';

import { jwt, unsetJwt } from '~/composables/jwt';
import { startNProgress, stopNProgress } from '~/composables/nprogress';

import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

type RequestResponse<T> = AxiosResponse<T | null>;

type RequestFn = <T = unknown>(url: string) => Promise<RequestResponse<T>>;

type RequestFnWithData = <T = unknown, D = unknown>(
  url: string,
  data?: D
) => Promise<RequestResponse<T>>;

type RestInstance = Record<'get' | 'delete', RequestFn> &
  Record<'post' | 'put' | 'patch', RequestFnWithData> &
  AxiosInstance;

const CONFIG: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  validateStatus: (status) => status < 500,
};

const rest = axios.create(CONFIG) as RestInstance & { silent: AxiosInstance };
rest.silent = axios.create(CONFIG) as RestInstance;
rest.silent.defaults.headers = rest.defaults.headers;

const parseResponse = (response: AxiosResponse) => {
  if (response.status === 401) {
    unsetJwt();
  }

  return {
    ...response,
    data: response.status === 200 && response.data ? response.data : null,
  };
};

rest.interceptors.request.use((request) => {
  startNProgress();
  return request;
});

rest.interceptors.response.use((response) => {
  stopNProgress();
  return parseResponse(response);
});

rest.silent.interceptors.response.use(parseResponse);

watch(
  jwt,
  (v) => {
    if (v) {
      rest.defaults.headers.common.Authorization = `Bearer ${v}`;
    } else {
      delete rest.defaults.headers.common.Authorization;
    }
  },
  { immediate: true }
);

export { rest };
