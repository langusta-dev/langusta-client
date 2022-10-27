import { acceptHMRUpdate, defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

import { isOnline } from '~/composables/online';

import { fetchRecipes, uploadRecipes } from '~/api/recipe';

import { useLocalProfileStore } from './localProfile';

import type { Recipe, RecipeId, EditableRecipe } from '~/types/recipe';

export const useRecipeStore = defineStore('recipes', () => {
  const localProfileStore = useLocalProfileStore();

  const { state: fetchedRecipes } = $(
    useAsyncState<Recipe[]>(fetchRecipes, [])
  );

  const localRecipes = $(useLocalStorage<Recipe[]>('recipes', []));

  const recipes = $computed(() => [...localRecipes, ...fetchedRecipes]);

  const recipesPerId = $computed(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe]))
  );

  const getRecipeById = (id: RecipeId) => recipesPerId.get(id) || null;

  const recipesToUpload = $(useLocalStorage<Recipe[]>('recipes-to-upload', []));

  const addRecipe = (recipe: EditableRecipe) => {
    const now = new Date().toString();

    const newRecipe = { id: uuid(), createdAt: now, updatedAt: now, ...recipe };

    localRecipes.push(newRecipe);

    if (!localProfileStore.isLocalProfileEnabled) {
      recipesToUpload.push(newRecipe);
    }
  };

  watch([$$(recipesToUpload), isOnline], async () => {
    if (isOnline.value && recipesToUpload.length) {
      await uploadRecipes(recipesToUpload);
      recipesToUpload.splice(0, recipesToUpload.length);
    }
  });

  // TODO
  // clear `localRecipes` and `recipesToUpload` on user change

  return { recipes: computed(() => recipes), getRecipeById, addRecipe };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipeStore, import.meta.hot));
}
