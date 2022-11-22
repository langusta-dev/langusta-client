import { acceptHMRUpdate, defineStore } from 'pinia';

import { useSynchronizableArray } from '~/composables/dataSync';

import {
  fetchUserRecipeCollections,
  uploadRecipeCollections,
  deleteRecipeCollectionsByIds,
} from '~/api/recipeCollection';

import { useLocalProfileStore } from './localProfile';

export const useRecipeCollectionStore = defineStore('recipeCollection', () => {
  const localProfileStore = useLocalProfileStore();

  const collectionInitializer = () => {
    if (localProfileStore.isLocalProfileEnabled) {
      return [];
    }

    return fetchUserRecipeCollections();
  };

  const {
    isInSync: areCollectionsInSync,
    state: collections,
    getById: getCollectionById,
    push: addCollection,
  } = useSynchronizableArray(
    'recipe-collections',
    collectionInitializer,
    uploadRecipeCollections,
    deleteRecipeCollectionsByIds
  );

  return {
    areCollectionsInSync,
    collections,
    getCollectionById,
    addCollection,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useRecipeCollectionStore, import.meta.hot)
  );
}
