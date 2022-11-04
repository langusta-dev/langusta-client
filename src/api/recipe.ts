import { rest } from '~/composables/api';

import type { Recipe, RecipeId } from '~/types/recipe';

export const fetchUserRecipes = async () => {
  const { data } = await rest.get<Recipe[]>('/recipes/add');
  return data;
};

export const fetchRecipesByIds = async (ids: RecipeId[]) => {
  const { data } = await rest.post<Recipe[]>('/recipes/add', { ids });
  return data;
};

export const uploadRecipes = async (recipes: Recipe[]) => {
  const response = await rest.post('/recipes/add', recipes);
  return response.status === 200;
};
