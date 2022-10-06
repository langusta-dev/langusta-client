const jwt = useSessionStorage<string | null>('token', null)

const setJwt = (newJwt: string) => {
  jwt.value = newJwt
}

const unsetJwt = () => {
  jwt.value = null
}

export { jwt, setJwt, unsetJwt }
