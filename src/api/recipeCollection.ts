import { rest } from '~/composables/api';

import type { RecipeCollection } from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

export const fetchUserRecipeCollections = async () => {
  const { data } = await rest.get<RecipeCollection[]>('/recipes/add');
  return data;
};

export const uploadRecipeCollections = async (
  recipeCollections: RecipeCollection[]
) => {
  const { data } = await rest.post<Uuid[]>('/recipes/add', {
    recipeCollections,
  });

  return data;
};

export const deleteRecipeCollectionsByIds = async (
  recipeCollectionIds: Uuid[]
) => {
  const { data } = await rest.post<Uuid[]>('/recipes/add', {
    recipeCollectionIds,
  });

  return data;
};
