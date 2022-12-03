<script setup lang="ts">
import type { LocaleKey } from '~/types/i18n';

const { navItems } = defineProps<{
  navItems: { title: LocaleKey; path: string }[];
}>();

const { t } = useI18n();
</script>

<template>
  <div _flex="~ col" _gap4>
    <div v-for="{ title, path } in navItems" :key="path">
      <div>{{ t(title) }}</div>
    </div>
  </div>
</template>
