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
</script>

<template>
  <div>
    <RecipeList :recipes="recipeStore.ownedRecipes" />
  </div>
</template>
