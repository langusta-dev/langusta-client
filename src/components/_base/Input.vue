<script setup lang="ts">
type InputType = 'number' | 'text' | 'password' | 'textarea'

type InputEvent = Event & { target: { value: string } }

interface Props {
  modelValue: string
  type?: InputType
  placeholder?: string
  error?: boolean
  autofocus?: boolean // TODO basic HTML solution is broken
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const {
  type = 'text',
  placeholder = '',
  modelValue = '',
  error = false,
  autofocus = false,
} = defineProps<Props>()

const emit = defineEmits<Emits>()

const STATIC_CLASSES = [
  'p-(x2 y1)',
  'w72',
  'bg-primary',
  'rounded',
  'placeholder:(text-sm italic text-primary-contrast/75)',
  'border-1px',
  'outline-(~ 2px offset-0 transparent) hover:outline-accent !focus:outline-accent-focus',
  'hover:outline-accent',
  '!focus:outline-accent-focus',
  'transition-all',
]

const classes = computed(() => [
  ...STATIC_CLASSES,
  error ? 'border-error' : 'border-primary-contrast/30',
])

const handleInput = (e: Event) => {
  emit('update:modelValue', (e as InputEvent).target.value)
}
</script>

<template>
  <input
    v-if="type !== 'textarea'"
    :value="modelValue"
    :placeholder="placeholder"
    :type="type"
    :autofocus="autofocus"
    :class="classes"
    autocomplete="false"
    _text-center
    @input="(e) => handleInput(e)"
  />
  <textarea
    v-else
    :value="modelValue"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :class="classes"
    _resize-none
    _overflow-hidden
    @input="(e) => handleInput(e)"
  />
</template>
