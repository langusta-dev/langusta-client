import type { Ref } from 'vue';

const STATIC_CLASSES = [
  'p-(x2 y1.5)',
  'w80 max-w-full',
  'rounded',
  'placeholder:(text-sm text-primary-contrast/70 fw500)',
  'border-1',
  'outline-(~ 2 offset--1 transparent) hover:outline-accent !focus:outline-accent-focus',
  'transition-(~ property-[background,border,outline])',
];

export const useInputClasses = (hasError: Ref<boolean>) => {
  const classes = computed(() => [
    ...STATIC_CLASSES,
    hasError.value
      ? 'border-error bg-error/8'
      : 'border-primary-contrast/30 bg-primary-contrast/2',
  ]);

  return { classes };
};
