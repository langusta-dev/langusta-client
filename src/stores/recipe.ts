import { acceptHMRUpdate, defineStore } from 'pinia';

import { useSynchronizableArray } from '~/composables/dataSync';

import {
  deleteRecipesByIds,
  fetchRecipesByIds,
  fetchUserRecipes,
  uploadRecipes,
} from '~/api/recipe';

import { useLocalProfileStore } from './localProfile';
import { useRecipeCollectionStore } from './recipeCollection';

import type { Recipe } from '~/types/recipe';

export const useRecipeStore = defineStore('recipe', () => {
  const localProfileStore = useLocalProfileStore();
  const recipeCollectionStore = useRecipeCollectionStore();

  const recipeInitializer = async (): Promise<Recipe[] | null> => {
    const shouldFetchUserRecipes = !localProfileStore.isLocalProfileEnabled;

    const [userRecipes] = await Promise.all([
      shouldFetchUserRecipes ? fetchUserRecipes() : [],
      until(() => recipeCollectionStore.areCollectionsInSync).toBe(true),
    ]);

    let recipesToFetchIds = recipeCollectionStore.collections.flatMap(
      ({ recipeIds }) => recipeIds
    );

    const newRecipes = [];

    if (userRecipes?.length) {
      newRecipes.push(...userRecipes);

      recipesToFetchIds = recipesToFetchIds.filter(
        (id) => !userRecipes.some((recipe) => recipe.id === id)
      );
    }

    const shouldFetchMissingRecipes = !!recipesToFetchIds.length;

    const missingRecipes = shouldFetchMissingRecipes
      ? await fetchRecipesByIds(recipesToFetchIds)
      : [];

    /**
     * at least one of the requests has failed
     */
    if (!userRecipes || !missingRecipes) {
      return null;
    }

    newRecipes.push(...missingRecipes);

    return newRecipes;
  };

  const {
    state: recipes,
    getById: getRecipeById,
    push: addRecipe,
  } = useSynchronizableArray(
    'recipes',
    recipeInitializer,
    uploadRecipes,
    deleteRecipesByIds
  );

  return { recipes, getRecipeById, addRecipe };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipeStore, import.meta.hot));
}
