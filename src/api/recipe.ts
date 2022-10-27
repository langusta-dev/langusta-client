import { rest } from '~/helpers/api';

import type { Recipe } from '~/types/recipe';

export const fetchRecipes = async () => {
  const { data } = await rest.get<Recipe[]>('/recipes/all');
  return data || [];
};

export const uploadRecipes = (recipes: Recipe[]) =>
  rest.post('/recipes/add', recipes);
