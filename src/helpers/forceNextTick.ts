const doubleRequestAnimationFrame = (callback: () => void) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}

export const forceNextTick = () =>
  new Promise<void>(doubleRequestAnimationFrame)
