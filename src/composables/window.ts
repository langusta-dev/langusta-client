import type { Ref } from 'vue';

const WINDOW_WIDTH_BREAKPOINTS = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
};

type isBreakpointKey = 'isSm' | 'isMd' | 'isLg' | 'isXl' | 'is2xl';

export const useWindowWidthBreakpoints = (): Record<
  isBreakpointKey,
  Ref<boolean>
> => {
  const { width } = useWindowSize();

  const entries: [isBreakpointKey, Ref<boolean>][] = Object.entries(
    WINDOW_WIDTH_BREAKPOINTS
  ).map(([key, value]) => [
    `is${capitalize(key)}` as isBreakpointKey,
    refDebounced(
      computed(() => width.value >= value),
      100
    ),
  ]);

  return Object.assign(
    {},
    ...entries.map(([key, value]) => ({ [key]: value }))
  );
};
