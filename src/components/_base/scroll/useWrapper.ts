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

    if (wrapperHeightPx !== wrapperEl.offsetHeight) {
      wrapperHeightPx = wrapperEl.offsetHeight;
    }

    if (wrapperScrollHeightPx !== wrapperEl.scrollHeight) {
      wrapperScrollHeightPx = wrapperEl.scrollHeight;
    }
  };

  const { pause } = useIntervalFn(updateWrapperElHeights, 50);
  onBeforeUnmount(pause);

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
