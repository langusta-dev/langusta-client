import type { Ref, WatchStopHandle } from 'vue';
import type { Recipe } from '~/types/recipes';

type EditableRecipe = Pick<
  Recipe,
  | 'title'
  | 'description'
  | 'calorieCount'
  | 'mealType'
  | 'ingredients'
  | 'preparationTime'
  | 'steps'
>;

const editableRecipe = $ref<Partial<EditableRecipe>>({});

const linkHandles: Partial<Record<keyof EditableRecipe, WatchStopHandle>> = {};

export const linkValue = <K extends keyof EditableRecipe>(
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
