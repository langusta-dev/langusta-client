<route lang="yaml">
meta:
  title: recipes.title
  auth: true
  nav: true
  navOrder: 2
  navIcon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
import TheNavList from '~/components/_shared/TheNavList.vue';

import { useNav } from '~/components/&layouts/_default/useNav';

const { t } = useI18n();

const { navigableSubRoutes } = $(useNav());

const navItems = $computed<{ title: string; path: string }[]>(() => [
  ...(navigableSubRoutes
    ? navigableSubRoutes.map(({ path, meta: { title } }) => ({ path, title }))
    : []),
  { title: 'add_recipe.title', path: '/recipes/add' },
  { title: 'add_recipe_collection.title', path: '/recipes/collections/add' },
]);
</script>

<template>
  <TheNavList :header="t('recipes.title')" :nav-items="navItems" />
</template>
