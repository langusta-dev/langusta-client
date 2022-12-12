<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheRecipeForm from '~/components/recipes/&shared/TheRecipeForm.vue';

import { useRecipeStore } from '~/stores/recipe';

import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const router = useRouter();
const recipeStore = useRecipeStore();

const recipe = $computed(() => recipeStore.getRecipeById(id));

if (!recipe?.isOwned) {
  router.replace({ name: 'all', params: { all: ['recipes', id, 'edit'] } });
}

const editableRecipe = $ref(recipe ? klona(recipe) : null);

const submitRecipe = () => {
  if (!editableRecipe) {
    return;
  }

  recipeStore.editRecipeById(id, editableRecipe);
  router.push('/recipes/created-by-me');
};
</script>

<template>
  <TheRecipeForm
    v-if="editableRecipe"
    v-model:recipe="editableRecipe"
    @submit-recipe="submitRecipe()"
  />
</template>
