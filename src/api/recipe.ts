import { rest } from '~/helpers/api';

import type { Recipe, RecipeId } from '~/types/recipe';

export const fetchRecipesByIds = async (ids: RecipeId[]) => {
  const { data } = await rest.post<Recipe[]>('/recipes/add', { ids });
  return data || [];
};

export const uploadRecipes = (recipes: Recipe[]) =>
  rest.post('/recipes/add', recipes);
