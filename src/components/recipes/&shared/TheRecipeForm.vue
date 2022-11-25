<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheIngredientList from './the-recipe-form/TheIngredientList.vue';
import TheStepList from './the-recipe-form/TheStepList.vue';

import { useInputGroup } from '~/composables/input';
import { useWindowWidthBreakpoints } from '~/composables/window';

import { useMealType } from './the-recipe-form/useMealType';
import { usePreparationTimeUnit } from './the-recipe-form/usePreparationTimeUnit';

import type {
  EditableRecipe,
  RecipeIngredient,
  RecipePreparationTime,
  RecipeStep,
} from '~/types/recipe';

const props = defineProps<{ recipe: EditableRecipe }>();

const emit = defineEmits<{
  (e: 'update:recipe', v: EditableRecipe): void;
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

const preparationTime = $computed<RecipePreparationTime>(() => ({
  value: Number(preparationTimeValue || 0),
  unit: preparationTimeUnit,
}));

let ingredients = $ref<RecipeIngredient[]>([]);

let steps = $ref<RecipeStep[]>([]);

let enableSteps = $ref(true);

let { recipe } = $(useVModels(props, emit));

watchEffect(() => {
  const newRecipe: EditableRecipe = {
    title,
    description,
    mealType,
    calorieCount: Number(calorieCount || 0),
    preparationTime,
    ingredients,
  };

  if (steps.length) {
    newRecipe.steps = steps;
  }

  recipe = newRecipe;
});

const isRecipeComplete = computed(
  () => !!(recipe.title && recipe.description && recipe.calorieCount)
);

const submitRecipe = () => {
  if (!isRecipeComplete) {
    return;
  }

  if (enableSteps) {
    steps = [];
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

  steps = props.recipe.steps || [];

  enableSteps = !!steps.length;
};

initializeForm();

const { isXl: showStandardForm } = $(useWindowWidthBreakpoints());

const formComponent = computed(() =>
  defineAsyncComponent(
    showStandardForm
      ? () => import('./the-recipe-form/TheStandardForm.vue')
      : () => import('./the-recipe-form/TheMobileForm.vue')
  )
);
</script>

<template>
  <component :is="formComponent" v-model:enable-steps="enableSteps">
    <template #metadata>
      <div>
        <div>{{ t('recipes.form.title') }}</div>
        <BaseInput v-model="title" />
      </div>

      <div>
        <div>{{ t('recipes.form.meal_type') }}</div>
        <BaseSelect
          v-model="mealType"
          :options="mealTypeOptions"
          :reduce="MEAL_TYPE_OPTION_REDUCER"
          label="label"
        />
      </div>

      <div>
        <div>{{ t('recipes.form.calorie_count') }}</div>
        <BaseInput v-model="calorieCount" numeric />
      </div>

      <div>
        <div>{{ t('recipes.form.preparation_time') }}</div>

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
    </template>

    <template #description>
      <div>
        <div>{{ t('recipes.form.description') }}</div>
        <BaseInput v-model="description" type="textarea" />
      </div>
    </template>

    <template #steps>
      <div>
        <BaseCheckbox
          v-model="enableSteps"
          :label="t('recipes.form.enable_steps')"
        />

        <TheStepList v-model:steps="steps" :enable-steps="enableSteps" />
      </div>
    </template>

    <template #ingredients>
      <TheIngredientList v-model:ingredients="ingredients" />
    </template>

    <template #submit-button>
      <BaseButton :disabled="!isRecipeComplete" @click="submitRecipe()">
        {{ t('recipes.form.submit') }}
      </BaseButton>
    </template>
  </component>
</template>
