<route lang="yaml">
meta:
  auth: true
  title: recipes.add_recipe
</route>

<script setup lang="ts">
import ThePageHeader from '~/components/&shared/ThePageHeader.vue';
import TheRecipeForm from '~/components/recipes/&shared/TheRecipeForm.vue';

import {
  RecipeIngredientQuantityUnit,
  RecipeMealType,
  RecipePreparationTimeUnit,
} from '~/types/recipe';

import { useRecipeStore } from '~/stores/recipe';

import type { EditableRecipe } from '~/types/recipe';

const { t } = useI18n();
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

const submitRecipe = async () => {
  newRecipe.steps = (newRecipe.steps || []).filter(({ description }) =>
    description.trim()
  );

  if (!newRecipe.steps?.length) {
    delete newRecipe.steps;
  }

  newRecipe.ingredients = newRecipe.ingredients.filter(
    ({ name, quantity }) => name.trim() && quantity > 0
  );

  await recipeStore.addRecipe(newRecipe);

  newRecipe = initialRecipe();

  router.push('/recipes/created-by-me');
};
</script>

<template>
  <div>
    <ThePageHeader>{{ t('recipes.add_recipe') }}</ThePageHeader>
    <TheRecipeForm v-model:recipe="newRecipe" @submit-recipe="submitRecipe()" />
  </div>
</template>
