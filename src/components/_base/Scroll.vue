<script setup lang="ts">
import useContainer from './scroll/useContainer'
import useModelValue from './scroll/useModelValue'
import useMouseScroll from './scroll/useMouseScroll'
import useTrackScroll from './scroll/useTrackScroll'
import useWrapper from './scroll/useWrapper'

const { modelValue } = defineProps<{ modelValue?: number }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const scrollEl = $ref<HTMLDivElement>()

const { containerEl, containerStyle, wrapperStyle } = useContainer(
  $$({ scrollEl })
)

const {
  wrapperEl,
  wrapperHeightPx,
  wrapperScrollHeightPx,
  wrapperScrollTopPx,
  wrapperScrollArrivedTop,
  wrapperScrollArrivedBottom,
  isWrapperElReady,
} = $(useWrapper())

const { startMouseScroll, isMouseScrollActive } = useMouseScroll(
  $$({
    wrapperEl,
    wrapperHeightPx,
    wrapperScrollTopPx,
    isWrapperElReady,
  })
)

useModelValue($$({ modelValue, wrapperScrollTopPx, wrapperEl }), emit)

const scrollHandleHeightPercent = $computed(() =>
  isWrapperElReady
    ? Math.min(100, (wrapperHeightPx / wrapperScrollHeightPx) * 100)
    : 100
)

const wrapperScrollTopPercent = $computed(() =>
  isWrapperElReady
    ? Math.min(
        100 - scrollHandleHeightPercent,
        (wrapperScrollTopPx / wrapperScrollHeightPx) * 100
      )
    : 0
)

const { startTrackScroll, isTrackScrollActive } = useTrackScroll(
  $$({
    wrapperEl,
    wrapperHeightPx,
    isWrapperElReady,
    scrollHandleHeightPercent,
    wrapperScrollTopPercent,
    wrapperScrollArrivedTop,
    wrapperScrollArrivedBottom,
  })
)

const showScroll = $computed(() => scrollHandleHeightPercent !== 100)

const scrollHandleHeight = $computed(() => `${scrollHandleHeightPercent}%`)
const scrollHandleTop = $computed(() => `${wrapperScrollTopPercent}%`)
const scrollHandleStyle = $computed(() => ({
  height: scrollHandleHeight,
  top: scrollHandleTop,
}))
</script>

<template>
  <div ref="containerEl" class="scroll__container" :style="containerStyle">
    <div
      ref="wrapperEl"
      class="scroll__content-wrapper"
      :style="wrapperStyle"
      _transition="padding"
    >
      <slot />
    </div>

    <BaseFadeTransition>
      <div
        v-show="showScroll"
        ref="scrollEl"
        _absolute
        _select-none
        _h-full
        _inset-y-0
        _right-0
        _w2
        _rounded-full
      >
        <div
          _w-full
          _h-full
          _relative
          _rounded-full
          _transition-colors
          :_bg="isTrackScrollActive ? 'accent-focus/75' : 'primary-contrast/25'"
          @mousedown.stop="(e) => startTrackScroll(e)"
        >
          <div
            :style="scrollHandleStyle"
            _absolute
            _inset-x-0
            _rounded-full
            _transition="background-color,height"
            :_bg="
              isMouseScrollActive
                ? 'accent-focus'
                : 'primary-contrast hover:accent'
            "
            :_pointer-events="isTrackScrollActive ? 'none' : 'auto'"
            @mousedown.stop="(e) => startMouseScroll(e)"
          />
        </div>
      </div>
    </BaseFadeTransition>
  </div>
</template>

<style lang="scss" scoped>
@mixin parent-content-properties {
  display: inherit;
  flex-flow: inherit;
  grid: inherit;
  justify-content: inherit;
  justify-items: inherit;
  align-content: inherit;
  align-items: inherit;
  gap: inherit;
  border-radius: inherit;
}

.scroll__container {
  @include parent-content-properties;
  @apply relative;

  .scroll__content-wrapper {
    @include parent-content-properties;
    @apply cover overflow-x-hidden overflow-y-scroll;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
</style>
