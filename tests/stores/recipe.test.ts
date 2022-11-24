import { flushPromises } from '@vue/test-utils';

import {
  RecipeIngredientQuantityUnit,
  RecipeMealType,
  RecipePreparationTimeUnit,
} from '~/types/recipe';
import { expectDateString, expectUuid } from '~test-utils';

import { useLocalProfileStore } from '~/stores/localProfile';
import { useRecipeStore } from '~/stores/recipe';
import { useRecipeCollectionStore } from '~/stores/recipeCollection';
import { useSessionStore } from '~/stores/session';

import * as online from '~/composables/online';

import * as recipeApi from '~/api/recipe';
import * as recipeCollectionApi from '~/api/recipeCollection';

import type { EditableRecipe, Recipe } from '~/types/recipe';
import type { RecipeCollection } from '~/types/recipeCollection';

describe('recipes store', () => {
  describe('data synchronization', () => {
    // @ts-expect-error the data is incomplete
    const testRecipe1: Recipe = { id: 'test-id-1' };

    // @ts-expect-error the data is incomplete
    const testRecipe2: Recipe = { id: 'test-id-2' };

    const testRecipeCollection: RecipeCollection = {
      id: 'test-collection-id',
      createdAt: 'test-created-at',
      updatedAt: 'test-updated-at',
      name: 'test-collection-name',
      recipeIds: [testRecipe1.id],
    };

    beforeEach(() => {
      vi.spyOn(
        recipeCollectionApi,
        'fetchUserRecipeCollections'
      ).mockResolvedValue([testRecipeCollection]);

      vi.spyOn(recipeApi, 'uploadRecipes').mockResolvedValue([]);
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

    it(`Given authenticated user,
        Then should fetch user recipes,
        fetch recipes from collections
        and combine them together`, async () => {
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue([testRecipe2]);

      const fetchRecipesByIdsSpy = vi
        .spyOn(recipeApi, 'fetchRecipesByIds')
        .mockResolvedValue([testRecipe1]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledOnce();
      expect(fetchRecipesByIdsSpy).toHaveBeenCalledOnce();
      expect(fetchRecipesByIdsSpy).toHaveBeenCalledWith([testRecipe1.id]);
      expect(recipeStore.recipes).toStrictEqual([testRecipe2, testRecipe1]);
    });

    it(`Given authenticated user,
        Then should fetch user recipes
        and not fetch recipes from collections,
        if they were already fetched as the user ones`, async () => {
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue([testRecipe1]);

      const fetchRecipesByIdsSpy = vi
        .spyOn(recipeApi, 'fetchRecipesByIds')
        .mockResolvedValue([]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledOnce();
      expect(fetchRecipesByIdsSpy).not.toHaveBeenCalled();
      expect(recipeStore.recipes).toStrictEqual([testRecipe1]);
    });

    it(`Given authenticated user,
        Then should fetch user recipes
        and fetch recipes from collections,
        excluding the already fetched ones`, async () => {
      vi.spyOn(
        recipeCollectionApi,
        'fetchUserRecipeCollections'
      ).mockResolvedValue([
        {
          ...testRecipeCollection,
          recipeIds: [testRecipe1.id, testRecipe2.id],
        },
      ]);

      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue([testRecipe1]);

      const fetchRecipesByIdsSpy = vi
        .spyOn(recipeApi, 'fetchRecipesByIds')
        .mockResolvedValue([testRecipe2]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledOnce();
      expect(fetchRecipesByIdsSpy).toHaveBeenCalledOnce();
      expect(fetchRecipesByIdsSpy).toHaveBeenCalledWith([testRecipe2.id]);
      expect(recipeStore.recipes).toStrictEqual([testRecipe1, testRecipe2]);
    });

    it(`Given authenticated user
        with local recipes created via local profile,
        When synchronizing user recipes
        and recipes from collections,
        Then should preserve recipes created via local profile`, async () => {
      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      const testLocalRecipe1: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-1',
        isLocalOnly: true,
      };

      const testLocalRecipe2: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-2',
      };

      const testLocalRecipe3: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-3',
        isLocalOnly: true,
      };

      const testLocalRecipe4: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-4',
        isLocalOnly: false,
      };

      localStorage.setItem(
        'recipes',
        JSON.stringify([
          testLocalRecipe1,
          testLocalRecipe2,
          testLocalRecipe3,
          testLocalRecipe4,
        ])
      );

      // When
      vi.spyOn(recipeApi, 'fetchUserRecipes').mockResolvedValue([testRecipe2]);
      vi.spyOn(recipeApi, 'fetchRecipesByIds').mockResolvedValue([testRecipe1]);

      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(recipeStore.recipes).toStrictEqual([
        testRecipe2,
        testRecipe1,
        testLocalRecipe1,
        testLocalRecipe3,
      ]);
    });

    it(`Given user using local profile
        with no local collections,
        Then should use recipes created via local profile`, async () => {
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue(null);

      const fetchRecipesByIdsSpy = vi
        .spyOn(recipeApi, 'fetchRecipesByIds')
        .mockResolvedValue(null);

      // Given
      const localProfileStore = useLocalProfileStore();
      localProfileStore.enableLocalProfile();

      const testLocalRecipe1: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-1',
        isLocalOnly: true,
      };

      const testLocalRecipe2: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-2',
      };

      localStorage.setItem(
        'recipes',
        JSON.stringify([testLocalRecipe1, testLocalRecipe2])
      );

      // When
      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).not.toHaveBeenCalled();
      expect(fetchRecipesByIdsSpy).not.toHaveBeenCalled();
      expect(recipeStore.recipes).toStrictEqual([testLocalRecipe1]);
    });

    it(`Given user using local profile
        with local collections,
        Then should fetch recipes from collections
        and combine them with local profile ones`, async () => {
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue(null);

      const fetchRecipesByIdsSpy = vi
        .spyOn(recipeApi, 'fetchRecipesByIds')
        .mockResolvedValue([testRecipe1]);

      // Given
      const localProfileStore = useLocalProfileStore();
      localProfileStore.enableLocalProfile();

      const recipeCollectionStore = useRecipeCollectionStore();

      // @ts-expect-error it's readonly
      recipeCollectionStore.collections = [testRecipeCollection];

      const testLocalRecipe1: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-1',
        isLocalOnly: true,
      };

      const testLocalRecipe2: Pick<Recipe, 'id' | 'isLocalOnly'> = {
        id: 'test-local-id-2',
      };

      localStorage.setItem(
        'recipes',
        JSON.stringify([testLocalRecipe1, testLocalRecipe2])
      );

      // When
      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).not.toHaveBeenCalled();
      expect(fetchRecipesByIdsSpy).toHaveBeenCalledOnce();
      expect(fetchRecipesByIdsSpy).toHaveBeenCalledWith([testRecipe1.id]);
      expect(recipeStore.recipes).toStrictEqual([
        testRecipe1,
        testLocalRecipe1,
      ]);
    });

    it(`Given authenticated user with local recipes,
        When all fired requests fail,
        Then should use the local recipes`, async () => {
      // When
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValue(null);

      const fetchRecipesByIdsSpy = vi
        .spyOn(recipeApi, 'fetchRecipesByIds')
        .mockResolvedValue(null);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      const testLocalRecipe1 = { id: 'test-local-id-1' };
      const testLocalRecipe2 = { id: 'test-local-id-2' };

      localStorage.setItem(
        'recipes',
        JSON.stringify([testLocalRecipe1, testLocalRecipe2])
      );

      const recipeStore = useRecipeStore();

      // When
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalled();
      expect(fetchRecipesByIdsSpy).toHaveBeenCalled();
      expect(recipeStore.recipes).toStrictEqual([
        testLocalRecipe1,
        testLocalRecipe2,
      ]);
    });

    it(`Given authenticated user,
        When the first set of fired requests fails,
        Then should try again`, async () => {
      // When
      const fetchUserRecipesSpy = vi
        .spyOn(recipeApi, 'fetchUserRecipes')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce([testRecipe2]);

      const fetchRecipesByIdsSpy = vi
        .spyOn(recipeApi, 'fetchRecipesByIds')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce([testRecipe1]);

      const sessionStore = useSessionStore();

      // Given
      // @ts-expect-error it's readonly
      sessionStore.isAuth = true;

      // When
      const recipeStore = useRecipeStore();
      await flushPromises();

      // Then
      expect(fetchUserRecipesSpy).toHaveBeenCalledTimes(2);
      expect(fetchRecipesByIdsSpy).toHaveBeenCalledTimes(2);
      expect(recipeStore.recipes).toStrictEqual([testRecipe2, testRecipe1]);
    });
  });

  describe('addRecipe', () => {
    const testEditableRecipe1: EditableRecipe = {
      title: 'title-1',
      description: 'description-1',
      mealType: RecipeMealType.Breakfast,
      calorieCount: 111,
      preparationTime: { value: 11, unit: RecipePreparationTimeUnit.Minute },
      ingredients: [],
      steps: [],
    };

    const testEditableRecipe2: EditableRecipe = {
      title: 'title-2',
      description: 'description-2',
      mealType: RecipeMealType.Dinner,
      calorieCount: 222,
      preparationTime: { value: 22, unit: RecipePreparationTimeUnit.Hour },
      ingredients: [
        {
          name: 'ingredient-2',
          quantity: 2,
          quantityUnit: RecipeIngredientQuantityUnit.G,
        },
      ],
      steps: [{ description: 'step-2' }],
    };

    const expectedRecipe1: Recipe = {
      ...testEditableRecipe1,
      id: expectUuid(),
      createdAt: expectDateString(),
      updatedAt: expectDateString(),
    };

    const expectedRecipe2: Recipe = {
      ...testEditableRecipe2,
      id: expectUuid(),
      createdAt: expectDateString(),
      updatedAt: expectDateString(),
    };

    it('should add new recipe', () => {
      const recipeStore = useRecipeStore();

      expect(recipeStore.recipes).toStrictEqual([]);

      recipeStore.addRecipe(testEditableRecipe1);
      expect(recipeStore.recipes).toStrictEqual([expectedRecipe1]);

      recipeStore.addRecipe(testEditableRecipe2);
      expect(recipeStore.recipes).toStrictEqual([
        expectedRecipe1,
        expectedRecipe2,
      ]);
    });

    it(`When online,
        Then should upload new recipes`, async () => {
      vi.useFakeTimers();
      const uploadRecipesSpy = vi.spyOn(recipeApi, 'uploadRecipes');

      // When
      vi.spyOn(online, 'isOnline').mockReturnValue(true);
      const recipeStore = useRecipeStore();

      recipeStore.addRecipe(testEditableRecipe1);

      expect(recipeStore.recipes).toStrictEqual([expectedRecipe1]);
      uploadRecipesSpy.mockResolvedValueOnce([recipeStore.recipes[0].id]);
      await flushPromises();

      // Then
      expect(uploadRecipesSpy).toHaveBeenCalledOnce();
      expect(uploadRecipesSpy).toHaveBeenCalledWith([expectedRecipe1]);

      recipeStore.addRecipe(testEditableRecipe2);
      await flushPromises();

      expect(uploadRecipesSpy).toHaveBeenCalledTimes(2);
      expect(uploadRecipesSpy).toHaveBeenCalledWith([expectedRecipe2]);
    });

    it(`When offline,
        Then should accumulate recipes to synchronize,
        When online,
        Then should upload all accumulated recipes at once`, async () => {
      vi.useFakeTimers();
      const uploadRecipesSpy = vi.spyOn(recipeApi, 'uploadRecipes');

      // When
      const isOnline = ref(false);
      vi.spyOn(online, 'isOnline').mockImplementation(() => isOnline.value);
      const recipeStore = useRecipeStore();

      // Then
      recipeStore.addRecipe(testEditableRecipe1);
      await flushPromises();

      expect(uploadRecipesSpy).not.toHaveBeenCalled();

      recipeStore.addRecipe(testEditableRecipe2);
      await flushPromises();

      expect(uploadRecipesSpy).not.toHaveBeenCalled();

      // When
      isOnline.value = true;
      await flushPromises();

      // Then
      expect(uploadRecipesSpy).toHaveBeenCalledOnce();
      expect(uploadRecipesSpy).toHaveBeenCalledWith([
        expectedRecipe1,
        expectedRecipe2,
      ]);
    });
  });
});
