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

  // TODO the sync mechanism in `useRecipeCollectionStore`
  // should use `useSynchronizableArray` as well
  // the "let's try again" part should also have some limitation

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
     * there was something to fetch, but all fired requests failed
     * let's use what we already have then
     */
    if (
      (shouldFetchUserRecipes || shouldFetchMissingRecipes) &&
      (!shouldFetchUserRecipes || !userRecipes) &&
      (!shouldFetchMissingRecipes || !missingRecipes)
    ) {
      return null;
    }

    /**
     * one of the requests has failed
     * let's try again
     */
    if (!userRecipes || !missingRecipes) {
      return recipeInitializer();
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
