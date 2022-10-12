<script setup lang="ts">
const {
  alt,
  sm,
  disabled = false,
} = defineProps<{
  alt?: boolean
  sm?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    :class="[
      !alt ? 'bg-accent-interactive' : 'bg-accent-alt-interactive',
      !sm ? 'p-(x4 y.5)' : 'p-(x3 y.5) text-sm',
    ]"
    :disabled="disabled"
    _rounded
    _inline-block
    _fw600
    _text-accent-interactive-contrast
    _transition-colors
    _cursor-pointer
    _select-none
    _disabled:pointer-events-none
  >
    <slot />
  </button>
</template>
