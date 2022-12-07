import { rest } from '~/composables/api';

import type { Recipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

export const fetchUserRecipes = async () => {
  const { data } = await rest.get<Recipe[]>('/recipes/user');
  return data;
};

export const fetchRecipesByIds = async (recipeIds: Uuid[]) => {
  const { data } = await rest.post<Recipe[]>('/recipes/get', { recipeIds });
  return data;
};

export const uploadRecipes = async (recipes: Recipe[]) => {
  const { data } = await rest.put<Uuid[]>('/recipes/update', { recipes });
  return data;
};

export const deleteRecipesByIds = async (recipeIds: Uuid[]) => {
  const { data } = await rest.delete<Uuid[]>('/recipes/delete', { recipeIds });
  return data;
};
