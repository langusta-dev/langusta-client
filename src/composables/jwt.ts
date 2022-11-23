import type { JwtToken } from '~/types/jwt';

const _jwt = useSessionStorage<JwtToken | null>('token', null);

const getJwt = () => _jwt.value;

const setJwt = (newJwt: JwtToken) => {
  _jwt.value = newJwt;
};

const unsetJwt = () => {
  _jwt.value = null;
};

export { getJwt, setJwt, unsetJwt };
