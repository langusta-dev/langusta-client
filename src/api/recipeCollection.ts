import { rest } from '~/composables/api';

import type { RecipeCollection } from '~/types/recipeCollection';

export const fetchUserRecipeCollections = async () => {
  const { data } = await rest.get<RecipeCollection[]>('/recipes/add');
  return data;
};
