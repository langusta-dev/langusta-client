<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheIngredientList from './the-recipe-form/TheIngredientList.vue';
import TheStepList from './the-recipe-form/TheStepList.vue';

import { useInputGroup } from '~/composables/input';

import { useMealType } from './the-recipe-form/useMealType';
import { usePreparationTimeUnit } from './the-recipe-form/usePreparationTimeUnit';

import type {
  EditableRecipe,
  RecipeIngredient,
  RecipeStep,
} from '~/types/recipe';

const props = defineProps<{ recipe: EditableRecipe }>();

const emit = defineEmits<{
  (e: 'update:recipe', value: EditableRecipe): void;
  (e: 'submitRecipe'): void;
}>();

const { t } = useI18n();

const { injectValueByKey } = $(
  useInputGroup([
    'title',
    'description',
    'calorieCount',
    'preparationTimeValue',
  ])
);

let title = $(injectValueByKey('title'));
let description = $(injectValueByKey('description'));
let calorieCount = $(injectValueByKey('calorieCount'));
let preparationTimeValue = $(injectValueByKey('preparationTimeValue'));

let { MEAL_TYPE_OPTION_REDUCER, mealTypeOptions, mealType } = $(useMealType());

let {
  PREPARATION_TIME_UNIT_OPTION_REDUCER,
  preparationTimeUnitOptions,
  preparationTimeUnit,
} = $(usePreparationTimeUnit());

let ingredients = $ref<RecipeIngredient[]>([]);

let steps = $ref<RecipeStep[]>([]);

const recipe = $computed<EditableRecipe>(() => ({
  title,
  description,
  mealType,
  calorieCount: Number(calorieCount || 0),
  preparationTime: {
    value: Number(preparationTimeValue || 0),
    unit: preparationTimeUnit,
  },
  ingredients,
  steps,
}));

watch($$(recipe), (v) => {
  emit('update:recipe', v);
});

const isRecipeComplete = computed(
  () => !!(recipe.title && recipe.description && recipe.calorieCount)
);

const submitRecipe = () => {
  if (!isRecipeComplete) {
    return;
  }

  emit('submitRecipe');
};

const initializeForm = () => {
  title = props.recipe.title;
  description = props.recipe.description;
  mealType = props.recipe.mealType;

  calorieCount = props.recipe.calorieCount
    ? String(props.recipe.calorieCount)
    : '';

  preparationTimeValue = props.recipe.preparationTime.value
    ? String(props.recipe.preparationTime.value)
    : '';

  preparationTimeUnit = props.recipe.preparationTime.unit;

  ingredients = props.recipe.ingredients;

  steps = props.recipe.steps;
};

initializeForm();
</script>

<template>
  <div _flex="~ col" _gap4 _my4>
    <div>
      <div>{{ t('recipes.new.title') }}</div>
      <BaseInput v-model="title" />
    </div>

    <div>
      <div>{{ t('recipes.new.meal_type') }}</div>
      <BaseSelect
        v-model="mealType"
        :options="mealTypeOptions"
        :reduce="MEAL_TYPE_OPTION_REDUCER"
        label="label"
      />
    </div>

    <div>
      <div>{{ t('recipes.new.description') }}</div>
      <BaseInput v-model="description" type="textarea" />
    </div>

    <div>
      <div>{{ t('recipes.new.calorie_count') }}</div>
      <BaseInput v-model="calorieCount" numeric />
    </div>

    <div>
      <div>{{ t('recipes.new.preparation_time') }}</div>

      <div _flex _children="!w0 grow" _gap2>
        <div>
          <BaseInput v-model="preparationTimeValue" numeric />
        </div>

        <BaseSelect
          v-model="preparationTimeUnit"
          :options="preparationTimeUnitOptions"
          :reduce="PREPARATION_TIME_UNIT_OPTION_REDUCER"
          label="label"
        />
      </div>
    </div>

    <BaseHr />

    <div>
      <TheIngredientList v-model:ingredients="ingredients" />
    </div>

    <BaseHr />

    <div>
      <TheStepList v-model:steps="steps" />
    </div>

    <BaseButton :disabled="!isRecipeComplete" @click="submitRecipe()">
      {{ t('recipes.new.submit') }}
    </BaseButton>
  </div>
</template>