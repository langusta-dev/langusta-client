<route lang="yaml">
meta:
  title: index.title
  auth: true
  nav: true
  navOrder: 1
  navIcon: fa:home
</route>

<script setup lang="ts">
import TheNavList from '~/components/&shared/TheNavList.vue';

const { t } = useI18n();

const navItems = $computed<{ title: string; path: string }[]>(() => [
  { title: 'browse_recipes.title', path: '/recipes/browse' },
  {
    title: 'browse_recipe_collections.title',
    path: '/recipes/collections/browse',
  },
  { title: 'recipes_created_by_me.title', path: '/recipes/created-by-me' },
  {
    title: 'recipe_collections_created_by_me.title',
    path: '/recipes/collections/created-by-me',
  },
  { title: 'add_recipe.title', path: '/recipes/add' },
  { title: 'add_recipe_collection.title', path: '/recipes/collections/add' },
]);
</script>

<template>
  <TheNavList :header="t('title')" :nav-items="navItems" />
</template>
