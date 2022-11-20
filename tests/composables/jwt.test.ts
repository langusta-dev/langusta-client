import { flushPromises } from '@vue/test-utils';

import { jwt, setJwt, unsetJwt } from '~/composables/jwt';

describe('jwt', () => {
  describe('setJwt', () => {
    it('should update JWT value', () => {
      expect(jwt.value).toBe(null);

      setJwt('some-jwt');
      expect(jwt.value).toBe('some-jwt');
    });
  });

  describe('unsetJwt', () => {
    it('should reset JWT value to null', () => {
      setJwt('some-jwt');
      expect(jwt.value).toBe('some-jwt');

      unsetJwt();
      expect(jwt.value).toBe(null);
    });
  });

  it('should update session storage', async () => {
    expect(sessionStorage.getItem('token')).toBe(null);

    setJwt('some-jwt');
    await flushPromises();
    expect(sessionStorage.getItem('token')).toBe('some-jwt');

    unsetJwt();
    await flushPromises();
    expect(sessionStorage.getItem('token')).toBe(null);
  });
});
