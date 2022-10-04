import type { InstallModule } from '~/types/modules'

export const install: InstallModule = async ({ isClient, router }) => {
  if (!isClient) {
    return
  }

  await router.isReady()

  const { registerSW } = await import('virtual:pwa-register')
  registerSW({ immediate: true })
}
