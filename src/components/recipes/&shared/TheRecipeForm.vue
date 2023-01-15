<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheIngredientList from './the-recipe-form/TheIngredientList.vue';
import TheStepList from './the-recipe-form/TheStepList.vue';

import { useInputGroup } from '~/composables/input';

import { useFormSkeleton } from './the-recipe-form/useFormSkeleton';
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

let imgPath = $ref<string | null>(null);

let ingredients = $ref<RecipeIngredient[]>([]);

let steps = $ref<RecipeStep[]>([]);

let enableSteps = $ref(true);

const trimmedDescription = $computed(() => description.trim());

const isPublishable = $computed(() => !!trimmedDescription);

let isPublic = $ref(false);

let { recipe } = $(useVModels(props, emit));

watchEffect(() => {
  const newRecipe: EditableRecipe = {
    title,
    mealType,
    calorieCount: Number(calorieCount || 0),
    preparationTime,
    ingredients,
  };

  if (trimmedDescription) {
    newRecipe.description = trimmedDescription;
  }

  if (isPublishable && isPublic) {
    newRecipe.isPublic = isPublic;
  }

  if (imgPath) {
    newRecipe.imgPath = imgPath;
  }

  if (steps.length) {
    newRecipe.steps = steps;
  }

  recipe = newRecipe;
});

const isRecipeComplete = computed(
  () => !!(recipe.title && recipe.calorieCount && recipe.preparationTime.value)
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
  imgPath = props.recipe.imgPath || null;
  description = props.recipe.description || '';
  mealType = props.recipe.mealType;

  calorieCount = props.recipe.calorieCount
    ? String(props.recipe.calorieCount)
    : '';

  preparationTimeValue = props.recipe.preparationTime.value
    ? String(props.recipe.preparationTime.value)
    : '';

  preparationTimeUnit = props.recipe.preparationTime.unit;

  ingredients = klona(props.recipe.ingredients);

  steps = props.recipe.steps ? klona(props.recipe.steps) : [];

  enableSteps = !!steps.length;

  isPublic = !!props.recipe.isPublic;
};

initializeForm();

const { skeletonComponent } = useFormSkeleton();
</script>

<template>
  <div _flex _justify-center _pb6>
    <BaseFadeTransition>
      <component :is="skeletonComponent">
        <template #metadata>
          <div _flex _justify-center>
            <BaseImgInput v-model="imgPath" />
          </div>

          <BaseInput
            v-model="title"
            :placeholder="t('recipes.form.title') + '*'"
          />

          <BaseSelect
            v-model="mealType"
            :options="mealTypeOptions"
            :reduce="MEAL_TYPE_OPTION_REDUCER"
            label="label"
            :title="t('recipes.form.meal_type')"
          />

          <BaseInput
            v-model="calorieCount"
            numeric
            :placeholder="t('recipes.form.calorie_count') + '*'"
          />

          <div _flex _children="!w0 grow" _gap2>
            <div>
              <BaseInput
                v-model="preparationTimeValue"
                numeric
                :placeholder="t('recipes.form.preparation_time') + '*'"
              />
            </div>

            <BaseSelect
              v-model="preparationTimeUnit"
              :options="preparationTimeUnitOptions"
              :reduce="PREPARATION_TIME_UNIT_OPTION_REDUCER"
              label="label"
            />
          </div>

          <BaseCheckbox
            v-model="isPublic"
            :label="t('recipes.form.is_public')"
          />
        </template>

        <template #description>
          <BaseInput
            v-model="description"
            type="textarea"
            :placeholder="t('recipes.form.description')"
          />
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
    </BaseFadeTransition>
  </div>
</template>
