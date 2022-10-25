import type { Ref } from 'vue';

export const useTextarea = (el: Ref<HTMLInputElement | undefined>) => {
  const resizeEl = () => {
    if (el.value) {
      el.value.style.height = '0';
      el.value.style.height = el.value.scrollHeight + 'px';
    }
  };

  onMounted(() => {
    resizeEl();
    useEventListener(el, 'input', resizeEl);
  });
};
