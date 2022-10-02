import type { InstallModule } from '~/types/modules'

// STARTER_DOCS:
// Set dark theme on start up
// https://vueuse.org/
export const install: InstallModule = () => {
  useDark()
}
