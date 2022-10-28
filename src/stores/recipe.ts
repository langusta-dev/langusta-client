import { acceptHMRUpdate, defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

import { isOnline } from '~/composables/online';

import { uploadRecipes } from '~/api/recipe';

import { useLocalProfileStore } from './localProfile';

import type { Recipe, EditableRecipe, RecipeId } from '~/types/recipe';

export const useRecipeStore = defineStore('recipes', () => {
  const localProfileStore = useLocalProfileStore();

  const recipes = $(useLocalStorage<Recipe[]>('recipes', []));

  const recipesPerId = $computed(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe]))
  );

  const getRecipeById = (id: RecipeId) => recipesPerId.get(id) || null;

  // TODO
  //
  // - fetch the current user's recipes' ids or use locally cached ones
  // - fetch collections from api or use locally cached ones
  // - combine all the recipe ids (user's + from collections) and fetch the recipes from api (if online)
  //
  // - all local recipes should be cleared on user change
  //
  // why not let the server calculate the necessary recipes?
  // - because user may not be logged in or simply synchronized

  const recipesToUpload = $(useLocalStorage<Recipe[]>('recipes-to-upload', []));

  const addRecipe = (recipe: EditableRecipe) => {
    const now = new Date().toString();

    const newRecipe = { id: uuid(), createdAt: now, updatedAt: now, ...recipe };

    recipes.push(newRecipe);

    if (!localProfileStore.isLocalProfileEnabled) {
      recipesToUpload.push(newRecipe);
    }
  };

  watch(
    [$$(recipesToUpload), isOnline],
    async () => {
      if (isOnline.value && recipesToUpload.length) {
        await uploadRecipes(recipesToUpload);
        recipesToUpload.splice(0, recipesToUpload.length);
      }
    },
    { immediate: true }
  );

  return $$({ getRecipeById, addRecipe });
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipeStore, import.meta.hot));
}
