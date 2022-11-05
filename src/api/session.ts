import { rest } from '~/composables/api';

import type { JwtTokenPayload } from '~/types/jwt';
import type { LogInPayload, RegisterPayload } from '~/types/session';

export const logIn = (data: LogInPayload) =>
  rest.post<JwtTokenPayload>('/auth/login', data);

export const register = (data: RegisterPayload) =>
  rest.post<JwtTokenPayload>('/auth/register', data);
