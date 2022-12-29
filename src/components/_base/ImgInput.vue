<script setup lang="ts">
defineProps<{ modelValue: string | null }>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const el = $ref<HTMLInputElement>();

const handleFileChange = () => {
  if (!el) {
    return;
  }

  const file = el.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    if (!isStr(reader.result)) {
      return;
    }

    emit('update:modelValue', reader.result);
  });

  reader.readAsDataURL(file);
};
</script>

<template>
  <div
    class="group"
    _relative
    _w80
    _h40
    _rounded
    _hover:text-accent-contrast
    _bg="primary-contrast/10 !hover:accent"
    _transition-colors
  >
    <label _block _h-full _w-full _rounded _cursor-pointer _op0>
      <input
        ref="el"
        type="file"
        accept=".png,.jpg,.jpeg"
        hidden
        @change="handleFileChange()"
      />
    </label>

    <div _cover _pointer-events-none _flex-center>
      <div _icon-ic-baseline-photo-camera _text-5xl />
    </div>

    <BaseFadeTransition>
      <div
        v-if="modelValue"
        _cover
        _pointer-events-none
        :style="{ backgroundImage: `url(${modelValue})` }"
        _bg="cover center"
      />
    </BaseFadeTransition>
  </div>
</template>
