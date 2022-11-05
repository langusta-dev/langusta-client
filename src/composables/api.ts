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

const _handleClientOffline = (
  request: AxiosRequestConfig
): AxiosRequestConfig => {
  if (!isOnline.value) {
    throw new ClientOfflineError();
  }

  return request;
};

const _parseResponse = (response: AxiosResponse): AxiosResponse => ({
  ...response,
  data: response.data || null,
});

const _clientOfflineResponse = (
  error: Pick<Error, 'message'>
): AxiosResponse => ({
  status: HttpStatusCode.ClientOffline,
  statusText: error.message,
  data: null,
  headers: {},
  config: CONFIG,
});

const _unknownErrorResponse = (
  error: Pick<Error, 'message'>
): AxiosResponse => ({
  status: HttpStatusCode.UnknownError,
  statusText: error.message,
  data: null,
  headers: {},
  config: CONFIG,
});

const _handleErrors = (error: Error): AxiosResponse => {
  if (error instanceof ClientOfflineError) {
    return _clientOfflineResponse(error);
  }

  if (error instanceof AxiosError) {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      unsetJwt();
    }

    return {
      status: error.response?.status || HttpStatusCode.UnknownError,
      statusText: error.response?.statusText || error.message,
      data: null,
      headers: error.response?.headers || {},
      config: CONFIG,
    };
  }

  return _unknownErrorResponse(error);
};

rest.interceptors.request.use(_handleClientOffline);
rest.silent.interceptors.request.use(_handleClientOffline);

rest.interceptors.response.use(_parseResponse, _handleErrors);
rest.silent.interceptors.response.use(_parseResponse, _handleErrors);

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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('_handleClientOffline', () => {
    it('should do nothing, if online', () => {
      isOnline.value = true;
      expect(() => _handleClientOffline({})).not.toThrow();
    });

    it('should throw ClientOfflineError, if offline', () => {
      isOnline.value = false;
      expect(() => _handleClientOffline({})).toThrow(ClientOfflineError);
    });
  });

  describe('_parseResponse', () => {
    it('should not change response with data', () => {
      const response = {
        status: 200,
        statusText: 'Ok',
        data: {},
        headers: {},
        config: {},
      };

      expect(_parseResponse(response)).toStrictEqual(response);
    });

    it('should replace missing data with null', () => {
      const response: AxiosResponse = {
        status: 400,
        statusText: 'Ok',
        data: undefined,
        headers: {},
        config: {},
      };

      expect(_parseResponse(response)).toStrictEqual({
        ...response,
        data: null,
      });
    });
  });

  describe('_handleErrors', () => {
    it('should handle ClientOfflineError', () => {
      expect(_handleErrors(new ClientOfflineError())).toStrictEqual(
        _clientOfflineResponse({ message: 'Client is offline' })
      );
    });

    it('should handle AxiosError', () => {
      expect(
        _handleErrors(
          // @ts-expect-error fields are intentionally missing
          new AxiosError('some message', undefined, undefined, undefined, {})
        )
      ).toStrictEqual({
        status: HttpStatusCode.UnknownError,
        statusText: 'some message',
        data: null,
        headers: {},
        config: CONFIG,
      });

      expect(
        _handleErrors(
          // @ts-expect-error other fields shouldn't matter
          new AxiosError('some message', undefined, undefined, undefined, {
            status: HttpStatusCode.BadRequest,
            statusText: 'some status text',
            headers: { some: 'header' },
          })
        )
      ).toStrictEqual({
        status: HttpStatusCode.BadRequest,
        statusText: 'some status text',
        data: null,
        headers: { some: 'header' },
        config: CONFIG,
      });
    });

    it('should unset jwt, if response has status 401', async () => {
      const { jwt, setJwt } = await import('~/composables/jwt');

      setJwt('abc');
      expect(jwt.value).toBe('abc');

      _handleErrors(
        // @ts-expect-error other fields shouldn't matter
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.Unauthorized,
        })
      );

      expect(jwt.value).toBe(null);
    });

    it('should handle unknown error', () => {
      expect(_handleErrors(new Error('abc'))).toStrictEqual(
        _unknownErrorResponse({ message: 'abc' })
      );
    });
  });
}
