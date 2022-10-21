import { rest } from '~/helpers/api';

import type { LogInPayload, RegisterPayload } from '~/types/session';

export const logIn = (data: LogInPayload) =>
  rest.post<{ token: string }>('/auth/login', data);

export const register = (data: RegisterPayload) =>
  rest.post<{ token: string }>('/auth/register', data);
