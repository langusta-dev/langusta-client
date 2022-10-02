<script setup lang="ts">
type InputType = 'number' | 'text'

type InputEvent = Event & { target: { value: string } }

interface Props {
  modelValue: string
  type?: InputType
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const {
  type = 'text',
  placeholder = '',
  modelValue = '',
} = defineProps<Props>()

const emit = defineEmits<Emits>()

const handleInput = (e: Event) => {
  emit('update:modelValue', (e as InputEvent).target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    :placeholder="placeholder"
    :aria-label="placeholder"
    :type="type"
    autocomplete="false"
    _p="x4 y1"
    _w-72
    _text-center
    _bg-primary
    _rounded
    _placeholder="text-sm italic text-secondary/75"
    _border="1px secondary/30"
    _outline="~ 2px offset-0 transparent hover:accent !focus:accent-focus"
    _duration-150
    @input="(e) => handleInput(e)"
  />
</template>
