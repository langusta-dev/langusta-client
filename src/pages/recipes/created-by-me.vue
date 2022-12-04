<route lang="yaml">
meta:
  title: recipes_created_by_me.title
  auth: true
  nav: true
  navOrder: 3
  navIcon: emojione-monotone:pot-of-food
</route>

<script setup lang="ts">
import RecipeList from '~/components/_shared/RecipeList.vue';

import { useRecipeStore } from '~/stores/recipe';

const recipeStore = useRecipeStore();

const recipesSorted = $computed(() =>
  recipeStore.ownedRecipes.sort((a, b) => (a.title > b.title ? 1 : -1))
);
</script>

<template>
  <div _h-full>
    <RecipeList :recipes="recipesSorted" />
  </div>
</template>
