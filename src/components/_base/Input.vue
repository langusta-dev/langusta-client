<script setup lang="ts">
import { useInputClasses } from './input/useInputClasses';
import { useTextarea } from './input/useTextarea';

type InputType = 'number' | 'text' | 'password' | 'textarea';

interface Props {
  modelValue: string;
  type?: InputType;
  placeholder?: string;
  error?: boolean;
  autofocus?: boolean;
  numeric?: boolean;
}

interface Emits {
  (e: 'update:modelValue', v: string): void;
}

const {
  type = 'text',
  placeholder = '',
  modelValue = '',
  error = false,
  autofocus = false,
  numeric = false,
} = defineProps<Props>();

const emit = defineEmits<Emits>();

const el = $ref<HTMLInputElement>();

const value = computed({
  get: () => modelValue,
  set: (v) => {
    if (el && numeric && !/^\d*$/.test(v)) {
      el.value = modelValue;
      return;
    }

    emit('update:modelValue', v);
  },
});

const { classes } = useInputClasses($$(error));

if (type === 'textarea') {
  useTextarea($$(el));
}

onMounted(() => {
  if (autofocus) {
    el?.focus();
  }
});
</script>

<template>
  <input
    v-if="type !== 'textarea'"
    ref="el"
    v-model="value"
    :placeholder="placeholder"
    :type="type"
    :class="classes"
    autocomplete="false"
    _text-center
  />
  <textarea
    v-else
    ref="el"
    v-model="value"
    :placeholder="placeholder"
    :class="classes"
    _min-h-15
    _resize-none
    _overflow-hidden
  />
</template>
