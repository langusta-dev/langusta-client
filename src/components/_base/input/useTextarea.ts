import type { Ref } from 'vue';

export const useTextarea = (el: Ref<HTMLInputElement | undefined>) => {
  const resizeEl = () => {
    if (el.value) {
      el.value.style.height = '0';
      el.value.style.height =
        el.value.scrollHeight * (el.value.value ? 1 : 2) + 'px';
    }
  };

  onMounted(() => {
    resizeEl();
    useEventListener(el, 'input', resizeEl);
  });
};
