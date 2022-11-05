import type { JwtToken } from '~/types/jwt';

const jwt = useSessionStorage<JwtToken | null>('token', null);

const setJwt = (newJwt: JwtToken) => {
  jwt.value = newJwt;
};

const unsetJwt = () => {
  jwt.value = null;
};

export { jwt, setJwt, unsetJwt };
