<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    {{ t('index.description') }}
  </div>
</template>
