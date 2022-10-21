import type { Nullish } from '~/types/basic';

export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

export const isBool = (value: unknown): value is boolean =>
  typeof value === 'boolean';

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFn = (value: unknown): value is Function =>
  value instanceof Function;

export const isNullish = (value: unknown): value is Nullish =>
  value === null || value === undefined;

export const isNum = (value: unknown): value is number =>
  typeof value === 'number';

export const isNumeric = (value: unknown) =>
  isNum(value) || Number(String(value)) === Number(value);

export const isObj = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !isArray(value);

export const isStr = (value: unknown): value is string =>
  typeof value === 'string';
