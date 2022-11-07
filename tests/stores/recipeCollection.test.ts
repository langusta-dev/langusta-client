import { flushPromises } from '@vue/test-utils';

import { useRecipeCollectionStore } from '~/stores/recipeCollection';
import { useSessionStore } from '~/stores/session';

import * as recipeCollectionApi from '~/api/recipeCollection';

import type { RecipeCollection } from '~/types/recipeCollection';

describe('recipe collections store', () => {
  describe('data synchronization', () => {
    const testCollection1: RecipeCollection = {
      id: 'test-id-1',
      createdAt: 'test-created-at-1',
      updatedAt: 'test-updated-at-1',
      name: 'test-name-1',
      recipeIds: [],
    };

    const testCollection2: RecipeCollection = {
      id: 'test-id-2',
      createdAt: 'test-created-at-2',
      updatedAt: 'test-updated-at-2',
      name: 'test-name-2',
      recipeIds: ['abc'],
    };

    it(`Given unauthenticated user,
        Then should not sync collections,
        When user becomes authenticated,
        Then should sync collections`, async () => {
      const fetchUserRecipeCollectionsSpy = vi
        .spyOn(recipeCollectionApi, 'fetchUserRecipeCollections')
        .mockResolvedValue([testCollection1]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = false;

      const recipeCollectionStore = useRecipeCollectionStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipeCollectionsSpy).not.toHaveBeenCalled();
      expect(recipeCollectionStore.collections).toStrictEqual([]);

      // When
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;
      await flushPromises();

      // Then
      expect(fetchUserRecipeCollectionsSpy).toHaveBeenCalledOnce();
      expect(recipeCollectionStore.collections).toStrictEqual([
        testCollection1,
      ]);
    });

    it(`Given authenticated user,
        Then should sync collections,
        When user becomes unauthenticated,
        Then should keep previous collections
        When user becomes authenticated,
        Then should sync collections`, async () => {
      const fetchUserRecipeCollectionsSpy = vi
        .spyOn(recipeCollectionApi, 'fetchUserRecipeCollections')
        .mockResolvedValueOnce([testCollection1]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      const recipeCollectionStore = useRecipeCollectionStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipeCollectionsSpy).toHaveBeenCalledOnce();
      expect(recipeCollectionStore.collections).toStrictEqual([
        testCollection1,
      ]);

      fetchUserRecipeCollectionsSpy.mockResolvedValueOnce([testCollection2]);

      // When
      // @ts-expect-error it's readonly
      sessionStore.isAuth = false;
      await flushPromises();

      // Then
      expect(fetchUserRecipeCollectionsSpy).toHaveBeenCalledOnce();
      expect(recipeCollectionStore.collections).toStrictEqual([
        testCollection1,
      ]);

      // When
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;
      await flushPromises();

      // Then
      expect(fetchUserRecipeCollectionsSpy).toHaveBeenCalledTimes(2);
      expect(recipeCollectionStore.collections).toStrictEqual([
        testCollection2,
      ]);
    });
  });
});
