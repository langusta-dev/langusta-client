import { Day } from '~/types/basic';

import type {
  EditableMealPlan,
  MealPlanOptions,
  MealPlanRecipesPerDay,
} from '~/types/mealPlan';
import type { Recipe } from '~/types/recipe';
import type { RecipeCollection } from '~/types/recipeCollection';

const DEFAULT_DAILY_CALORIE_COUNT = 2000;
const DEFAULT_DAILY_MEAL_COUNT = 4;

const initialMealPlanRecipesPerDay = (): MealPlanRecipesPerDay => ({
  [Day.Monday]: [],
  [Day.Tuesday]: [],
  [Day.Wednesday]: [],
  [Day.Thursday]: [],
  [Day.Friday]: [],
  [Day.Sunday]: [],
  [Day.Saturday]: [],
});

export const initialMealPlan = (
  recipeCollectionId: RecipeCollection['id']
): EditableMealPlan => ({
  recipeCollectionId,
  dailyCalorieCount: DEFAULT_DAILY_CALORIE_COUNT,
  dailyMealCount: DEFAULT_DAILY_MEAL_COUNT,
  recipesPerDay: initialMealPlanRecipesPerDay(),
});

export const generateMealPlanRecipesPerDay = (
  options: MealPlanOptions,
  recipes: Recipe[]
): MealPlanRecipesPerDay => {
  // TODO
  console.log('generating meal plan', options, recipes);
  return initialMealPlanRecipesPerDay();
};
