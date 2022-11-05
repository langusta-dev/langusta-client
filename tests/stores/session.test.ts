import { useLocalProfileStore } from '~/stores/localProfile';
import { useSessionStore } from '~/stores/session';

import { jwt, setJwt, unsetJwt } from '~/composables/jwt';

import * as sessionApi from '~/api/session';

import type { LogInPayload, RegisterPayload } from '~/types/session';

describe('session store', () => {
  afterEach(() => {
    unsetJwt();
    vi.restoreAllMocks();
  });

  describe('isAuth', () => {
    it('should be authenticated, if jwt is present', () => {
      const sessionStore = useSessionStore();

      expect(sessionStore.isAuth).toBe(false);

      setJwt('some-jwt');
      expect(sessionStore.isAuth).toBe(true);
    });

    it('should be authenticated, if local profile is active', () => {
      const sessionStore = useSessionStore();
      const localProfileStore = useLocalProfileStore();

      expect(sessionStore.isAuth).toBe(false);

      localProfileStore.enableLocalProfile();
      expect(sessionStore.isAuth).toBe(true);
    });
  });

  describe('logOut', () => {
    it('should unset jwt', () => {
      const sessionStore = useSessionStore();

      setJwt('some-jwt');
      expect(jwt.value).toBe('some-jwt');
      expect(sessionStore.isAuth).toBe(true);

      sessionStore.logOut();
      expect(jwt.value).toBe(null);
      expect(sessionStore.isAuth).toBe(false);
    });

    it('should disable local profile', () => {
      const sessionStore = useSessionStore();
      const localProfileStore = useLocalProfileStore();

      localProfileStore.enableLocalProfile();
      expect(sessionStore.isAuth).toBe(true);

      sessionStore.logOut();
      expect(localProfileStore.isLocalProfileEnabled).toBe(false);
      expect(sessionStore.isAuth).toBe(false);
    });
  });

  describe('logIn', () => {
    const logInPayload: LogInPayload = {
      username: 'some-username',
      password: 'some-password',
    };

    it('should log out, if authenticated', async () => {
      const sessionStore = useSessionStore();

      setJwt('some-jwt');
      expect(jwt.value).toBe('some-jwt');
      expect(sessionStore.isAuth).toBe(true);

      await sessionStore.logIn(logInPayload);

      expect(jwt.value).toBe(null);
      expect(sessionStore.isAuth).toBe(false);
    });

    it('should disable local profile', async () => {
      const sessionStore = useSessionStore();
      const localProfileStore = useLocalProfileStore();

      localProfileStore.enableLocalProfile();
      expect(sessionStore.isAuth).toBe(true);

      await sessionStore.logIn(logInPayload);

      expect(localProfileStore.isLocalProfileEnabled).toBe(false);
      expect(sessionStore.isAuth).toBe(false);
    });

    it('should fetch and set jwt', async () => {
      const token = 'jwt-from-api';

      const apiLogInSpy = vi
        .spyOn(sessionApi, 'logIn')
        // @ts-expect-error other fields shouldn't matter
        .mockResolvedValue({ data: { token } });

      const sessionStore = useSessionStore();

      await sessionStore.logIn(logInPayload);

      expect(apiLogInSpy).toHaveBeenCalledOnce();
      expect(apiLogInSpy).toHaveBeenCalledWith(logInPayload);

      expect(jwt.value).toBe(token);
    });

    it('should not authenticate, if request fails', async () => {
      const apiLogInSpy = vi
        .spyOn(sessionApi, 'logIn')
        // @ts-expect-error other fields shouldn't matter
        .mockResolvedValue({ data: null });

      const sessionStore = useSessionStore();

      await sessionStore.logIn(logInPayload);

      expect(apiLogInSpy).toHaveBeenCalledOnce();
      expect(apiLogInSpy).toHaveBeenCalledWith(logInPayload);

      expect(jwt.value).toBe(null);
      expect(sessionStore.isAuth).toBe(false);
    });
  });

  describe('register', () => {
    const registerPayload: RegisterPayload = {
      email: 'some-email',
      firstname: 'some-firstname',
      lastname: 'some-lastname',
      username: 'some-username',
      password: 'some-password',
    };

    it('should log out, if authenticated', async () => {
      const sessionStore = useSessionStore();

      setJwt('some-jwt');
      expect(jwt.value).toBe('some-jwt');
      expect(sessionStore.isAuth).toBe(true);

      await sessionStore.register(registerPayload);

      expect(jwt.value).toBe(null);
      expect(sessionStore.isAuth).toBe(false);
    });

    it('should disable local profile', async () => {
      const sessionStore = useSessionStore();
      const localProfileStore = useLocalProfileStore();

      localProfileStore.enableLocalProfile();
      expect(sessionStore.isAuth).toBe(true);

      await sessionStore.register(registerPayload);

      expect(localProfileStore.isLocalProfileEnabled).toBe(false);
      expect(sessionStore.isAuth).toBe(false);
    });

    it('should fetch and set jwt', async () => {
      const token = 'jwt-from-api';

      const apiLogInSpy = vi
        .spyOn(sessionApi, 'register')
        // @ts-expect-error other fields shouldn't matter
        .mockResolvedValue({ data: { token } });

      const sessionStore = useSessionStore();

      await sessionStore.register(registerPayload);

      expect(apiLogInSpy).toHaveBeenCalledOnce();
      expect(apiLogInSpy).toHaveBeenCalledWith(registerPayload);

      expect(jwt.value).toBe(token);
    });

    it('should not authenticate, if request fails', async () => {
      const apiLogInSpy = vi
        .spyOn(sessionApi, 'register')
        // @ts-expect-error other fields shouldn't matter
        .mockResolvedValue({ data: null });

      const sessionStore = useSessionStore();

      await sessionStore.register(registerPayload);

      expect(apiLogInSpy).toHaveBeenCalledOnce();
      expect(apiLogInSpy).toHaveBeenCalledWith(registerPayload);

      expect(jwt.value).toBe(null);
      expect(sessionStore.isAuth).toBe(false);
    });
  });
});
