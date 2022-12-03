<script setup lang="ts">
import Confirms from '~/components/&app/Confirms.vue';
import Overlay from '~/components/&app/Overlay.vue';

import { isDark } from '~/composables/dark';

const { t } = useI18n();
const route = useRoute();

const title = computed(() =>
  isStr(route.meta.title)
    ? `${t('title')} • ${t(route.meta.title)}`
    : t('title')
);

useHead({
  title,
  meta: [
    { name: 'description', content: t('description') },
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
