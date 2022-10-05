<script setup lang="ts">
import { isDark } from '~/composables/dark'

const { t } = useI18n()
const route = useRoute()

const title = computed(() =>
  t(isStr(route.meta.title) ? route.meta.title : 'title')
)

// TODO: add route-based title
useHead({
  title,
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
      <component :is="Component" />
    </BaseFadeTransition>
  </RouterView>
</template>
