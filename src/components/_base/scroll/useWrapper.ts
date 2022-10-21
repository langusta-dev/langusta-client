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

  useMutationObserver(
    $$(wrapperEl),
    () => {
      for (const i of range(wrapperEl.children.length)) {
        useResizeObserver(
          wrapperEl.children[i] as HTMLElement,
          updateWrapperElHeights
        );
      }
    },
    { childList: true }
  );

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
