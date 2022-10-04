// TODO login hack - remove after api is online
// const jwt = useSessionStorage<string | null>('token', null)
const jwt = useSessionStorage<string | null>('token', 'abc123')

const setJwt = (newJwt: string) => {
  jwt.value = newJwt
}

const unsetJwt = () => {
  jwt.value = null
}

export { jwt, setJwt, unsetJwt }
