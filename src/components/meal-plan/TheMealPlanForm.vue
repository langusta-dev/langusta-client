<script setup lang="ts">
import { useRecipeStore } from '~/stores/recipe';
import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import { useInputGroup } from '~/composables/input';

import { generateMealPlanRecipesPerDay } from '~/helpers/mealPlan';

import type { EditableMealPlan, MealPlanRecipesPerDay } from '~/types/mealPlan';
import type { RecipeCollection } from '~/types/recipeCollection';

const props = defineProps<{ mealPlan: EditableMealPlan }>();

const emit = defineEmits<{
  (e: 'update:mealPlan', v: EditableMealPlan): void;
  (e: 'submitMealPlan'): void;
}>();

const { t } = useI18n();
const recipeStore = useRecipeStore();
const recipeCollectionStore = useRecipeCollectionStore();

const { injectValueByKey } = $(
  useInputGroup(['dailyCalorieCount', 'dailyMealCount'])
);

let dailyCalorieCount = $(injectValueByKey('dailyCalorieCount'));
let dailyMealCount = $(injectValueByKey('dailyMealCount'));

let recipeCollectionId = $ref<RecipeCollection['id'] | null>(null);

let recipesPerDay = $ref<MealPlanRecipesPerDay | null>(null);

let { mealPlan } = $(useVModels(props, emit));

const dailyCalorieCountNum = $computed(() => Number(dailyCalorieCount || 0));
const dailyMealCountNum = $computed(() => Number(dailyMealCount || 0));

watchEffect(() => {
  if (!recipesPerDay || !recipeCollectionId) {
    return;
  }

  const newMealPlan: EditableMealPlan = {
    dailyCalorieCount: dailyCalorieCountNum,
    dailyMealCount: dailyMealCountNum,
    recipeCollectionId,
    recipesPerDay,
  };

  mealPlan = newMealPlan;
});

const isMealPlanComplete = computed(
  () =>
    !!(
      mealPlan.dailyCalorieCount &&
      mealPlan.dailyMealCount &&
      Object.values(mealPlan.recipesPerDay).every(
        (dailyRecipes) => dailyRecipes.length === mealPlan.dailyMealCount
      )
    )
);

const generateMealPlan = () => {
  recipesPerDay = generateMealPlanRecipesPerDay(
    {
      dailyCalorieCount: dailyCalorieCountNum,
      dailyMealCount: dailyMealCountNum,
    },
    []
  );
};

const submitMealPlan = () => {
  if (!isMealPlanComplete) {
    return;
  }

  emit('submitMealPlan');
};

const initializeForm = () => {
  dailyCalorieCount = props.mealPlan.dailyCalorieCount
    ? String(props.mealPlan.dailyCalorieCount)
    : '';

  dailyMealCount = props.mealPlan.dailyMealCount
    ? String(props.mealPlan.dailyMealCount)
    : '';

  recipeCollectionId = props.mealPlan.recipeCollectionId;

  recipesPerDay = props.mealPlan.recipesPerDay;
};

initializeForm();
</script>

<template>
  <div>
    <div />
  </div>
</template>
