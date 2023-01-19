import { rest } from '~/composables/api';

import type { MealPlan } from '~/types/mealPlan';
import type { Uuid } from '~/types/uuid';

export const fetchUserMealPlans = async () => {
  const { data } = await rest.get<MealPlan[]>('/meal-plan/get/user');

  return data;
};

export const uploadMealPlans = async (mealPlans: MealPlan[]) => {
  const { data } = await rest.put<Uuid[]>('/meal-plan/save', {
    mealPlans,
  });

  return data;
};

export const deleteMealPlansByIds = async (mealPlanIds: Uuid[]) => {
  const { data } = await rest.delete<Uuid[]>('/meal-plan/delete', {
    mealPlanIds,
  });

  return data;
};
