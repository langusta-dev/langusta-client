<script setup lang="ts">
const {
  alt,
  sm,
  circle,
  disabled = false,
} = defineProps<{
  alt?: boolean;
  sm?: boolean;
  circle?: boolean;
  disabled?: boolean;
}>();

const classes = $computed(() => {
  const classes: string[] = [];

  classes.push(
    alt
      ? 'bg-accent-alt-interactive text-accent-alt-interactive-contrast border-(1 accent) hover:border-primary'
      : 'bg-accent-interactive text-accent-interactive-contrast'
  );

  if (sm) {
    classes.push('text-sm');
  }

  if (circle) {
    classes.push('h-8 w-8');
  } else {
    classes.push(sm ? 'p-(x4 y1) ' : 'p-(x8 y1)');
  }

  return classes;
});
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled"
    _rounded-full
    _fw600
    _text-center
    _transition-all
    _cursor-pointer
    _select-none
    _disabled:pointer-events-none
    _disabled:op40
    _flex-center
  >
    <slot />
  </button>
</template>
