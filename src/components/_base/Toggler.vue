<script setup lang="ts">
const { modelValue } = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>();

const toggle = () => {
  emit('update:modelValue', !modelValue);
};
</script>

<template>
  <div
    :class="{ 'flex-row-reverse': modelValue }"
    _flex
    _items-center
    _h7
    _w12
    _rounded-full
    _cursor-pointer
    _bg-primary
    _border="1 primary-contrast/30"
    _outline="~ 2 offset--1 transparent hover:accent"
    _transition-all
    _p="x.5"
    @click.stop="toggle()"
  >
    <div
      _h5
      _w5
      _rounded-full
      _transition-all
      :_bg="modelValue ? 'accent' : 'primary-contrast/60'"
    />
  </div>
</template>
