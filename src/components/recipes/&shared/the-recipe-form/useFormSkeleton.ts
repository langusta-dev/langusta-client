import { useWindowWidthBreakpoints } from '~/composables/window';

export const useFormSkeleton = () => {
  const { isXl: showStandardForm } = $(useWindowWidthBreakpoints());

  const skeletonComponent = computed(() =>
    defineAsyncComponent(
      showStandardForm
        ? () => import('./TheStandardSkeleton.vue')
        : () => import('./TheMobileSkeleton.vue')
    )
  );

  return { skeletonComponent };
};
