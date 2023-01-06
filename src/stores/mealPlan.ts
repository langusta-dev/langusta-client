import { acceptHMRUpdate, defineStore } from 'pinia';

import { useSynchronizableArray } from '~/composables/dataSync';

import {
  fetchUserMealPlans,
  uploadMealPlans,
  deleteMealPlansByIds,
} from '~/api/mealPlan';

import { useLocalProfileStore } from './localProfile';

export const useMealPlanStore = defineStore('recipeCollection', () => {
  const localProfileStore = useLocalProfileStore();

  const mealPlanInitializer = () =>
    localProfileStore.isLocalProfileEnabled ? [] : fetchUserMealPlans();

  const {
    isInSync: areMealPlansInSync,
    syncPromise: mealPlansSyncPromise,
    state: mealPlans,
    getById: getMealPlanById,
    push: addMealPlan,
  } = useSynchronizableArray(
    'mealPlans',
    mealPlanInitializer,
    uploadMealPlans,
    deleteMealPlansByIds
  );

  return {
    areMealPlansInSync,
    mealPlansSyncPromise,
    mealPlans,
    getMealPlanById,
    addMealPlan,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMealPlanStore, import.meta.hot));
}
