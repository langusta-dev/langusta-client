import { acceptHMRUpdate, defineStore } from 'pinia';

import { useSynchronizableArray } from '~/composables/dataSync';

import {
  fetchUserMealPlans,
  uploadMealPlans,
  deleteMealPlansByIds,
} from '~/api/mealPlan';

import { useLocalProfileStore } from './localProfile';

export const useMealPlanStore = defineStore('mealPlan', () => {
  const localProfileStore = useLocalProfileStore();

  const mealPlanInitializer = () =>
    localProfileStore.isLocalProfileEnabled ? [] : fetchUserMealPlans();

  const {
    isInSync: areMealPlansInSync,
    readyPromise: mealPlansReadyPromise,
    syncPromise: mealPlansSyncPromise,
    state: mealPlans,
    getById: getMealPlanById,
    push: addMealPlan,
    deleteById: deleteMealPlanById,
  } = useSynchronizableArray(
    'mealPlans',
    mealPlanInitializer,
    uploadMealPlans,
    deleteMealPlansByIds
  );

  return {
    areMealPlansInSync,
    mealPlansReadyPromise,
    mealPlansSyncPromise,
    mealPlans,
    getMealPlanById,
    addMealPlan,
    deleteMealPlanById,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMealPlanStore, import.meta.hot));
}
