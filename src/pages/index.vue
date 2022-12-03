<route lang="yaml">
meta:
  title: index.title
  auth: true
  nav: true
  navOrder: 1
  navIcon: fa:home
</route>

<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>{{ t('index.title') }}</div>
</template>
