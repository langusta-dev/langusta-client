import type { Ref } from 'vue'

interface Options {
  wrapperEl: Ref<HTMLDivElement>
  isWrapperElReady: Ref<boolean>
  wrapperHeightPx: Ref<number>
  scrollHandleHeightPercent: Ref<number>
  wrapperScrollTopPercent: Ref<number>
  wrapperScrollArrivedTop: Ref<boolean>
  wrapperScrollArrivedBottom: Ref<boolean>
}

export const useTrackScroll = (options: Options) => {
  const {
    wrapperEl,
    isWrapperElReady,
    wrapperHeightPx,
    scrollHandleHeightPercent,
    wrapperScrollTopPercent,
    wrapperScrollArrivedTop,
    wrapperScrollArrivedBottom,
  } = $(options)

  const checkIfMouseClickAboveHandle = (clickY: number) =>
    clickY <
    ((scrollHandleHeightPercent / 2 + wrapperScrollTopPercent) / 100) *
      wrapperHeightPx

  let scrollInterval = $ref<NodeJS.Timer | null>(null)

  const isTrackScrollActive = $computed(() => scrollInterval !== null)

  const endTrackScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = null
    }

    window.removeEventListener('mouseup', endTrackScroll)
  }

  const startTrackScroll = ({ offsetY }: MouseEvent) => {
    if (!isWrapperElReady || isTrackScrollActive) {
      return
    }

    const mouseClickAboveHandle = checkIfMouseClickAboveHandle(offsetY)

    scrollInterval = setInterval(() => {
      const nowWouldAboveHandle = checkIfMouseClickAboveHandle(offsetY)

      if (
        mouseClickAboveHandle !== nowWouldAboveHandle ||
        (mouseClickAboveHandle && wrapperScrollArrivedTop) ||
        (!mouseClickAboveHandle && wrapperScrollArrivedBottom)
      ) {
        endTrackScroll()
        return
      }

      const top = (mouseClickAboveHandle ? -5 : 5) + wrapperEl.scrollTop
      wrapperEl.scroll({ top })
    }, 10)

    window.addEventListener('mouseup', endTrackScroll)
  }

  onUnmounted(endTrackScroll)

  return $$({ startTrackScroll, isTrackScrollActive })
}
