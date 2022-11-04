import { acceptHMRUpdate, defineStore } from 'pinia';

import { fetchUserRecipeCollections } from '~/api/recipeCollection';

import { useLocalProfileStore } from './localProfile';
import { useSessionStore } from './session';

import type { RecipeCollection } from '~/types/recipeCollection';

export const useRecipeCollectionStore = defineStore('recipe-collection', () => {
  const sessionStore = useSessionStore();
  const localProfileStore = useLocalProfileStore();

  let areCollectionsInSync = $ref(!sessionStore.isAuth);
  whenever(
    () => sessionStore.isAuth,
    () => {
      areCollectionsInSync = false;
    }
  );

  const collections = $(useLocalStorage<RecipeCollection[]>('collections', []));

  const setCollections = (newCollections: RecipeCollection[]) => {
    collections.splice(0, collections.length, ...newCollections);
  };

  const syncCollections = async () => {
    if (sessionStore.isAuth && !localProfileStore.isLocalProfileEnabled) {
      const newCollections = await fetchUserRecipeCollections();

      if (newCollections) {
        setCollections(newCollections);
      }
    }

    areCollectionsInSync = true;
  };

  whenever(() => !areCollectionsInSync, syncCollections, { immediate: true });

  return {
    collections: computed(() => collections),
    areCollectionsInSync: $$(areCollectionsInSync),
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useRecipeCollectionStore, import.meta.hot)
  );
}
