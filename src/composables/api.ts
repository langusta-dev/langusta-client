import axios, { AxiosError } from 'axios';

import { HttpStatusCode } from '~/types/api';

import { jwt, unsetJwt } from '~/composables/jwt';
import { startNProgress, stopNProgress } from '~/composables/nprogress';

import { isOnline } from './online';

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

class ClientOfflineError extends Error {
  constructor() {
    super('Client is offline');
  }
}

const CONFIG: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
};

const rest = axios.create(CONFIG) as RestInstance & { silent: AxiosInstance };
rest.silent = axios.create(CONFIG) as RestInstance;
rest.silent.defaults.headers = rest.defaults.headers;

const handleClientOffline = (
  request: AxiosRequestConfig
): AxiosRequestConfig => {
  if (!isOnline.value) {
    throw new ClientOfflineError();
  }

  return request;
};

const parseResponse = (response: AxiosResponse): AxiosResponse => {
  if (response.status === HttpStatusCode.Unauthorized) {
    unsetJwt();
  }

  return { ...response, data: response.data ?? null };
};

const handleErrors = (error: Error | AxiosError): AxiosResponse => {
  if (error instanceof ClientOfflineError) {
    return {
      status: HttpStatusCode.ClientOffline,
      statusText: 'Client is offline',
      data: null,
      headers: {},
      config: CONFIG,
    };
  }

  if (error instanceof AxiosError) {
    return {
      status: error.response?.status || HttpStatusCode.UnknownError,
      statusText: error.response?.statusText || error.message,
      data: null,
      headers: error.response?.headers || {},
      config: CONFIG,
    };
  }

  return {
    status: HttpStatusCode.UnknownError,
    statusText: error.message,
    data: null,
    headers: {},
    config: CONFIG,
  };
};

rest.interceptors.request.use(handleClientOffline);
rest.silent.interceptors.request.use(handleClientOffline);

rest.interceptors.response.use(parseResponse, handleErrors);
rest.silent.interceptors.response.use(parseResponse, handleErrors);

rest.interceptors.request.use((request) => {
  startNProgress();
  return request;
});

rest.interceptors.response.use(
  (response) => {
    stopNProgress();
    return response;
  },
  (error) => {
    stopNProgress();
    return error;
  }
);

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
