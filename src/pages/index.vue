<route lang="yaml">
meta:
  auth: true
  nav: true
  navOrder: 1
  title: index.title
  icon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    {{ t('index.description') }}
  </div>
</template>
