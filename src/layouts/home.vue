<script setup lang="ts">
import TheFooter from '~/components/&layouts/&shared/TheFooter.vue'
import TheVueTagInfo from '~/components/&layouts/home/TheVueTagInfo.vue'
</script>

<template>
  <main _p="x6 y10">
    <RouterView _text-center />
    <TheFooter />
    <TheVueTagInfo />
    <div _op50 _text-sm _text-center>[Home Layout]</div>
  </main>
</template>
