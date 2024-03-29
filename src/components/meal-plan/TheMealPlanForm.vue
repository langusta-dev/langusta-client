<script setup lang="ts">
import {
  InsufficientRecipeCountError,
  InvalidDailyMealCountError,
  InvalidMealPlanOptionsError,
  MealPlanGenerationError,
} from '~/types/mealPlan';

import { useRecipeStore } from '~/stores/recipe';
import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import { showConfirm } from '~/composables/confirm';
import { useInputGroup } from '~/composables/input';

import { mapDays } from '~/helpers/array';
import {
  generateMealPlanRecipeIdsPerDay,
  isMealPlanValid,
  areMealPlanOptionsValid as _areMealPlanOptionsValid,
} from '~/helpers/mealPlan';

import type { Day } from '~/types/basic';
import type {
  EditableMealPlan,
  MealPlanRecipeIdsPerDay,
} from '~/types/mealPlan';
import type { Recipe } from '~/types/recipe';
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

let recipeIdsPerDay = $ref<MealPlanRecipeIdsPerDay | null>(null);

let { mealPlan } = $(useVModels(props, emit));

const dailyCalorieCountNum = $computed(() => Number(dailyCalorieCount || 0));
const dailyMealCountNum = $computed(() => Number(dailyMealCount || 0));

watchEffect(() => {
  if (!recipeIdsPerDay || !recipeCollectionId) {
    return;
  }

  const newMealPlan: EditableMealPlan = {
    dailyCalorieCount: dailyCalorieCountNum,
    dailyMealCount: dailyMealCountNum,
    recipeCollectionId,
    recipeIdsPerDay,
  };

  mealPlan = newMealPlan;
});

const areMealPlanOptionsValid = $computed(() =>
  _areMealPlanOptionsValid(mealPlan)
);

const isMealPlanComplete = $computed(() => isMealPlanValid(mealPlan));

const recipesPerDayToDisplay = $computed<Record<Day, Recipe[]>>(() =>
  Object.assign(
    {},
    ...Object.entries(mealPlan.recipeIdsPerDay).map(([day, recipeIds]) => ({
      [day]: recipeIds.map(recipeStore.getRecipeById).filter(Boolean),
    }))
  )
);

const daysToDisplay = $computed(() => {
  if (
    Object.values(recipesPerDayToDisplay).some((recipes) => !recipes.length)
  ) {
    return null;
  }

  return mapDays((day) => ({ day, recipes: recipesPerDayToDisplay[day] }));
});

const recipeCollection = $computed(() =>
  recipeCollectionId
    ? recipeCollectionStore.getCollectionById(recipeCollectionId)
    : null
);

const recipeCollectionRecipes = $computed<Recipe[]>(() =>
  recipeCollection
    ? recipeCollection.recipeIds
        .map(recipeStore.getRecipeById)
        .filter((item): item is Recipe => !!item)
    : []
);

const generateMealPlan = () => {
  try {
    recipeIdsPerDay = generateMealPlanRecipeIdsPerDay(
      {
        dailyCalorieCount: dailyCalorieCountNum,
        dailyMealCount: dailyMealCountNum,
      },
      recipeCollectionRecipes
    );
  } catch (error) {
    let errorReasonMsgKey = 'unknown';

    if (error instanceof MealPlanGenerationError) {
      switch (error.constructor) {
        case InvalidMealPlanOptionsError: {
          errorReasonMsgKey = 'invalid_meal_plan_options';
          break;
        }

        case InvalidDailyMealCountError: {
          errorReasonMsgKey = 'invalid_daily_meal_count';
          break;
        }

        case InsufficientRecipeCountError: {
          errorReasonMsgKey = 'insufficient_recipe_count';
          break;
        }
      }
    }

    const msg =
      t('meal_plan.form.generation_error.title') +
      '.\n' +
      t(`meal_plan.form.generation_error.reason.${errorReasonMsgKey}`);

    showConfirm({
      msg,
      cancelMsg: null,
    });
  }
};

let initialMealPlan = $ref(klona(props.mealPlan));

const isInitialMealPlanValid = $computed(() =>
  isMealPlanValid(initialMealPlan)
);

const isMealPlanChanged = $computed(
  () => !deepEqual(initialMealPlan.recipeIdsPerDay, mealPlan.recipeIdsPerDay)
);

