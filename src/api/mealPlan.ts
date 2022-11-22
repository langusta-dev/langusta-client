import { rest } from '~/composables/api';

import type { MealPlan } from '~/types/mealPlan';
import type { Uuid } from '~/types/uuid';

export const fetchUserMealPlans = async () => {
  const { data } = await rest.get<MealPlan[]>('/recipes/add');
  return data;
};

export const uploadMealPlans = async (mealPlans: MealPlan[]) => {
  const { data } = await rest.post<Uuid[]>('/recipes/add', { mealPlans });

  return data;
};

export const deleteMealPlansByIds = async (mealPlanIds: Uuid[]) => {
  const { data } = await rest.post<Uuid[]>('/recipes/add', { mealPlanIds });

  return data;
};
