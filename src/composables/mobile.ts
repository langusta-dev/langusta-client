const _windowSize = useWindowSize()
const _windowWidth = $(refDebounced(_windowSize.width))

const isMobile = computed(() => _windowWidth < 800)

export { isMobile }