const isMealPlanSubmittable = $computed(
  () => isMealPlanComplete && isMealPlanChanged
);

const submitMealPlan = () => {
  if (!isMealPlanSubmittable) {
    return;
  }

  emit('submitMealPlan');

  initialMealPlan = klona(mealPlan);
};

const initializeForm = () => {
  dailyCalorieCount = initialMealPlan.dailyCalorieCount
    ? String(initialMealPlan.dailyCalorieCount)
    : '';

  dailyMealCount = initialMealPlan.dailyMealCount
    ? String(initialMealPlan.dailyMealCount)
    : '';

  recipeCollectionId = initialMealPlan.recipeCollectionId;

  recipeIdsPerDay = initialMealPlan.recipeIdsPerDay;
};

initializeForm();

const isMealPlanRestorable = $computed(
  () => isInitialMealPlanValid && isMealPlanChanged
);

const restoreMealPlan = () => {
  if (isMealPlanRestorable) {
    initializeForm();
  }
};
</script>

<template>
  <div _flex="~ col" _items-center _px4 _gap4>
    <div _w="xl:full" _flex="~ col xl:row" _justify-center _gap4>
      <div _flex _items-center _gap2 _w-full _max-w-100>
        <div>{{ t('meal_plan.form.recipe_collection') }}:</div>

        <BaseSelect
          v-model="recipeCollectionId"
          :options="recipeCollectionStore.ownedCollectionsOrderedByTitle"
          :reduce="({ id }) => id"
          label="title"
          :title="t('meal_plan.form.recipe_collection')"
          _grow
        />
      </div>

      <BaseInput
        v-model="dailyCalorieCount"
        numeric
        :placeholder="t('meal_plan.form.daily_calorie_count')"
      />

      <BaseInput
        v-model="dailyMealCount"
        numeric
        :placeholder="t('meal_plan.form.daily_meal_count')"
      />
    </div>

    <div _flex="~ col xl:row" _justify-center _gap4>
      <BaseButton
        :disabled="!areMealPlanOptionsValid"
        @click="generateMealPlan()"
      >
        {{ t('meal_plan.form.generate') }}
      </BaseButton>

      <BaseButton :disabled="!isMealPlanSubmittable" @click="submitMealPlan()">
        {{ t('meal_plan.form.submit') }}
      </BaseButton>

      <BaseButton
        alt
        :disabled="!isMealPlanRestorable"
        @click="restoreMealPlan()"
      >
        {{ t('meal_plan.form.restore') }}
      </BaseButton>
    </div>

    <BaseHr _w-full />

    <BaseFadeTransition>
      <div v-if="daysToDisplay" _flex="~ col xl:row" _gap4 _w-full _p="x1 b4">
        <div
          v-for="{ day, recipes } in daysToDisplay"
          :key="day"
          _xl:grow
          _basis-0
          _w="full xl:unset"
        >
          <div _capitalize _text-xl _fw600 _pb1>{{ day }}</div>

          <div _flex="~ col" _gap="1 xl:3">
            <div
              v-for="recipe in recipes"
              :key="recipe.id"
              class="group"
              _flex="~ wrap"
              _h="12 md:14 xl:auto"
              _gap="x2 y1"
              _cursor-pointer
              _select-none
              _items-center
            >
              <div
                _w="1/5 xl:full"
                _max-w="20 xl:full"
                _h-full
                _xl:pb="1/2"
                _relative
                _rounded
                _border="1 primary-contrast/70 group-hover:accent"
                _group-hover:text-accent
                _transition-colors
              >
                <div
                  v-if="recipe.imgPath"
                  _cover
                  :style="{ backgroundImage: `url(${recipe.imgPath})` }"
                  _bg="cover center no-repeat"
                />
                <div v-else _cover _flex-center>
                  <div _icon-emojione-monotone:pot-of-food _text-3xl />
                </div>
              </div>

              <div
                _grow
                _basis="0 xl:full"
                _text-lines-2
                :title="recipe.title"
                _group-hover:text-accent
                _transition-colors
              >
                {{ recipe.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else _text-center _pt6 _op70>
        {{ t('meal_plan.form.no_recipes_to_display') }}
      </div>
    </BaseFadeTransition>
  </div>
</template>
