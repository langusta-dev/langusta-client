import {
  defineConfig,
  presetWind,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { presetBetterNestedColors } from 'unocss-preset-better-nested-colors';

import colors from './unocss.colors';

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

  presets: [
    presetWind(),

    presetBetterNestedColors({ colors }),

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

  include: ['**/*.vue', '**/*.scss', '**/components/**/*.ts'],
});
