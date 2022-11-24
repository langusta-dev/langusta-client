import type { Ref } from 'vue';

const STATIC_CLASSES = [
  'p-(x2 y1)',
  'w72 max-w-full',
  'bg-primary',
  'rounded',
  'placeholder:(text-sm italic text-primary-contrast/75)',
  'border-1px',
  'outline-(~ 2px offset-0 transparent) hover:outline-accent !focus:outline-accent-focus',
  'transition-(colors property-[outline])',
];

export const useInputClasses = (hasError: Ref<boolean>) => {
  const classes = computed(() => [
    ...STATIC_CLASSES,
    hasError.value ? 'border-error' : 'border-primary-contrast/30',
  ]);

  return { classes };
};
