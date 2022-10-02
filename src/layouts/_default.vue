<script setup lang="ts">
import TheFooter from '~/components/&layouts/&shared/TheFooter.vue'
</script>

<template>
  <main _p="x4 y10">
    <RouterView />
    <TheFooter />
    <div _op50 _text-sm _text-center>[Default Layout]</div>
  </main>
</template>
