import { rest } from '~/composables/api';

import type {
  PublishedRecipeCollection,
  RecipeCollection,
  RecipeCollectionQuery,
} from '~/types/recipeCollection';
import type { Uuid } from '~/types/uuid';

export const fetchUserRecipeCollections = async () => {
  const { data } = await rest.get<RecipeCollection[]>('/collections/get/user');

  return data;
};

export const fetchRecipeCollectionsByIds = async (
  recipeCollectionIds: Uuid[]
) => {
  const { data } = await rest.post<RecipeCollection[]>(
    '/collections/get/by-id',
    recipeCollectionIds
  );

  return data;
};

export const uploadRecipeCollections = async (
  recipeCollections: RecipeCollection[]
) => {
  const { data } = await rest.put<Uuid[]>(
    '/collections/save',
    recipeCollections
  );

  return data;
};

export const deleteRecipeCollectionsByIds = async (
  recipeCollectionIds: Uuid[]
) => {
  const { data } = await rest.delete<Uuid[]>(
    '/collections/delete',
    recipeCollectionIds
  );

  return data;
};

export const fetchPublicRecipeCollections = async (
  query: RecipeCollectionQuery
) => {
  const { data } = await rest.silent.post<PublishedRecipeCollection[]>(
    '/collections/get/public',
    query
  );

  return data;
};
