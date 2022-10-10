import type { Ref } from 'vue'

interface Options {
  scrollEl: Ref<HTMLDivElement>
}

export const useContainer = (options: Options) => {
  const { scrollEl } = $(options)

  const containerEl = $ref<HTMLDivElement>()

  let containerMargin = $ref('0')
  let wrapperPadding = $ref('0')
  let containerWidth = $ref('100%')
  let containerHeight = $ref('100%')

  const inheritParentPadding = () => {
    if (!containerEl?.parentElement) {
      return
    }

    const { paddingTop, paddingRight, paddingBottom, paddingLeft } =
      getComputedStyle(containerEl.parentElement)

    const containerMarginArr = [
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    ].map((value) => `calc(${value} * -1)`)

    const paddingRightWithScrollTrack = `calc(${paddingRight} + ${scrollEl.offsetWidth}px)`
    const wrapperPaddingArr = [
      paddingTop,
      paddingRightWithScrollTrack,
      paddingBottom,
      paddingLeft,
    ]

    containerMargin = containerMarginArr.join(' ')
    wrapperPadding = wrapperPaddingArr.join(' ')

    containerWidth = `calc(100% + ${paddingRight} + ${paddingLeft})`
    containerHeight = `calc(100% + ${paddingTop} + ${paddingBottom})`
  }

  onMounted(async () => {
    useResizeObserver(containerEl, inheritParentPadding)

    await forceNextTick()
    useMutationObserver(scrollEl, inheritParentPadding, {
      attributes: true,
    })
  })

  const containerStyle = $computed(() => ({
    margin: containerMargin,
    height: containerHeight,
    width: containerWidth,
  }))

  const wrapperStyle = $computed(() => ({
    padding: wrapperPadding,
  }))

  return $$({
    containerEl,
    containerStyle,
    wrapperStyle,
  })
}
