<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; label: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const { modelValue } = $(useVModels(props, emit));
</script>

<template>
  <div _flex _items-center _gap2>
    <div _w4 _h4 _flex _relative _rounded _overflow-hidden>
      <input
        v-model="modelValue"
        type="checkbox"
        _w-full
        _h-full
        _op0
        _cursor-pointer
      />

      <div _absolute _inset-0 _pointer-events-none _bg="primary-contrast/30">
        <BaseFadeTransition>
          <div v-if="modelValue" _bg-accent _absolute _inset-0>
            <div _absolute _inset="0.45" _flex _justify-center _items-center>
              <div _icon-icomoon-free-cross _text-accent-contrast />
            </div>
          </div>
        </BaseFadeTransition>
      </div>
    </div>

    <div>
      {{ label }}
    </div>
  </div>
</template>
