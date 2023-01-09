import { useMealPlanStore } from '~/stores/mealPlan';
import { useRecipeStore } from '~/stores/recipe';
import { useRecipeCollectionStore } from '~/stores/recipeCollection';
import { useSessionStore } from '~/stores/session';

import { getJwt } from '~/composables/jwt';

import type { InstallModule } from '~/types/modules';

export const install: InstallModule = ({ isClient, router }) => {
  if (!isClient) {
    return;
  }

  router.beforeEach(async (to) => {
    if (to.meta.auth) {
      const sessionStore = useSessionStore();

      if (!sessionStore.isAuth) {
        return '/login';
      }

      const recipeStore = useRecipeStore();
      const recipeCollectionStore = useRecipeCollectionStore();
      const mealPlanStore = useMealPlanStore();

      await Promise.all([
        recipeStore.recipesReadyPromise,
        recipeCollectionStore.collectionsReadyPromise,
        mealPlanStore.mealPlansReadyPromise,
      ]);
    }

    return true;
  });

  watch(getJwt, (v) => {
    if (!v) {
      router.push('/login');
    }
  });
};
