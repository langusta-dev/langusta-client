import { useRecipeStore } from '~/stores/recipe';

import type { Ref, WatchStopHandle } from 'vue';
import type { EditableRecipe } from '~/types/recipe';

let editableRecipe = $ref<Partial<EditableRecipe>>({});

const linkHandles: Partial<Record<keyof EditableRecipe, WatchStopHandle>> = {};

export const linkRecipeEntry = <K extends keyof EditableRecipe>(
  key: K,
  valueRef: Ref<EditableRecipe[K]>
) => {
  linkHandles[key]?.();
  linkHandles[key] = watch(
    valueRef,
    (v) => {
      editableRecipe[key] = v;
    },
    { immediate: true }
  );
};

const isRecipeComplete = (
  recipe: Partial<EditableRecipe>
): recipe is EditableRecipe =>
  !!(
    recipe.title &&
    recipe.description &&
    recipe.calorieCount &&
    recipe.mealType &&
    recipe.ingredients &&
    recipe.preparationTime &&
    recipe.steps
  );

export const submitRecipe = () => {
  if (!isRecipeComplete(editableRecipe)) {
    return;
  }

  const recipeStore = useRecipeStore();
  recipeStore.addRecipe(editableRecipe);

  editableRecipe = {};

  for (const [key, dropLink] of Object.entries(linkHandles)) {
    dropLink();
    delete linkHandles[key as keyof EditableRecipe];
  }
};
