<script setup lang="ts">
const { lazy = false } = defineProps<{ lazy?: boolean }>();

const route = useRoute();
</script>

<template>
  <RouterView v-slot="{ Component }">
    <BaseFadeTransition appear>
      <component :is="Component" v-if="lazy" />
      <component :is="Component" v-else :key="route.name" />
    </BaseFadeTransition>
  </RouterView>
</template>
