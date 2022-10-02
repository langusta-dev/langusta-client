import { rest } from '~/helpers/api'

interface Realease {
  tag_name: string
}

export const fetchLatestViteTag = async () => {
  const {
    data: { tag_name: tag },
  } = await rest.get<Realease>('/repos/vitejs/vite/releases/latest')

  return tag
}

export const fetchLatestVueTag = async () => {
  const {
    data: { tag_name: tag },
  } = await rest.get<Realease>('/repos/vuejs/core/releases/latest')

  return tag
}
