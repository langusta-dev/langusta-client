<script setup lang="ts">
type InputType = 'number' | 'text' | 'password'

type InputEvent = Event & { target: { value: string } }

interface Props {
  modelValue: string
  type?: InputType
  placeholder?: string
  error?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const {
  type = 'text',
  placeholder = '',
  modelValue = '',
  error = false,
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
    :type="type"
    :class="error ? 'border-error' : 'border-primary-contrast/30'"
    autocomplete="false"
    _p="x4 y1"
    _w72
    _text-center
    _bg-primary
    _rounded
    _placeholder="text-sm italic text-primary-contrast/75"
    _border-1px
    _outline="~ 2px offset-0 transparent hover:accent !focus:accent-focus"
    _transition-all
    @input="(e) => handleInput(e)"
  />
</template>
