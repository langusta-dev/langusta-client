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

import type { Recipe, EditableRecipe, RecipeId } from '~/types/recipe';

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
    recipes.splice(0, recipes.length, ...newRecipes);
  };

  // TODO the sync mechanism is duplicated in `useRecipeCollectionStore`
  // thus should be extracted as a composable
  // the "let's try again" part should also have some limitation

  const syncRecipes = async () => {
    if (!sessionStore.isAuth) {
      areRecipesInSync = true;
      return;
    }

    const [fetchedUserRecipes] = await Promise.all([
      !localProfileStore.isLocalProfileEnabled ? fetchUserRecipes() : [],
      until(() => recipeCollectionStore.areCollectionsInSync).toBe(true),
    ]);

    let recipesToFetchIds = recipeCollectionStore.collections.flatMap(
      ({ recipeIds }) => recipeIds
    );

    const newRecipes = [];

    if (fetchedUserRecipes?.length) {
      newRecipes.push(...fetchedUserRecipes);

      recipesToFetchIds = recipesToFetchIds.filter(
        (id) => !fetchedUserRecipes.some((recipe) => recipe.id === id)
      );
    }

    const shouldFetchMissingRecipes = !!recipesToFetchIds.length;

    const missingRecipes = shouldFetchMissingRecipes
      ? await fetchRecipesByIds(recipesToFetchIds)
      : [];

    /**
     * all fired requests failed, so the server is probably unavailable
     * let's use local recipes then
     */
    if (
      !fetchedUserRecipes &&
      ((shouldFetchMissingRecipes && !missingRecipes) ||
        !shouldFetchMissingRecipes)
    ) {
      areRecipesInSync = true;
      return;
    }

    /**
     * one of the requests failed
     * let's try again
     */
    if (!fetchedUserRecipes || !missingRecipes) {
      syncRecipes();
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

  const getRecipeById = (id: RecipeId) => recipesPerId.get(id) || null;

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

  return { recipes: computed(() => recipes), getRecipeById, addRecipe };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipeStore, import.meta.hot));
}
