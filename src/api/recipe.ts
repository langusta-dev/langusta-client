import { rest } from '~/composables/api';

import type { Recipe } from '~/types/recipe';
import type { Uuid } from '~/types/uuid';

export const fetchUserRecipes = async () => {
  const { data } = await rest.get<Recipe[]>('/recipes/add');
  return data;
};

export const fetchRecipesByIds = async (recipeIds: Uuid[]) => {
  const { data } = await rest.post<Recipe[]>('/recipes/add', { recipeIds });
  return data;
};

export const uploadRecipes = async (recipes: Recipe[]) => {
  const { data } = await rest.post<Uuid[]>('/recipes/add', { recipes });
  return data;
};

export const deleteRecipesByIds = async (recipeIds: Uuid[]) => {
  const { data } = await rest.post<Uuid[]>('/recipes/add', { recipeIds });
  return data;
};
