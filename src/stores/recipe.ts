import { acceptHMRUpdate, defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

import { isOnline } from '~/composables/online';

import {
  fetchRecipesByIds,
  fetchUserRecipes,
  uploadRecipes,
} from '~/api/recipe';

import { useLocalProfileStore } from './localProfile';
import { useRecipeCollectionStore } from './recipeCollection';
import { useSessionStore } from './session';

import type { Recipe, EditableRecipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

export const useRecipeStore = defineStore('recipe', () => {
  const sessionStore = useSessionStore();
  const localProfileStore = useLocalProfileStore();
  const recipeCollectionStore = useRecipeCollectionStore();

  let areRecipesInSync = $ref(!sessionStore.isAuth);
  whenever(
    () => sessionStore.isAuth,
    () => {
      areRecipesInSync = false;
    }
  );

  const recipes = $(useLocalStorage<Recipe[]>('recipes', []));

  const setRecipes = (newRecipes: Recipe[]) => {
    recipes.splice(
      0,
      recipes.length,
      ...recipes.filter(({ isLocalOnly }) => isLocalOnly), // local recipes should be always preserved
      ...newRecipes
    );
  };

  // TODO the sync mechanism is duplicated in `useRecipeCollectionStore`
  // thus should be extracted as a composable
  // the "let's try again" part should also have some limitation

  const syncRecipes = async () => {
    if (!sessionStore.isAuth) {
      areRecipesInSync = true;
      return;
    }

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
      areRecipesInSync = true;
      return;
    }

    /**
     * one of the requests failed
     * let's try again
     */
    if (!userRecipes || !missingRecipes) {
      await syncRecipes();
      return;
    }

    newRecipes.push(...missingRecipes);

    setRecipes(newRecipes);
    areRecipesInSync = true;
  };

  whenever(() => !areRecipesInSync, syncRecipes, { immediate: true });

  const recipesPerId = $computed(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe]))
  );

  const getRecipeById = (id: Uuid) => recipesPerId.get(id) || null;

  const recipesToUpload = $(useLocalStorage<Recipe[]>('recipes-to-upload', []));

  const addRecipe = (recipe: EditableRecipe) => {
    const now = new Date().toString();

    const newRecipe: Recipe = {
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      ...recipe,
    };

    if (localProfileStore.isLocalProfileEnabled) {
      newRecipe.isLocalOnly = true;
    }

    recipes.push(newRecipe);

    if (!newRecipe.isLocalOnly) {
      recipesToUpload.push(newRecipe);
    }
  };

  watch(
    [$$(recipesToUpload), isOnline],
    async () => {
      if (isOnline.value && recipesToUpload.length) {
        const areRecipesUploaded = await uploadRecipes(recipesToUpload);

        if (areRecipesUploaded) {
          recipesToUpload.splice(0, recipesToUpload.length);
        }
      }
    },
    { immediate: true }
  );

  return { recipes: computed(() => recipes), getRecipeById, addRecipe };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipeStore, import.meta.hot));
}
