<route lang="yaml">
meta:
  auth: true
</route>

<script setup lang="ts">
import TheIngredientList from '~/components/recipes/new/TheIngredientList.vue';

import { useMealType } from '~/components/recipes/new/useMealType';
import { usePreparationTimeUnit } from '~/components/recipes/new/usePreparationTimeUnit';

import { useInputGroup } from '~/composables/input';

const { t } = useI18n();

const { injectValueByKey } = $(
  useInputGroup(['title', 'description', 'calorieCount', 'preparationTime'])
);

const title = injectValueByKey('title');
const description = injectValueByKey('description');
const calorieCount = injectValueByKey('calorieCount');
const preparationTime = injectValueByKey('preparationTime');

const { MEAL_TYPE_OPTION_REDUCER, mealTypeOptions, mealType } = useMealType();

const {
  PREPARATION_TIME_UNIT_OPTION_REDUCER,
  preparationTimeUnitOptions,
  preparationTimeUnit,
} = usePreparationTimeUnit();
</script>

<template>
  <div _flex="~ col" _items-center>
    <div _flex="~ col" _gap4 _mt4>
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
            <BaseInput v-model="preparationTime" numeric />
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
        <TheIngredientList />
      </div>
    </div>
  </div>
</template>
