import { rest } from '~/helpers/api'

import type { AuthPayload } from '~/types/session'

export const logIn = (data: AuthPayload) =>
  rest.post<{ token: string }>('/auth/login', data)

export const register = (data: AuthPayload) =>
  rest.post<{ token: string }>('/auth/register', data)
