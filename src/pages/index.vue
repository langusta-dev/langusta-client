<route lang="yaml">
meta:
  title: index.title
  nav: true
  navOrder: 1
  navIcon: fa:home
  layout: blank
</route>

<script setup lang="ts">
import TheNavList from '~/components/&shared/TheNavList.vue';
import TheUnauthorizedView from '~/components/index/TheUnauthorizedView.vue';

import { useSessionStore } from '~/stores/session';

const { t } = useI18n();
const sessionStore = useSessionStore();

const NAV_ITEMS = [
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
  { title: 'meal_plan.title', path: '/meal-plan' },
];
</script>

<template>
  <TheNavList
    v-if="sessionStore.isAuth"
    :header="t('title')"
    :nav-items="NAV_ITEMS"
  />
  <TheUnauthorizedView v-else />
</template>
