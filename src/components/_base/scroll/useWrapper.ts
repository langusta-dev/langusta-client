export const useWrapper = () => {
  const wrapperEl = $ref<HTMLDivElement>();

  const {
    y: wrapperScrollTopPx,
    arrivedState: {
      top: wrapperScrollArrivedTop,
      bottom: wrapperScrollArrivedBottom,
    },
  } = $(useScroll($$(wrapperEl)));

  let wrapperHeightPx = $ref(0);
  let wrapperScrollHeightPx = $ref(0);

  const updateWrapperElHeights = () => {
    if (!wrapperEl) {
      return;
    }

    wrapperHeightPx = wrapperEl.offsetHeight;
    wrapperScrollHeightPx = wrapperEl.scrollHeight;
  };

  useResizeObserver($$(wrapperEl), updateWrapperElHeights);

  const observeWrapperChildren = () => {
    for (const child of wrapperEl.children) {
      useResizeObserver(child as HTMLElement, updateWrapperElHeights);
    }
  };

  useMutationObserver($$(wrapperEl), observeWrapperChildren, {
    childList: true,
  });

  onMounted(observeWrapperChildren);

  const isWrapperElReady = $computed(
    () => !!(wrapperHeightPx && wrapperScrollHeightPx)
  );

  return $$({
    wrapperEl,
    wrapperHeightPx,
    wrapperScrollHeightPx,
    wrapperScrollTopPx,
    wrapperScrollArrivedTop,
    wrapperScrollArrivedBottom,
    isWrapperElReady,
  });
};
