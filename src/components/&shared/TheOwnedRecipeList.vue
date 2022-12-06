<script setup lang="ts">
import TheRecipeList from '~/components/&shared/TheRecipeList.vue';

import { useRecipeStore } from '~/stores/recipe';

const recipeStore = useRecipeStore();

const recipesSorted = $computed(() =>
  recipeStore.ownedRecipes.sort((a, b) => (a.title > b.title ? 1 : -1))
);
</script>

<template>
  <TheRecipeList :recipes="recipesSorted" editable />
</template>
