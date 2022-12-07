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

import type { LocalOnly } from '~/types/dataSync';
import type { Recipe } from '~/types/recipe';

export const useRecipeStore = defineStore('recipe', () => {
  const localProfileStore = useLocalProfileStore();
  const recipeCollectionStore = useRecipeCollectionStore();

  const recipeInitializer = async (localOnlyRecipes: LocalOnly<Recipe>[]) => {
    const shouldFetchUserRecipes = !localProfileStore.isLocalProfileEnabled;

    const [userRecipes] = await Promise.all([
      shouldFetchUserRecipes ? fetchUserRecipes() : [],
      until(() => recipeCollectionStore.areCollectionsInSync).toBe(true),
    ]);

    let recipesToFetchIds = [
      ...new Set(
        recipeCollectionStore.collections.flatMap(({ recipeIds }) => recipeIds)
      ),
    ];

    if (localOnlyRecipes.length) {
      recipesToFetchIds = recipesToFetchIds.filter(
        (id) => !localOnlyRecipes.some((recipe) => recipe.id === id)
      );
    }

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
    isInSync: areRecipesInSync,
    state: recipes,
    ownedState: ownedRecipes,
    getById: getRecipeById,
    isOwnedById: isRecipeOwnedById,
    push: addRecipe,
    editById: editRecipeById,
    deleteById: deleteRecipeById,
  } = useSynchronizableArray(
    'recipes',
    recipeInitializer,
    uploadRecipes,
    deleteRecipesByIds
  );

  return {
    areRecipesInSync,
    recipes,
    ownedRecipes,
    getRecipeById,
    isRecipeOwnedById,
    addRecipe,
    editRecipeById,
    deleteRecipeById,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipeStore, import.meta.hot));
}
