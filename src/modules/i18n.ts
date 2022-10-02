import { createI18n } from 'vue-i18n'

import type { InstallModule } from '~/types/modules'

// STARTER_DOCS:
// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('../../locales/*.yaml', { eager: true })
  ).map(([path, module]) => [path.slice(14, -5), module.default])
)

export const install: InstallModule = ({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
  })

  app.use(i18n)
}
