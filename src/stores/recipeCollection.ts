import { acceptHMRUpdate, defineStore } from 'pinia';

import { useSynchronizableArray } from '~/composables/dataSync';

import {
  fetchUserRecipeCollections,
  uploadRecipeCollections,
  deleteRecipeCollectionsByIds,
} from '~/api/recipeCollection';

import { sortByTitle } from '~/helpers/array';

import { useLocalProfileStore } from './localProfile';

export const useRecipeCollectionStore = defineStore('recipeCollection', () => {
  const localProfileStore = useLocalProfileStore();

  const collectionInitializer = () =>
    localProfileStore.isLocalProfileEnabled ? [] : fetchUserRecipeCollections();

  const {
    isInSync: areCollectionsInSync,
    readyPromise: collectionsReadyPromise,
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

  const ownedCollectionsOrderedByTitle = computed(() =>
    sortByTitle(ownedCollections.value)
  );

  return {
    areCollectionsInSync,
    collectionsReadyPromise,
    collectionsSyncPromise,
    collections,
    ownedCollections,
    ownedCollectionsOrderedByTitle,
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
