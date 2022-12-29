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
      'cover': 'absolute inset-0 max-w-full max-h-full rounded-[inherit]',
      'flex-center': 'flex justify-center items-center',
    },
  ],

  rules: [
    [
      /^text-lines-(\d+)$/,
      ([, lineCount]) => ({
        'display': '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': lineCount,
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
        'max-height': `${Number(lineCount) * 1.45}em`,
      }),
    ],
  ],

  theme: {
    borderRadius: {
      DEFAULT: '0.5rem',
    },
  },

  presets: [
    presetWind(),

    presetBetterNestedColors({ colors }),

    presetAttributify({ prefix: '_', prefixedOnly: true }),

    presetIcons({ prefix: 'icon-', scale: 1.2, warn: true }),

    presetTypography(),

    presetWebFonts({ fonts: { sans: 'Inter' } }),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup()],

  include: ['**/*.vue', '**/*.scss', '**/components/**/*.ts'],
});
