import { useSessionStore } from '~/stores/session';

export const useRedirectOnAuth = () => {
  const router = useRouter();
  const sessionStore = useSessionStore();

  whenever(
    () => sessionStore.isAuth,
    () => {
      router.push('/');
    }
  );
};
