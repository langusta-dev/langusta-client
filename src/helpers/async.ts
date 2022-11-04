const _doubleRequestAnimationFrame = (callback: () => void) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
};

export const forceNextTick = () =>
  new Promise<void>(_doubleRequestAnimationFrame);

export const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
