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
  <div _relative _w80 _h40 _rounded>
    <label
      class="group"
      _block
      _h-full
      _w-full
      _rounded
      _cursor-pointer
      _relative
    >
      <input
        ref="el"
        type="file"
        accept=".png,.jpg,.jpeg"
        hidden
        @change="handleFileChange()"
      />

      <div
        _cover
        _pointer-events-none
        _bg="primary-contrast/20 group-hover:accent"
        _transition-all
      />
    </label>

    <div _cover _pointer-events-none _flex _items-center _justify-center>
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
