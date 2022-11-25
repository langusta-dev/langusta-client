<script setup lang="ts">
const { lazy = false } = defineProps<{ lazy?: boolean }>();

const route = useRoute();
</script>

<template>
  <RouterView v-slot="{ Component }">
    <BaseFadeTransition appear>
      <Suspense>
        <component :is="Component" v-if="lazy" _h-full _w-full />
        <component :is="Component" v-else :key="route.name" _h-full _w-full />
      </Suspense>
    </BaseFadeTransition>
  </RouterView>
</template>
