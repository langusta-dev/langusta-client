import { rest } from '~/composables/api';

import type { RecipeCollection } from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

export const fetchUserRecipeCollections = async () => {
  const { data } = await rest.get<RecipeCollection[]>(
    '/recipes/collections/user'
  );

  return data;
};

export const fetchRecipeCollectionsByIds = async (
  recipeCollectionIds: Uuid[]
) => {
  const { data } = await rest.post<RecipeCollection[]>(
    '/recipes/collections/get',
    { recipeCollectionIds }
  );

  return data;
};

export const uploadRecipeCollections = async (
  recipeCollections: RecipeCollection[]
) => {
  const { data } = await rest.put<Uuid[]>('/recipes/collections/update', {
    recipeCollections,
  });

  return data;
};

export const deleteRecipeCollectionsByIds = async (
  recipeCollectionIds: Uuid[]
) => {
  const { data } = await rest.delete<Uuid[]>('/recipes/collections/delete', {
    recipeCollectionIds,
  });

  return data;
};
