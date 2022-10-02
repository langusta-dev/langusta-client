import axios from 'axios'

// STARTER_DOCS: https://github.com/axios/axios
// don't forget to remove axios (pnpm rm axios), if you're not going to use it
export const rest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
})
