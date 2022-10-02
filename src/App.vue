<script setup lang="ts">
import TheCookieBanner from '~/components/&app/TheCookieBanner.vue'

import { isDark } from '~/composables/dark'

const route = useRoute()

// STARTER_DOCS: https://vuejs.org/guide/extras/reactivity-transform.html
const routeTitle = $computed(() =>
  isStr(route.meta.title) || isNum(route.meta.title) ? route.meta.title : null
)

// STARTER_DOCS: https://github.com/vueuse/head
useHead({
  title: computed(() =>
    routeTitle ? `ViteStrict - ${routeTitle}` : 'ViteStrict'
  ),
  meta: [
    { name: 'description', content: 'Strict Vitesse-based Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => (isDark.value ? '#00aba9' : '#ffffff')),
    },
  ],
})
</script>

<template>
  <!-- STARTER_DOCS: https://router.vuejs.org/guide/advanced/transitions.html -->
  <RouterView v-slot="{ Component }">
    <BaseFadeTransition appear>
      <component :is="Component" :key="route.name" />
    </BaseFadeTransition>
  </RouterView>
  <TheCookieBanner />
</template>
