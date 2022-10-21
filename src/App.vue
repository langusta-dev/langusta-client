<script setup lang="ts">
import Confirms from '~/components/&app/Confirms.vue';
import Overlay from '~/components/&app/Overlay.vue';

import { isDark } from '~/composables/dark';

const { t } = useI18n();
const route = useRoute();

const title = computed(() =>
  t(isStr(route.meta.title) ? route.meta.title : 'title')
);

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
});
</script>

<template>
  <BaseRouterView lazy />
  <Overlay />
  <Confirms />
</template>
