import type { Ref } from 'vue';

interface Options {
  wrapperEl: Ref<HTMLDivElement>;
  isWrapperElReady: Ref<boolean>;
  wrapperHeightPx: Ref<number>;
  wrapperScrollTopPx: Ref<number>;
}

export const useMouseScroll = (options: Options) => {
  const { wrapperEl, isWrapperElReady, wrapperHeightPx, wrapperScrollTopPx } =
    $(options);

  let beforeMouseScroll = $ref<{
    clickY: number;
    wrapperScrollTopPx: number;
  } | null>(null);

  const isMouseScrollActive = $computed(() => !!beforeMouseScroll);

  const scrollByMouse = ({ clientY }: MouseEvent) => {
    if (!isWrapperElReady || !beforeMouseScroll) {
      return;
    }

    const scrollMoveTopPx = beforeMouseScroll.clickY - clientY;
    const scrollMoveTopPercent = scrollMoveTopPx / wrapperHeightPx;

    wrapperEl.scroll({
      top:
        beforeMouseScroll.wrapperScrollTopPx -
        scrollMoveTopPercent * wrapperEl.scrollHeight,
    });
  };

  const bodyEl = $ref(document.querySelector('body') as HTMLBodyElement);

  const startMouseScroll = ({ clientY }: MouseEvent) => {
    if (!isWrapperElReady || isMouseScrollActive) {
      return;
    }

    beforeMouseScroll = { clickY: clientY, wrapperScrollTopPx };

    window.addEventListener('mousemove', scrollByMouse);
    window.addEventListener('mouseup', endMouseScroll);
    bodyEl.addEventListener('mouseleave', endMouseScroll);
  };

  const endMouseScroll = () => {
    beforeMouseScroll = null;

    window.removeEventListener('mousemove', scrollByMouse);
    window.removeEventListener('mouseup', endMouseScroll);
    bodyEl.removeEventListener('mouseleave', endMouseScroll);
  };

  onUnmounted(endMouseScroll);

  return $$({ startMouseScroll, isMouseScrollActive });
};
