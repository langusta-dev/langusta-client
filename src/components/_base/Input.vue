<script setup lang="ts">
import { useInputClasses } from './input/useInputClasses';
import { useTextarea } from './input/useTextarea';

type InputType = 'number' | 'text' | 'password' | 'textarea';

type InputEvent = Event & { target: { value: string } };

interface Props {
  modelValue: string;
  type?: InputType;
  placeholder?: string;
  error?: boolean;
  autofocus?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const {
  type = 'text',
  placeholder = '',
  modelValue = '',
  error = false,
  autofocus = false,
} = defineProps<Props>();

const emit = defineEmits<Emits>();

const el = ref<HTMLElement>();

const { classes } = useInputClasses($$(error));

if (type === 'textarea') {
  useTextarea(el);
}

const handleInput = (e: Event) => {
  emit('update:modelValue', (e as InputEvent).target.value);
};

onMounted(() => {
  if (autofocus) {
    el.value?.focus();
  }
});
</script>

<template>
  <input
    v-if="type !== 'textarea'"
    ref="el"
    :value="modelValue"
    :placeholder="placeholder"
    :type="type"
    :class="classes"
    autocomplete="false"
    _text-center
    @input="(e) => handleInput(e)"
  />
  <textarea
    v-else
    ref="el"
    :value="modelValue"
    :placeholder="placeholder"
    :class="classes"
    _resize-none
    _overflow-hidden
    @input="(e) => handleInput(e)"
  />
</template>
