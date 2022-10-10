import {
  defineConfig,
  presetWind,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetBetterNestedColors } from 'unocss-preset-better-nested-colors'

export default defineConfig({
  safelist: [
    'icon-fa:home',
    'icon-emojione-monotone:pot-of-food',
    'icon-fa:calendar',
    'icon-fa6-solid:gear',
  ],

  shortcuts: [
    {
      cover: 'absolute inset-0 max-w-full max-h-full rounded-[inherit]',
    },
  ],

  theme: {
    colors: {},
  },

  presets: [
    presetWind(),

    presetBetterNestedColors({
      // todo color theme
      colors: {
        primary: {
          DEFAULT: '#eee',
          ':dark': '#222',

          contrast: {
            DEFAULT: '#222',
            ':dark': '#fafafa',

            interactive: {
              DEFAULT: '~',
              ':hover': 'accent',
              ':dark': '~',
              ':dark:hover': 'accent',
            },
          },
        },

        // secondary: {
        //   DEFAULT: 'rgba(40,40,40,.8)',
        //   ':dark': 'rgba(250,250,250,.9)',

        //   interactive: {
        //     DEFAULT: '~',
        //     ':hover': 'accent',
        //     ':dark': '~',
        //     ':dark:hover': 'accent',
        //   },
        // },

        accent: {
          DEFAULT: '#42b883',

          contrast: {
            DEFAULT: '#fff',
            ':dark': '#333',
          },

          focus: {
            DEFAULT: '#33a06f',
            ':dark': '#42d392',
          },

          interactive: {
            DEFAULT: '~',
            ':hover': {
              DEFAULT: 'accent-focus',
              ':dark': 'accent-focus:dark',
            },
            ':disabled': {
              DEFAULT: '#999',
              ':dark': '#333',
            },

            contrast: {
              DEFAULT: 'accent-contrast',
              ':dark': 'accent-contrast:dark',
              ':disabled': {
                DEFAULT: '#f1f1f1',
                ':dark': '#888',
              },
            },
          },

          alt: {
            DEFAULT: '#999',

            interactive: {
              DEFAULT: '~',
              ':hover': 'accent',
              ':disabled': {
                DEFAULT: '#999',
                ':dark': '#333',
              },
            },
          },
        },

        error: '#d55',
      },
    }),

    presetAttributify({ prefix: '_', prefixedOnly: true }),

    presetIcons({ prefix: 'icon-', scale: 1.2, warn: true }),

    presetTypography(),

    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup()],

  include: ['**/*.vue', '**/*.scss'],
})
