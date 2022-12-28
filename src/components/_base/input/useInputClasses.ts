import type { Ref } from 'vue';

const STATIC_CLASSES = [
  'p-(x2 y1)',
  'w80 max-w-full',
  'rounded-lg',
  'bg-primary',
  'placeholder:(text-sm italic text-primary-contrast/75)',
  'border-1',
  'outline-(~ 2 offset--1 transparent) hover:outline-accent !focus:outline-accent-focus',
  'transition-(colors property-[outline])',
];

export const useInputClasses = (hasError: Ref<boolean>) => {
  const classes = computed(() => [
    ...STATIC_CLASSES,
    hasError.value ? 'border-error' : 'border-primary-contrast/30',
  ]);

  return { classes };
};
