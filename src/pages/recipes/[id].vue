<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheRecipeForm from '~/components/recipes/&shared/TheRecipeForm.vue';

import { useRecipeStore } from '~/stores/recipe';

import type { Recipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

const { id } = defineProps<{ id: Uuid }>();

const router = useRouter();
const recipeStore = useRecipeStore();

const recipe = computed(() => recipeStore.getRecipeById(id));

if (!recipe.value) {
  await router.replace({ name: 'all', params: { all: ['recipes', id] } });
}

const editableRecipe = $ref(klona(recipe.value as Recipe));

const submitRecipe = () => {
  recipeStore.editRecipeById(id, editableRecipe);
  router.push('/recipes');
};
</script>

<template>
  <TheRecipeForm
    v-model:recipe="editableRecipe"
    @submit-recipe="submitRecipe()"
  />
</template>
