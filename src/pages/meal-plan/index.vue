<route lang="yaml">
meta:
  title: meal_plan.title
  auth: true
  nav: true
  navOrder: 3
  navIcon: fa:calendar
</route>

<script setup lang="ts">
import ThePageHeader from '~/components/&shared/ThePageHeader.vue';
import TheMealPlanForm from '~/components/meal-plan/TheMealPlanForm.vue';

import { useMealPlanStore } from '~/stores/mealPlan';
import { useRecipeCollectionStore } from '~/stores/recipeCollection';

import { emptyMealPlan } from '~/helpers/mealPlan';

import type { EditableMealPlan, MealPlan } from '~/types/mealPlan';
import type { RecipeCollection } from '~/types/recipeCollection';

const { t } = useI18n();
const router = useRouter();
const recipeCollectionStore = useRecipeCollectionStore();
const mealPlanStore = useMealPlanStore();

const firstRecipeCollection = $computed<RecipeCollection | undefined>(
  () => recipeCollectionStore.ownedCollectionsOrderedByTitle[0]
);

const oldMealPlan = $computed<MealPlan | undefined>(
  () => mealPlanStore.mealPlans[0]
);

const editableMealPlan = $ref<EditableMealPlan | null>(
  oldMealPlan ||
    (firstRecipeCollection ? emptyMealPlan(firstRecipeCollection.id) : null)
);

const submitMealPlan = async () => {
  if (!editableMealPlan) {
    return;
  }

  if (oldMealPlan) {
    await mealPlanStore.deleteMealPlanById(oldMealPlan.id);
  }

  await mealPlanStore.addMealPlan(editableMealPlan);
};
</script>

<template>
  <div>
    <ThePageHeader>{{ t('meal_plan.title') }}</ThePageHeader>

    <TheMealPlanForm
      v-if="editableMealPlan"
      v-model:meal-plan="editableMealPlan"
      @submit-meal-plan="submitMealPlan()"
    />
    <div v-else _flex="~ col" _items-center _gap4>
      <div>{{ t('meal_plan.no_collections') }}</div>

      <BaseButton @click="router.push('/recipes/collections/add')">
        {{ t('meal_plan.create_first_collection') }}
      </BaseButton>
    </div>
  </div>
</template>
