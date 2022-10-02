import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Eslint from '@nabla/vite-plugin-eslint'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Pages, { type ImportModeResolver } from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'
import Layouts from 'vite-plugin-vue-layouts'
import generateSitemap from 'vite-ssg-sitemap'

import * as globalHelpers from './src/helpers/_global'

import type { ComponentResolver } from 'unplugin-vue-components/types'

const GlobalHelpersImport = (options: { importPath: string }) => ({
  [options.importPath]: Object.keys(globalHelpers),
})

const BaseComponentsResolver = (options: {
  importDir: string
  prefix?: string
}): ComponentResolver => {
  options.importDir = options.importDir.replace(/\/$/, '')

  const pascalCasePrefix = (options.prefix || '')
    .replace(/\w+/g, (match) => match[0].toUpperCase() + match.slice(1))
    .replace(/-|\s/g, '')

  return (name: string) =>
    name.startsWith(pascalCasePrefix)
      ? `${options.importDir}/${name.slice(pascalCasePrefix.length)}.vue`
      : null
}

const PagesImportModeResolver =
  (): ImportModeResolver =>
  (filepath, { dirs }) => {
    // top level index.vue: `sync`, others: `async`
    for (const { baseRoute, dir } of dirs) {
      if (baseRoute === '' && filepath.startsWith(`/${dir}/index`)) {
        return 'sync'
      }
    }
    return 'async'
  }

const cwd = process.cwd()

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '~/': `${cwd}/src/`,
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },

  plugins: [
    Vue({
      // STARTER_DOCS: https://vuejs.org/guide/extras/reactivity-transform.html
      reactivityTransform: true,
    }),

    // STARTER_DOCS: https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
        GlobalHelpersImport({ importPath: '~/helpers/_global' }),
      ],
      dts: 'src/__vite_auto-imports.d.ts',
    }),

    // STARTER_DOCS: https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: [],
      resolvers: [
        BaseComponentsResolver({
          importDir: '~/components/_base',
          prefix: 'base',
        }),
      ],
      // prevent tests from breaking the declaration file
      dts: mode !== 'test' ? 'src/__vite_components.d.ts' : false,
    }),

    // STARTER_DOCS: https://github.com/hannoeru/vite-plugin-pages
    Pages({
      importMode: mode === 'production' ? PagesImportModeResolver() : 'sync',
    }),

    // STARTER_DOCS: https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({ defaultLayout: '_default' }),

    // STARTER_DOCS: https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: `${cwd}/locales/*.yaml`,
    }),

    // STARTER_DOCS: https://github.com/unocss/unocss
    Unocss(),

    // STARTER_DOCS: https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'ViteStrict',
        short_name: 'ViteStrict',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // STARTER_DOCS: https://github.com/nabla/vite-plugin-eslint
    Eslint({ eslintOptions: { cache: false } }),

    // STARTER_DOCS: https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3333/__inspect to see the inspector
    Inspect(),
  ],

  // STARTER_DOCS: https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    onFinished: generateSitemap,
  },

  // STARTER_DOCS: https://vitest.dev/
  test: {
    clearMocks: true,
    setupFiles: 'tests/setup.ts',
    globals: true,
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    deps: { inline: ['@vue', '@vueuse', 'vue-demi'] },

    // STARTER_DOCS: https://vitest.dev/guide/coverage.html
    coverage: {
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/main.ts', 'src/modules', 'src/types', '**/*.d.ts'],
      all: true,

      // change the values below to something higher for a real project
      // preferred are 80+
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
}))
