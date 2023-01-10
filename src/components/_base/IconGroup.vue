<script setup lang="ts">
const { icons } = defineProps<{ icons: string[] }>();
</script>

<template>
  <div _flex _items-end>
    <div :class="`icon-${icons[0]}`" />
    <div
      v-for="(icon, i) in icons.slice(1)"
      :key="i"
      :class="`icon-${icon}`"
      _text=".75em"
    />
  </div>
</template>
