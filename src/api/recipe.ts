import { rest } from '~/composables/api';

import type { PublishedRecipe, Recipe, RecipeQuery } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

export const fetchUserRecipes = async () => {
  const { data } = await rest.get<Recipe[]>('/recipes/get/user');
  return data;
};

export const fetchRecipesByIds = async (recipeIds: Uuid[]) => {
  const { data } = await rest.post<Recipe[]>('/recipes/get/by-id', {
    recipeIds,
  });
  return data;
};

export const uploadRecipes = async (recipes: Recipe[]) => {
  const { data } = await rest.silent.put<Uuid[]>('/recipes/save', {
    recipes,
  });

  return data;
};

export const deleteRecipesByIds = async (recipeIds: Uuid[]) => {
  const { data } = await rest.silent.delete<Uuid[]>('/recipes/delete', {
    recipeIds,
  });

  return data;
};

export const fetchPublicRecipes = async (query: RecipeQuery) => {
  const { data } = await rest.silent.post<PublishedRecipe[]>(
    '/recipes/get/public',
    query
  );

  return data;
};
