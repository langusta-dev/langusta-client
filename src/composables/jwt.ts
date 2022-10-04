// TODO login hack - remove after api is online
// let jwt = $(useSessionStorage<string | null>('token', null))
let jwt = $(useSessionStorage<string | null>('token', 'abc123'))

const setJwt = (value: string) => {
  jwt = value
}

const unsetJwt = () => {
  jwt = null
}

const jwtRef = $$(jwt)
export { jwtRef as jwt, setJwt, unsetJwt }
