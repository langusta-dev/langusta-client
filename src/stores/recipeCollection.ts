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

  const collectionInitializer = () =>
    localProfileStore.isLocalProfileEnabled ? [] : fetchUserRecipeCollections();

  const {
    isInSync: areCollectionsInSync,
    syncPromise: collectionsSyncPromise,
    state: collections,
    ownedState: ownedCollections,
    getById: getCollectionById,
    isOwnedById: isCollectionOwnedById,
    push: addCollection,
    editById: editCollectionById,
    deleteById: deleteCollectionById,
  } = useSynchronizableArray(
    'recipeCollections',
    collectionInitializer,
    uploadRecipeCollections,
    deleteRecipeCollectionsByIds
  );

  return {
    areCollectionsInSync,
    collectionsSyncPromise,
    collections,
    ownedCollections,
    getCollectionById,
    addCollection,
    isCollectionOwnedById,
    editCollectionById,
    deleteCollectionById,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useRecipeCollectionStore, import.meta.hot)
  );
}
