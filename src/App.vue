<script setup lang="ts">
import { isDark } from '~/composables/dark'

const route = useRoute()

// TODO: add route-based title
useHead({
  title: computed(() => 'LANgusta'),
  meta: [
    // TODO: meta description
    { name: 'description', content: 'LANgusta' },
    {
      name: 'theme-color',
      content: computed(() => (isDark.value ? '#00aba9' : '#ffffff')),
    },
  ],
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <BaseFadeTransition appear>
      <component :is="Component" :key="route.name" />
    </BaseFadeTransition>
  </RouterView>
</template>
