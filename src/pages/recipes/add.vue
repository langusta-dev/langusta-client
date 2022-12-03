<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheRecipeForm from '~/components/recipes/&shared/TheRecipeForm.vue';

import {
  RecipeIngredientQuantityUnit,
  RecipeMealType,
  RecipePreparationTimeUnit,
} from '~/types/recipe';

import { useRecipeStore } from '~/stores/recipe';

import type { EditableRecipe } from '~/types/recipe';

const recipeStore = useRecipeStore();
const router = useRouter();

const initialRecipe = (): EditableRecipe => ({
  title: '',
  description: '',
  mealType: RecipeMealType.Lunch,
  calorieCount: 0,
  preparationTime: { value: 0, unit: RecipePreparationTimeUnit.Minute },
  steps: [{ description: '' }],
  ingredients: [
    { name: '', quantity: 0, quantityUnit: RecipeIngredientQuantityUnit.G },
  ],
});

let newRecipe = $ref<EditableRecipe>(initialRecipe());

const submitRecipe = () => {
  recipeStore.addRecipe(newRecipe);
  newRecipe = initialRecipe();
  router.push('/recipes/created-by-me');
};
</script>

<template>
  <TheRecipeForm v-model:recipe="newRecipe" @submit-recipe="submitRecipe()" />
</template>
