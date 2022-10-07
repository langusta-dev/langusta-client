<script setup lang="ts">
const { clickable = false } = defineProps<{ clickable?: boolean }>()
</script>

<template>
  <div
    class="group"
    :class="{ 'cursor-pointer': clickable }"
    _flex
    _justify-between
    _items-center
    _gap2
    _rounded
    _p="y2 x5"
    _w-full
    _max-w-200
    _relative
    _bg="primary-contrast/15"
  >
    <div _py1>
      <div _text-lg>
        <slot name="title" />
      </div>
      <div _text-sm>
        <slot name="description" />
      </div>
    </div>

    <div>
      <slot />
    </div>

    <div
      _cover
      _pointer-events-none
      _border="2 transparent group-hover:accent"
      _transition-colors
    />
  </div>
</template>
