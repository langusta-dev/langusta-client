<script setup lang="ts">
import { isOverlayVisible } from '~/composables/overlay'
</script>

<template>
  <BaseFadeTransition>
    <div v-if="isOverlayVisible" _cover _bg="#000/20" />
  </BaseFadeTransition>
</template>
