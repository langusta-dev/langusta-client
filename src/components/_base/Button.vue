<script setup lang="ts">
const { alt, sm } = defineProps<{
  alt?: boolean
  sm?: boolean
}>()
</script>

<template>
  <button
    :class="[
      !alt ? 'bg-accent-interactive' : 'bg-secondary-interactive',
      !sm ? 'p-(x4 y.5)' : 'p-(x3 y.5) text-sm',
    ]"
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
