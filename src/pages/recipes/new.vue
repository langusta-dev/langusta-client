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

const initialRecipe = (): EditableRecipe => ({
  title: '',
  description: '',
  mealType: RecipeMealType.LUNCH,
  calorieCount: 0,
  preparationTime: {
    value: 0,
    unit: RecipePreparationTimeUnit.MINUTE,
  },
  steps: [{ description: '' }],
  ingredients: [
    { name: '', quantity: 0, quantityUnit: RecipeIngredientQuantityUnit.G },
  ],
});

let newRecipe = $ref<EditableRecipe>(initialRecipe());

let formKey = $ref(0);

const submitRecipe = () => {
  recipeStore.addRecipe(newRecipe);
  newRecipe = initialRecipe();
  formKey++;
};
</script>

<template>
  <div _flex="~ col" _items-center>
    <BaseScroll>
      <TheRecipeForm
        :key="formKey"
        v-model:recipe="newRecipe"
        @submit-recipe="submitRecipe()"
      />
    </BaseScroll>
  </div>
</template>
