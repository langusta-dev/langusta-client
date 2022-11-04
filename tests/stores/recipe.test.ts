import { flushPromises } from '@vue/test-utils';

import { useRecipeStore } from '~/stores/recipe';
import { useSessionStore } from '~/stores/session';

import * as recipeApi from '~/api/recipe';
import * as recipeCollectionApi from '~/api/recipeCollection';

import type { Recipe } from '~/types/recipe';

describe('recipes store', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('data synchronization', () => {
    // @ts-expect-error the data is incomplete
    const testRecipe1: Recipe = { id: 'test-id-1' };

    // @ts-expect-error the data is incomplete
    const testRecipe2: Recipe = { id: 'test-id-2' };

    beforeEach(() => {
      vi.spyOn(
        recipeCollectionApi,
        'fetchUserRecipeCollections'
      ).mockResolvedValue([{ id: '', name: '', recipeIds: [testRecipe1.id] }]);
    });

    it(`Given unauthenticated user,
        Then should not sync recipes,
        When user becomes authenticated,
        Then should sync recipes`, async () => {
      vi.spyOn(recipeApi, 'fetchRecipesByIds').mockResolvedValue([]);
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue([testRecipe1]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = false;

      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).not.toHaveBeenCalled();
      expect(recipeStore.recipes).toStrictEqual([]);

      // When
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledOnce();
      expect(recipeStore.recipes).toStrictEqual([testRecipe1]);
    });

    it(`Given authenticated user,
        Then should sync recipes,
        When user becomes unauthenticated,
        Then should keep previous recipes
        When user becomes authenticated,
        Then should sync recipes`, async () => {
      vi.spyOn(recipeApi, 'fetchRecipesByIds').mockResolvedValue([]);
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue([testRecipe1]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledOnce();
      expect(recipeStore.recipes).toStrictEqual([testRecipe1]);

      fetchUserRecipesSpy.mockResolvedValueOnce([testRecipe2]);

      // When
      // @ts-expect-error it's readonly
      sessionStore.isAuth = false;
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledOnce();
      expect(recipeStore.recipes).toStrictEqual([testRecipe1]);

      // When
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledTimes(2);
      expect(recipeStore.recipes).toStrictEqual([testRecipe2]);
    });
  });
});
